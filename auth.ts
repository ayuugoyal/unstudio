import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { saltAndHashPassword } from "./lib/helper";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password || !credentials)
          return null;

        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password as string);

        let user: any = await db.user.findUnique({
          where: {
            email,
          },
        });

        console.log(credentials);
        console.log(user);
        if (!user) {
          console.log("Creating user");
          user = await db.user.create({
            data: {
              email: credentials.email as string,
              hashedPassword: hash,
            },
          });
        } else {
          console.log("User exists");
          const check = bcrypt.compareSync(
            credentials.password as string,
            user.hashedPassword
          );
          console.log(check);
          if (!check) {
            throw "Invalid credentials";
          }
        }
        return user;
      },
    }),
  ],
});
