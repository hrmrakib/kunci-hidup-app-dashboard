"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

interface JournalPrompt {
  id: string;
  prompt: string;
  emotion: string;
  spiral: string;
  useCase: string;
  status: "Active" | "Inactive";
  category: string;
}

const mockPrompts: JournalPrompt[] = Array.from({ length: 20 }, (_, i) => ({
  id: `prompt-${i + 1}`,
  prompt:
    "Kapan terakhir kali kamu merasa seperti bukan dirimu sendiri? Apa bagian yang ingin kamu peluk kembali hari ini?",
  emotion: "Shame",
  spiral: "Shadow Spiral",
  useCase: "Self-reflection",
  status: "Active" as const,
  category: "Spiral Journey",
}));

export default function JournalPromptManagerPage() {
  const [prompts, setPrompts] = useState<JournalPrompt[]>(mockPrompts);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.emotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.spiral.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.useCase.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrompts = filteredPrompts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter((prompt) => prompt.id !== id));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className=''>
        {/* Header */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Link href='/journal-prompt-manager/add'>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white w-fit'>
              <Plus className='mr-2 h-4 w-4' />
              Add new Prompt
            </Button>
          </Link>

          <div className='relative w-full sm:w-80'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Title */}
        <h1 className='mb-8 text-2xl font-semibold text-gray-900'>
          Journal Prompt Manager
        </h1>

        {/* Prompts Grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {currentPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className='border-2 border-orange-200 bg-orange-50'
            >
              <CardContent className='p-6'>
                <p className='mb-4 text-sm text-gray-700 leading-relaxed'>
                  {prompt.prompt}
                </p>

                <div className='space-y-1 text-xs'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-orange-600'>
                      Emotion:
                    </span>
                    <span className='text-gray-600'>{prompt.emotion}</span>
                    <span className='font-medium text-orange-600 ml-4'>
                      Spiral:
                    </span>
                    <span className='text-gray-600'>{prompt.spiral}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-orange-600'>
                      Use Case:
                    </span>
                    <span className='text-gray-600'>{prompt.useCase}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-orange-600'>Status:</span>
                    <span
                      className={`font-medium ${
                        prompt.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {prompt.status}
                    </span>
                  </div>
                </div>

                <div className='mt-4 flex gap-2'>
                  <Link
                    href={`/journal-prompt-manager/edit/${prompt.id}`}
                    className='flex-1'
                  >
                    <Button
                      variant='outline'
                      className='w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent'
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    className='flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent'
                    onClick={() => handleDelete(prompt.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-8 flex items-center justify-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='px-3'
            >
              ‹
            </Button>

            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className='px-3 py-2 text-gray-400'>...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size='sm'
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-3 ${
                      currentPage === page
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className='px-3'
            >
              ›
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
