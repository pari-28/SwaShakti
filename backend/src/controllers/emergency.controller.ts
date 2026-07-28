import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import EmergencyService from "../services/emergency.service";

export const createEmergencyContact = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contact = await EmergencyService.create(req.userId!, req.body);

    res.status(201).json({
  success: true,
  message: "Emergency contact created successfully.",
  data: contact,
});
    } catch (error: any) {
    console.error(error);

    res.status(400).json({
        success: false,
        message: error.message,
    });
}
};

export const getEmergencyContacts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contacts = await EmergencyService.getAll(req.userId!);

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmergencyContact = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contact = await EmergencyService.update(
      req.userId!,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmergencyContact = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await EmergencyService.delete(
      req.userId!,
      req.params.id
    );

    res.json({
  success: true,
  message: "Emergency contact deleted successfully.",
  data: result,
});
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const setPrimaryContact = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contact = await EmergencyService.setPrimary(
      req.userId!,
      req.params.id
    );

    res.json({
      success: true,
      message: "Primary contact updated successfully.",
      data: contact,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};