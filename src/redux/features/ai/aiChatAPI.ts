import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseAPI = process.env.NEXT_PUBLIC_AI_URL;

export const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Session"],
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAiChatBySession: builder.query({
      query: (id) => ({
        url: `/ai/all_chat/?session_id=${id}`,
        method: "GET",
      }),
    }),

    getAiChatSession: builder.query({
      query: (email) => ({
        url: `/ai/all_sessions/?email=${email}`,
        method: "GET",
      }),
    }),

    createSession: builder.mutation({
      query: (data) => ({
        url: "/ai/chat_session/",
        method: "POST",
        body: data,
      }),
    }),

    deleteSession: builder.mutation({
      query: (body) => ({
        url: `/ai/delete_session_chats/`,
        method: "DELETE",
        body,
      }),
    }),

    createChat: builder.mutation({
      query: (data) => ({
        url: "/ai/chat/",
        method: "POST",
        body: data,
      }),
    }),

    serachChats: builder.query({
      query: ({ q, email }) => ({
        url: `/ai/search/?q=${q}&email=${email}`,
        method: "GET",
      }),
    }),

    deleteChat: builder.mutation({
      query: (id) => ({
        url: `/ai/chat/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAiChatBySessionQuery,
  useGetAiChatSessionQuery,
  useCreateSessionMutation,
  useCreateChatMutation,
  useDeleteSessionMutation,
  useDeleteChatMutation,
  useSerachChatsQuery,
} = chatApi;
export default chatApi;
