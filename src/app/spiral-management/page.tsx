"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Spiral {
  id: string;
  title: string;
  description: string;
  duration: string;
  focus: string[];
}

const mockSpirals: Spiral[] = [
  {
    id: "1",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "2",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "3",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "4",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "5",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "6",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "7",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "8",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
  {
    id: "9",
    title: "Feminine Healing Spiral",
    description:
      '"For the part of you that longs to feel soft, intuitive, and safe again. This spiral reconnects you to your sacred feminine wisdom."',
    duration: "1-7 Days",
    focus: ["Self-worth", "fear of receiving", "overflow"],
  },
];

export default function JournalPromptsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [spirals, setSpirals] = useState<Spiral[]>(mockSpirals);

  const filteredSpirals = spirals.filter(
    (spiral) =>
      spiral.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spiral.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spiral.focus.some((f) =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDelete = (id: string) => {
    setSpirals(spirals.filter((spiral) => spiral.id !== id));
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='w-full'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <Link href='/journal-prompts/create'>
              <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
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
          {filteredSpirals.map((spiral) => (
            <Card
              key={spiral.id}
              className='border-2 border-orange-200 hover:border-orange-300 transition-colors'
            >
              <CardHeader className='pb-4'>
                <CardTitle className='text-xl text-orange-600 text-center'>
                  {spiral.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-gray-700 text-center italic leading-relaxed'>
                  {spiral.description}
                </p>

                <div className='flex items-center justify-center gap-2'>
                  <Badge
                    variant='secondary'
                    className='bg-orange-100 text-orange-800'
                  >
                    📅 Duration: {spiral.duration}
                  </Badge>
                </div>

                <div className='text-center'>
                  <p className='text-sm font-medium text-orange-600 mb-2'>
                    Focus:{" "}
                    <span className='text-orange-500'>
                      {spiral.focus.join(", ")}
                    </span>
                  </p>
                </div>

                <div className='flex gap-3 pt-4'>
                  <Link
                    href={`/journal-prompts/edit/${spiral.id}`}
                    className='flex-1'
                  >
                    <Button
                      variant='outline'
                      className='w-full border-gray-300 hover:bg-gray-50 bg-transparent'
                    >
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    className='flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent'
                    onClick={() => handleDelete(spiral.id)}
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpirals.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No spirals found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
