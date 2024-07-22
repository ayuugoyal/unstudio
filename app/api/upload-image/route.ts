import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
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
  const formData = await req.formData();
  const image = formData.get("image") as unknown as File;
  console.log(image);

  const data: any = await uploadImage(image, "unstudio");

  const adding: Image = await db.image.create({
    data: {
      url: data?.secure_url,
      public_id: data?.public_id,
      userId: session.id,
    },
  });

  return NextResponse.json(
    { msg: adding },
    {
      status: 200,
    }
  );
};
