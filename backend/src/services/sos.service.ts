import { ApiError } from "../errors/ApiError";
import prisma from "../config/prisma";
import { SOSStatus } from "@prisma/client";
import NotificationService from "./notification.service";
import EmailService from "./email.service";
import { getIO } from "../config/socket";

const getSafeEmailErrorDetails = (error: unknown) => {
  if (typeof error !== "object" || error === null) {
    return { errorType: typeof error };
  }

  const mailError = error as {
    name?: unknown;
    code?: unknown;
    command?: unknown;
    responseCode?: unknown;
  };

  return {
    name:
      typeof mailError.name === "string"
        ? mailError.name
        : "UnknownError",
    code:
      typeof mailError.code === "string"
        ? mailError.code
        : undefined,
    command:
      typeof mailError.command === "string"
        ? mailError.command
        : undefined,
    responseCode:
      typeof mailError.responseCode === "number"
        ? mailError.responseCode
        : undefined,
  };
};

class SOSService {
  private static async getEmergencyContacts(userId: string) {
  return prisma.emergencyContact.findMany({
    where: {
      userId,
    },
    orderBy: {
      isPrimary: "desc",
    },
  });
}
  static async create(
    userId: string,
    data: {
      latitude: number;
      longitude: number;
      message?: string;
    }
  ) {

    const { latitude, longitude, message } = data;

    // Check if user already has an active SOS



    const existingSOS = await prisma.sOSAlert.findFirst({
      where: {
        userId,
        status: SOSStatus.ACTIVE,
      },
    });



    if (existingSOS) {

  throw new ApiError(409, "An active SOS already exists.");
}

   const sos = await prisma.sOSAlert.create({
  data: {
    latitude,
    longitude,
    userId,

    ...(message !== undefined && {
      message,
    }),
  },
});









// Fetch emergency contacts
const emergencyContacts = await this.getEmergencyContacts(userId);




// Get user's FCM token
const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});


if (user?.fcmToken) {


  try {
    const response = await NotificationService.sendPushNotification(
      user.fcmToken,
      "🚨 SOS Activated",
      "Emergency detected. Help is being notified."
    );


  } catch (error) {
    console.error("Failed to send SOS push notification.");
  }
}

// Send SOS email to all emergency contacts
let emailsAccepted = 0;
let emailsFailed = 0;
let emailsSkipped = 0;

for (const contact of emergencyContacts) {
  if (!contact.email) {
    emailsSkipped++;
    continue;
  }

  try {
    const mailResult = await EmailService.sendSOSAlert(
  contact.email,
  contact.name,
  user?.fullName || "SwaShakti User",
  latitude,
  longitude,
  message
);

if (mailResult.accepted?.length > 0) {
  emailsAccepted++;
} else {
  emailsFailed++;
}
  } catch (error) {
  emailsFailed++;
  console.error(
    "Failed to send an SOS email to an emergency contact.",
    getSafeEmailErrorDetails(error)
  );
}
}

// Broadcast to connected clients
try {
  const io = getIO();



  io.to(`family:${userId}`).emit("sos-created", {
  sos,
  contacts: emergencyContacts,
});
  io.to(`user:${userId}`).emit("sos-success", sos);


} catch (error) {
  console.error("Socket broadcast failed during SOS creation.");
}

return {
  sos,
  emergencyContacts,
  notificationSummary: {
    email: {
      totalContacts: emergencyContacts.length,
      acceptedByProvider: emailsAccepted,
      failed: emailsFailed,
      skipped: emailsSkipped,
    },
  },
};
}

    static async getActive(userId: string) {







    const sos = await prisma.sOSAlert.findFirst({
        where: {
            userId,
            status: SOSStatus.ACTIVE,
        },
    });



    if (!sos) {
        throw new ApiError(404, "Active SOS not found.");
    }

    return sos;
}

    static async updateLocation(
        userId: string,
        sosId: string,
        data: {
            latitude: number;
            longitude: number;
        }
        ) {
        const { latitude, longitude } = data;

        const sos = await prisma.sOSAlert.findFirst({
            where: {
            id: sosId,
            userId,
            status: SOSStatus.ACTIVE,
            },
        });

        if (!sos) {
            throw new ApiError(404, "Active SOS not found.");
        }

        const updatedSOS = await prisma.sOSAlert.update({
    where: {
        id: sosId,
    },
    data: {
        latitude,
        longitude,
    },
});

try {
    const io = getIO();

    io.to(`family:${userId}`).emit("location-update", updatedSOS);
    io.to(`user:${userId}`).emit("location-update", updatedSOS);


} catch (error) {
    console.error("Socket broadcast failed during location update.");
}

return updatedSOS;
    }

    static async updateStatus(
        userId: string,
        sosId: string,
        status: SOSStatus
        ) {
        const sos = await prisma.sOSAlert.findFirst({
            where: {
            id: sosId,
            userId,
            status: SOSStatus.ACTIVE,
            },
        });

        if (!sos) {
            throw new ApiError(404, "Active SOS not found.");
        }

        const updatedSOS = await prisma.sOSAlert.update({
    where: {
        id: sosId,
    },
    data: {
        status,
        resolvedAt: new Date(),
    },
});

try {
    const io = getIO();

    io.to(`family:${userId}`).emit("sos-resolved", updatedSOS);
    io.to(`user:${userId}`).emit("sos-resolved", updatedSOS);


} catch (error) {
    console.error("Socket broadcast failed during SOS resolution.");
}

return updatedSOS;
    }

static async resend(userId: string, sosId: string) {
  const sos = await prisma.sOSAlert.findFirst({
    where: {
      id: sosId,
      userId,
      status: SOSStatus.ACTIVE,
    },
  });

  if (!sos) {
    throw new ApiError(404, "Active SOS not found.");
  }

  const emergencyContacts = await this.getEmergencyContacts(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let emailsAccepted = 0;
  let emailsFailed = 0;
  let emailsSkipped = 0;

  for (const contact of emergencyContacts) {
    if (!contact.email) {
      emailsSkipped++;
      continue;
    }

    try {
      const mailResult = await EmailService.sendSOSAlert(
        contact.email,
        contact.name,
        user?.fullName || "SwaShakti User",
        sos.latitude,
        sos.longitude,
        sos.message ?? undefined
      );

      if (mailResult.accepted?.length > 0) {
        emailsAccepted++;
      } else {
        emailsFailed++;
      }
    } catch (error) {
  emailsFailed++;
  console.error(
    "Failed to resend an SOS email to an emergency contact.",
    getSafeEmailErrorDetails(error)
  );
}
  }

  try {
    const io = getIO();

    io.to(`family:${userId}`).emit("sos-resent", {
      sos,
      contacts: emergencyContacts,
    });

    io.to(`user:${userId}`).emit("sos-resent", {
      sos,
      contacts: emergencyContacts,
    });
  } catch (error) {
    console.error("Socket broadcast failed during SOS resend.");
  }

  return {
    sos,
    emergencyContacts,
    notificationSummary: {
      email: {
        totalContacts: emergencyContacts.length,
        acceptedByProvider: emailsAccepted,
        failed: emailsFailed,
        skipped: emailsSkipped,
      },
    },
    message:
      emailsAccepted > 0
        ? `SOS email accepted by SMTP for ${emailsAccepted} contact(s).`
        : "SOS remains active, but no emergency contact email was accepted by SMTP.",
  };
}


    static async getHistory(userId: string) {
        return prisma.sOSAlert.findMany({
            where: {
            userId,
            },
            orderBy: {
            createdAt: "desc",
            },
        });
    }

}



export default SOSService;