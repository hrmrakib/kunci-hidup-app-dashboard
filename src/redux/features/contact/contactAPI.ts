import baseAPI from "@/redux/api/baseAPI";

const contactAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    sendContact: builder.mutation({
      query: (data) => ({
        url: "api/dicipline/contact-form/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendContactMutation } = contactAPI;
export default contactAPI;
