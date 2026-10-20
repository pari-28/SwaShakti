import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAreaRiskAnalysisData,
} from "../services/risk/communityRiskService.js";
import {
  generateRiskAnalysis,
} from "../services/ai/aiRiskAnalysis.service.js";
import {
  generateSafetyAssistantResponse,
} from "../services/ai/aiSafetyAssistant.service";

export const safetyAssistantController =
  asyncHandler(async (req, res) => {
    const { message, riskData } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    try {
      const reply =
        await generateSafetyAssistantResponse({
          message: message.trim(),
          riskData: riskData ?? null,
        });

      return res.status(200).json({
        success: true,
        data: {
          reply,
        },
      });
    } catch (error) {
      console.error(
        "Safety Assistant controller error:",
        error
      );

      return res.status(503).json({
        success: false,
        message:
          "AI Safety Assistant is temporarily unavailable. Please try again later.",
      });
    }
  });

export const generateAreaRiskAnalysisController =
  asyncHandler(async (req, res) => {
    const riskData = req.body;

    if (!riskData?.location) {
      return res.status(400).json({
        success: false,
        message: "Risk data is required",
      });
    }

    const analysis = await generateRiskAnalysis(
      riskData
    );

    return res.status(200).json({
      success: true,
      data: {
        ...riskData,
        analysis,
      },
    });
  });