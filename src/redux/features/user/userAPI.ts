import baseAPI from "@/redux/api/baseAPI";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "v1/dashboard/user-management/",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = userAPI;
export default userAPI;
