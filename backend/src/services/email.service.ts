
class EmailService {
  async sendSOSAlert(
    to: string,
    contactName: string,
    userName: string,
    latitude: number,
    longitude: number,
    message?: string
  ) {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const webhookSecret = process.env.SWASHAKTI_WEBHOOK_SECRET;

    if (!scriptUrl || !webhookSecret) {
      throw new Error(
        "Google Apps Script email configuration is missing."
      );
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: webhookSecret,
        to,
        contactName,
        userName,
        latitude,
        longitude,
        message,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(
        `Google Apps Script request failed with status ${response.status}.`
      );
    }

    const result = await response.json() as {
      success?: boolean;
      message?: string;
      error?: string;
    };

    if (!result.success) {
      throw new Error(
        result.error || "Google MailApp failed to accept the email."
      );
    }

    // Compatibility with the existing SOS email-counting logic.
    // This means Google MailApp accepted the send operation,
    // not that inbox delivery has been independently verified.
    return {
      accepted: [to],
      rejected: [],
      provider: "Google MailApp",
      message: result.message,
    };
  }
}

export default new EmailService();
