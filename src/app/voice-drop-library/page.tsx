/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Info,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useChangeStatusMutation,
  useDeleteVoiceLibraryMutation,
  useGetVoiceLibraryQuery,
} from "@/redux/features/voice-library/voiceLibraryAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Voice {
  audio_id: string;
  title: string;
  duration: string;
  category: string;
  emotion: string;
  useCase: string;
  status: "active" | "inactive";
  audioFile?: string;
}

export default function VoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const itemsPerPage = 10;

  // ✅ Always call hooks in the same order
  const { data, isLoading, isError, refetch } = useGetVoiceLibraryQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [changeStatus, { isLoading: isChangeStatusLoading }] =
    useChangeStatusMutation();
  const [deleteVoiceLibrary, { isLoading: isDeleteLoading }] =
    useDeleteVoiceLibraryMutation();

  // ✅ Always run memo, even if loading
  const voices: Voice[] = useMemo(() => {
    if (!data) return [];
    return data.map((item: any) => ({
      audio_id: item.audio_id?.toString() || "",
      title: item.title || "Untitled",
      duration: item.duration || "—",
      category: item.category || "—",
      emotion: item.emotion || "—",
      useCase: item.use_case || "—",
      status: item.status,
      audioFile: item.audioFile || "",
    }));
  }, [data]);

  const filteredVoices = useMemo(
    () =>
      voices.filter((voice) =>
        [voice.title, voice.category, voice.emotion, voice.useCase]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    [voices, searchTerm],
  );

  const totalPages = Math.ceil(filteredVoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVoices = filteredVoices.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleActionClick = (voice: Voice) => {
    setSelectedVoice(voice);
    setIsActionModalOpen(true);
  };

  const handleDeleteVoice = async (voiceId: string) => {
    try {
      const res = await deleteVoiceLibrary(voiceId).unwrap();

      if (res?.success) {
        refetch();
        toast.success("Voice deleted successfully!");
        setIsActionModalOpen(false);
        setSelectedVoice(null);
      }
    } catch (error) {
      toast.error("Voice deleting fail!");
    }
  };

  const handleActivationToggle = async (voiceId: string, isActive: boolean) => {
    try {
      const res = await changeStatus(voiceId).unwrap();

      if (res?.success) {
        refetch();
        toast.success("Status updated successfully!");
        setSelectedVoice((prev) =>
          prev ? { ...prev, status: isActive ? "active" : "inactive" } : null,
        );
        setIsActionModalOpen(false);
      }
    } catch (error) {
      toast.error("Voice deleting fail!");
    }
  };

  const renderPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages.map((page, idx) => (
      <Button
        key={idx}
        variant={page === currentPage ? "default" : "outline"}
        size='sm'
        className={`w-9 h-9 p-0 rounded-lg font-medium transition-all duration-200 ${
          page === currentPage
            ? "bg-gradient-to-r from-[#FEAA39] to-[#e09530] hover:from-[#e09530] hover:to-[#d18e29] text-white shadow-md shadow-[#FEAA39]/20 border-0"
            : "border-gray-200 text-gray-600 hover:border-[#FEAA39]/30 hover:text-[#FEAA39] hover:bg-[#FFF7EB]"
        }`}
        onClick={() => typeof page === "number" && setCurrentPage(page)}
        disabled={typeof page !== "number"}
      >
        {page}
      </Button>
    ));
  };

  // ✅ Always return the same JSX tree structure — no early return
  return (
    <div className='p-4 md:p-6'>
      {/* {isLoading && <Loading />} */}
      {!isLoading && isError && (
        <div className='text-center py-16'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-4'>
            <Volume2 className='h-8 w-8 text-red-400' />
          </div>
          <p className='text-base font-medium text-red-600 mb-1'>Failed to load voices</p>
          <p className='text-sm text-gray-400'>Please try again later</p>
        </div>
      )}
      {!isError && (
        <>
          {/* Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-lg shadow-[#FEAA39]/20'>
                <Volume2 className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Voice List</h1>
                <p className='text-sm text-gray-500'>Manage your voice drop library</p>
              </div>
            </div>
            <div className='flex items-center gap-3 w-full sm:w-auto'>
              <div className='relative flex-1 sm:flex-initial'>
                <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  placeholder='Search voices...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='pl-10 w-full sm:w-72 h-11 bg-white border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200'
                />
              </div>
              <Link href='/voice-drop-library/add'>
                <Button className='bg-gradient-to-r from-[#FEAA39] to-[#e09530] hover:from-[#e09530] hover:to-[#d18e29] text-white font-medium rounded-xl shadow-md shadow-[#FEAA39]/20 h-11 px-5 transition-all duration-200'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add new Voice
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Table */}
          <div className='hidden md:block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#FEAA39] to-[#e09530]'>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Title</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Duration</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Category</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Emotion</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Use Case</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Status</th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-white'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className='animate-pulse'>
                        <td className='px-6 py-4'><Skeleton className='h-5 w-28 rounded-md' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-5 w-16 rounded-md' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-5 w-20 rounded-md' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-5 w-20 rounded-md' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-5 w-24 rounded-md' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-6 w-16 rounded-full' /></td>
                        <td className='px-6 py-4'><Skeleton className='h-8 w-8 rounded-lg mx-auto' /></td>
                      </tr>
                    ))
                  : null}
                {paginatedVoices.map((voice) => (
                  <tr
                    key={voice?.audio_id}
                    className='group hover:bg-[#FFF7EB]/60 transition-colors duration-200'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEAA39]/10 shrink-0'>
                          <Volume2 className='h-3.5 w-3.5 text-[#FEAA39]' />
                        </div>
                        <span className='text-sm font-semibold text-gray-800'>{voice.title}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600'>{voice.duration}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'>
                        {voice.category}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600'>{voice.emotion}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600'>{voice.useCase}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          voice.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                            : "bg-red-50 text-red-700 border-red-200/60"
                        }`}
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                          voice.status === "active" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                        {voice.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleActionClick(voice)}
                        className='h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-[#FEAA39] hover:bg-[#FEAA39]/10 transition-all duration-200'
                      >
                        <Info className='w-4 h-4' />
                      </Button>
                      {/* <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteVoice(voice.id)}
                        className='p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button> */}
                    </td>
                  </tr>
                ))}
                {!isLoading && paginatedVoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className='px-6 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                          <Volume2 className='h-7 w-7 text-gray-400' />
                        </div>
                        <p className='text-sm font-medium text-gray-500'>No voices found</p>
                        <p className='text-xs text-gray-400'>Try adjusting your search or add a new voice</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className='md:hidden space-y-3'>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Skeleton className='h-9 w-9 rounded-lg' />
                      <div className='flex-1 space-y-2'>
                        <Skeleton className='h-4 w-32 rounded-md' />
                        <Skeleton className='h-3 w-20 rounded-md' />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Skeleton className='h-3 w-full rounded-md' />
                      <Skeleton className='h-3 w-2/3 rounded-md' />
                    </div>
                  </div>
                ))
              : null}
            {paginatedVoices.map((voice) => (
              <div
                key={voice?.audio_id}
                className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2.5'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEAA39]/10'>
                      <Volume2 className='h-4 w-4 text-[#FEAA39]' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 text-sm'>{voice.title}</h3>
                      <span className='text-xs text-gray-400'>{voice.duration}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold border ${
                        voice.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          : "bg-red-50 text-red-700 border-red-200/60"
                      }`}
                    >
                      {voice.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleActionClick(voice)}
                      className='h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-[#FEAA39] hover:bg-[#FEAA39]/10'
                    >
                      <Info className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
                <div className='flex items-center gap-2 flex-wrap pl-[46px]'>
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>{voice.category}</span>
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>{voice.emotion}</span>
                  <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>{voice.useCase}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='h-9 w-9 p-0 rounded-lg border-gray-200 text-gray-500 hover:text-[#FEAA39] hover:border-[#FEAA39]/30 disabled:opacity-30 transition-all duration-200'
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>

              {renderPaginationNumbers()}

              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className='h-9 w-9 p-0 rounded-lg border-gray-200 text-gray-500 hover:text-[#FEAA39] hover:border-[#FEAA39]/30 disabled:opacity-30 transition-all duration-200'
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          )}

          {/* Action Modal */}
          <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
            <DialogContent className='sm:max-w-md rounded-2xl'>
              <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-md shadow-[#FEAA39]/20'>
                    <Volume2 className='h-5 w-5 text-white' />
                  </div>
                  <DialogTitle className='text-lg font-bold text-gray-900'>
                    Voice Details
                  </DialogTitle>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsActionModalOpen(false)}
                  className='h-8 w-8 p-0 rounded-lg hover:bg-gray-100'
                >
                  <X className='w-4 h-4' />
                </Button>
              </DialogHeader>

              {selectedVoice && (
                <div className='space-y-3 pt-2'>
                  {/* Info Fields */}
                  <div className='space-y-2.5'>
                    <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                      <span className='text-sm font-medium text-gray-500'>Title</span>
                      <span className='text-sm font-semibold text-gray-800'>{selectedVoice.title}</span>
                    </div>
                    <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                      <span className='text-sm font-medium text-gray-500'>Duration</span>
                      <span className='text-sm font-semibold text-gray-800'>{selectedVoice.duration}</span>
                    </div>
                    <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                      <span className='text-sm font-medium text-gray-500'>Emotion</span>
                      <span className='text-sm font-semibold text-gray-800'>{selectedVoice.emotion}</span>
                    </div>
                  </div>

                  {/* Activation Toggle */}
                  <div className='flex items-center justify-between rounded-xl bg-gradient-to-r from-[#FFF7EB] to-[#FEF3E2] px-4 py-3 border border-[#FEAA39]/10'>
                    <div>
                      <span className='text-sm font-semibold text-gray-800'>Activation</span>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        {selectedVoice.status === "active" ? "Voice is currently active" : "Voice is currently inactive"}
                      </p>
                    </div>
                    <Switch
                      checked={selectedVoice.status === "active"}
                      disabled={isChangeStatusLoading}
                      onCheckedChange={(checked) =>
                        handleActivationToggle(selectedVoice.audio_id, checked)
                      }
                    />
                  </div>

                  {/* Delete Action */}
                  <div className='flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3'>
                    <div>
                      <span className='text-sm font-semibold text-red-700'>Delete Voice</span>
                      <p className='text-xs text-red-400 mt-0.5'>This action cannot be undone</p>
                    </div>
                    <Button
                      variant='default'
                      size='sm'
                      disabled={isDeleteLoading}
                      onClick={() => handleDeleteVoice(selectedVoice.audio_id)}
                      className='bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-all duration-200 text-sm font-medium cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4 mr-1.5' />
                      {isDeleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
