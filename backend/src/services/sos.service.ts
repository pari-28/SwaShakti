import { ApiError } from "../errors/ApiError";
import prisma from "../config/prisma";
import { SOSStatus } from "@prisma/client";

class SOSService {
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
        message,
        userId,
      },
    });

    return sos;
  }

    static async getActive(userId: string) {
    
    

    const allAlerts = await prisma.sOSAlert.findMany({
        where: {
            userId,
        },
    });

    

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

        return prisma.sOSAlert.update({
            where: {
            id: sosId,
            },
            data: {
            latitude,
            longitude,
            },
        });
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

        return prisma.sOSAlert.update({
            where: {
            id: sosId,
            },
            data: {
            status,
            resolvedAt: new Date(),
            },
        });
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