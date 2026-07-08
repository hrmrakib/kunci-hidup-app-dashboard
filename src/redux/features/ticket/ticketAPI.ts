import baseAPI from "@/redux/api/baseAPI";

const ticketAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: "api/tickets/",
        method: "POST",
        body: data,
      }),
    }),

    ticketCheckout: builder.mutation({
      query: (data) => ({
        url: "api/ticket/purchase-tickets/",
        method: "POST",
        body: data,
      }),
    }),

    getTickets: builder.query({
      query: () => ({
        url: "api/ticket/available-ticket/",
        method: "GET",
      }),
    }),

    userPurchasedTickets: builder.query({
      query: () => ({
        url: "api/subscription/my-subscription-tickets/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useTicketCheckoutMutation,
  useGetTicketsQuery,
  useUserPurchasedTicketsQuery,
} = ticketAPI;
export default ticketAPI;
