"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";

import Loading from "@/components/loading/Loading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetTermConditionQuery,
  useSetTermConditionMutation,
} from "@/redux/features/setting/settingAPI";

const EditTermsCondition = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const {
    data: privacyPolicy,
    isLoading,
    refetch,
  } = useGetTermConditionQuery({});

  const [setPrivacyPolicy, { isLoading: isSaving }] =
    useSetTermConditionMutation();

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized || quillRef.current) return;
      initialized = true;

      const Quill = (await import("quill")).default;

      if (editorRef.current && !editorRef.current.querySelector(".ql-editor")) {
        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Enter your Terms and Conditions...",
        });

        quillRef.current = quill;

        if (privacyPolicy?.description) {
          quill.root.innerHTML = privacyPolicy.description;
          setContent(privacyPolicy.description);
        }

        quill.on("text-change", () => {
          setContent(quill.root.innerHTML);
        });
      }
    };

    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      initialized = true;
    };
  }, [privacyPolicy]);

  if (isLoading && !privacyPolicy && !quillRef.current) return <Loading />;

  const handleSubmit = async () => {
    try {
      const res = await setPrivacyPolicy({ description: content }).unwrap();
      if (res?.description) {
        toast.success("Terms and Conditions saved successfully!");
        router.push("/settings/terms-conditions");
        refetch();
      } else {
        toast.error("Failed to save.");
      }
    } catch {
      toast.error("Save failed.");
    }
  };

  return (
    <div className='w-[96%] mx-auto flex flex-col justify-between gap-6'>
      <div className='space-y-6 pt-6'>
        <div className='h-auto'>
          <div
            ref={editorRef}
            className='h-auto bg-white text-black text-base'
            id='quill-editor'
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className='bg-[#FEAA39] hover:bg-teal-700'
        >
          {isSaving ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </div>
  );
};

export default EditTermsCondition;
