"use client";

import { ChevronDown, Gift, Mail, MessageCircle, PencilLine } from "lucide-react";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { NavAction } from "@/types/appointment";
import { OccasionType } from "@/types/occasion";
import { OCCASION_OPTIONS } from "@/utils/occasion";

interface SidebarProps {
  activeAction: NavAction;
  onChangeAction: (action: NavAction) => void;
}

const items: { id: NavAction; label: string; icon: ReactNode; style: string }[] =
  [
    {
      id: "form",
      label: "Fill Appointment / Message Form",
      icon: <PencilLine size={16} />,
      style:
        "from-blue-500 to-indigo-500 shadow-blue-500/30 hover:shadow-blue-500/50",
    },
    {
      id: "occasion",
      label: "Fill Occasion Form",
      icon: <Gift size={16} />,
      style:
        "from-fuchsia-500 to-purple-600 shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50",
    },
    {
      id: "whatsapp",
      label: "Send WhatsApp",
      icon: <MessageCircle size={16} />,
      style:
        "from-emerald-500 to-green-600 shadow-emerald-500/30 hover:shadow-emerald-500/50",
    },
    {
      id: "email",
      label: "Send Email",
      icon: <Mail size={16} />,
      style:
        "from-orange-500 to-red-500 shadow-orange-500/30 hover:shadow-orange-500/50",
    },
  ];

export function Sidebar({ activeAction, onChangeAction }: SidebarProps) {
  const router = useRouter();
  const [showOccasions, setShowOccasions] = useState(false);

  const handleOccasionSelect = (type: OccasionType) => {
    setShowOccasions(false);
    router.push(`/occasion/${type}`);
  };

  return (
    <aside className="z-20 md:sticky md:top-[84px] md:h-fit md:w-80 md:self-start">
      <div className="space-y-3">
        <div className="w-full flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/30 p-2 backdrop-blur-xl">
          {items.map((item) => {
            const active = item.id === activeAction;
            return (
              <div key={item.id} className="w-full">
                <button
                  type="button"
                  onClick={() => {
                    onChangeAction(item.id);
                    if (item.id === "occasion") {
                      setShowOccasions((current) => !current);
                      return;
                    }
                    setShowOccasions(false);
                  }}
                  className={`sidebar-action-button inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] ${item.style} bg-gradient-to-r ${active ? "ring-2 ring-offset-2 ring-purple-400 ring-offset-transparent" : "opacity-90"}`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === "occasion" ? (
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${showOccasions ? "rotate-180" : ""}`}
                    />
                  ) : null}
                </button>
                {item.id === "occasion" && showOccasions ? (
                  <div className="mt-2 space-y-2 rounded-xl border border-white/25 bg-white/65 p-2 backdrop-blur-xl">
                    {OCCASION_OPTIONS.map((occasion) => (
                      <button
                        key={occasion.type}
                        type="button"
                        onClick={() => handleOccasionSelect(occasion.type)}
                        className="block min-h-10 w-full rounded-lg bg-white/90 px-3 text-left text-sm font-semibold text-slate-800 hover:bg-white"
                      >
                        {occasion.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="w-full rounded-2xl border border-white/20 bg-white/40 p-3 text-sm text-slate-800 shadow-md backdrop-blur-xl dark:text-slate-100">
          <p className="font-semibold">
            Note : Kindly send reply after receiving message / mail.
          </p>
          <p className="mt-3 font-medium">Designed By : Azmat Ali</p>
        </div>
      </div>
    </aside>
  );
}
