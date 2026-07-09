/* eslint-disable @typescript-eslint/no-explicit-any */
import baseAPI from "@/redux/api/baseAPI";

const sprialManagementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllSprials: builder.query({
      query: () => ({
        url: "v1/spiral-journey/spirals/",
        method: "GET",
      }),
      providesTags: ["Spirals"],
    }),

    getSprial: builder.query({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "GET",
      }),
      providesTags: ["Spirals"],
    }),

    createSpiral: builder.mutation({
      query: (data) => ({
        url: "v1/spiral-journey/spirals/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Spirals"],
    }),

    updateSprial: builder.mutation({
      query: ({ id, data }) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Spirals"],
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
      invalidatesTags: ["Spirals"],
    }),

    deleteSprial: builder.mutation({
      query: (id) => ({
        url: `v1/spiral-journey/spirals/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Spirals"],
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
