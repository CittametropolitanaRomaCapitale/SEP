import { SSOApi as api } from './baseApi';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postApiAdminRole: build.mutation<
      PostApiAdminRoleApiResponse,
      PostApiAdminRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role`,
        method: 'POST',
        body: queryArg.createAdminRoleBean
      })
    }),
    getApiAdminRoleApplicationByApplicationId: build.query<
      GetApiAdminRoleApplicationByApplicationIdApiResponse,
      GetApiAdminRoleApplicationByApplicationIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role/application/${queryArg.applicationId}`
      })
    }),
    getApiAdminRoleUserByUserId: build.query<
      GetApiAdminRoleUserByUserIdApiResponse,
      GetApiAdminRoleUserByUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role/user/${queryArg.userId}`,
        params: {
          application_id: queryArg.applicationId
        }
      })
    }),
    getApiAdminRoleById: build.query<
      GetApiAdminRoleByIdApiResponse,
      GetApiAdminRoleByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/admin_role/${queryArg.id}` })
    }),
    deleteApiAdminRoleById: build.mutation<
      DeleteApiAdminRoleByIdApiResponse,
      DeleteApiAdminRoleByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    putApiAdminRoleByRoleIdUserAndUserId: build.mutation<
      PutApiAdminRoleByRoleIdUserAndUserIdApiResponse,
      PutApiAdminRoleByRoleIdUserAndUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role/${queryArg.roleId}/user/${queryArg.userId}`,
        method: 'PUT'
      })
    }),
    deleteApiAdminRoleByRoleIdUserAndUserId: build.mutation<
      DeleteApiAdminRoleByRoleIdUserAndUserIdApiResponse,
      DeleteApiAdminRoleByRoleIdUserAndUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin_role/${queryArg.roleId}/user/${queryArg.userId}`,
        method: 'DELETE'
      })
    }),
    getApiApplication: build.query<
      GetApiApplicationApiResponse,
      GetApiApplicationApiArg
    >({
      query: () => ({ url: `/api/application` })
    }),
    getApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeId:
      build.query<
        GetApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeIdApiResponse,
        GetApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/application/${queryArg.applicationId}/free_roles_for_user/${queryArg.userId}/by_office/${queryArg.officeId}`
        })
      }),
    getApiApplicationByApplicationIdGetAdmins: build.query<
      GetApiApplicationByApplicationIdGetAdminsApiResponse,
      GetApiApplicationByApplicationIdGetAdminsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/application/${queryArg.applicationId}/get_admins`
      })
    }),
    getApiApplicationByApplicationIdSearchUsers: build.query<
      GetApiApplicationByApplicationIdSearchUsersApiResponse,
      GetApiApplicationByApplicationIdSearchUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/application/${queryArg.applicationId}/search_users`,
        params: {
          code: queryArg.code,
          office_filter: queryArg.officeFilter,
          user_filter: queryArg.userFilter
        }
      })
    }),
    postApiApplicationByApplicationIdSyncUsersWithPermissions: build.mutation<
      PostApiApplicationByApplicationIdSyncUsersWithPermissionsApiResponse,
      PostApiApplicationByApplicationIdSyncUsersWithPermissionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/application/${queryArg.applicationId}/sync_users_with_permissions`,
        method: 'POST'
      })
    }),
    getApiApplicationById: build.query<
      GetApiApplicationByIdApiResponse,
      GetApiApplicationByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/application/${queryArg.id}` })
    }),
    getApiAuthGetFullUsersInfos: build.query<
      GetApiAuthGetFullUsersInfosApiResponse,
      GetApiAuthGetFullUsersInfosApiArg
    >({
      query: () => ({ url: `/api/auth/getFullUsersInfos` })
    }),
    getApiAuthMe: build.query<GetApiAuthMeApiResponse, GetApiAuthMeApiArg>({
      query: (queryArg) => ({
        url: `/api/auth/me`,
        params: {
          applicationId: queryArg.applicationId
        }
      })
    }),
    postApiAuthSynchUsers: build.mutation<
      PostApiAuthSynchUsersApiResponse,
      PostApiAuthSynchUsersApiArg
    >({
      query: () => ({ url: `/api/auth/synch_users`, method: 'POST' })
    }),
    getApiAuthUserByAuthIdApplicationAndApplicationId: build.query<
      GetApiAuthUserByAuthIdApplicationAndApplicationIdApiResponse,
      GetApiAuthUserByAuthIdApplicationAndApplicationIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/user/${queryArg.authId}/application/${queryArg.applicationId}`
      })
    }),
    getApiAuthUserByIdHistory: build.query<
      GetApiAuthUserByIdHistoryApiResponse,
      GetApiAuthUserByIdHistoryApiArg
    >({
      query: (queryArg) => ({ url: `/api/auth/user/${queryArg.id}/history` })
    }),
    getApiAuthUsers: build.query<
      GetApiAuthUsersApiResponse,
      GetApiAuthUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/users`,
        params: {
          appId: queryArg.appId,
          by: queryArg.by,
          desc: queryArg.desc,
          enabledFlag: queryArg.enabledFlag,
          officeIds: queryArg.officeIds,
          page: queryArg.page,
          roles: queryArg.roles,
          search: queryArg.search,
          size: queryArg.size,
          types: queryArg.types
        }
      })
    }),
    getApiAuthUsersExport: build.query<
      GetApiAuthUsersExportApiResponse,
      GetApiAuthUsersExportApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/users/export`,
        params: {
          appId: queryArg.appId,
          by: queryArg.by,
          desc: queryArg.desc,
          enabledFlag: queryArg.enabledFlag,
          officeIds: queryArg.officeIds,
          page: queryArg.page,
          roles: queryArg.roles,
          search: queryArg.search,
          size: queryArg.size,
          types: queryArg.types
        }
      })
    }),
    getApiAuthUsersPages: build.query<
      GetApiAuthUsersPagesApiResponse,
      GetApiAuthUsersPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/users/pages`,
        params: {
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    deleteApiDocsDeleteAttachmentById: build.mutation<
      DeleteApiDocsDeleteAttachmentByIdApiResponse,
      DeleteApiDocsDeleteAttachmentByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/docs/delete_attachment/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    getApiDocsDownloadAttachmentById: build.query<
      GetApiDocsDownloadAttachmentByIdApiResponse,
      GetApiDocsDownloadAttachmentByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/docs/download_attachment/${queryArg.id}`
      })
    }),
    postApiDocsImportFile: build.mutation<
      PostApiDocsImportFileApiResponse,
      PostApiDocsImportFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/docs/import_file`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    postApiDocsLoadAttachment: build.mutation<
      PostApiDocsLoadAttachmentApiResponse,
      PostApiDocsLoadAttachmentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/docs/load_attachment`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    getApiOffice: build.query<GetApiOfficeApiResponse, GetApiOfficeApiArg>({
      query: (queryArg) => ({
        url: `/api/office`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    postApiOffice: build.mutation<
      PostApiOfficeApiResponse,
      PostApiOfficeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office`,
        method: 'POST',
        body: queryArg.officeInput
      })
    }),
    deleteApiOfficeDeleteByOfficeIdPermanent: build.mutation<
      DeleteApiOfficeDeleteByOfficeIdPermanentApiResponse,
      DeleteApiOfficeDeleteByOfficeIdPermanentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/delete/${queryArg.officeId}/permanent`,
        method: 'DELETE'
      })
    }),
    putApiOfficeMerge: build.mutation<
      PutApiOfficeMergeApiResponse,
      PutApiOfficeMergeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/merge`,
        method: 'PUT',
        body: queryArg.body
      })
    }),
    postApiOfficeMulti: build.mutation<
      PostApiOfficeMultiApiResponse,
      PostApiOfficeMultiApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/multi`,
        method: 'POST',
        body: queryArg.body
      })
    }),
    putApiOfficeOpenByOfficeId: build.mutation<
      PutApiOfficeOpenByOfficeIdApiResponse,
      PutApiOfficeOpenByOfficeIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/open/${queryArg.officeId}`,
        method: 'PUT'
      })
    }),
    getApiOfficePages: build.query<
      GetApiOfficePagesApiResponse,
      GetApiOfficePagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/pages`,
        params: {
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiOfficeByApplicationIdUsersAndCdr: build.query<
      GetApiOfficeByApplicationIdUsersAndCdrApiResponse,
      GetApiOfficeByApplicationIdUsersAndCdrApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.applicationId}/users/${queryArg.cdr}`,
        params: {
          nodeleg: queryArg.nodeleg
        }
      })
    }),
    getApiOfficeByCdrCodeNewOffices: build.query<
      GetApiOfficeByCdrCodeNewOfficesApiResponse,
      GetApiOfficeByCdrCodeNewOfficesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.cdrCode}/new_offices`
      })
    }),
    getApiOfficeByCdrCodeRelatedOffices: build.query<
      GetApiOfficeByCdrCodeRelatedOfficesApiResponse,
      GetApiOfficeByCdrCodeRelatedOfficesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.cdrCode}/related_offices`
      })
    }),
    getApiOfficeById: build.query<
      GetApiOfficeByIdApiResponse,
      GetApiOfficeByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/office/${queryArg.id}` })
    }),
    getApiOfficeByIdHistory: build.query<
      GetApiOfficeByIdHistoryApiResponse,
      GetApiOfficeByIdHistoryApiArg
    >({
      query: (queryArg) => ({ url: `/api/office/${queryArg.id}/history` })
    }),
    getApiOfficeByIdUsers: build.query<
      GetApiOfficeByIdUsersApiResponse,
      GetApiOfficeByIdUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.id}/users`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiOfficeByIdUsersPages: build.query<
      GetApiOfficeByIdUsersPagesApiResponse,
      GetApiOfficeByIdUsersPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.id}/users/pages`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiOfficeByOfficeIdApplicationAndApplicationIdUsers: build.query<
      GetApiOfficeByOfficeIdApplicationAndApplicationIdUsersApiResponse,
      GetApiOfficeByOfficeIdApplicationAndApplicationIdUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/application/${queryArg.applicationId}/users`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    putApiOfficeByOfficeId: build.mutation<
      PutApiOfficeByOfficeIdApiResponse,
      PutApiOfficeByOfficeIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}`,
        method: 'PUT',
        body: queryArg.officeInput
      })
    }),
    deleteApiOfficeByOfficeId: build.mutation<
      DeleteApiOfficeByOfficeIdApiResponse,
      DeleteApiOfficeByOfficeIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}`,
        method: 'DELETE'
      })
    }),
    putApiOfficeByOfficeIdSplit: build.mutation<
      PutApiOfficeByOfficeIdSplitApiResponse,
      PutApiOfficeByOfficeIdSplitApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/split`,
        method: 'PUT',
        body: queryArg.moveUsersToOfficeInput
      })
    }),
    postApiOfficeByOfficeIdUsers: build.mutation<
      PostApiOfficeByOfficeIdUsersApiResponse,
      PostApiOfficeByOfficeIdUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/users`,
        method: 'POST',
        body: queryArg.userIdListBean
      })
    }),
    deleteApiOfficeByOfficeIdUsers: build.mutation<
      DeleteApiOfficeByOfficeIdUsersApiResponse,
      DeleteApiOfficeByOfficeIdUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/users`,
        method: 'DELETE',
        body: queryArg.userIdListBean
      })
    }),
    postApiOfficeByOfficeIdAndUserId: build.mutation<
      PostApiOfficeByOfficeIdAndUserIdApiResponse,
      PostApiOfficeByOfficeIdAndUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/${queryArg.userId}`,
        method: 'POST'
      })
    }),
    deleteApiOfficeByOfficeIdAndUserId: build.mutation<
      DeleteApiOfficeByOfficeIdAndUserIdApiResponse,
      DeleteApiOfficeByOfficeIdAndUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.officeId}/${queryArg.userId}`,
        method: 'DELETE',
        body: queryArg.removeUserFromOfficeInput
      })
    }),
    postApiOfficeByUserIdOffices: build.mutation<
      PostApiOfficeByUserIdOfficesApiResponse,
      PostApiOfficeByUserIdOfficesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/office/${queryArg.userId}/offices`,
        method: 'POST',
        body: queryArg.officeIdListBean
      })
    }),
    getApiPermit: build.query<GetApiPermitApiResponse, GetApiPermitApiArg>({
      query: (queryArg) => ({
        url: `/api/permit`,
        params: {
          sort_by: queryArg.sortBy,
          sort_desc: queryArg.sortDesc
        }
      })
    }),
    postApiPermitAddDelegation: build.mutation<
      PostApiPermitAddDelegationApiResponse,
      PostApiPermitAddDelegationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/add_delegation`,
        method: 'POST',
        body: queryArg.createDelegationBean
      })
    }),
    postApiPermitAddPermission: build.mutation<
      PostApiPermitAddPermissionApiResponse,
      PostApiPermitAddPermissionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/add_permission`,
        method: 'POST',
        body: queryArg.createPermissionBean
      })
    }),
    deleteApiPermitDeleteDelegationById: build.mutation<
      DeleteApiPermitDeleteDelegationByIdApiResponse,
      DeleteApiPermitDeleteDelegationByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/delete_delegation/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    postApiPermitMultiAddPermission: build.mutation<
      PostApiPermitMultiAddPermissionApiResponse,
      PostApiPermitMultiAddPermissionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/multi_add_permission`,
        method: 'POST',
        body: queryArg.createMultiPermissionBean
      })
    }),
    putApiPermitUpdateDelegationById: build.mutation<
      PutApiPermitUpdateDelegationByIdApiResponse,
      PutApiPermitUpdateDelegationByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/update_delegation/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.updateDelegationDatesBean
      })
    }),
    getApiPermitById: build.query<
      GetApiPermitByIdApiResponse,
      GetApiPermitByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/permit/${queryArg.id}` })
    }),
    deleteApiPermitById: build.mutation<
      DeleteApiPermitByIdApiResponse,
      DeleteApiPermitByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/permit/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    postApiRole: build.mutation<PostApiRoleApiResponse, PostApiRoleApiArg>({
      query: (queryArg) => ({
        url: `/api/role`,
        method: 'POST',
        body: queryArg.createRoleBean
      })
    }),
    getApiRoleAppByApplicationId: build.query<
      GetApiRoleAppByApplicationIdApiResponse,
      GetApiRoleAppByApplicationIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/role/app/${queryArg.applicationId}` })
    }),
    putApiRoleApplicationByApplicationIdUserAndUserId: build.mutation<
      PutApiRoleApplicationByApplicationIdUserAndUserIdApiResponse,
      PutApiRoleApplicationByApplicationIdUserAndUserIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/role/application/${queryArg.applicationId}/user/${queryArg.userId}`,
        method: 'PUT',
        params: {
          anac: queryArg.anac,
          gpp: queryArg.gpp
        }
      })
    }),
    getApiRoleById: build.query<
      GetApiRoleByIdApiResponse,
      GetApiRoleByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/role/${queryArg.id}` })
    }),
    putApiRoleById: build.mutation<
      PutApiRoleByIdApiResponse,
      PutApiRoleByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/role/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.body
      })
    }),
    deleteApiRoleById: build.mutation<
      DeleteApiRoleByIdApiResponse,
      DeleteApiRoleByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/role/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    getApiUser: build.query<GetApiUserApiResponse, GetApiUserApiArg>({
      query: (queryArg) => ({
        url: `/api/user`,
        params: {
          page: queryArg.page,
          size: queryArg.size,
          sort: queryArg.sort
        }
      })
    }),
    postApiUser: build.mutation<PostApiUserApiResponse, PostApiUserApiArg>({
      query: (queryArg) => ({
        url: `/api/user`,
        method: 'POST',
        body: queryArg.user
      })
    }),
    getApiUserById: build.query<
      GetApiUserByIdApiResponse,
      GetApiUserByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/user/${queryArg.id}` })
    }),
    putApiUserById: build.mutation<
      PutApiUserByIdApiResponse,
      PutApiUserByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}`,
        method: 'PUT',
        body: queryArg.user
      })
    }),
    deleteApiUserById: build.mutation<
      DeleteApiUserByIdApiResponse,
      DeleteApiUserByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}`,
        method: 'DELETE'
      })
    }),
    postApiUserByIdNote: build.mutation<
      PostApiUserByIdNoteApiResponse,
      PostApiUserByIdNoteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}/note`,
        method: 'POST',
        params: {
          note: queryArg.note
        }
      })
    }),
    getApiUserByIdOffices: build.query<
      GetApiUserByIdOfficesApiResponse,
      GetApiUserByIdOfficesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}/offices`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByIdOfficesPages: build.query<
      GetApiUserByIdOfficesPagesApiResponse,
      GetApiUserByIdOfficesPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}/offices/pages`,
        params: {
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdDelegations: build.query<
      GetApiUserByUserIdDelegationsApiResponse,
      GetApiUserByUserIdDelegationsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/delegations`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdDelegationsPages: build.query<
      GetApiUserByUserIdDelegationsPagesApiResponse,
      GetApiUserByUserIdDelegationsPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/delegations/pages`,
        params: {
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdDelegationsSent: build.query<
      GetApiUserByUserIdDelegationsSentApiResponse,
      GetApiUserByUserIdDelegationsSentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/delegations_sent`,
        params: {
          by: queryArg.by,
          desc: queryArg.desc,
          page: queryArg.page,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdDelegationsSentPages: build.query<
      GetApiUserByUserIdDelegationsSentPagesApiResponse,
      GetApiUserByUserIdDelegationsSentPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/delegations_sent/pages`,
        params: {
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdPermissions: build.query<
      GetApiUserByUserIdPermissionsApiResponse,
      GetApiUserByUserIdPermissionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/permissions`,
        params: {
          applicationId: queryArg.applicationId,
          by: queryArg.by,
          cdrs: queryArg.cdrs,
          desc: queryArg.desc,
          page: queryArg.page,
          roleIds: queryArg.roleIds,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    }),
    getApiUserByUserIdPermissionsPages: build.query<
      GetApiUserByUserIdPermissionsPagesApiResponse,
      GetApiUserByUserIdPermissionsPagesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.userId}/permissions/pages`,
        params: {
          applicationId: queryArg.applicationId,
          cdrs: queryArg.cdrs,
          roleIds: queryArg.roleIds,
          search: queryArg.search,
          size: queryArg.size
        }
      })
    })
  }),
  overrideExisting: false
});
export { injectedRtkApi as SSOApi };
export type PostApiAdminRoleApiResponse =
  /** status 200 OK */ AdminApplicationRole;
