/* eslint-disable @typescript-eslint/no-explicit-any */
import baseAPI from "@/redux/api/baseAPI";

const sprialManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllSprials: builder.query({
      query: () => ({
        url: "v1/spiral-journey/spirals/",
        method: "GET",
      }),
    }),

    getSprial: builder.query({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "GET",
      }),
    }),

    createSpiral: builder.mutation({
      query: (data) => ({
        url: "v1/spiral-journey/spirals/",
        method: "POST",
        body: data,
      }),
    }),

    updateSprial: builder.mutation({
      query: ({ id, data }) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "PUT",
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
        body: data,
      }),
    }),

    deleteSprial: builder.mutation({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "DELETE",
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
