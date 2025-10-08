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
        url: `change-audio-status?audio_id=${id}`,
        method: "PUT",
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
} = voiceLibraryApi;
export default voiceLibraryApi;
