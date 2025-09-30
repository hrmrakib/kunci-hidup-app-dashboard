import baseAPI from "@/redux/api/baseAPI";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "v1/dashboard/user-management/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = userAPI;
export default userAPI;
