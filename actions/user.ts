"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import cloudinary from "@/lib/cloudinary";
import { Image, User } from "@prisma/client";

export const getUserImages = async () => {
  try {
    const session = await auth();

    console.log("Session:", session);

    if (!session) {
      return { message: "Unauthorized", status: 401 };
    }

    const images: Image[] = await db.image.findMany({
      where: { userId: session?.user?.id },
    });

    return images;
  } catch (error: any) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

// export const getUserDetails: User = async () => {
//   try {
//     const session = await auth();
//     let data: User | null = null;
//     if (!session) {
//       return null;
//     }
//     if (session?.user?.email) {
//       data = await db.user.findUnique({
//         where: {
//           email: session?.user?.email,
//         },
//       });
//     }
//     return data;
//   } catch (error: any) {
//     console.error(error);
//     return {
//       error: error.message,
//     };
//   }
// };
