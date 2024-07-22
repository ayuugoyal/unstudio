import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/db";
import { uploadImage } from "@/lib/uploadImage";
import { getUserData } from "@/actions/auth";
import { Image, User } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const session: User | null = (await getUserData()) as User | null;
  if (!session) {
    return NextResponse.json({ msg: "unauthorized" }, { status: 401 });
  }
  console.log(session);

  try {
    const formData = await req.formData();
    const vid = formData.get("video") as File | null;

    if (!vid) {
      console.error("No file found in form data");
      return NextResponse.json({ msg: "No file uploaded" }, { status: 400 });
    }

    console.log("Received file:", vid.name);

    const data: any = await uploadImage(vid, "unstudio");

    return NextResponse.json(
      { msg: data },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
};
