import baseAPI from "../../api/baseAPI";

const AdministratorsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaffs: builder.query({
      query: () => ({
        url: "v1/administration/staff/list/",
        method: "GET",
      }),
      providesTags: ["Staffs"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "v1/administration/create-admin/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Staffs"],
    }),

    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `v1/administration/admin-update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Staffs"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `v1/administration/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staffs"],
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
