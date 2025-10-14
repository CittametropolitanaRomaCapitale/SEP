import * as generated from './generated';

const SSOApi = generated.SSOApi.enhanceEndpoints({
  addTagTypes: [
    'OfficeByIdUsers',
    'Office',
    'UserByIdOffices',
    'UserByUserIdDelegationsSent',
    'UserByUserIdDelegations',
    'UserByUserIdPermissions',
    'OfficeById',
    'OfficeByIdUsers',
    'AdminRoleUserByUserId',
    'OfficeByCdrCodeRelatedOffices'
  ],
  endpoints: {
    getApiOffice: {
      providesTags: ['Office']
    },
    postApiOffice: {
      invalidatesTags: ['Office']
    },
    putApiOfficeByOfficeId: {
      invalidatesTags: ['Office', 'OfficeById', 'OfficeByCdrCodeRelatedOffices']
    },
    getApiUserByIdOffices: {
      providesTags: ['UserByIdOffices']
    },
    postApiOfficeByOfficeIdAndUserId: {
      invalidatesTags: ['UserByIdOffices']
    },
    postApiOfficeByUserIdOffices: {
      invalidatesTags: ['UserByIdOffices']
    },
    deleteApiOfficeByOfficeIdAndUserId: {
      invalidatesTags: [
        'UserByIdOffices',
        'OfficeByIdUsers',
        'UserByUserIdPermissions'
      ]
    },
    getApiUserByUserIdDelegations: {
      providesTags: ['UserByUserIdDelegations']
    },
    getApiUserByUserIdDelegationsSent: {
      providesTags: ['UserByUserIdDelegationsSent']
    },
    postApiPermitAddDelegation: {
      invalidatesTags: [
        'UserByUserIdDelegations',
        'UserByUserIdDelegationsSent'
      ]
    },
    putApiPermitUpdateDelegationById: {
      invalidatesTags: [
        'UserByUserIdDelegations',
        'UserByUserIdDelegationsSent'
      ]
    },
    deleteApiDocsDeleteAttachmentById: {
      invalidatesTags: [
        'UserByUserIdDelegations',
        'UserByUserIdDelegationsSent'
      ]
    },
    deleteApiPermitById: {
      invalidatesTags: ['UserByUserIdPermissions']
    },
    deleteApiPermitDeleteDelegationById: {
      invalidatesTags: [
        'UserByUserIdDelegations',
        'UserByUserIdDelegationsSent'
      ]
    },
    getApiUserByUserIdPermissions: {
      providesTags: ['UserByUserIdPermissions']
    },
    postApiPermitAddPermission: {
      invalidatesTags: ['UserByUserIdPermissions']
    },
    postApiPermitMultiAddPermission: {
      invalidatesTags: ['UserByUserIdPermissions']
    },
    getApiOfficeByIdUsers: {
      providesTags: ['OfficeByIdUsers']
    },
    deleteApiOfficeByOfficeIdUsers: {
      invalidatesTags: ['OfficeByIdUsers']
    },
    getApiOfficeById: {
      providesTags: ['OfficeById']
    },
    postApiOfficeByOfficeIdUsers: {
      invalidatesTags: ['OfficeByIdUsers']
    },
    deleteApiOfficeByOfficeId: {
      invalidatesTags: ['Office', 'OfficeById', 'OfficeByIdUsers']
    },
    deleteApiOfficeDeleteByOfficeIdPermanent: {
      invalidatesTags: ['Office', 'OfficeById', 'OfficeByIdUsers']
    },
    putApiOfficeOpenByOfficeId: {
      invalidatesTags: ['Office', 'OfficeById', 'OfficeByIdUsers']
    },
    getApiAdminRoleUserByUserId: {
      providesTags: ['AdminRoleUserByUserId']
    },
    putApiAdminRoleByRoleIdUserAndUserId: {
      invalidatesTags: ['AdminRoleUserByUserId']
    },
    deleteApiAdminRoleByRoleIdUserAndUserId: {
      invalidatesTags: ['AdminRoleUserByUserId']
    },
    getApiOfficeByCdrCodeRelatedOffices: {
      providesTags: ['OfficeByCdrCodeRelatedOffices']
    }
  }
});

export default SSOApi;
