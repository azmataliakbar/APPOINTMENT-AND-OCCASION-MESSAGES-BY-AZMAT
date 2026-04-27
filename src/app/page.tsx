"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppointmentCard } from "@/components/AppointmentCard";
import { AppointmentForm } from "@/components/AppointmentForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Toast } from "@/components/Toast";
import { useNotifications } from "@/hooks/useNotifications";
import { readAppointments, writeAppointments } from "@/lib/storage";
import { Appointment, AppointmentFormValues, NavAction } from "@/types/appointment";
import {
  emailUrl,
  generateReferenceId,
  googleCalendarUrl,
  whatsappUrl,
} from "@/utils/appointment";

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAction, setActiveAction] = useState<NavAction>("form");
  const [searchRef, setSearchRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    variant: "success" | "error";
  }>({ open: false, message: "", variant: "success" });
  const [darkMode, setDarkMode] = useState(false);
  const { notify } = useNotifications();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAppointments(readAppointments());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToast((current) => ({ ...current, open: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.open]);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  const filteredAppointments = useMemo(() => {
    if (!searchRef.trim()) return appointments;
    return appointments.filter((item) => item.referenceId.includes(searchRef.trim()));
  }, [appointments, searchRef]);
  const latestMessageDateTime = useMemo(() => {
    if (editTarget) return editTarget.messageDateTime || editTarget.createdAt;
    const latest = appointments[0];
    if (!latest) return null;
    return latest.messageDateTime || latest.createdAt;
  }, [appointments, editTarget]);

  const openToast = (message: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, message, variant });
  };

  const handleSubmit = (values: AppointmentFormValues) => {
    setLoading(true);
    const now = new Date().toISOString();
    const cleanedIssues = values.issues
      .map((item) => item.value.trim())
      .filter(Boolean);

    if (!cleanedIssues.length) {
      setLoading(false);
      openToast("Please add at least one issue line.", "error");
      return;
    }

    const payloadBase = {
      messageTo: values.messageTo.trim(),
      fullName: values.fullName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      emailAddress: values.emailAddress.trim(),
      address: values.address.trim(),
      issues: cleanedIssues,
      appointmentDate: values.appointmentDate,
      appointmentTime: values.appointmentTime,
      messageDateTime: now,
      priority: values.priority,
      updatedAt: now,
    };

    let next: Appointment[];
    let referenceId = "";

    if (editTarget) {
      referenceId = editTarget.referenceId;
      next = appointments.map((item) =>
        item.id === editTarget.id ? { ...item, ...payloadBase } : item,
      );
      setEditTarget(null);
      openToast(`Appointment updated - Ref ${referenceId}`);
      notify("Appointment updated", `Ref ${referenceId}`);
    } else {
      referenceId = generateReferenceId(appointments);
      const record: Appointment = {
        id: crypto.randomUUID(),
        referenceId,
        createdAt: now,
        ...payloadBase,
      };
      next = [record, ...appointments];
      openToast(`Appointment saved - Ref ${referenceId}`);
      notify("Appointment saved", `Ref ${referenceId}`);
    }

    setAppointments(next);
    writeAppointments(next);
    setLoading(false);
  };

  const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const getQuickActionAppointment = () => {
    if (editTarget) return editTarget;
    if (appointments.length) return appointments[0];
    return null;
  };

  const handleWhatsapp = (appointment: Appointment) => {
    openUrl(whatsappUrl(appointment));
    setActiveAction("whatsapp");
  };

  const handleEmail = (appointment: Appointment) => {
    openUrl(emailUrl(appointment));
    setActiveAction("email");
  };

  const handleSidebarAction = (action: NavAction) => {
    setActiveAction(action);
    if (action === "form" || action === "occasion") return;

    const target = getQuickActionAppointment();
    if (!target) {
      openToast("Save an appointment first, then send WhatsApp/Email.", "error");
      return;
    }

    if (action === "whatsapp") {
      handleWhatsapp(target);
      return;
    }

    handleEmail(target);
  };

  const handleCalendar = (appointment: Appointment) => {
    openUrl(googleCalendarUrl(appointment));
    openToast(`Calendar link opened for Ref ${appointment.referenceId}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const next = appointments.filter((item) => item.id !== deleteTarget.id);
    setAppointments(next);
    writeAppointments(next);
    openToast(`Deleted Ref ${deleteTarget.referenceId}`);
    setDeleteTarget(null);
    if (editTarget?.id === deleteTarget.id) setEditTarget(null);
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-2 py-3 sm:px-4 md:flex-row md:gap-4 md:py-6">
        <Sidebar activeAction={activeAction} onChangeAction={handleSidebarAction} />

        <section className="min-w-0 flex-1 space-y-4">
          <AppointmentForm
            editTarget={editTarget}
            messageDateTime={latestMessageDateTime}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditTarget(null)}
            loading={loading}
          />

          <div className="rounded-2xl border border-white/20 bg-white/70 p-3 shadow-xl backdrop-blur-xl dark:bg-slate-900/60">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold">Saved Appointments</h2>
              <label className="relative block w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Search by Ref ID"
                  className="min-h-11 w-full rounded-lg border border-slate-300 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {filteredAppointments.length ? (
                filteredAppointments.map((item) => (
                  <AppointmentCard
                    key={item.id}
                    appointment={item}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                    onWhatsapp={handleWhatsapp}
                    onEmail={handleEmail}
                    onCalendar={handleCalendar}
                  />
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
                  No appointments found. Save your first appointment to start
                  managing records.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Toast open={toast.open} message={toast.message} variant={toast.variant} />
      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        name={deleteTarget?.fullName ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
