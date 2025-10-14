import { Page } from '@playwright/test';
import { TestPlan } from '@xstate/test/lib/types';
import { AnyStateMachine } from 'xstate';
import { api, GetAttivitaDetailsQuery } from '@cmrc/services';
import merge from 'lodash/merge';
import camelCase from 'lodash/camelCase';
type EndpointsType = keyof typeof api.endpoints;

export const isGraphql = (name: string, data: any) =>
  RegExp(`[query|mutation]( +)${name}`, 'gm').test(data);

export const waitForGraphql = async (
  page: Page,
  name: EndpointsType,
  status: number = 200
) => {
  return await page.waitForResponse((resp) => {
    return (
      resp.url().includes('/graphql') &&
      isGraphql(name, resp.request().postData()) &&
      resp.status() === status
    );
  });
};

export const mockGraphql = async <T = any>(
  page: Page,
  name: EndpointsType,
  override?: T
) => {
  return await page.route('**/graphql', async (route, request) => {
    if (isGraphql(name, route.request().postData())) {
      const response = await page.request.fetch(
        'http://localhost:4000/graphql',
        {
          method: route.request().method(),
          headers: await route.request().allHeaders(),
          data: route.request().postData()
        }
      );
      let body = await response.json();
      if (!!override) body = merge(body, { data: override });

      route.fulfill({
        response,
        body: JSON.stringify(body)
      });
    } else route.continue();
  });
};

/**
 * Adds state.meta.test to machines by their state id -
 * allowing you to specify the tests separately to the
 * machine itself
 */
export const addTestsToMachine = (
  /**
   * The machine you want to add tests to
   */
  machine: AnyStateMachine,
  /**
   * The tests, specified as a keyed object, where:
   *
   * 1. Keys are the state ids
   * 2. Values are functions that take your test context
   *   and return a promise
   */
  tests: Record<string, (page: Page) => Promise<void>>
) => {
  Object.entries(tests).forEach(([stateId, test]) => {
    const node = machine.getStateNodeById(`${machine.id}.${stateId}`);

    if (tests[stateId]) {
      node.meta = {
        test: tests[stateId]
      };
    }
  });

  return machine;
};

/**
 * Deduplicates your path plans so that A -> B
 * is not executed separately to A -> B -> C
 */
export const dedupPathPlans = <TTestContext>(
  pathPlans: TestPlan<TTestContext, any>[]
): TestPlan<TTestContext, any>[] => {
  const planPathSegments = pathPlans.map((plan) => {
    const planSegments = plan.paths[0].segments.map((segment) =>
      JSON.stringify(segment.event)
    );

    return planSegments;
  });

  /**
   * Filter out the paths that are just shorter versions
   * of other paths
   */
  const filteredPathPlans = pathPlans.filter((plan, index) => {
    const planSegments = planPathSegments[index];

    if (planSegments.length === 0) return false;

    const concatenatedPlanSegments = planSegments.join('');

    return !planPathSegments.some((planPathSegmentsToCompare) => {
      const concatenatedSegmentToCompare = planPathSegmentsToCompare.join('');
      /**
       * Filter IN (return false) if it's the same as the current plan,
       * because it's not a valid comparison
       */
      if (concatenatedSegmentToCompare === concatenatedPlanSegments) {
        return false;
      }

      /**
       * Filter IN (return false) if the plan to compare against has length 0
       */
      if (planPathSegmentsToCompare.length === 0) {
        return false;
      }

      /**
       * We filter OUT (return true)
       */
      return concatenatedSegmentToCompare.includes(concatenatedPlanSegments);
    });
  });

  return filteredPathPlans;
};
