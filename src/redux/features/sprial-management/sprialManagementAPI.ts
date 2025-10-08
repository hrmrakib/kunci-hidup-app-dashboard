/* eslint-disable @typescript-eslint/no-explicit-any */
import baseAPI from "@/redux/api/baseAPI";

const sprialManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllSprials: builder.query({
      query: () => ({
        url: "v1/spiral-journey/spirals/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),

    getSprial: builder.query({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),

    createSpiral: builder.mutation({
      query: (data) => ({
        url: "v1/spiral-journey/spirals/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }),
    }),

    updateSprial: builder.mutation({
      query: ({ id, data }) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }),
    }),

    updateSpiralDay: builder.mutation<
      any,
      { id: string | number; day: number | string; data: any }
    >({
      query: ({ id, day, data }) => ({
        url: `v1/spiral-journey/admin/spirals/${id}/days/${day}/`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }),
    }),

    deleteSprial: builder.mutation({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllSprialsQuery,
  useGetSprialQuery,
  useCreateSpiralMutation,
  useUpdateSprialMutation,
  useUpdateSpiralDayMutation,
  useDeleteSprialMutation,
} = sprialManagementAPI;
export default sprialManagementAPI;
