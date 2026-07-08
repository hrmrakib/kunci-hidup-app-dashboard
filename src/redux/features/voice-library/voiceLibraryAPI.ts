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
        body: data,
      }),
    }),

    changeStatus: builder.mutation({
      query: (id) => ({
        url: `ai/change-audio-status?audio_id=${id}`,
        method: "PUT",
      }),
    }),

    deleteVoiceLibrary: builder.mutation({
      query: (id) => ({
        url: `ai/delete-audio?audio_id=${id}`,
        method: "DELETE",
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
