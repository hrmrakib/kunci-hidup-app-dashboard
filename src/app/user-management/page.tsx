"use client";

import { useState } from "react";
import { Search, Info, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answersModalOpen, setAnswersModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse>();
  const itemsPerPage = 8; // ✅ show 8 per page

  const { data: users, isLoading } = useGetAllUsersQuery({});

  // ✅ Filter users by search
  const filteredUsers =
    users?.results?.filter((u: UserResponse) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // ✅ Pagination math
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleActionClick = (user: UserResponse) => {
    setSelectedUser(user);
    setActionModalOpen(true);
  };

  const handleViewAnswerClick = (answers: Answer[]) => {
    setAnswers(answers);
    setAnswersModalOpen(true);
  };

  const handleToggleChange = (
    field: "disableAccess" | "deleteAccount",
    value: boolean
  ) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [field]: value });
    }
  };

  // ✅ Generate page numbers with "..." support
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
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
    }
    return pages;
  };

  return (
    <div className='min-h-screen bg-transparent'>
      <div className='w-full'>
        {/* Header */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-2.5'>
          <h1 className='text-2xl font-semibold text-gray-900'>User List</h1>
          <div className='relative w-full sm:w-80 bg-[#E0E0E0] rounded-xl'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // ✅ reset to page 1 when searching
              }}
              className='pl-10 text-black'
            />
          </div>
        </div>

        {/* Table Container */}
        <div className='overflow-hidden rounded-lg bg-white shadow'>
          {/* Desktop Table */}
          <div className='hidden md:block'>
            <table className='w-full'>
              <thead className='bg-table-header-bg'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Sl no.
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Profile
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Name
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Contact Number
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Answer
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-table-header-color'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className='text-center py-4 space-y-6'>
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-10 w-full' />
                    </td>
                  </tr>
                ) : null}
                {paginatedUsers.map((user: UserResponse, index: number) => (
                  <tr key={user.user_id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-base text-table-color font-medium'>
                      {startIndex + index + 1}
                    </td>
                    <td className='px-6 py-4'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user?.profile_pic_url}`}
                          alt={user?.full_name}
                          width={40}
                          height={40}
                        />
                        <AvatarFallback>
                          {user?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className='px-6 py-4 text-base text-table-color font-medium'>
                      {user?.full_name}
                    </td>
                    <td className='px-6 py-4 text-base text-table-color font-medium'>
                      {user?.email}
                    </td>
                    <td className='px-6 py-4 text-base text-table-color font-medium'>
                      {user?.contanct_no}
                    </td>
                    <td className='px-6 py-4'>
                      <Button
                        variant='link'
                        className='p-0 text-blue-600 hover:text-blue-800'
                        onClick={() => handleViewAnswerClick(user?.answers)}
                      >
                        <Eye className='mr-1 h-4 w-4' />
                        View Answer
                      </Button>
                    </td>
                    <td className='px-6 py-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() => handleActionClick(user)}
                      >
                        <Info className='h-4 w-4 text-gray-400' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className='md:hidden'>
            <div className='bg-orange-400 px-4 py-3'>
              <h2 className='text-sm font-medium text-white'>User List</h2>
            </div>
            <div className='divide-y divide-gray-200'>
              {paginatedUsers.map((user: UserResponse) => (
                <div key={user.user_id} className='p-4'>
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_API_URL}${user?.profile_pic_url}`}
                        alt={user?.full_name}
                      />
                      <AvatarFallback>
                        {user?.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-medium text-gray-900'>
                          {user?.full_name}
                        </h3>
                        <span className='text-xs text-gray-500'>
                          {user?.user_id}
                        </span>
                      </div>
                      <div className='space-y-1 text-sm text-gray-600'>
                        <p>{user?.email}</p>
                        <p>{user?.contanct_no}</p>
                      </div>
                      <div className='flex items-center justify-between pt-2'>
                        <Button
                          variant='link'
                          className='p-0 text-blue-600 hover:text-blue-800'
                          onClick={() => handleViewAnswerClick(user?.answers)}
                        >
                          <Eye className='mr-1 h-4 w-4' />
                          View Answer
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
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
        <div className='mt-6 flex items-center justify-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className='h-8 w-8 p-0'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className='px-2 text-gray-500'>...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size='sm'
                  onClick={() => setCurrentPage(page as number)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className='h-8 w-8 p-0'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>

        {/* Results info */}
        <div className='mt-4 text-center text-sm text-gray-600'>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)}{" "}
          of {filteredUsers.length} results
        </div>

        {/* Action Modal */}
        <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
              <DialogTitle className='text-lg font-semibold text-black'>
                Action
              </DialogTitle>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={() => setActionModalOpen(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </DialogHeader>
            {selectedUser && (
              <div className='space-y-4'>
                <div className='flex flex-col gap-5 text-sm'>
                  <div className='flex items-center justify-between border-b pb-5'>
                    <Label className='text-[#333338] text-xl font-medium'>
                      User Id:
                    </Label>
                    <p className='text-[#3e3e41] text-base font-medium'>
                      {selectedUser?.user_id}
                    </p>
                  </div>
                  <div className='flex items-center justify-between border-b pb-5'>
                    <Label className='text-[#333338] text-xl font-medium'>
                      User Name:
                    </Label>
                    <p className='text-[#3e3e41] text-base font-medium'>
                      {selectedUser?.full_name}
                    </p>
                  </div>
                  <div className='flex items-center justify-between border-b pb-5'>
                    <Label className='text-[#333338] text-xl font-medium'>
                      Email Address:
                    </Label>
                    <p className='text-[#3e3e41] text-base font-medium'>
                      {selectedUser?.email}
                    </p>
                  </div>
                  <div className='flex items-center justify-between border-b pb-5'>
                    <Label className='text-[#333338] text-xl font-medium'>
                      Contact Number:
                    </Label>
                    <p className='text-[#3e3e41] text-base font-medium'>
                      {selectedUser?.contanct_no}
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-between pt-4'>
                  <Label className='text-[#333338] text-xl font-medium'>
                    Delete User Account
                  </Label>
                  <Button className='bg-red-500'>Delete</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Answers Modal */}
        <Dialog open={answersModalOpen} onOpenChange={setAnswersModalOpen}>
          <DialogContent className='sm:max-w-2xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
              <DialogTitle className='text-lg font-semibold text-black'>
                {answers.length === 0 ? "No answers" : "All Answers"}
              </DialogTitle>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={() => setAnswersModalOpen(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </DialogHeader>
            <div className='space-y-4'>
              {answers.map((item, index) => (
                <div
                  key={index}
                  className='space-y-2 bg-[#FFF7EB] p-2 rounded-lg'
                >
                  <div>
                    <span className='font-medium text-sm text-black'>
                      Question:{" "}
                    </span>
                    <span className='text-sm text-gray-900'>
                      {item?.question}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium text-sm text-black'>
                      Answer:{" "}
                    </span>
                    <span className='text-sm text-gray-900'>
                      {item?.answer}
                    </span>
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
