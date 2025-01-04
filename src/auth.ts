import { betterAuth } from "better-auth";
import dotenv from "dotenv";

import { db } from "./db";

dotenv.config();

export const auth = betterAuth({
  database: db,

  emailAndPassword: {
    enabled: true
  },
  
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   }
  // },
});
