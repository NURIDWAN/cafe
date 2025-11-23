import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
  // Remove baseURL to use current origin (supports both localhost and IP)
  plugins: [organizationClient(), polarClient()],
});
