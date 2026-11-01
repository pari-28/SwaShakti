import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

const transporter =
  emailUser && emailAppPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailAppPassword,
        },
        connectionTimeout: 10_000,
        greetingTimeout: 8_000,
        socketTimeout: 30_000,
      })
    : null;

class EmailService {
  async sendSOSAlert(
    to: string,
    contactName: string,
    userName: string,
    latitude: number,
    longitude: number,
    message?: string
  ) {
    if (!transporter || !emailUser) {
      throw new Error(
        "SOS email unavailable: EMAIL_USER or EMAIL_APP_PASSWORD is not configured."
      );
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };

        return entities[character] ?? character;
      });

    const safeContactName = escapeHtml(contactName);
    const safeUserName = escapeHtml(userName);
    const safeMessage = message ? escapeHtml(message) : "";

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const triggeredAt = new Date();

    const formattedTime = triggeredAt.toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata",
    });

    return transporter.sendMail({
      from: `"SwaShakti Emergency Alert" <${emailUser}>`,
      to,
      subject: "🚨 SwaShakti SOS Emergency Alert",

      text: `
Hello ${contactName},

This is an emergency alert from SwaShakti.

An SOS has been triggered by ${userName}.

Time:
${formattedTime}

Location:
${mapsLink}

Latitude: ${latitude}
Longitude: ${longitude}

${message ? `Message: ${message}` : ""}

Please contact the person immediately if necessary.

This is an automated SwaShakti emergency notification.
      `,

      html: `
        <h2>🚨 SwaShakti SOS Emergency Alert</h2>

        <p>Hello ${safeContactName},</p>

        <p>
          An <strong>SOS emergency alert</strong> has been triggered
          through SwaShakti by <strong>${safeUserName}</strong>.
        </p>

        <p>
          <strong>Time:</strong><br/>
          ${formattedTime}
        </p>

        <p>
          <strong>Location:</strong>
          <a href="${mapsLink}" target="_blank">
            View location on Google Maps
          </a>
        </p>

        <p>
          <strong>Latitude:</strong> ${latitude}<br/>
          <strong>Longitude:</strong> ${longitude}
        </p>

        ${
          safeMessage
            ? `<p><strong>Message:</strong> ${safeMessage}</p>`
            : ""
        }

        <p>Please contact the person immediately if necessary.</p>

        <hr/>

        <p style="color:#777;font-size:12px;">
          This is an automated emergency notification from SwaShakti.
        </p>
      `,
    });
  }
}

export default new EmailService();