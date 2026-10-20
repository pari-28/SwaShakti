import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

class EmailService {
  async sendSOSAlert(
    to: string,
    contactName: string,
    userName: string,
    latitude: number,
    longitude: number,
    message?: string
  ) {
    const mapsLink =
      `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Time when the SOS email is generated
    const triggeredAt = new Date();

    const formattedTime = triggeredAt.toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    });

    return await transporter.sendMail({
      from: `"SwaShakti Emergency Alert" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🚨 SwaShakti SOS Emergency Alert",

      text: `

Hello ${contactName},

This is an emergency alert from SwaShakti.

An SOS has been triggered by ${userName}.

⏰ Time:

${formattedTime}

📍 Location:

${mapsLink}

Latitude: ${latitude}

Longitude: ${longitude}

${message ? `Message: ${message}` : ""}

Please contact the person immediately if necessary.

This is an automated SwaShakti emergency notification.

      `,

      html: `
        <h2>🚨 SwaShakti SOS Emergency Alert</h2>

        <p>Hello ${contactName},</p>

        <p>
          An <strong>SOS emergency alert</strong> has been triggered
          through SwaShakti by <strong>${userName}</strong>.
        </p>

        <p>
          <strong>⏰ Time:</strong><br/>
          ${formattedTime}
        </p>


        <p>
          <strong>📍 Location:</strong>
          <a href="${mapsLink}" target="_blank">
            View location on Google Maps
          </a>
        </p>

        <p>
          <strong>Latitude:</strong> ${latitude}<br/>
          <strong>Longitude:</strong> ${longitude}
        </p>

        ${
          message
            ? `<p><strong>Message:</strong> ${message}</p>`
            : ""
        }

        <p>
          Please contact the person immediately if necessary.
        </p>

        <hr/>

        <p style="color:#777;font-size:12px;">
          This is an automated emergency notification from SwaShakti.
        </p>
      `,
    });
  }
}

export default new EmailService();