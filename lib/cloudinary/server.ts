import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() { return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET); }
export function getCloudinarySignature(params: Record<string, string | number>) { if (!isCloudinaryConfigured()) return null; cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET }); return cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET as string); }
