import type { Response } from "express";
import { ApiError } from "../errors/ApiError";
import SOSService from "../services/sos.service";
import type { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

class SOSController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sos = await SOSService.create(req.userId!, req.body);

    return res.status(201).json({
      success: true,
      message: "SOS alert created successfully.",
      data: sos,
    });
  });

  static getActive = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sos = await SOSService.getActive(req.userId!);

    // Extra safety check (optional if service already throws)
    if (!sos) {
      throw new ApiError(404, "Active SOS not found.");
    }

    return res.status(200).json({
      success: true,
      data: sos,
    });
  });

  static updateLocation = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const sos = await SOSService.updateLocation(
        req.userId!,
        req.params.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "SOS location updated successfully.",
        data: sos,
      });
    }
  );

  static updateStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { status } = req.body;

      const sos = await SOSService.updateStatus(
        req.userId!,
        req.params.id,
        status
      );

      return res.status(200).json({
        success: true,
        message: "SOS status updated successfully.",
        data: sos,
      });
    }
  );



static resend = asyncHandler(async (req: AuthRequest, res: Response) => {


  const result = await SOSService.resend(
    req.userId!,
    req.params.id
  );



  return res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
});



  static getHistory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const history = await SOSService.getHistory(req.userId!);

      return res.status(200).json({
        success: true,
        data: history,
      });
    }
  );
}



export default SOSController;