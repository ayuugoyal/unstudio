"use server";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const getUserbyEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/dashboard" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (formData: FormData) => {
  const rawFromData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirectTo: "/dashboard",
  };

  console.log("Form submitted");
  console.log(rawFromData);
  const existUser = await getUserbyEmail(rawFromData.email as string);

  console.log(existUser);

  try {
    await signIn("credentials", rawFromData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.log("AuthError");
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath("/");
};

export const getUserData = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  return session;
};
