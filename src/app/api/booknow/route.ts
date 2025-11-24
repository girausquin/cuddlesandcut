// src/app/api/booknow/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Extraemos TODO lo que viene del modal
    const {
      petName,
      sex,
      parentName,
      phone,
      email,
      service,
      breed,
      age,
      weightLbs,
      notes,
      travelFee,
      servicePrice,
      travelFeeNum,
      totalEstimate,
      ts,
      source,
    } = data;

    // ✉️ Enviar correo con absolutamente toda la información
    await resend.emails.send({
      from: "Cuddles & Cuts <noreply@cuddlesandcut.com>",
      to: "contact@cuddlesandcut.com",
      subject: `New Booking Request — ${petName} (${parentName})`,
      html: `
        <h2>New Booking Request</h2>

        <h3>🐾 Pet Information</h3>
        <p><b>Name:</b> ${petName}</p>
        <p><b>Sex:</b> ${sex}</p>
        <p><b>Breed:</b> ${breed}</p>
        <p><b>Age:</b> ${age || "(not provided)"}</p>
        <p><b>Weight:</b> ${weightLbs} lbs</p>
        <p><b>Notes:</b> ${notes || "(none)"}</p>

        <h3>👤 Pet Parent</h3>
        <p><b>Parent Name:</b> ${parentName}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email || "(not provided)"}</p>

        <h3>✂️ Service Details</h3>
        <p><b>Service:</b> ${service}</p>
        <p><b>Service Price:</b> ${servicePrice != null ? "$" + servicePrice.toFixed(2) : "N/A"}</p>

        <h3>🚗 Travel</h3>
        <p><b>Travel Fee:</b> ${travelFeeNum === 0 ? "Free" : "$" + travelFeeNum}</p>

        <h3>💵 Estimated Total</h3>
        <p><b>Total:</b> ${
          totalEstimate != null
            ? "$" + totalEstimate.toFixed(2) + " (before tax)"
            : "N/A"
        }</p>

        <hr />
        <p><b>Source:</b> ${source}</p>
        <p><b>Timestamp:</b> ${ts}</p>
        <p>Sent from cuddlesandcut.com BOOK NOW modal.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send booking email" },
      { status: 500 }
    );
  }
}
