import baseAPI from "../../api/baseAPI";

const settingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: () => ({
        url: "v1/account/profile/update/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),

    updateAdminProfile: builder.mutation({
      query: (body) => ({
        url: "v1/account/profile/update/",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body,
      }),
    }),

    getTermsConditions: builder.query({
      query: () => `api/dicipline/terms-conditions/`,
    }),
    getPrivacyPolicy: builder.query({
      query: () => `api/dicipline/terms-conditions/`,
    }),
    getTrustSafety: builder.query({
      query: () => `api/dicipline/terms-conditions/`,
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetTermsConditionsQuery,
  useGetPrivacyPolicyQuery,
  useGetTrustSafetyQuery,
} = settingAPI;
export default settingAPI;
