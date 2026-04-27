"use client";

import { CalendarPlus, Mail, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Appointment } from "@/types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (value: Appointment) => void;
  onDelete: (value: Appointment) => void;
  onWhatsapp: (value: Appointment) => void;
  onEmail: (value: Appointment) => void;
  onCalendar: (value: Appointment) => void;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function priorityClasses(priority: Appointment["priority"]) {
  if (priority === "High") return "bg-red-100 text-red-700";
  if (priority === "Medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onWhatsapp,
  onEmail,
  onCalendar,
}: AppointmentCardProps) {
  return (
    <article className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-xl dark:bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Ref #{appointment.referenceId}
        </h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClasses(
            appointment.priority,
          )}`}
        >
          {appointment.priority}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200">
        <p>
          <strong>Name:</strong> {appointment.fullName}
        </p>
        <p>
          <strong>Phone:</strong> {appointment.phoneNumber}
        </p>
        <p>
          <strong>Message To:</strong> {appointment.messageTo}
        </p>
        <p>
          <strong>Schedule:</strong> {appointment.appointmentDate} at{" "}
          {appointment.appointmentTime}
        </p>
        <p className="break-words">
          <strong>Issues:</strong> {appointment.issues.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Date & Time Of Message:</strong>{" "}
          {formatDateTime(appointment.messageDateTime || appointment.createdAt)}
        </p>
        <p className="text-violet-600 dark:text-violet-300">
          Note: Kindly send a reply after receiving the message / email.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onEdit(appointment)}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(appointment)}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-red-300 bg-red-50 px-2 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          <Trash2 size={14} />
          Delete
        </button>
        <button
          type="button"
          onClick={() => onWhatsapp(appointment)}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => onEmail(appointment)}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-orange-300 bg-orange-50 px-2 text-xs font-semibold text-orange-700 hover:bg-orange-100"
        >
          <Mail size={14} />
          Email
        </button>
        <button
          type="button"
          onClick={() => onCalendar(appointment)}
          className="col-span-2 inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-purple-300 bg-purple-50 px-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 sm:col-span-1"
        >
          <CalendarPlus size={14} />
          Google Calendar
        </button>
      </div>
    </article>
  );
}
