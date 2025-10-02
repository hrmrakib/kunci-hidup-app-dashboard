import baseAPI from "../../api/baseAPI";

const AdministratorsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaffs: builder.query({
      query: () => ({
        url: "v1/administration/staff/list/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
      providesTags: ["Staffs"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "v1/administration/create-admin/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }),
    }),

    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `v1/administration/admin-update/${id}/`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }),
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `v1/administration/delete/${id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllStaffsQuery,
  useCreateAdminMutation,
  useUpdateRoleMutation,
  useDeleteAdminMutation,
} = AdministratorsAPI;
export default AdministratorsAPI;
