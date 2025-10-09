import baseAPI from "@/redux/api/baseAPI";

const voiceLibraryApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVoiceLibrary: builder.query({
      query: () => ({
        url: "ai/audios",
        method: "GET",
      }),
    }),

    createVoiceLibrary: builder.mutation({
      query: (data) => ({
        url: "ai/upload-audio",
        method: "POST",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        // },
        body: data,
      }),
    }),

    changeStatus: builder.mutation({
      query: (id) => ({
        url: `ai/change-audio-status?audio_id=${id}`,
        method: "PUT",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        // },
        // body: data,
      }),
    }),

    deleteVoiceLibrary: builder.mutation({
      query: (id) => ({
        url: `ai/delete-audio?audio_id=${id}`,
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        // },
        // body: data,
      }),
    }),
  }),
});

export const {
  useGetVoiceLibraryQuery,
  useCreateVoiceLibraryMutation,
  useChangeStatusMutation,
  useDeleteVoiceLibraryMutation,
} = voiceLibraryApi;
export default voiceLibraryApi;
