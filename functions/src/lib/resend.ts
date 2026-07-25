import { Resend } from "resend";
import { defineSecret } from "firebase-functions/params";

export const resendApiKey = defineSecret("RESEND_API_KEY");
export const contactFormToEmail = defineSecret("CONTACT_FORM_TO_EMAIL");
export const resendFromEmail = defineSecret("RESEND_FROM_EMAIL");

export async function sendLeadEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const resend = new Resend(resendApiKey.value());
  const to = contactFormToEmail.value();
  const from = resendFromEmail.value();

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
