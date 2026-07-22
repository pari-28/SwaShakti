import type { Request, Response } from "express";
import { getHomeData } from "../services/home.service";

export const getHome = (
  req: Request,
  res: Response
) => {
  const data = getHomeData();

  res.status(200).json(data);
};