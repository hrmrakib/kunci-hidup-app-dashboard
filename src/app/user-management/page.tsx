"use client";

import { useState, useEffect } from "react";
import { Search, Info, Eye, X, Users, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useGetAllUsersQuery } from "@/redux/features/user/userAPI";
import { Skeleton } from "@/components/ui/skeleton";
import GlobalPagination from "@/components/pagination/GlobalPagination";

export interface Answer {
  question: string;
  answer: "Yes" | "No";
  answered_at: string;
}

export interface UserResponse {
  user_id: number;
  profile_pic_url: string | null;
  full_name: string;
  email: string;
  contanct_no: string | null;
  answers: Answer[];
}

export default function UserListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answersModalOpen, setAnswersModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse>();
  const itemsPerPage = 8;

  // Debounce search term by 700ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 700);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: users, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    paze_size: itemsPerPage,
    search: debouncedSearch,
  });

  const totalPages = users?.total_pages || 1;

  const handleActionClick = (user: UserResponse) => {
    setSelectedUser(user);
    setActionModalOpen(true);
  };

  const handleViewAnswerClick = (answers: Answer[]) => {
    setAnswers(answers);
    setAnswersModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-transparent'>
      <div className='w-full'>
        {/* Header Section */}
        <div className='mb-8 mt-2.5'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-lg shadow-[#FEAA39]/20'>
                <Users className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>User List</h1>
                <p className='text-sm text-gray-500'>Manage and view all registered users</p>
              </div>
            </div>
            <div className='relative w-full sm:w-80'>
              <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                type='text'
                placeholder='Search by name or email...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // ✅ reset to page 1 when searching
                }}
                className='pl-10 h-11 bg-white border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200'
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className='overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100'>
          {/* Desktop Table */}
          <div className='hidden md:block'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#FEAA39] to-[#e09530]'>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Sl no.
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Profile
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Contact Number
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Answer
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className='animate-pulse'>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-8 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-10 w-10 rounded-full' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-32 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-40 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-28 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-8 w-24 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-8 w-8 rounded-full' /></td>
                    </tr>
                  ))
                ) : null}
                {users?.results?.map((user: UserResponse, index: number) => (
                  <tr
                    key={user.user_id}
                    className='group hover:bg-[#FFF7EB]/60 transition-colors duration-200'
                  >
                    <td className='px-6 py-4'>
                      <span className='inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 group-hover:bg-[#FEAA39]/10 group-hover:text-[#FEAA39] transition-colors'>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <Avatar className='h-10 w-10 ring-2 ring-white shadow-sm'>
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user?.profile_pic_url}`}
                          alt={user?.full_name}
                          width={40}
                          height={40}
                        />
                        <AvatarFallback className='bg-gradient-to-br from-[#FEAA39]/20 to-[#d18e29]/20 text-[#d18e29] text-sm font-semibold'>
                          {user?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm font-semibold text-gray-800'>{user?.full_name}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600'>{user?.email}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600'>{user?.contanct_no || '—'}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='gap-1.5 rounded-lg text-[#315D62] hover:text-[#27484c] hover:bg-[#315D62]/10 font-medium text-sm transition-all duration-200'
                        onClick={() => handleViewAnswerClick(user?.answers)}
                      >
                        <Eye className='h-4 w-4' />
                        View Answer
                      </Button>
                    </td>
                    <td className='px-6 py-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-9 w-9 p-0 rounded-lg hover:bg-[#FEAA39]/10 hover:text-[#FEAA39] transition-all duration-200'
                        onClick={() => handleActionClick(user)}
                      >
                        <Info className='h-4 w-4 text-gray-400 group-hover:text-[#FEAA39] transition-colors' />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && (!users?.results || users.results.length === 0) && (
                  <tr>
                    <td colSpan={7} className='px-6 py-16 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                          <UserCheck className='h-7 w-7 text-gray-400' />
                        </div>
                        <p className='text-sm font-medium text-gray-500'>No users found</p>
                        <p className='text-xs text-gray-400'>Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className='md:hidden'>
            <div className='bg-gradient-to-r from-[#FEAA39] to-[#e09530] px-5 py-4'>
              <h2 className='text-sm font-semibold text-white tracking-wide'>User List</h2>
            </div>
            <div className='divide-y divide-gray-100'>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='p-4 animate-pulse'>
                    <div className='flex items-start gap-3'>
                      <Skeleton className='h-12 w-12 rounded-full' />
                      <div className='flex-1 space-y-2'>
                        <Skeleton className='h-4 w-32 rounded-md' />
                        <Skeleton className='h-3 w-48 rounded-md' />
                        <Skeleton className='h-3 w-28 rounded-md' />
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
              {users?.results?.map((user: UserResponse) => (
                <div
                  key={user.user_id}
                  className='p-4 hover:bg-[#FFF7EB]/60 transition-colors duration-200'
                >
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-12 w-12 ring-2 ring-white shadow-sm'>
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_API_URL}${user?.profile_pic_url}`}
                        alt={user?.full_name}
                      />
                      <AvatarFallback className='bg-gradient-to-br from-[#FEAA39]/20 to-[#d18e29]/20 text-[#d18e29] text-sm font-semibold'>
                        {user?.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-semibold text-gray-900'>
                          {user?.full_name}
                        </h3>
                        <span className='inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'>
                          #{user?.user_id}
                        </span>
                      </div>
                      <div className='space-y-1 text-sm text-gray-500'>
                        <p>{user?.email}</p>
                        <p>{user?.contanct_no || '—'}</p>
                      </div>
                      <div className='flex items-center justify-between pt-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='gap-1.5 rounded-lg text-[#315D62] hover:text-[#27484c] hover:bg-[#315D62]/10 font-medium text-sm h-8 px-2'
                          onClick={() => handleViewAnswerClick(user?.answers)}
                        >
                          <Eye className='h-3.5 w-3.5' />
                          View Answer
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 rounded-lg hover:bg-[#FEAA39]/10 hover:text-[#FEAA39]'
                          onClick={() => handleActionClick(user)}
                        >
                          <Info className='h-4 w-4 text-gray-400' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <GlobalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Action Modal */}
        <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-md shadow-[#FEAA39]/20'>
                  <Info className='h-5 w-5 text-white' />
                </div>
                <DialogTitle className='text-lg font-bold text-gray-900'>
                  User Details
                </DialogTitle>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 rounded-lg hover:bg-gray-100'
                onClick={() => setActionModalOpen(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </DialogHeader>
            {selectedUser && (
              <div className='space-y-1 pt-2'>
                {/* User Profile Header */}
                <div className='flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#FFF7EB] to-[#FEF3E2]'>
                  <Avatar className='h-14 w-14 ring-2 ring-white shadow-md'>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedUser?.profile_pic_url}`}
                      alt={selectedUser?.full_name}
                    />
                    <AvatarFallback className='bg-gradient-to-br from-[#FEAA39] to-[#d18e29] text-white text-lg font-bold'>
                      {selectedUser?.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold text-gray-900'>{selectedUser?.full_name}</p>
                    <p className='text-sm text-gray-500'>ID: {selectedUser?.user_id}</p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className='space-y-3 pt-3'>
                  <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                    <Label className='text-sm font-medium text-gray-500'>User ID</Label>
                    <p className='text-sm font-semibold text-gray-800'>{selectedUser?.user_id}</p>
                  </div>
                  <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                    <Label className='text-sm font-medium text-gray-500'>Full Name</Label>
                    <p className='text-sm font-semibold text-gray-800'>{selectedUser?.full_name}</p>
                  </div>
                  <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                    <Label className='text-sm font-medium text-gray-500'>Email Address</Label>
                    <p className='text-sm font-semibold text-gray-800'>{selectedUser?.email}</p>
                  </div>
                  <div className='flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3'>
                    <Label className='text-sm font-medium text-gray-500'>Contact Number</Label>
                    <p className='text-sm font-semibold text-gray-800'>{selectedUser?.contanct_no || '—'}</p>
                  </div>
                </div>

                {/* Delete Action */}
                <div className='flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 mt-4'>
                  <div>
                    <Label className='text-sm font-semibold text-red-700'>Delete Account</Label>
                    <p className='text-xs text-red-400 mt-0.5'>This action cannot be undone</p>
                  </div>
                  <Button className='bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-all duration-200 text-sm font-medium'>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Answers Modal */}
        <Dialog open={answersModalOpen} onOpenChange={setAnswersModalOpen}>
          <DialogContent className='sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#315D62] to-[#27484c] shadow-md'>
                  <Eye className='h-5 w-5 text-white' />
                </div>
                <div>
                  <DialogTitle className='text-lg font-bold text-gray-900'>
                    {answers.length === 0 ? "No Answers" : "All Answers"}
                  </DialogTitle>
                  {answers.length > 0 && (
                    <p className='text-sm text-gray-500'>{answers.length} answer{answers.length !== 1 ? 's' : ''} recorded</p>
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className='space-y-3 pt-2'>
              {answers.length === 0 && (
                <div className='flex flex-col items-center gap-3 py-12'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                    <Eye className='h-7 w-7 text-gray-400' />
                  </div>
                  <p className='text-sm font-medium text-gray-500'>No answers available</p>
                </div>
              )}
              {answers.map((item, index) => (
                <div
                  key={index}
                  className='rounded-xl bg-gradient-to-r from-[#FFF7EB] to-[#FEF3E2] p-4 border border-[#FEAA39]/10 hover:shadow-sm transition-shadow duration-200'
                >
                  <div className='flex items-start gap-3'>
                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#FEAA39]/20 text-xs font-bold text-[#d18e29] mt-0.5 shrink-0'>
                      {index + 1}
                    </span>
                    <div className='space-y-2 flex-1'>
                      <div>
                        <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                          Question
                        </span>
                        <p className='text-sm font-medium text-gray-800 mt-0.5'>
                          {item?.question}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                          Answer:
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item?.answer === 'Yes'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item?.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
