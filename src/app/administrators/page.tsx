/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, X, Plus, Eye, EyeOff, Shield, UserCog, AlertTriangle } from "lucide-react";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAllStaffsQuery,
  useUpdateRoleMutation,
} from "@/redux/features/administrators/administratorsAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import GlobalPagination from "@/components/pagination/GlobalPagination";

interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Super Admin" | string;
  avatar: string;
}

export interface Staff {
  id: number;
  email: string;
  full_name: string;
  username: string;
  password: string;
  role: "staff" | "superadmin";
  is_active: boolean;
  created_at: string;
}

export default function AdministratorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentID, setCurrentID] = useState<string | number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const itemsPerPage = 10;

  const {
    data: staffs,
    isLoading,
    refetch,
  } = useGetAllStaffsQuery(
    {
      page: currentPage,
      page_size: itemsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const totalPages = staffs?.total_pages || 1;

  const [createAdminMutation] = useCreateAdminMutation();
  const [deleteAdminMutation] = useDeleteAdminMutation();
  const [updateRoleMutation] = useUpdateRoleMutation();

  const handleAddAdmin = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "staff",
    });
    setIsAddModalOpen(true);
  };

  const handleEditAdmin = async (admin: Staff) => {
    setFormData({
      name: admin.full_name,
      username: admin.username,
      email: admin.email,
      password: admin.password,
      role: admin.role,
    });
    setCurrentID(admin.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteAdmin = async (admin: string | number) => {
    setCurrentID(admin);
    setIsDeleteModalOpen(true);
  };

  const handleCreateAdmin = async () => {
    if (formData.name && formData.email && formData.password) {
      const newAdmin = {
        email: formData.email,
        full_name: formData.name,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      try {
        // unwrap makes it throw on error instead of giving you res.error
        const res = await createAdminMutation(newAdmin).unwrap();

        if (res.success) {
          toast.success("New role created successfully!");
          setIsAddModalOpen(false);
          refetch();
          setFormData({
            name: "",
            username: "",
            email: "",
            password: "",
            role: "staff",
          });
        }
      } catch (err) {
        const fetchError = err as FetchBaseQueryError & {
          data?: { message?: string };
        };

        console.error(fetchError.data?.message || "Something went wrong");
        toast.error(fetchError.data?.message || "Failed to create role");
      }
    }
  };

  const handleUpdateAdmin = async () => {
    const data = {
      full_name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    const res = await updateRoleMutation({ id: currentID, data });

    if (res?.data?.success) {
      toast.success("Role updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    }
  };

  const confirmDeleteAdmin = async () => {
    const res = await deleteAdminMutation(currentID);
    if (res?.data?.success) {
      toast.success("Role deleted successfully!");
      setIsDeleteModalOpen(false);
      refetch();
    }
    setIsDeleteModalOpen(false);
    setCurrentID(null);
  };

  return (
    <div className='min-h-screen bg-transparent pt-5'>
      <div className='w-full'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#315D62] to-[#27484c] shadow-lg shadow-[#315D62]/20'>
              <Shield className='h-5 w-5 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
                Administrators
              </h1>
              <p className='text-sm text-gray-500'>Manage team roles and permissions</p>
            </div>
          </div>
          <Button
            onClick={handleAddAdmin}
            className='bg-gradient-to-r from-[#FEAA39] to-[#e09530] hover:from-[#e09530] hover:to-[#d18e29] text-white font-medium rounded-xl shadow-md shadow-[#FEAA39]/20 flex items-center gap-2 cursor-pointer transition-all duration-200 px-5 h-11'
          >
            <Plus className='w-4 h-4' />
            Add New Administrator
          </Button>
        </div>

        {/* Desktop Table */}
        <div className='w-full hidden md:block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gradient-to-r from-[#FEAA39] to-[#e09530]'>
                <th className='px-6 py-4 text-center text-sm font-semibold text-white'>
                  Sl no.
                </th>
                <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                  Name
                </th>
                <th className='px-6 py-4 text-left text-sm font-semibold text-white'>
                  Email
                </th>
                <th className='px-6 py-4 text-center text-sm font-semibold text-white'>
                  Access Role
                </th>
                <th className='px-6 py-4 text-center text-sm font-semibold text-white'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className='animate-pulse'>
                      <td className='px-6 py-4'><Skeleton className='h-7 w-7 rounded-lg mx-auto' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-36 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-5 w-44 rounded-md' /></td>
                      <td className='px-6 py-4'><Skeleton className='h-6 w-24 rounded-full mx-auto' /></td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-center gap-2'>
                          <Skeleton className='h-8 w-8 rounded-lg' />
                          <Skeleton className='h-8 w-8 rounded-lg' />
                        </div>
                      </td>
                    </tr>
                  ))
                : null}

              {staffs?.data?.map((admin: Staff, index: number) => (
                <tr
                  key={admin?.id}
                  className='group hover:bg-[#FFF7EB]/60 transition-colors duration-200'
                >
                  <td className='px-6 py-4 text-center'>
                    <span className='inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 group-hover:bg-[#FEAA39]/10 group-hover:text-[#FEAA39] transition-colors'>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#315D62]/10 to-[#27484c]/10 text-[#315D62] text-sm font-bold shrink-0'>
                        {admin?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className='text-sm font-semibold text-gray-800'>
                        {admin?.full_name}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm text-gray-600'>{admin?.email}</span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        admin?.role === "superadmin"
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 ring-1 ring-blue-200/60"
                          : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 ring-1 ring-emerald-200/60"
                      }`}
                    >
                      {admin?.role === "superadmin" ? (
                        <Shield className='w-3 h-3' />
                      ) : (
                        <UserCog className='w-3 h-3' />
                      )}
                      {admin?.role === "superadmin" ? "Super Admin" : "Staff"}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEditAdmin(admin)}
                        className='h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-[#FEAA39] hover:bg-[#FEAA39]/10 transition-all duration-200'
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteAdmin(admin?.id)}
                        className='h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && (!staffs?.data || staffs.data.length === 0) && (
                <tr>
                  <td colSpan={5} className='px-6 py-16 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
                        <Shield className='h-7 w-7 text-gray-400' />
                      </div>
                      <p className='text-sm font-medium text-gray-500'>No administrators found</p>
                      <p className='text-xs text-gray-400'>Add a new administrator to get started</p>
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
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-32 rounded-md' />
                      <Skeleton className='h-3 w-24 rounded-md' />
                    </div>
                  </div>
                  <Skeleton className='h-3 w-full rounded-md' />
                </div>
              ))
            : null}
          {staffs?.data?.map((admin: Staff) => (
            <div
              key={admin.id}
              className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200'
            >
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#315D62]/10 to-[#27484c]/10 text-[#315D62] text-sm font-bold'>
                    {admin?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {admin?.full_name}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                        admin.role === "superadmin"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {admin.role === "superadmin" ? (
                        <Shield className='w-2.5 h-2.5' />
                      ) : (
                        <UserCog className='w-2.5 h-2.5' />
                      )}
                      {admin.role === "superadmin" ? "Super Admin" : "Staff"}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleEditAdmin(admin)}
                    className='h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-[#FEAA39] hover:bg-[#FEAA39]/10'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDeleteAdmin(admin?.id)}
                    className='h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              <div className='space-y-1.5 text-sm pl-[52px]'>
                <div className='flex justify-between'>
                  <span className='text-gray-400 text-xs'>Email</span>
                  <span className='text-gray-700 text-xs'>{admin.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <GlobalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Add Administrator Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-md shadow-[#FEAA39]/20'>
                  <Plus className='h-5 w-5 text-white' />
                </div>
                <DialogTitle className='text-lg font-bold text-gray-900'>
                  Add New Administrator
                </DialogTitle>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsAddModalOpen(false)}
                className='h-8 w-8 p-0 rounded-lg hover:bg-gray-100'
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogHeader>

            <div className='space-y-4 pt-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='add-name' className='text-sm font-medium text-gray-700'>
                  Full Name
                </Label>
                <Input
                  id='add-name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                  placeholder='Enter full name'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='user-name' className='text-sm font-medium text-gray-700'>
                  Username
                </Label>
                <Input
                  id='user-name'
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                  placeholder='Enter username'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='add-email' className='text-sm font-medium text-gray-700'>
                  Email Address
                </Label>
                <Input
                  id='add-email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                  placeholder='Enter email address'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='add-phone' className='text-sm font-medium text-gray-700'>
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='add-phone'
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 placeholder:text-gray-400 pr-10 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                    placeholder='Enter password'
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='add-role' className='text-sm font-medium text-gray-700'>
                  Role
                </Label>
                <Select
                  defaultValue='staff'
                  onValueChange={(value: "staff" | "superadmin") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='staff' className='text-gray-800'>
                      Staff
                    </SelectItem>
                    <SelectItem value='superadmin' className='text-gray-800'>
                      Super Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={() => setIsAddModalOpen(false)}
                className='flex-1 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-all duration-200'
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAdmin}
                className='flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FEAA39] to-[#e09530] hover:from-[#e09530] hover:to-[#d18e29] text-white font-medium cursor-pointer shadow-md shadow-[#FEAA39]/20 transition-all duration-200'
              >
                Create Administrator
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Administrator Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className='sm:max-w-md rounded-2xl'>
            <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#315D62] to-[#27484c] shadow-md'>
                  <Edit className='h-5 w-5 text-white' />
                </div>
                <DialogTitle className='text-lg font-bold text-gray-900'>
                  Edit Administrator
                </DialogTitle>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditModalOpen(false)}
                className='h-8 w-8 p-0 rounded-lg hover:bg-gray-100'
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogHeader>

            <div className='space-y-4 pt-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='edit-name' className='text-sm font-medium text-gray-700'>
                  Full Name
                </Label>
                <Input
                  id='edit-name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='edit-email' className='text-sm font-medium text-gray-700'>
                  Email Address
                </Label>
                <Input
                  id='edit-email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20'
                  placeholder='Enter email'
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='edit-role' className='text-sm font-medium text-gray-700'>
                  Role
                </Label>
                <Select
                  defaultValue={formData.role}
                  onValueChange={(value: "staff" | "superadmin") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className='bg-gray-50 border-gray-200 rounded-xl h-11 text-gray-800'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='staff' className='text-gray-800'>
                      Staff
                    </SelectItem>
                    <SelectItem value='superadmin' className='text-gray-800'>
                      Super Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
                className='flex-1 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-all duration-200'
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAdmin}
                className='flex-1 h-11 rounded-xl bg-gradient-to-r from-[#315D62] to-[#27484c] hover:from-[#27484c] hover:to-[#1e3d40] text-white font-medium cursor-pointer shadow-md shadow-[#315D62]/20 transition-all duration-200'
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className='sm:max-w-sm rounded-2xl'>
            <DialogHeader className='flex flex-row items-end justify-end space-y-0'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDeleteModalOpen(false)}
                className='h-8 w-8 p-0 rounded-lg hover:bg-gray-100'
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogHeader>

            <div className='text-center pb-2'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-4'>
                <AlertTriangle className='h-8 w-8 text-red-500' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                Delete Administrator?
              </h3>
              <p className='text-sm text-gray-500 mb-6'>
                This action cannot be undone. The administrator will lose all access.
              </p>

              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsDeleteModalOpen(false)}
                  className='flex-1 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-all duration-200'
                >
                  Cancel
                </Button>

                <Button
                  onClick={confirmDeleteAdmin}
                  className='flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 cursor-pointer text-white font-medium flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all duration-200'
                >
                  <Trash2 className='w-4 h-4' />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
