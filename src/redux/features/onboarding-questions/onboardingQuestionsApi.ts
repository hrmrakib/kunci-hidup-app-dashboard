import { baseAPI } from "@/redux/api/baseAPI";

export interface OnboardingQuestion {
  id: number;
  text: string;
}

export const onboardingQuestionsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingQuestions: builder.query<OnboardingQuestion[], void>({
      query: () => "/v1/onboarding/questions/",
      providesTags: ["OnboardingQuestions"],
    }),
    getOnboardingQuestion: builder.query<OnboardingQuestion, number>({
      query: (id) => `/v1/onboarding/questions/${id}/`,
      providesTags: (result, error, id) => [{ type: "OnboardingQuestions", id }],
    }),
    createOnboardingQuestion: builder.mutation<OnboardingQuestion, { text: string }>({
      query: (data) => ({
        url: "/v1/onboarding/questions/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OnboardingQuestions"],
    }),
    updateOnboardingQuestion: builder.mutation<
      OnboardingQuestion,
      { id: number; data: { text: string } }
    >({
      query: ({ id, data }) => ({
        url: `/v1/onboarding/questions/${id}/`,
        method: "PUT", // API supports both PUT and PATCH, using PUT here
        body: data,
      }),
      invalidatesTags: ["OnboardingQuestions"],
    }),
    deleteOnboardingQuestion: builder.mutation<void, number>({
      query: (id) => ({
        url: `/v1/onboarding/questions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OnboardingQuestions"],
    }),
  }),
});

export const {
  useGetOnboardingQuestionsQuery,
  useGetOnboardingQuestionQuery,
  useCreateOnboardingQuestionMutation,
  useUpdateOnboardingQuestionMutation,
  useDeleteOnboardingQuestionMutation,
} = onboardingQuestionsApi;
