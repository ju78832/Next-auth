import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/helper/dbConnect";
import User from "@/models/db";
import bcrypt from "bcryptjs";
import { Account, User as AuthUser } from "next-auth";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const verifyPass = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (verifyPass) {
              return user;
            }
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account.provider == "credentials") {
        return true;
      }
      if (account.provider == "github") {
        await dbConnect();
        try {
          const existUser = await User.findOne({ email: user.email });
          if (!existUser) {
            const newUser = new User({
              email: user.email,
            });
            await newUser.save();
            return true;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
