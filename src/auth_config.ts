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
            }
        }
    },
    providers: [Credentials({
        async authorize(credentials) {
            // console.log("credentials", credentials);
            try {
                // console.log("credentials", credentials);
                if (credentials?.data) {
                    const data = JSON.parse(credentials?.data as string);
                    delete credentials?.data;
                    credentials = {
                        ...credentials, ...data
                    }
                    // console.log("credentials", credentials);
                } else if(credentials?.email) {
                    // console.log("credentials", credentials);
                    credentials = {
                        ...credentials
                    }
                }

                // Replace with actual user validation logic
                return credentials as any; // Return a valid User object
            } catch (error) {
                console.error("Error in authorize:", error);
                return null; // Return null in case of an error
            }
        },
    }), Google, Github]
} satisfies NextAuthConfig;



