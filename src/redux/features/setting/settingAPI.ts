import baseAPI from "../../api/baseAPI";

const settingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: () => ({
        url: "v1/account/profile/update/",
        method: "GET",
      }),
    }),

    updateAdminProfile: builder.mutation({
      query: (body) => ({
        url: "v1/account/profile/update/",
        method: "PUT",
        body,
      }),
    }),

    getPrivacyPolicy: builder.query({
      query: () => `v1/privacy-policy/privacy-policy/`,
    }),
    setPrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: "v1/privacy-policy/privacy-policy/",
        method: "PUT",
        body,
      }),
    }),

    getTermCondition: builder.query({
      query: () => `v1/privacy-policy/terms-conditions/`,
    }),
    setTermCondition: builder.mutation({
      query: (body) => ({
        url: "v1/privacy-policy/terms-conditions/",
        method: "PUT",
        body,
      }),
    }),

    getTrustSafety: builder.query({
      query: () => `v1/privacy-policy/trust-safety/`,
    }),
    setTrustSafety: builder.mutation({
      query: (body) => ({
        url: "v1/privacy-policy/trust-safety/",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
  useGetTermConditionQuery,
  useSetTermConditionMutation,
  useGetTrustSafetyQuery,
  useSetTrustSafetyMutation,
} = settingAPI;
export default settingAPI;
