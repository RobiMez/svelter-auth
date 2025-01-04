import { betterAuth } from "better-auth";
import dotenv from "dotenv";

import { db } from "./db";
import { sendEmail } from "$lib/utils/email";

dotenv.config();

export const auth = betterAuth({
  database: db,

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: { user: { email: string; }, url: string; }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${url}">Reset</a></p>
      `,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: <a href="${url}">Verify</a></p>
      `,
      });
    },
  },

  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   }
  // },
});
