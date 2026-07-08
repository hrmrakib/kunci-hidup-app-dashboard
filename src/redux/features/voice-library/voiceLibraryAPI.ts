import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseAIAPI = process.env.NEXT_PUBLIC_AI_URL;

const voiceLibraryApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Session"],
  baseQuery: fetchBaseQuery({
    baseUrl: baseAIAPI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

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
