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

    getPrivacyPolicy: builder.query({
      query: () => `v1/privacy-policy/privacy-policy/`,
    }),

    setPrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: "v1/privacy-policy/privacy-policy/",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
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
