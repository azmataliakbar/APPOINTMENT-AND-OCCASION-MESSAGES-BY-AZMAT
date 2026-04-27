export type Priority = "Low" | "Medium" | "High";

export type NavAction = "form" | "occasion" | "whatsapp" | "email";

export interface Appointment {
  id: string;
  referenceId: string;
  messageTo: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  issues: string[];
  appointmentDate: string;
  appointmentTime: string;
  messageDateTime: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormValues {
  messageTo: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  issues: { value: string }[];
  appointmentDate: string;
  appointmentTime: string;
  priority: Priority;
}
