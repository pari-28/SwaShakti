import { Router } from "express";
import { searchLocationController } from "../controllers/location.controller";

const router = Router();

router.get("/search", searchLocationController);

export default router;