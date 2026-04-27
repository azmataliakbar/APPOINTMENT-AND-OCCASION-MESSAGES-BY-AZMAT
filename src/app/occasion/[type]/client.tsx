"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import {
  readOccasionMessageByType,
  readOccasionMessages,
  writeOccasionMessages,
} from "@/lib/occasionStorage";
import { OccasionMessageRecord } from "@/types/occasion";
import {
  occasionEmailUrl,
  occasionWhatsappUrl,
  formatOccasionTemplate,
  getOccasion,
  OCCASION_OPTIONS,
} from "@/utils/occasion";

interface OccasionFormState {
  toName: string;
  senderName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
}

const initialState: OccasionFormState = {
  toName: "",
  senderName: "",
  phoneNumber: "",
  emailAddress: "",
  message: "",
};

function extractCustomMessage({
  savedMessage,
  toName,
  senderName,
  occasionType,
  occasionLabel,
}: {
  savedMessage: string;
  toName: string;
  senderName: string;
  occasionType: string;
  occasionLabel: string;
}) {
  const normalized = savedMessage.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const defaultTemplate = formatOccasionTemplate({
    toName,
    senderName,
    occasionLabel,
    occasionType,
    customMessage: "",
  });
  if (normalized === defaultTemplate) return "";

  const lines = normalized.split("\n");
  if (lines.length < 4) return normalized;

  const expectedFirst = `Dear ${toName.trim() || "Friend"},`;
  const expectedSecond =
    occasionType === "condolences"
      ? "Sending heartfelt condolences on this difficult loss."
      : `Wishing you a wonderful ${occasionLabel}...`;
  const expectedLast = senderName.trim() || "Your Well Wisher";

  const first = lines[0]?.trim();
  const second = lines[1]?.trim();
  const penultimate = lines[lines.length - 2]?.trim();
  const last = lines[lines.length - 1]?.trim();

  if (
    first === expectedFirst &&
    second === expectedSecond &&
    penultimate === "Best regards," &&
    last === expectedLast
  ) {
    return lines.slice(2, -2).join("\n").trim();
  }

  return normalized;
}

