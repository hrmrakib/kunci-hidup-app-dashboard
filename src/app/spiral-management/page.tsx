"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useGetAllSprialsQuery } from "@/redux/features/sprial-management/sprialManagementAPI";

export interface Day {
  id: number;
  day_number: number;
  journal_prompt: string;
  voice_title: string;
  voice_drop: string | null;
  is_active: boolean;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Journal {
  id: number;
  title: string;
  description: string;
  focus_point: string;
  duration: number;
  days: Day[];
  created_at: string;
  updated_at: string;
}

export default function JournalPromptsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const { data: spirals } = useGetAllSprialsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log(spirals?.results);

  const handleDelete = (id: string) => {
    // if (isDeleteConfirm) {
    //   setSpirals(spirals.filter((spiral) => spiral.id !== id));
    // }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='w-full'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <Link href='/spiral-management/create'>
              <Button className='bg-[#006699] hover:bg-[#006699] text-white cursor-pointer'>
                <Plus className='w-4 h-4 mr-2' />
                Add new Spiral
              </Button>
            </Link>
          </div>
          <div className='relative w-full sm:w-auto'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 w-full sm:w-80'
            />
          </div>
        </div>

        {/* Title */}
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
          Journal Prompt Manager
        </h1>

        {/* Spirals Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {spirals?.results?.map((spiral: Journal) => (
            <Card
              key={spiral?.id}
              className='bg-[#FFF7EB] border-2 border-orange-200 hover:border-orange-300 transition-colors'
            >
              <CardHeader>
                <CardTitle className='text-xl text-[#FEAA39] text-center'>
                  {spiral?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-[#404040] text-center leading-relaxed'>
                  {spiral?.description}
                </p>

                <div className='flex items-center justify-center gap-2'>
                  <Badge
                    variant='secondary'
                    className='bg-orange-100 text-orange-800'
                  >
                    📅 Duration: {spiral?.duration}
                  </Badge>
                </div>

                <div className='text-center'>
                  <p className='text-sm font-medium text-orange-600 mb-2'>
                    Focus:{" "}
                    <span className='text-orange-500'>
                      {spiral?.focus_point}
                    </span>
                  </p>
                </div>

                <div className='flex gap-3 pt-4'>
                  <Link
                    href={`/spiral-management/edit/${spiral.id}`}
                    className='flex-1'
                  >
                    <Button
                      variant='outline'
                      className='w-full border !border-[#222222] hover:bg-gray-50 bg-transparent'
                    >
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    className='flex-1 !border-red-300 text-red-600 hover:bg-red-50 bg-transparent cursor-pointer'
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {spirals?.results?.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No spirals found matching your search.
            </p>
          </div>
        )}

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className='sm:max-w-sm'>
            <DialogHeader>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDeleteModalOpen(false)}
                className='absolute right-4 top-4 text-white rounded-full w-8 h-8 p-0'
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogHeader>

            <div className='text-center py-6'>
              <h3 className='text-2xl font-semibold text-gray-900 mb-6'>
                Are You Sure?
              </h3>

              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsDeleteModalOpen(false)}
                  className='flex-1 bg-[#FEAA39] hover:bg-[#FEAA39] text-[#FEAA39] border !border-[#FEAA39] hover:!border-[#000000] cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete("5465")}
                  className='flex-1 bg-[#FF0000] hover:bg-red-600 cursor-pointer text-white flex items-center justify-center gap-2'
                >
                  <Trash2 className='w-4 h-4' />
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
