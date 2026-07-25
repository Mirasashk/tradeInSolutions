import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Schedule Appointment",
  path: "/schedule-appointment/",
});

export default function ScheduleAppointmentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold text-brand-navy">
        Schedule Your Free Appraisal
      </h1>
      <p className="mt-4 text-muted-foreground">
        Pick a time that works for you. We&apos;ll confirm your appointment by email.
      </p>
      <div className="mt-8">
        <AppointmentForm />
      </div>
    </div>
  );
}
