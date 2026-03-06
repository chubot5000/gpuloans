"use server";

import Mailgun from "mailgun.js";

const mailgunClient = new Mailgun(FormData).client({ username: "api", key: `${process.env.MAILGUN_API_KEY}` });

interface Params {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: Params) {
  const { to, subject, html } = params;

  const from = process.env.NEXT_PUBLIC_MAILGUN_EMAIL;
  if (!from) throw new Error("Mailgun email is not set");

  const domain = from.split("@")[1];

  return mailgunClient.messages.create(domain, {
    from: `USD.AI Notifications <${from}>`,
    to: [to],
    subject,
    html,
  });
}
