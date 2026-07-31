import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { EvidenceService } from "../services/evidence.service";
import prisma from "../config/prisma";

export class EvidenceController {
  static uploadEvidence = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { sosId } = req.body;

      

console.log("Received sosId:", sosId);

const existing = await prisma.sOSAlert.findUnique({
  where: {
    id: sosId,
  },
});

console.log("Existing SOS:", existing);

      console.log("Received sosId:", sosId);


      const mime = file.mimetype;

      let type: "IMAGE" | "VIDEO" | "AUDIO";

      if (mime.startsWith("image")) {
        type = "IMAGE";
      } else if (mime.startsWith("video")) {
        type = "VIDEO";
      } else {
        type = "AUDIO";
      }

      console.log("File object:", req.file);

      const uploaded = await EvidenceService.createEvidence({
        userId: req.userId!,
        sosId,
        type,
        fileName: file.originalname,
        fileUrl: (file as any).path,
        publicId: (file as any).filename,
      });

      return res.status(201).json({
        success: true,
        message: "Evidence uploaded successfully.",
        data: uploaded,
      });
    }
  );

  static getEvidence = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { sosId } = req.params;

      const evidence = await EvidenceService.getEvidenceBySOS(sosId);

      return res.status(200).json({
        success: true,
        data: evidence,
      });
    }
  );
}

export default EvidenceController;