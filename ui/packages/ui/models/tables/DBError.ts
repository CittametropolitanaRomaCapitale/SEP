import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 25;

export interface DBError {
  id?: number;
  createdDate?: Date;
  message: string;
  type?: string;
  arguments?: string;
  stack?: string;
  resolved?: boolean;
}

type ErrorOperationsProps = {
  page?: number;
};

export const useErrorsData = (args?: ErrorOperationsProps) => {
  const { page } = args || {};

  const paginatedErrors = useLiveQuery(async () => {
    const errors = await db.errors
      .reverse()
      .offset((page || DEFAULT_PAGE_NUMBER) * DEFAULT_PAGE_SIZE)
      .limit(DEFAULT_PAGE_SIZE)
      .sortBy('id');
    return errors;
  }, [page]);

  const paginatedErrorsCount = useLiveQuery(async () => {
    const count = await db.errors.count();
    return Math.ceil(count / DEFAULT_PAGE_SIZE) || 1;
  });

  return {
    paginatedErrors,
    paginatedErrorsCount
  };
};

export const errorOperations = () => {
  const addError = async (dbError: DBError) => {
    try {
      await db.errors.add(dbError);
    } catch (error) {
      console.error(`Failed to add to db: ${error}`);
    }
  };

  const updateError = async ({
    id,
    dbError
  }: {
    id: number;
    dbError: DBError;
  }) => {
    try {
      await db.errors.update(id, dbError);
    } catch (error) {
      console.error(`Failed to update to db: ${error}`);
    }
  };

  const deleteError = async ({ id }: { id: number }) => {
    try {
      await db.errors.delete(id);
    } catch (error) {
      console.error(`Failed to delete to db: ${error}`);
    }
  };

  return {
    addError,
    updateError,
    deleteError
  };
};
