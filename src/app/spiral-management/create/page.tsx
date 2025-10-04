/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateSpiralMutation } from "@/redux/features/sprial-management/sprialManagementAPI";
import { toast } from "sonner";

interface DayData {
  id: number;
  enabled: boolean;
  journalPrompt: string;
  voiceTitle: string;
  voiceFile: File | null;
}

export default function CreateSpiralPage() {
  const [spiralName, setSpiralName] = useState("");
  const [spiralDetails, setSpiralDetails] = useState("");
  const [focusPoint, setFocusPoint] = useState("");
  const [duration, setDuration] = useState<string | number>("");
  const [days, setDays] = useState<DayData[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      enabled: i === 0, // default enabled
      journalPrompt: "",
      voiceTitle: "",
      voiceFile: null,
    }))
  );

  console.log(days);

  const router = useRouter();
  const [createSpiral, { isLoading }] = useCreateSpiralMutation();

  // ✅ Handlers
  const handleDayToggle = (dayId: number) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, enabled: !day.enabled } : day
      )
    );

  const handleJournalPromptChange = (dayId: number, prompt: string) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, journalPrompt: prompt } : day
      )
    );

  const handleVoiceTitleChange = (dayId: number, title: string) =>
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, voiceTitle: title } : day
      )
    );

  const handleVoiceUpload = (dayId: number, file: File | null) =>
    setDays((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, voiceFile: file } : day))
    );

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", spiralName);
      formData.append("description", spiralDetails);
      formData.append("focus_point", focusPoint);
      formData.append("duration", duration?.toString() || "7");

      days
        .filter((day) => day.enabled)
        .forEach((day) => {
          formData.append(`day_${day.id}_number`, String(day.id));
          formData.append(`day_${day.id}_journal_prompt`, day.journalPrompt);
          formData.append(
            `day_${day.id}_voice_title`,
            day.voiceTitle || `Day ${day.id} Voice`
          );
          if (day.voiceFile)
            formData.append(`day_${day.id}_voice_drop`, day.voiceFile);
        });

      const res = await createSpiral(formData).unwrap();

      if (res?.data?.success) {
        toast.success("Spiral created successfully!");
        console.log("Spiral created:", res);
        router.push("/spiral-management");
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || "Failed to create spiral";
      console.warn(" Spiral creation failed:", msg);
      alert(msg);
    }
  };

  const handleCancel = () => router.push("/spiral-management");

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link
            href='/spiral-management'
            className='flex items-center text-gray-900'
          >
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='w-4 h-4 mr-2' />
            </Button>
            Create New Spiral
          </Link>
        </div>

        {/* Form */}
        <div className='space-y-6'>
          {/* Basic Info */}
          <Card className='w-full md:w-1/2'>
            <CardContent className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Spiral Name:
                </label>
                <Input
                  placeholder='Enter spiral name'
                  value={spiralName}
                  onChange={(e) => setSpiralName(e.target.value)}
                  className='text-black border !border-gray-400'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Spiral Details:
                </label>
                <Textarea
                  className='text-black border !border-gray-400'
                  placeholder='Enter spiral details'
                  value={spiralDetails}
                  onChange={(e) => setSpiralDetails(e.target.value)}
                  rows={6}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Focus Point:
                </label>
                <Input
                  placeholder='Enter focus point'
                  className='text-black border !border-gray-400'
                  value={focusPoint}
                  onChange={(e) => setFocusPoint(e.target.value)}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Duration:
                </label>
                <Input
                  type='number'
                  placeholder='Enter duration in days'
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Days */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {days.map((day) => (
              <Card
                key={day.id}
                className={`${
                  day.enabled
                    ? "border-[#FEAA39]"
                    : "border-gray-200 opacity-60"
                }`}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold'>Day {day.id}</h3>
                    <Switch
                      checked={day.enabled}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Voice Title:
                      </label>
                      <Input
                        placeholder='Enter voice title'
                        value={day.voiceTitle}
                        onChange={(e) =>
                          handleVoiceTitleChange(day.id, e.target.value)
                        }
                        disabled={!day.enabled}
                        className='text-black border !border-gray-400'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Journal Prompt:
                      </label>
                      <Textarea
                        placeholder='Enter journal prompt'
                        className='text-black border !border-gray-400'
                        value={day.journalPrompt}
                        onChange={(e) =>
                          handleJournalPromptChange(day.id, e.target.value)
                        }
                        disabled={!day.enabled}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Voice Upload:
                      </label>
                      <div className='flex items-center gap-2'>
                        <Input
                          type='file'
                          accept='audio/*'
                          onChange={(e) =>
                            handleVoiceUpload(
                              day.id,
                              e.target.files?.[0] || null
                            )
                          }
                          disabled={!day.enabled}
                          className='hidden'
                          id={`voice-upload-${day.id}`}
                        />
                        <label
                          htmlFor={`voice-upload-${day.id}`}
                          className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                            !day.enabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className='w-4 h-4' />
                          <span className='text-sm'>
                            {day.voiceFile
                              ? day.voiceFile.name
                              : "Choose voice file"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-end pt-6'>
            <Button
              className='w-36 h-12 bg-transparent border !border-[#FEAA39] text-[#FEAA39] hover:bg-transparent'
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className='w-36 h-12 bg-[#FEAA39] hover:bg-[#FEAA39] text-white'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
