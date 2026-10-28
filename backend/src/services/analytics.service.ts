import prisma from "../config/prisma";

export class AnalyticsService {
  static async getCommunityReportsLast7Days() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const reports = await prisma.communityReport.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const dailyCounts = new Map<string, number>();

    for (let offset = 0; offset < 7; offset++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + offset);

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      dailyCounts.set(key, 0);
    }

    for (const report of reports) {
      const date = new Date(report.createdAt);
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (dailyCounts.has(key)) {
        dailyCounts.set(key, dailyCounts.get(key)! + 1);
      }
    }

    return Array.from(dailyCounts, ([date, count]) => ({
      date,
      count,
    }));
  }
}

export default AnalyticsService;
