"use client";

import { PlusCircle } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Appointment, AppointmentFormValues } from "@/types/appointment";
import { APPOINTMENT_TIMES } from "@/utils/appointment";

interface AppointmentFormProps {
  editTarget: Appointment | null;
  messageDateTime: string | null;
  loading: boolean;
  onSubmit: (values: AppointmentFormValues) => void;
  onCancelEdit: () => void;
}

const defaultValues: AppointmentFormValues = {
  messageTo: "",
  fullName: "",
  phoneNumber: "",
  emailAddress: "",
  address: "",
  issues: [{ value: "" }],
  appointmentDate: "",
  appointmentTime: "",
  priority: "Medium",
};

export function AppointmentForm({
  editTarget,
  messageDateTime,
  loading,
  onSubmit,
  onCancelEdit,
}: AppointmentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({ defaultValues });

  const { fields, append, remove } = useFieldArray({ control, name: "issues" });

  useEffect(() => {
    if (!editTarget) {
      reset(defaultValues);
      return;
    }
    reset({
      messageTo: editTarget.messageTo,
      fullName: editTarget.fullName,
      phoneNumber: editTarget.phoneNumber,
      emailAddress: editTarget.emailAddress,
      address: editTarget.address,
      issues: editTarget.issues.length
        ? editTarget.issues.map((value) => ({ value }))
        : [{ value: "" }],
      appointmentDate: editTarget.appointmentDate,
      appointmentTime: editTarget.appointmentTime,
      priority: editTarget.priority,
    });
  }, [editTarget, reset]);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/70 p-3 shadow-2xl backdrop-blur-xl sm:p-5 dark:bg-slate-900/60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Message To" error={errors.messageTo?.message}>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
              placeholder="Doctor / Company / Person"
              {...register("messageTo", { required: "Message To is required" })}
            />
          </Field>
          <Field label="Full Name" error={errors.fullName?.message}>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
              placeholder="Enter full name"
              {...register("fullName", { required: "Full Name is required" })}
            />
          </Field>
          <Field label="Phone Number" error={errors.phoneNumber?.message}>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
              placeholder="+92XXXXXXXXXX"
              {...register("phoneNumber", {
                required: "Phone Number is required",
                minLength: { value: 8, message: "Phone Number is too short" },
              })}
            />
          </Field>
          <Field label="Email Address" error={errors.emailAddress?.message}>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
              placeholder="Email for confirmation"
              {...register("emailAddress", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
          </Field>
        </div>

        <Field label="Address" error={errors.address?.message}>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
            placeholder="Full address"
            {...register("address", { required: "Address is required" })}
          />
        </Field>

        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3">
          <p className="text-sm font-semibold text-slate-800">
            Describe Issues / Reasons
          </p>
          <div className="mt-3 space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <span className="mt-2 text-base font-bold text-slate-800">●</span>
                <textarea
                  className="min-h-[52px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
                  placeholder={`Issue ${index + 1}`}
                  {...register(`issues.${index}.value`, {
                    required: "Issue line is required",
                  })}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-red-300 px-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-500 px-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            <PlusCircle size={16} />
            Add issue line
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Field
            label="Appointment Date"
            error={errors.appointmentDate?.message}
          >
            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black placeholder:font-medium placeholder:text-black outline-none focus:border-blue-500"
              {...register("appointmentDate", {
                required: "Appointment Date is required",
              })}
            />
          </Field>
          <Field
            label="Appointment Time"
            error={errors.appointmentTime?.message}
          >
            <select
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
              {...register("appointmentTime", {
                required: "Appointment Time is required",
              })}
            >
              <option value="">Select time</option>
              {APPOINTMENT_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              className="w-full rounded-lg border border-slate-300 bg-white/80 px-3 text-sm font-medium text-black outline-none focus:border-blue-500"
              {...register("priority")}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </Field>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            disabled={loading}
            type="submit"
            className="min-h-11 flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg hover:shadow-blue-400/40 disabled:opacity-70"
          >
            {loading
              ? "Saving..."
              : editTarget
                ? "Update Appointment"
                : "Save Appointment"}
          </button>
          {editTarget && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white/80 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <p className="border-t border-slate-200 pt-3 text-sm font-medium text-slate-800 dark:border-slate-700 dark:text-slate-200">
          Date & Time Of Message :{" "}
          <span className="font-semibold">
            {messageDateTime ? formatDateTime(messageDateTime) : "Not saved yet"}
          </span>
        </p>
      </form>
    </section>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