export type PostApiAdminRoleApiArg = {
  createAdminRoleBean: CreateAdminRoleBean;
};
export type GetApiAdminRoleApplicationByApplicationIdApiResponse =
  /** status 200 OK */ AdminApplicationRole[];
export type GetApiAdminRoleApplicationByApplicationIdApiArg = {
  applicationId: number;
};
export type GetApiAdminRoleUserByUserIdApiResponse =
  /** status 200 OK */ AdminApplicationRole[];
export type GetApiAdminRoleUserByUserIdApiArg = {
  userId: number;
  applicationId?: number;
};
export type GetApiAdminRoleByIdApiResponse =
  /** status 200 OK */ AdminApplicationRole;
export type GetApiAdminRoleByIdApiArg = {
  id: number;
};
export type DeleteApiAdminRoleByIdApiResponse =
  /** status 200 OK */ AdminApplicationRole;
export type DeleteApiAdminRoleByIdApiArg = {
  id: number;
};
export type PutApiAdminRoleByRoleIdUserAndUserIdApiResponse = unknown;
export type PutApiAdminRoleByRoleIdUserAndUserIdApiArg = {
  roleId: number;
  userId: number;
};
export type DeleteApiAdminRoleByRoleIdUserAndUserIdApiResponse = unknown;
export type DeleteApiAdminRoleByRoleIdUserAndUserIdApiArg = {
  roleId: number;
  userId: number;
};
export type GetApiApplicationApiResponse = unknown;
export type GetApiApplicationApiArg = void;
export type GetApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeIdApiResponse =
  /** status 200 OK */ Role[];
