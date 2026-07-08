import baseAPI from "@/redux/api/baseAPI";

const subscriptionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query({
      query: () => ({
        url: "api/subscription/plans/",
        method: "GET",
      }),
    }),

    createSubscription: builder.mutation({
      query: (data) => ({
        url: "api/subscription/user-subscribe/",
        method: "POST",
        body: data,
      }),
    }),

    cancelSubscription: builder.mutation({
      query: () => ({
        url: "api/subscription/cancel-subscription/",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionAPI;
export default subscriptionAPI;
