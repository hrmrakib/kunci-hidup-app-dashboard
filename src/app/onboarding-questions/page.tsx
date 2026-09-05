"use client";

import { useState } from "react";
import { MessageCircleQuestion, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetOnboardingQuestionsQuery,
  useCreateOnboardingQuestionMutation,
  useUpdateOnboardingQuestionMutation,
  useDeleteOnboardingQuestionMutation,
  OnboardingQuestion,
} from "@/redux/features/onboarding-questions/onboardingQuestionsApi";

export default function OnboardingQuestionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [selectedQuestion, setSelectedQuestion] = useState<OnboardingQuestion | null>(null);
  const [questionText, setQuestionText] = useState("");

  const { data: questions, isLoading } = useGetOnboardingQuestionsQuery();
  const [createQuestion, { isLoading: isCreating }] = useCreateOnboardingQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateOnboardingQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteOnboardingQuestionMutation();

  const rawQuestions = (questions as any)?.results || (questions as any)?.data || questions;
  const questionsArray = Array.isArray(rawQuestions) ? rawQuestions : [];

  const filteredQuestions = questionsArray.filter((q: OnboardingQuestion) =>
    q?.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setQuestionText("");
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (question: OnboardingQuestion) => {
    setSelectedQuestion(question);
    setQuestionText(question.text);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (question: OnboardingQuestion) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleCreate = async () => {
    if (!questionText.trim()) return toast.error("Question text is required");
    try {
      await createQuestion({ text: questionText }).unwrap();
      toast.success("Question created successfully");
      setIsCreateModalOpen(false);
      setQuestionText("");
    } catch (error) {
      toast.error("Failed to create question");
    }
  };

  const handleUpdate = async () => {
    if (!questionText.trim()) return toast.error("Question text is required");
    if (!selectedQuestion) return;
    try {
      await updateQuestion({ id: selectedQuestion.id, data: { text: questionText } }).unwrap();
      toast.success("Question updated successfully");
      setIsEditModalOpen(false);
      setSelectedQuestion(null);
      setQuestionText("");
    } catch (error) {
      toast.error("Failed to update question");
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;
    try {
      await deleteQuestion(selectedQuestion.id).unwrap();
      toast.success("Question deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className='min-h-screen bg-transparent'>
      <div className='w-full'>
        {/* Header Section */}
        <div className='mb-8 mt-2.5'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-lg shadow-[#FEAA39]/20'>
                <MessageCircleQuestion className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Onboarding Questions</h1>
                <p className='text-sm text-gray-500'>Manage questions asked during user onboarding</p>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
              <div className='relative w-full sm:w-80'>
                <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Search questions...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 h-11 bg-white border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200'
                />
              </div>
              <Button
                onClick={handleOpenCreateModal}
                className='h-11 px-6 rounded-xl bg-[#FEAA39] hover:bg-[#e09530] text-white font-semibold shadow-sm transition-all duration-200 gap-2'
              >
                <Plus className='h-5 w-5' />
                Add Question
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className='overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#FEAA39] to-[#e09530]'>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white w-20'>ID</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Question Text</th>
                  <th className='px-6 py-4 text-right text-sm font-semibold text-white w-32'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className='animate-pulse'>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-8 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-full max-w-md rounded-md' /></td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex justify-end gap-2'>
                          <Skeleton className='h-8 w-8 rounded-lg' />
                          <Skeleton className='h-8 w-8 rounded-lg' />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : null}
                {filteredQuestions?.map((question) => (
                  <tr
                    key={question.id}
                    className='group hover:bg-[#FFF7EB]/60 transition-colors duration-200'
                  >
                    <td className='px-6 py-4'>
                      <span className='inline-flex h-7 min-w-[28px] px-2 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 group-hover:bg-[#FEAA39]/10 group-hover:text-[#FEAA39] transition-colors'>
                        {question.id}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm font-medium text-gray-800'>{question.text}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors duration-200'
                          onClick={() => handleOpenEditModal(question)}
                        >
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors duration-200'
                          onClick={() => handleOpenDeleteModal(question)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredQuestions?.length === 0 && (
                  <tr>
                    <td colSpan={3} className='px-6 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                          <MessageCircleQuestion className='h-7 w-7 text-gray-400' />
                        </div>
                        <p className='text-sm font-medium text-gray-500'>No questions found</p>
                        <p className='text-xs text-gray-400'>Click "Add Question" to create one</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold text-gray-900'>Add New Question</DialogTitle>
            </DialogHeader>
            <div className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label htmlFor='question-text' className='text-sm font-medium text-gray-700'>Question Text</Label>
                <Input
                  id='question-text'
                  placeholder='e.g., How did you hear about us?'
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className='rounded-xl focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                />
              </div>
            </div>
            <DialogFooter className='pt-4 sm:justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsCreateModalOpen(false)}
                className='rounded-xl'
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !questionText.trim()}
                className='rounded-xl bg-[#FEAA39] hover:bg-[#e09530] text-white'
              >
                {isCreating ? "Adding..." : "Add Question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold text-gray-900'>Edit Question</DialogTitle>
            </DialogHeader>
            <div className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-question-text' className='text-sm font-medium text-gray-700'>Question Text</Label>
                <Input
                  id='edit-question-text'
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className='rounded-xl focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                />
              </div>
            </div>
            <DialogFooter className='pt-4 sm:justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
                className='rounded-xl'
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating || !questionText.trim()}
                className='rounded-xl bg-[#FEAA39] hover:bg-[#e09530] text-white'
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold text-red-600 flex items-center gap-2'>
                <Trash2 className="h-5 w-5" />
                Delete Question
              </DialogTitle>
            </DialogHeader>
            <div className='pt-4 pb-2'>
              <p className='text-sm text-gray-600'>
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
              {selectedQuestion && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">"{selectedQuestion.text}"</p>
                </div>
              )}
            </div>
            <DialogFooter className='sm:justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsDeleteModalOpen(false)}
                className='rounded-xl'
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className='rounded-xl bg-red-600 hover:bg-red-700 text-white'
              >
                {isDeleting ? "Deleting..." : "Delete Question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
