import baseAPI from "@/redux/api/baseAPI";
import { get } from "http";

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
  }),
});

export const { useGetAllSprialsQuery, useGetSprialQuery } = sprialManagementAPI;
export default sprialManagementAPI;
