// correct it
import NextAuth, { Session } from "next-auth";
import auth_config from "./auth_config"; // edit ...
import { userRegisterSchema } from "@/models/zod";
import { createOrUpdateUser, getUser } from "./app/actions/user";
import { log } from "console";
import dbConnect from "./lib/db-connect";

// Temporary implementations for missing functions
async function checkExistingUser(email: string): Promise<any> {
  // Simulate checking for an existing user
  return null; // Return null to simulate no existing user
}

function userFilter(user: any): any {
  return user; // Return the user as-is for now
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
      console.log(user, "User")
      if (!user || !user.email) {
        return false;
      }
      await dbConnect()
      const existingUser = await getUser({
        email: user.email,
        role: user?.role
      });

      if (!existingUser && user.name) {
        delete user?.id;
        delete user?.callbackUrl;
        delete user?.csrfToken;
        delete user?.confirmPassword;
        console.log(user, "User")
        const created = await createOrUpdateUser(user);
        console.log(created, "Created User")
      }

      return true;
    },

    async jwt({ token, trigger, session, user }) {

      if (trigger === "signIn") {
        // console.log(user, "User", token, session);
        const existingUser = await getUser(user as any);

        if (typeof existingUser === "object")
          return { ...token, ...existingUser }
      }
      if (trigger === 'update' && session?.user)
        return { ...token, ...userFilter(session.user) };

      return token;
    },
    // Disable type checking issues here
    async session({ session, token }) {
      if (session?.user)
        session.user = { ...session.user, ...userFilter(token) }
      return session as Session; // Ensure we always return session
    }
  },
  ...auth_config,
});