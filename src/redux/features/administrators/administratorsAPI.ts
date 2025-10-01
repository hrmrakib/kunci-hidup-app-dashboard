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

    getStaffProfile: builder.query({
      query: () => ({
        url: "v1/account/profile/update/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
    }),
  }),
});

export const { useGetAllStaffsQuery, useGetStaffProfileQuery } =
  AdministratorsAPI;
export default AdministratorsAPI;
