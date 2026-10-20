import prisma from "../config/prisma";

export class CommunityReportService {
  static async createReport(data: {
    userId: string;
    category: string;
    description: string;
    location: string;
    locationPrecision?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    district?: string;
    state?: string;
    occurredAt?: Date;
    evidenceUrl?: string;
    evidencePublicId?: string;
    evidenceType?: string;
  }) {
    return prisma.communityReport.create({
      data: {
        userId: data.userId,
        category: data.category,
        description: data.description,
        location: data.location,
        locationPrecision:
          data.locationPrecision ?? "APPROXIMATE",

        ...(data.latitude !== undefined && {
          latitude: data.latitude,
        }),

        ...(data.longitude !== undefined && {
          longitude: data.longitude,
        }),

        ...(data.city !== undefined && {
          city: data.city,
        }),

        ...(data.district !== undefined && {
          district: data.district,
        }),

        ...(data.state !== undefined && {
          state: data.state,
        }),

        ...(data.occurredAt !== undefined && {
          occurredAt: data.occurredAt,
        }),

        ...(data.evidenceUrl !== undefined && {
          evidenceUrl: data.evidenceUrl,
        }),

        ...(data.evidencePublicId !== undefined && {
          evidencePublicId: data.evidencePublicId,
        }),

        ...(data.evidenceType !== undefined && {
          evidenceType: data.evidenceType,
        }),
      },
    });
  }

  static async getReports(userId: string) {
    return prisma.communityReport.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default CommunityReportService;
