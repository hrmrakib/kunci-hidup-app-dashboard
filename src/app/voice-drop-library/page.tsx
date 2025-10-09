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
    }
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
          .includes(searchTerm.toLowerCase())
      ),
    [voices, searchTerm]
  );

  const totalPages = Math.ceil(filteredVoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVoices = filteredVoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleActionClick = (voice: Voice) => {
    setSelectedVoice(voice);
    setIsActionModalOpen(true);
  };

  const handleDeleteVoice = async (voiceId: string) => {
    const res = await deleteVoiceLibrary(voiceId).unwrap();

    if (res?.success) {
      refetch();
      toast.success("Voice deleted successfully!");
      setIsActionModalOpen(false);
      setSelectedVoice(null);
    }
  };

  const handleActivationToggle = async (voiceId: string, isActive: boolean) => {
    const res = await changeStatus(voiceId).unwrap();
    console.log(res);

    if (res?.success) {
      refetch();
      toast.success("Status updated successfully!");
      setSelectedVoice((prev) =>
        prev ? { ...prev, status: isActive ? "active" : "inactive" } : null
      );
      setIsActionModalOpen(false);
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
        totalPages
      );
    }

    return pages.map((page, idx) => (
      <Button
        key={idx}
        variant={page === currentPage ? "default" : "outline"}
        size='sm'
        className={`w-8 h-8 p-0 ${
          page === currentPage
            ? "bg-orange-500 hover:bg-orange-600 text-white"
            : "hover:bg-gray-100"
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
        <div className='text-center text-red-600 py-6'>
          Failed to load voices 😢
        </div>
      )}
      {!isError && (
        <>
          {/* Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
            <div className='flex items-center gap-4'>
              <Link href='/voice-drop-library/add'>
                <Button className='bg-[#FEAA39] text-white'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add new Voice
                </Button>
              </Link>
            </div>
            <div className='relative w-full sm:w-auto'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className='pl-10 w-full sm:w-64'
              />
            </div>
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-6'>
            Voice List
          </h1>

          {/* Table */}
          <div className='hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden'>
            <div className='bg-[#FEAA39] text-white'>
              <div className='grid grid-cols-7 gap-4 p-4 font-medium'>
                <div>Title</div>
                <div>Duration</div>
                <div>Category</div>
                <div>Emotion</div>
                <div>Use Case</div>
                <div>Status</div>
                <div>Action</div>
              </div>
            </div>
            <div className='divide-y divide-gray-200'>
              {isLoading ? (
                <div className='text-center py-4 space-y-6'>
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                  <Skeleton className='h-10 w-full bg-gray-200' />
                </div>
              ) : null}
              {paginatedVoices.map((voice) => (
                <div
                  key={voice?.audio_id}
                  className='grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50'
                >
                  <div className='font-medium text-gray-900'>{voice.title}</div>
                  <div className='text-gray-600'>{voice.duration}</div>
                  <div className='text-gray-600'>{voice.category}</div>
                  <div className='text-gray-600'>{voice.emotion}</div>
                  <div className='text-gray-600'>{voice.useCase}</div>
                  <div>
                    <Badge
                      className={
                        voice.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {voice.status}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleActionClick(voice)}
                      className='p-1 h-8 w-8'
                    >
                      <Info className='w-4 h-4 text-gray-700' />
                    </Button>
                    {/* <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDeleteVoice(voice.id)}
                      className='p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center gap-2 mt-8'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='p-2'
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
                className='p-2'
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          )}

          {/* Action Modal */}
          <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle className='text-xl text-gray-900 font-semibold text-center'>
                  Action
                </DialogTitle>
              </DialogHeader>

              {selectedVoice && (
                <div className='space-y-6 py-4'>
                  <div className='space-y-6'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-medium text-gray-700'>
                        Title:
                      </span>
                      <span className='text-lg text-gray-600'>
                        {selectedVoice.title}
                      </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-medium text-gray-700'>
                        Duration:
                      </span>
                      <span className='text-lg text-gray-600'>
                        {selectedVoice.duration}
                      </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-medium text-gray-700'>
                        Emotion:
                      </span>
                      <span className='text-lg text-gray-600'>
                        {selectedVoice.emotion}
                      </span>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-medium text-gray-700'>
                      Activation
                    </span>
                    <Switch
                      checked={selectedVoice.status === "active"}
                      disabled={isChangeStatusLoading}
                      onCheckedChange={(checked) =>
                        handleActivationToggle(selectedVoice.audio_id, checked)
                      }
                    />
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-medium text-gray-700'>
                      Delete Voice
                    </span>
                    <Button
                      variant='default'
                      size='sm'
                      disabled={isDeleteLoading}
                      onClick={() => handleDeleteVoice(selectedVoice.audio_id)}
                      className='bg-red-700 hover:bg-red-800 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
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
