"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  prompt: string;
  category: string;
  useCase: string;
  emotion: string;
  activationStatus: string;
}

export default function EditJournalPromptPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    category: "",
    useCase: "",
    emotion: "",
    activationStatus: "Active",
  });

  const categories = [
    "Spiral Journey",
    "Shadow Work",
    "Inner Child",
    "Manifestation",
    "Gratitude",
  ];
  const useCases = [
    "Self-reflection",
    "Comfort",
    "Activation",
    "Healing",
    "Growth",
  ];
  const emotions = ["Shame", "Fear", "Grief", "Joy", "Anger", "Love", "Peace"];
  const statuses = ["Active", "Inactive"];

  // Load existing data (mock data for demo)
  useEffect(() => {
    // In a real app, you would fetch the data based on params.id
    setFormData({
      prompt:
        "Kapan terakhir kali kamu merasa seperti bukan dirimu sendiri? Apa bagian yang ingin kamu peluk kembali hari ini?",
      category: "Spiral Journey",
      useCase: "Comfort",
      emotion: "Shame",
      activationStatus: "Active",
    });
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.prompt.trim() ||
      !formData.category ||
      !formData.useCase ||
      !formData.emotion
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Updating journal prompt:", { id: params.id, ...formData });

    // Redirect back to the main page
    router.push("/journal-prompt-manager");
  };

  const handleCancel = () => {
    router.push("/journal-prompt-manager");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-2xl'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-3'>
          <Link href='/journal-prompt-manager'>
            <Button variant='ghost' size='sm' className='p-2'>
              <ArrowLeft className='h-4 w-4' />
            </Button>
          </Link>
          <h1 className='text-xl font-semibold text-gray-900'>
            Edit Journal Prompt
          </h1>
        </div>

        {/* Form */}
        <Card className='border-2 border-orange-200 bg-white'>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Journal Prompt */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Journal Prompt :
                </label>
                <Textarea
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  className='min-h-[120px] resize-none'
                  required
                />
              </div>

              {/* Category and Use Case */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category:
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Use Case:
                  </label>
                  <Select
                    value={formData.useCase}
                    onValueChange={(value) =>
                      setFormData({ ...formData, useCase: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {useCases.map((useCase) => (
                        <SelectItem key={useCase} value={useCase}>
                          {useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emotion and Activation Status */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Emotion:
                  </label>
                  <Select
                    value={formData.emotion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, emotion: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emotions.map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Activation Status:
                  </label>
                  <Select
                    value={formData.activationStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, activationStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <span
                            className={
                              status === "Active"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {status}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Buttons */}
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  className='flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-orange-500 hover:bg-orange-600 text-white'
                >
                  Edit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