export type GetApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeIdApiArg =
  {
    applicationId: number;
    officeId: number;
    userId: number;
  };
export type GetApiApplicationByApplicationIdGetAdminsApiResponse =
  /** status 200 OK */ User[];
export type GetApiApplicationByApplicationIdGetAdminsApiArg = {
  applicationId: number;
};
export type GetApiApplicationByApplicationIdSearchUsersApiResponse =
  /** status 200 OK */ UserApplicationOfficesDto[];
export type GetApiApplicationByApplicationIdSearchUsersApiArg = {
  applicationId: number;
  code?: string;
  officeFilter?: string;
  userFilter?: string;
};
export type PostApiApplicationByApplicationIdSyncUsersWithPermissionsApiResponse =
  /** status 200 OK */ SynchBean;
export type PostApiApplicationByApplicationIdSyncUsersWithPermissionsApiArg = {
  applicationId: number;
};
export type GetApiApplicationByIdApiResponse = unknown;
export type GetApiApplicationByIdApiArg = {
  id: number;
};
export type GetApiAuthGetFullUsersInfosApiResponse =
  /** status 200 OK */ UserWithAttributeDto[];
export type GetApiAuthGetFullUsersInfosApiArg = void;
export type GetApiAuthMeApiResponse = /** status 200 OK */ MeBean;
export type GetApiAuthMeApiArg = {
  applicationId?: number;
};
export type PostApiAuthSynchUsersApiResponse = /** status 200 OK */ SynchBean;
export type PostApiAuthSynchUsersApiArg = void;
export type GetApiAuthUserByAuthIdApplicationAndApplicationIdApiResponse =
  /** status 200 OK */ MeBean;
