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
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetPrivacyPolicyQuery,
  useSetPrivacyPolicyMutation,
} = settingAPI;
export default settingAPI;
