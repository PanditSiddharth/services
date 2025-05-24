import NextAuth, { Session } from "next-auth";
import auth_config from "./auth_config";
import { userRegisterSchema } from "@/models/zod";
import { createOrUpdateUser, getUser } from "./app/actions/user";
import { log } from "console";
import dbConnect from "./lib/db-connect";
import { AnyAaaaRecord } from "dns";

import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    _id: string
    role: string
  }

  interface Session {
    user: {
      _id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      profileImage?: string
      phone?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string
    role: string
  }
}


// Temporary implementations for missing functions
async function checkExistingUser(email: string): Promise<any> {
  // Simulate checking for an existing user
  return null; // Return null to simulate no existing user
}

function userFilter(user: any): any {
  return user; // Return the user as-is for now
}

function sanitizeMongoObject(obj: any) {
  if (!obj) return obj;
  const cleaned = JSON.parse(JSON.stringify(obj));
  if (cleaned._id) {
    cleaned._id = cleaned._id.toString();
  }
  delete cleaned.__v;
  return cleaned;
}

function getFilteredUser(user: any) {
  if (!user) return null;
  const { name, email, _id, profileImage, role } = user;
  return {name, email, _id, profileImage, role}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }: any) {
      try {
        return true
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, trigger, session, user }) {
      try {
        if (trigger === "signIn") {
          const existingUser = await getUser({
            email: (user as any).email,
            role: (user as any).role,
            populate: false
          });
             

          if (existingUser) {
             console.log("existingUser", existingUser);

            if((user as any)?.password === existingUser.password){
              const sanitizedUser = sanitizeMongoObject(existingUser);
             
              const ret = { 
                ...token, 
                _id: sanitizedUser._id,
                ...sanitizedUser 
              };

            
              return ret;
            } 
            else 
              return token || null
          }
        }

        if (trigger === 'update' && session?.user) {
          const { iat, exp, jti, ...rest } = session.user;
          log("rest", rest);
          const a = await createOrUpdateUser(rest);
          console.log("a", a);
          return { ...token, ...sanitizeMongoObject(rest) };
        }

        return token;
      } catch (error) {
        console.error("JWT error:", error);
        return token;
      }
    },
    // Disable type checking issues here
    async session({ session, token }) {
      if (session?.user) {
        const sanitizedToken = sanitizeMongoObject(token);
        session.user = { 
          ...session.user, 
          _id: sanitizedToken._id,
          ...sanitizedToken 
        };

      }
      return session as Session; // Ensure we always return session
    }
  },
  ...auth_config,
});