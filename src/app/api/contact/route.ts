//cuddlesandcut\src\app\api\contact\route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, phone, email, city, zip, service, message } = data;

    // ✉️ Envía el correo
    await resend.emails.send({
      from: "Cuddles & Cuts <noreply@cuddlesandcut.com>",
      to: "contact@cuddlesandcut.com", // 👈 cambia por tu correo real
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>ZIP:</b> ${zip}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b><br>${message || "(no message provided)"}</p>
        <hr>
        <p>Sent from cuddlesandcut.com</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
