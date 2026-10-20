import { ApiError } from "../errors/ApiError";
import prisma from "../config/prisma";
import { SOSStatus } from "@prisma/client";
import NotificationService from "./notification.service";
import EmailService from "./email.service";
import { getIO } from "../config/socket";

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
    console.log("✅ SOSService.create() called");
    const { latitude, longitude, message } = data;

    // Check if user already has an active SOS
   
    

    const existingSOS = await prisma.sOSAlert.findFirst({
      where: {
        userId,
        status: SOSStatus.ACTIVE,
      },
    });
console.log("Existing SOS:", existingSOS);


    if (existingSOS) {
  console.log("🔥 THROWING 409 - Active SOS exists");
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


console.log("✅ Created SOS:", sos);

const verifySOS = await prisma.sOSAlert.findUnique({
  where: {
    id: sos.id,
  },
});

console.log("✅ Verify SOS:", verifySOS);


// Fetch emergency contacts
const emergencyContacts = await this.getEmergencyContacts(userId);

console.log("Emergency Contacts:", emergencyContacts);


// Get user's FCM token
const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});


if (user?.fcmToken) {
  console.log("Sending notification...");

  try {
    const response = await NotificationService.sendPushNotification(
      user.fcmToken,
      "🚨 SOS Activated",
      "Emergency detected. Help is being notified."
    );

    console.log("FCM Response:", response);
  } catch (error) {
    console.error("FCM Error:", error);
  }
}

// Send SOS email to all emergency contacts
for (const contact of emergencyContacts) {
  if (!contact.email) {
    console.log(
      `⚠️ No email configured for ${contact.name}`
    );
    continue;
  }

  try {
    console.log(
      `📧 Sending SOS email to ${contact.name} (${contact.email})`
    );

    const response = await EmailService.sendSOSAlert(
      contact.email,
      contact.name,
      user?.fullName || "SwaShakti User",
      latitude,
      longitude,
      message
    );

    console.log(
      `✅ SOS email sent to ${contact.email}`,
      response.messageId
    );
  } catch (error) {
    console.error(
      `❌ Failed to send SOS email to ${contact.email}:`,
      error
    );
  }
}

// Broadcast to connected clients
try {
  const io = getIO();

  console.log(
  "EMITTING:",
  JSON.stringify(
    {
      sos,
      contacts: emergencyContacts,
    },
    null,
    2
  )
);

  io.to(`family:${userId}`).emit("sos-created", {
  sos,
  contacts: emergencyContacts,
});
  io.to(`user:${userId}`).emit("sos-success", sos);


} catch (error) {
  console.error("Socket broadcast failed:", error);
}

return {
  sos,
  emergencyContacts,
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

    console.log("📍 Live location broadcasted");
} catch (error) {
    console.error("Socket broadcast failed:", error);
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

    console.log("✅ SOS resolved broadcasted");
} catch (error) {
    console.error("Socket broadcast failed:", error);
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

  // Log emergency contacts
  for (const contact of emergencyContacts) {
    console.log(
  `${contact.isPrimary ? "⭐" : "📱"} Resending alert to ${contact.name} (${contact.phone})`
);
  }

  // Broadcast resend event through Socket.IO
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

    console.log("🚨 SOS alert re-sent via Socket.IO.");
  } catch (error) {
    console.error("Socket broadcast failed:", error);
  }

  return {
    sos,
    emergencyContacts,
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