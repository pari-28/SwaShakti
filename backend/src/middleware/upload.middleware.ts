import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "swashakti/evidence",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "mp3", "wav"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});