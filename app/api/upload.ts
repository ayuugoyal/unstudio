import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, images } = req.body;
    const uploadedImageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "uploads",
      });
      uploadedImageUrls.push(result.secure_url);

      await db.image.create({
        data: {
          url: result.secure_url,
          userId: userId,
        },
      });
    }

    res.status(200).json({ imageUrls: uploadedImageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
}
