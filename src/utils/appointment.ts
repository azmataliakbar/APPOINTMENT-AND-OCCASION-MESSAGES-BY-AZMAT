import { Appointment } from "@/types/appointment";

export const APPOINTMENT_TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function generateReferenceId(existing: Appointment[]): string {
  let value = "";
  do {
    value = `${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existing.some((item) => item.referenceId === value));
  return value;
}

const replyNote = "Note: Kindly send a reply after receiving the message / email.";

export function toWhatsappMessage(appointment: Appointment): string {
  return [
    `Appointment / Message Ref: ${appointment.referenceId}`,
    ``,
    `Name: ${appointment.fullName}`,
    `Phone: ${appointment.phoneNumber}`,
    `Message To: ${appointment.messageTo}`,
    `Issues: ${appointment.issues.join(", ") || "N/A"}`,
    `Date: ${appointment.appointmentDate}`,
    `Time: ${appointment.appointmentTime}`,
    `Priority: ${appointment.priority}`,
    ``,
    replyNote,
  ].join("\n");
}

export function whatsappUrl(appointment: Appointment): string {
  return `https://wa.me/?text=${encodeURIComponent(toWhatsappMessage(appointment))}`;
}

export function emailUrl(appointment: Appointment): string {
  const subject = `Appointment Ref ${appointment.referenceId}`;
  const lines = [
    `Appointment Report`,
    ``,
    `Reference ID: ${appointment.referenceId}`,
    `Message To: ${appointment.messageTo}`,
    `Name: ${appointment.fullName}`,
    `Phone: ${appointment.phoneNumber}`,
    `Email: ${appointment.emailAddress}`,
    `Address: ${appointment.address}`,
    ``,
    `Issues:`,
    ...appointment.issues.map((issue) => `- ${issue}`),
    ``,
    `Schedule: ${appointment.appointmentDate} at ${appointment.appointmentTime}`,
    `Priority: ${appointment.priority}`,
    ``,
    replyNote,
  ];
  return `mailto:${encodeURIComponent(appointment.emailAddress || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function toGoogleDateTime(date: string, time: string): string {
  const [timePart, meridiem] = time.split(" ");
  const [rawHour, minute] = timePart.split(":").map(Number);
  let hour = rawHour % 12;
  if (meridiem?.toUpperCase() === "PM") hour += 12;

  const start = new Date(`${date}T00:00:00`);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  const format = (value: Date) =>
    value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  return `${format(start)}/${format(end)}`;
}

export function googleCalendarUrl(appointment: Appointment): string {
  const title = `Appointment (Ref ${appointment.referenceId})`;
  const details = [
    `Reference ID: ${appointment.referenceId}`,
    `Message To: ${appointment.messageTo}`,
    `Name: ${appointment.fullName}`,
    `Phone: ${appointment.phoneNumber}`,
    `Email: ${appointment.emailAddress}`,
    `Address: ${appointment.address}`,
    `Issues: ${appointment.issues.join(", ") || "N/A"}`,
    `Priority: ${appointment.priority}`,
  ].join("\n");

  const dates = toGoogleDateTime(
    appointment.appointmentDate,
    appointment.appointmentTime,
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${encodeURIComponent(dates)}`;
}
