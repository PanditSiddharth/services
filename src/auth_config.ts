import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
export default {
    cookies:
    {
        sessionToken: {
            name: "user",
            options: {
                sameSite: "lax",
                path: "/",
                secure: true,
                domain: process.env.NODE_ENV === "production" ? ".ignoux.in" : undefined,
            }
        }
    },
    providers: [Credentials({
        async authorize(credentials) {
            try {
               const data = JSON.parse(credentials?.data as string);
               delete credentials?.data;
               credentials = {
                ...credentials, ...data
               }
               console.log(credentials, "Credentials")
                // Replace with actual user validation logic
                return credentials as any; // Return a valid User object
            } catch (error) {
                console.error("Error in authorize:", error);
                return null; // Return null in case of an error
            }
        },
    }), Google, Github]
} satisfies NextAuthConfig;



