import NextAuth, { Session } from "next-auth";
import auth_config from "./auth_config";
import { userRegisterSchema } from "@/models/zod";
import { createOrUpdateUser, getUser } from "./app/actions/user";
import { log } from "console";
import dbConnect from "./lib/db-connect";
import { AnyAaaaRecord } from "dns";

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

type IUser = typeof userRegisterSchema;
declare module 'next-auth' {
  interface Session {
    user: IUser,
    token: IUser
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }: any) {
      try {
        console.log(user);
        if (!user?.email) return false;
        await dbConnect();

        // Remove non-essential fields before checking/creating user
        const userToCreate = { ...user };
        delete userToCreate.csrfToken;
        delete userToCreate.callbackUrl;
        delete userToCreate.confirmPassword;

        const existingUser = await getUser({
          email: user.email,
          role: user.role,
          populate: false
        });

        if (!existingUser && userToCreate.name) {
          await createOrUpdateUser(userToCreate);
          return true;
        }

        return !!existingUser;
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
            if((user as any)?.password === existingUser.password){
              const sanitizedUser = sanitizeMongoObject(existingUser);
              console.log("JWT Callback - sanitized user:", sanitizedUser);
              return { 
                ...token, 
                _id: sanitizedUser._id,
                ...sanitizedUser 
              };
            } 
            else 
              return token || null
          }
        }

        if (trigger === 'update' && session?.user) {
          return { ...token, ...sanitizeMongoObject(session.user) };
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
        console.log("Session Callback - sanitized token:", sanitizedToken);
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