export function OccasionFormClient({ type }: { type: string }) {
  const router = useRouter();
  const occasion = useMemo(() => getOccasion(type), [type]);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState<OccasionFormState>(initialState);
  const [savedRecord, setSavedRecord] = useState<OccasionMessageRecord | null>(null);
  const [toast, setToast] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    if (!occasion) return;
    const frame = window.requestAnimationFrame(() => {
      setSelectedImage(occasion.image);
      setPreviewImage(occasion.image);
      const existing = readOccasionMessageByType(occasion.type);
      if (!existing) {
        setSavedRecord(null);
        setForm(initialState);
        return;
      }
      setSavedRecord(existing);
      setForm({
        toName: existing.toName,
        senderName: existing.senderName,
        phoneNumber: existing.phoneNumber,
        emailAddress: existing.emailAddress,
        message: extractCustomMessage({
          savedMessage: existing.message,
          toName: existing.toName,
          senderName: existing.senderName,
          occasionType: existing.type,
          occasionLabel: occasion.label,
        }),
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [occasion]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!occasion) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <p className="text-lg font-semibold">Invalid occasion type.</p>
        <Link
          className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white"
          href="/"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const replyNote = "Note: Kindly send a reply after receiving the message / email.";
  const resolvedMessage = formatOccasionTemplate({
    toName: form.toName,
    senderName: form.senderName,
    occasionLabel: occasion.label,
    occasionType: occasion.type,
    customMessage: form.message,
  });
  const resolvedMessageWithNote = `${resolvedMessage}\n\n${replyNote}`;

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    if (
      !form.toName.trim() ||
      !form.senderName.trim() ||
      !form.phoneNumber.trim() ||
      !form.emailAddress.trim()
    ) {
      setToast("Please fill all required fields.");
      return;
    }

    const now = new Date().toISOString();
    const record: OccasionMessageRecord = {
      id: savedRecord?.id ?? crypto.randomUUID(),
      type: occasion.type,
      toName: form.toName.trim(),
      senderName: form.senderName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      emailAddress: form.emailAddress.trim(),
      message: form.message.trim(),
      createdAt: savedRecord?.createdAt ?? now,
      updatedAt: now,
    };

    const existing = readOccasionMessages().filter((item) => item.type !== occasion.type);
    const next = [record, ...existing];
    writeOccasionMessages(next);
    setSavedRecord(record);
    setToast("Occasion message saved.");
  };

  const handleWhatsapp = () => {
    window.open(occasionWhatsappUrl(resolvedMessageWithNote), "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    window.location.href = occasionEmailUrl(resolvedMessageWithNote);
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this saved occasion message?")) return;
    const next = readOccasionMessages().filter((item) => item.type !== occasion.type);
    writeOccasionMessages(next);
    setSavedRecord(null);
    setForm(initialState);
    setToast("Occasion message deleted.");
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />

      <main className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 md:py-6">
        <section className="rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-xl sm:p-5 dark:bg-slate-900/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">Fill Occasion Form</h2>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="min-h-11 rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to Appointment Page
            </button>
          </div>

          <div className="mb-4 overflow-hidden rounded-xl border border-white/20 bg-white/80 p-2 shadow-md">
            <Image
              src={previewImage || occasion.image}
              alt={`${occasion.label} card`}
              className="h-44 w-full rounded-lg object-cover"
              width={1200}
              height={600}
              unoptimized
              onError={() => {
                if (previewImage !== "/cards/birthday.jpg") {
                  setPreviewImage("/cards/birthday.jpg");
                }
              }}
            />
          </div>
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:text-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Image Attachment</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Download the selected image to attach manually to your message.
                </p>
              </div>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => setShowImagePicker((current) => !current)}
                  className='inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                >
                  {showImagePicker ? 'Hide Images' : 'Attach Image'}
                </button>
                <a
                  href={selectedImage || occasion.image}
                  download
                  className='inline-flex min-h-11 items-center rounded-lg bg-blue-500 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600'
                >
                  Download Image
                </a>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Selected image: <span className="font-semibold">{selectedImage || occasion.image}</span>
            </p>
            {showImagePicker ? (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OCCASION_OPTIONS.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      setSelectedImage(option.image);
                      setPreviewImage(option.image);
                      setShowImagePicker(false);
                    }}
                    className={`overflow-hidden rounded-xl border p-1 text-left transition hover:border-blue-500 ${selectedImage === option.image ? "border-blue-500" : "border-slate-200"}`}
                  >
                    <Image
                      src={option.image}
                      alt={option.label}
                      width={200}
                      height={140}
                      className="h-20 w-full rounded-lg object-cover"
                      unoptimized
                    />
                    <span className="mt-2 block truncate text-xs font-semibold text-slate-700 dark:text-slate-100">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="To (Person Name)">
                <input
                  value={form.toName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, toName: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
                  placeholder="Recipient name"
                  required
                />
              </Field>

              <Field label="Full Name (Sender)">
                <input
                  value={form.senderName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, senderName: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
                  placeholder="Your full name"
                  required
                />
              </Field>

              <Field label="Phone Number">
                <input
                  value={form.phoneNumber}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phoneNumber: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
                  placeholder="+92XXXXXXXXXX"
                  required
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={form.emailAddress}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, emailAddress: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
                  placeholder="name@email.com"
                  required
                />
              </Field>
            </div>

            <Field label="Occasion Type">
              <input
                value={occasion.label}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-700 outline-none"
              />
            </Field>

            <Field label="Message">
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                className="min-h-[120px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-black outline-none focus:border-blue-500"
                placeholder="Optional custom line to include in the generated message."
              />
            </Field>

            <div className="rounded-lg border border-purple-200 bg-purple-50/80 p-3 text-sm text-slate-800">
              <p className="mb-2 font-semibold">Generated Preview</p>
              <pre className="whitespace-pre-wrap font-sans">{resolvedMessageWithNote}</pre>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg hover:shadow-blue-400/40"
              >
                Save Message
              </button>
              <button
                type="button"
                onClick={handleWhatsapp}
                className="min-h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 text-sm font-semibold text-white shadow-lg hover:shadow-emerald-400/40"
              >
                Send WhatsApp
              </button>
              <button
                type="button"
                onClick={handleEmail}
                className="min-h-11 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 text-sm font-semibold text-white shadow-lg hover:shadow-orange-400/40"
              >
                Send Email
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="min-h-11 rounded-lg border border-red-300 bg-red-50 px-4 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </form>
        </section>
      </main>

      {toast ? (
        <div className="fixed bottom-4 right-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      {children}
    </label>
  );
}