export type GetApiAuthUserByAuthIdApplicationAndApplicationIdApiArg = {
  applicationId: number;
  authId: string;
};
export type GetApiAuthUserByIdHistoryApiResponse =
  /** status 200 OK */ UserHistory[];
export type GetApiAuthUserByIdHistoryApiArg = {
  id: number;
};
export type GetApiAuthUsersApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiAuthUsersApiArg = {
  appId?: number;
  by?: string;
  desc?: boolean;
  enabledFlag?: number;
  officeIds?: number[];
  page?: number;
  roles?: number[];
  search?: string;
  size?: number;
  types?: string[];
};
export type GetApiAuthUsersExportApiResponse = unknown;
export type GetApiAuthUsersExportApiArg = {
  appId?: number;
  by?: string;
  desc?: boolean;
  enabledFlag?: number;
  officeIds?: number[];
  page?: number;
  roles?: number[];
  search?: string;
  size?: number;
  types?: string[];
};
export type GetApiAuthUsersPagesApiResponse = /** status 200 OK */ number;
export type GetApiAuthUsersPagesApiArg = {
  search?: string;
  size?: number;
};
export type DeleteApiDocsDeleteAttachmentByIdApiResponse = unknown;
export type DeleteApiDocsDeleteAttachmentByIdApiArg = {
  id: number;
};
export type GetApiDocsDownloadAttachmentByIdApiResponse = unknown;
export type GetApiDocsDownloadAttachmentByIdApiArg = {
  id: number;
};
export type PostApiDocsImportFileApiResponse = unknown;
export type PostApiDocsImportFileApiArg = {
  body: object;
};
export type PostApiDocsLoadAttachmentApiResponse = unknown;
export type PostApiDocsLoadAttachmentApiArg = {
  body: object;
};
export type GetApiOfficeApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiOfficeApiArg = {
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type PostApiOfficeApiResponse = /** status 200 OK */ Office;
export type PostApiOfficeApiArg = {
  officeInput: OfficeInput;
};
export type DeleteApiOfficeDeleteByOfficeIdPermanentApiResponse =
  /** status 200 OK */ Office;
export type DeleteApiOfficeDeleteByOfficeIdPermanentApiArg = {
  officeId: number;
};
export type PutApiOfficeMergeApiResponse = unknown;
export type PutApiOfficeMergeApiArg = {
  body: OfficeUserUpdates[];
};
export type PostApiOfficeMultiApiResponse = unknown;
export type PostApiOfficeMultiApiArg = {
  body: OfficeInput[];
};
export type PutApiOfficeOpenByOfficeIdApiResponse = /** status 200 OK */ Office;
export type PutApiOfficeOpenByOfficeIdApiArg = {
  officeId: number;
};
export type GetApiOfficePagesApiResponse = /** status 200 OK */ number;
export type GetApiOfficePagesApiArg = {
  search?: string;
  size?: number;
};
export type GetApiOfficeByApplicationIdUsersAndCdrApiResponse =
  /** status 200 OK */ UserDto1[];
export type GetApiOfficeByApplicationIdUsersAndCdrApiArg = {
  applicationId: number;
  cdr: string;
  nodeleg?: boolean;
};
export type GetApiOfficeByCdrCodeNewOfficesApiResponse =
  /** status 200 OK */ Office[];
export type GetApiOfficeByCdrCodeNewOfficesApiArg = {
  cdrCode: string;
};
export type GetApiOfficeByCdrCodeRelatedOfficesApiResponse =
  /** status 200 OK */ Office[];
export type GetApiOfficeByCdrCodeRelatedOfficesApiArg = {
  cdrCode: string;
};
export type GetApiOfficeByIdApiResponse = /** status 200 OK */ Office;
export type GetApiOfficeByIdApiArg = {
  id: number;
};
export type GetApiOfficeByIdHistoryApiResponse =
  /** status 200 OK */ OfficeHistory[];
export type GetApiOfficeByIdHistoryApiArg = {
  id: number;
};
export type GetApiOfficeByIdUsersApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiOfficeByIdUsersApiArg = {
  id: number;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type GetApiOfficeByIdUsersPagesApiResponse = /** status 200 OK */ number;
export type GetApiOfficeByIdUsersPagesApiArg = {
  id: number;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type GetApiOfficeByOfficeIdApplicationAndApplicationIdUsersApiResponse =
  /** status 200 OK */ {
    [key: string]: object;
  };
export type GetApiOfficeByOfficeIdApplicationAndApplicationIdUsersApiArg = {
  applicationId: number;
  officeId: string;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type PutApiOfficeByOfficeIdApiResponse = /** status 200 OK */ Office;
export type PutApiOfficeByOfficeIdApiArg = {
  officeId: number;
  officeInput: OfficeInput;
};
export type DeleteApiOfficeByOfficeIdApiResponse = /** status 200 OK */ Office;
export type DeleteApiOfficeByOfficeIdApiArg = {
  officeId: number;
};
export type PutApiOfficeByOfficeIdSplitApiResponse = unknown;
export type PutApiOfficeByOfficeIdSplitApiArg = {
  officeId: number;
  moveUsersToOfficeInput: MoveUsersToOfficeInput;
};
export type PostApiOfficeByOfficeIdUsersApiResponse = unknown;
export type PostApiOfficeByOfficeIdUsersApiArg = {
  officeId: number;
  userIdListBean: UserIdListBean;
};
export type DeleteApiOfficeByOfficeIdUsersApiResponse = unknown;
export type DeleteApiOfficeByOfficeIdUsersApiArg = {
  officeId: number;
  userIdListBean: UserIdListBean;
};
export type PostApiOfficeByOfficeIdAndUserIdApiResponse =
  /** status 200 OK */ UserOffice;
export type PostApiOfficeByOfficeIdAndUserIdApiArg = {
  officeId: number;
  userId: number;
};
export type DeleteApiOfficeByOfficeIdAndUserIdApiResponse =
  /** status 200 OK */ UserOffice;
export type DeleteApiOfficeByOfficeIdAndUserIdApiArg = {
  officeId: number;
  userId: number;
  removeUserFromOfficeInput: RemoveUserFromOfficeInput;
};
export type PostApiOfficeByUserIdOfficesApiResponse = unknown;
export type PostApiOfficeByUserIdOfficesApiArg = {
  userId: number;
  officeIdListBean: OfficeIdListBean;
};
export type GetApiPermitApiResponse = /** status 200 OK */ Permit[];
export type GetApiPermitApiArg = {
  sortBy?: string;
  sortDesc?: boolean;
};
export type PostApiPermitAddDelegationApiResponse = unknown;
export type PostApiPermitAddDelegationApiArg = {
  createDelegationBean: CreateDelegationBean;
};
export type PostApiPermitAddPermissionApiResponse = /** status 200 OK */ Permit;
export type PostApiPermitAddPermissionApiArg = {
  createPermissionBean: CreatePermissionBean;
};
export type DeleteApiPermitDeleteDelegationByIdApiResponse =
  /** status 200 OK */ boolean;
export type DeleteApiPermitDeleteDelegationByIdApiArg = {
  id: number;
};
export type PostApiPermitMultiAddPermissionApiResponse = unknown;
export type PostApiPermitMultiAddPermissionApiArg = {
  createMultiPermissionBean: CreateMultiPermissionBean;
};
export type PutApiPermitUpdateDelegationByIdApiResponse = unknown;
export type PutApiPermitUpdateDelegationByIdApiArg = {
  id: number;
  updateDelegationDatesBean: UpdateDelegationDatesBean;
};
export type GetApiPermitByIdApiResponse = /** status 200 OK */ Permit;
export type GetApiPermitByIdApiArg = {
  id: number;
};
export type DeleteApiPermitByIdApiResponse = unknown;
export type DeleteApiPermitByIdApiArg = {
  id: number;
};
export type PostApiRoleApiResponse = /** status 200 OK */ Role;
export type PostApiRoleApiArg = {
  createRoleBean: CreateRoleBean;
};
export type GetApiRoleAppByApplicationIdApiResponse =
  /** status 200 OK */ Role[];
export type GetApiRoleAppByApplicationIdApiArg = {
  applicationId: number;
};
export type PutApiRoleApplicationByApplicationIdUserAndUserIdApiResponse =
  unknown;
export type PutApiRoleApplicationByApplicationIdUserAndUserIdApiArg = {
  applicationId: number;
  userId: number;
  anac?: boolean;
  gpp?: boolean;
};
export type GetApiRoleByIdApiResponse = /** status 200 OK */ Role;
export type GetApiRoleByIdApiArg = {
  id: number;
};
export type PutApiRoleByIdApiResponse = /** status 200 OK */ Role;
export type PutApiRoleByIdApiArg = {
  id: number;
  body: number;
};
export type DeleteApiRoleByIdApiResponse = /** status 200 OK */ Role;
export type DeleteApiRoleByIdApiArg = {
  id: number;
};
export type GetApiUserApiResponse = unknown;
export type GetApiUserApiArg = {
  page?: number;
  size?: number;
  sort?: any;
};
export type PostApiUserApiResponse = unknown;
export type PostApiUserApiArg = {
  user: User;
};
export type GetApiUserByIdApiResponse = unknown;
export type GetApiUserByIdApiArg = {
  id: number;
};
export type PutApiUserByIdApiResponse = unknown;
export type PutApiUserByIdApiArg = {
  id: number;
  user: User;
};
export type DeleteApiUserByIdApiResponse = unknown;
export type DeleteApiUserByIdApiArg = {
  id: number;
};
export type PostApiUserByIdNoteApiResponse = /** status 200 OK */ boolean;
export type PostApiUserByIdNoteApiArg = {
  id: number;
  note?: string;
};
export type GetApiUserByIdOfficesApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiUserByIdOfficesApiArg = {
  id: number;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type GetApiUserByIdOfficesPagesApiResponse = /** status 200 OK */ number;
export type GetApiUserByIdOfficesPagesApiArg = {
  id: number;
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdDelegationsApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiUserByUserIdDelegationsApiArg = {
  userId: number;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdDelegationsPagesApiResponse =
  /** status 200 OK */ number;
export type GetApiUserByUserIdDelegationsPagesApiArg = {
  userId: number;
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdDelegationsSentApiResponse =
  /** status 200 OK */ {
    [key: string]: object;
  };
export type GetApiUserByUserIdDelegationsSentApiArg = {
  userId: number;
  by?: string;
  desc?: boolean;
  page?: number;
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdDelegationsSentPagesApiResponse =
  /** status 200 OK */ number;
export type GetApiUserByUserIdDelegationsSentPagesApiArg = {
  userId: number;
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdPermissionsApiResponse = /** status 200 OK */ {
  [key: string]: object;
};
export type GetApiUserByUserIdPermissionsApiArg = {
  userId: number;
  applicationId?: number;
  by?: string;
  cdrs?: string[];
  desc?: boolean;
  page?: number;
  roleIds?: number[];
  search?: string;
  size?: number;
};
export type GetApiUserByUserIdPermissionsPagesApiResponse =
  /** status 200 OK */ number;
export type GetApiUserByUserIdPermissionsPagesApiArg = {
  userId: number;
  applicationId?: number;
  cdrs?: string[];
  roleIds?: number[];
  search?: string;
  size?: number;
};
export type Role = {
  id?: number;
  name?: string;
  full_name?: string;
  keycloak_ref?: string;
  hierarchy_level?: number;
};
export type ApplicationRole = {
  id?: number;
  application_id?: number;
  role_id?: number;
  role?: Role;
};
export type Application = {
  id?: number;
  name?: string;
  applicationRoles?: ApplicationRole[];
};
export type AdminApplicationRole = {
  id?: number;
  application_id?: number;
  role?: string;
  complete_role?: string;
  application?: Application;
};
export type CreateAdminRoleBean = {
  role?: string;
  applicationId?: number;
};
export type Attachment = {
  id?: number;
  url?: string;
  delegation_id?: number;
};
export type PermitType = 'PERSISTENT' | 'DELEGATION' | 'TRANSIENT';
export type Permit = {
  id?: number;
  father_permit_id?: number;
  application_id?: number;
  delegation_id?: number;
  user_id?: number;
  office_id?: number;
  role_id?: number;
  type?: PermitType;
  father?: Permit;
  officeName?: string;
  role?: Role;
};
export type UserDto = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  auth_id?: string;
  email?: string;
};
export type Office = {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  short_description?: string;
  service?: string;
  dirigente_user_id?: number;
  office_start_date?: string;
  office_end_date?: string;
  last_update?: string;
  deleted?: boolean;
  deleted_permanent?: boolean;
  blocked?: boolean;
};
export type Delegation = {
  id?: number;
  note?: string;
  user_id?: number;
  from_user_id?: number;
  delegation_start?: string;
  delegation_end?: string;
  cdrCode?: number;
  cdr?: string;
  applicationId?: number;
  attachment?: Attachment;
  permits?: Permit[];
  user_UserName?: string;
  fromUser_UserName?: string;
  fromUserData?: UserDto;
  cDR_Object?: Office;
  cDR_Name?: string;
  application_Object?: Application;
  application_Name?: string;
};
export type UserOffice = {
  id?: number;
  user_id?: number;
  office_id?: number;
  deleted?: boolean;
  office?: Office;
  officeById?: Office;
  userOfficeRoles?: Permit[];
  userOfficeDelegheInviate?: Permit[];
  roles?: Role[];
  rolesNodeleg?: Role[];
};
export type User = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  auth_id?: string;
  email?: string;
  note?: string;
  enabled?: boolean;
  roles?: string[];
  delegations?: Delegation[];
  delegationsSent?: Delegation[];
  userOffices?: UserOffice[];
  userOfficesForDelegation?: UserOffice[];
  storicUserOffices?: UserOffice[];
};
export type UserApplicationOfficesDto = {
  authId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cdrCodes?: {
    [key: string]: string[];
  };
};
export type SynchBean = {
  success?: boolean;
};
export type UserWithAttributeDto = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  auth_id?: string;
  email?: string;
  matricola?: string;
  department?: string;
  role?: string;
  qualifica?: string;
  isDirigente?: boolean;
  cdrCode?: string;
  mustBeImportedInTitolario?: boolean;
  enabled?: boolean;
};
export type DelegationDto = {
  id?: number;
  note?: string;
  user_id?: number;
  applicationId?: number;
  from_user_id?: number;
  delegation_start?: string;
  delegation_end?: string;
  attachment?: Attachment;
  permits?: Permit[];
  fromUser_UserName?: string;
  fromUserData?: UserDto;
};
export type UserOfficeBean = {
  user_id?: number;
  office_id?: number;
  deleted?: boolean;
  office?: Office;
  userOfficeRoles?: Permit[];
  userOfficeDelegheInviate?: Permit[];
  roles?: Role[];
  rolesNodeleg?: Role[];
};
export type UserBean = {
  username?: string;
  firstName?: string;
  lastName?: string;
  auth_id?: string;
  email?: string;
  roles?: string[];
  delegations?: DelegationDto[];
  delegationsSent?: DelegationDto[];
  userOffices?: UserOfficeBean[];
  storicUserOffices?: UserOfficeBean[];
};
export type RecordState = 'IN' | 'OUT' | 'CR' | 'OTHER';
export type RecordType =
  | 'PERM'
  | 'OFFICE'
  | 'UPDATE_ROW'
  | 'DELETE_OFFICE'
  | 'PERMANENT_DELETE_OFFICE'
  | 'REOPEN_OFFICE'
  | 'CREATE_OFFICE'
  | 'INVALIDATE_PERMIT'
  | 'INHERIT';
export type UserHistory = {
  id?: number;
  father_permit_id?: number;
  note?: string;
  permit_id?: number;
  correlation?: string;
  user_id?: number;
  office_id?: number;
  role_id?: number;
  delegation_start?: string;
  delegation_end?: string;
  type?: PermitType;
  state?: RecordState;
  record_type?: RecordType;
  created_at?: string;
  cdr_code?: number;
  cdr?: string;
  application_id?: number;
  userName?: string;
  sentUserName?: string;
  officeName?: string;
  officeCode?: string;
};
export type MeBean = {
  user_data?: UserBean;
  history?: UserHistory[];
  storic_offices?: Office[];
};
export type OfficeInput = {
  name?: string;
  code?: string;
  dirigente_user_id?: number;
  service?: string;
  description?: string;
  belonging_offices?: number[];
  blocked?: boolean;
};
export type UserOffices = {
  userId?: number;
  offices?: number[];
};
export type OfficeUserUpdates = {
  officeId?: number;
  userOffices?: UserOffices[];
  deleteOffice?: boolean;
};
export type UserDto1 = {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  userOffices?: UserOffice[];
};
export type OfficeHistory = {
  id?: number;
  old_office_id?: number;
  office_id?: number;
  user_id?: number;
  correlation?: string;
  state?: RecordState;
  record_type?: RecordType;
  created_at?: string;
  userName?: string;
  officeName?: string;
  officeCode?: string;
  oldOfficeName?: string;
  oldOfficeCode?: string;
};
export type MoveUsersToOfficeInput = {
  userUpdates?: UserOffices[];
  deleteOffice?: boolean;
};
export type UserIdListBean = {
  user_ids?: number[];
  deletePermits?: boolean;
};
export type RemoveUserFromOfficeInput = {
  deletePermits?: boolean;
};
export type OfficeIdListBean = {
  office_ids?: number[];
};
export type CreateDelegationBean = {
  note?: string;
  user_id?: number;
  to_user_id?: number;
  delegation_start?: string;
  delegation_end?: string;
  cdr_code_list?: number[];
  applicationId?: number;
};
export type CreatePermissionBean = {
  user_id?: number;
  office_id?: number;
  role_id?: number;
};
export type CreateMultiPermissionBean = {
  user_id?: number;
  office_id?: number;
  role_ids?: number[];
};
export type UpdateDelegationDatesBean = {
  delegation_start?: string;
  delegation_end?: string;
  note?: string;
  cdr_code?: number;
  applicationId?: number;
};
export type CreateRoleBean = {
  name?: string;
  applicationId?: number;
  keycloak_ref?: string;
  hierarchy_level?: number;
};
export const {
  usePostApiAdminRoleMutation,
  useGetApiAdminRoleApplicationByApplicationIdQuery,
  useGetApiAdminRoleUserByUserIdQuery,
  useGetApiAdminRoleByIdQuery,
  useDeleteApiAdminRoleByIdMutation,
  usePutApiAdminRoleByRoleIdUserAndUserIdMutation,
  useDeleteApiAdminRoleByRoleIdUserAndUserIdMutation,
  useGetApiApplicationQuery,
  useGetApiApplicationByApplicationIdFreeRolesForUserAndUserIdByOfficeOfficeIdQuery,
  useGetApiApplicationByApplicationIdGetAdminsQuery,
  useGetApiApplicationByApplicationIdSearchUsersQuery,
  usePostApiApplicationByApplicationIdSyncUsersWithPermissionsMutation,
  useGetApiApplicationByIdQuery,
  useGetApiAuthGetFullUsersInfosQuery,
  useGetApiAuthMeQuery,
  usePostApiAuthSynchUsersMutation,
  useGetApiAuthUserByAuthIdApplicationAndApplicationIdQuery,
  useGetApiAuthUserByIdHistoryQuery,
  useGetApiAuthUsersQuery,
  useGetApiAuthUsersExportQuery,
  useGetApiAuthUsersPagesQuery,
  useDeleteApiDocsDeleteAttachmentByIdMutation,
  useGetApiDocsDownloadAttachmentByIdQuery,
  usePostApiDocsImportFileMutation,
  usePostApiDocsLoadAttachmentMutation,
  useGetApiOfficeQuery,
  usePostApiOfficeMutation,
  useDeleteApiOfficeDeleteByOfficeIdPermanentMutation,
  usePutApiOfficeMergeMutation,
  usePostApiOfficeMultiMutation,
  usePutApiOfficeOpenByOfficeIdMutation,
  useGetApiOfficePagesQuery,
  useGetApiOfficeByApplicationIdUsersAndCdrQuery,
  useGetApiOfficeByCdrCodeNewOfficesQuery,
  useGetApiOfficeByCdrCodeRelatedOfficesQuery,
  useGetApiOfficeByIdQuery,
  useGetApiOfficeByIdHistoryQuery,
  useGetApiOfficeByIdUsersQuery,
  useGetApiOfficeByIdUsersPagesQuery,
  useGetApiOfficeByOfficeIdApplicationAndApplicationIdUsersQuery,
  usePutApiOfficeByOfficeIdMutation,
  useDeleteApiOfficeByOfficeIdMutation,
  usePutApiOfficeByOfficeIdSplitMutation,
  usePostApiOfficeByOfficeIdUsersMutation,
  useDeleteApiOfficeByOfficeIdUsersMutation,
  usePostApiOfficeByOfficeIdAndUserIdMutation,
  useDeleteApiOfficeByOfficeIdAndUserIdMutation,
  usePostApiOfficeByUserIdOfficesMutation,
  useGetApiPermitQuery,
  usePostApiPermitAddDelegationMutation,
  usePostApiPermitAddPermissionMutation,
  useDeleteApiPermitDeleteDelegationByIdMutation,
  usePostApiPermitMultiAddPermissionMutation,
  usePutApiPermitUpdateDelegationByIdMutation,
  useGetApiPermitByIdQuery,
  useDeleteApiPermitByIdMutation,
  usePostApiRoleMutation,
  useGetApiRoleAppByApplicationIdQuery,
  usePutApiRoleApplicationByApplicationIdUserAndUserIdMutation,
  useGetApiRoleByIdQuery,
  usePutApiRoleByIdMutation,
  useDeleteApiRoleByIdMutation,
  useGetApiUserQuery,
  usePostApiUserMutation,
  useGetApiUserByIdQuery,
  usePutApiUserByIdMutation,
  useDeleteApiUserByIdMutation,
  usePostApiUserByIdNoteMutation,
  useGetApiUserByIdOfficesQuery,
  useGetApiUserByIdOfficesPagesQuery,
  useGetApiUserByUserIdDelegationsQuery,
  useGetApiUserByUserIdDelegationsPagesQuery,
  useGetApiUserByUserIdDelegationsSentQuery,
  useGetApiUserByUserIdDelegationsSentPagesQuery,
  useGetApiUserByUserIdPermissionsQuery,
  useGetApiUserByUserIdPermissionsPagesQuery
} = injectedRtkApi;
