// Better Auth: registracija in prijava z e-pošto in geslom (docs/adr/0007)
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      // input: false = polj uporabnik ne more poslati ob registraciji
      vloga: { type: "string", defaultValue: "menedzer", input: false },
      jeBlokiran: { type: "boolean", defaultValue: false, input: false },
    },
  },

  databaseHooks: {
    session: {
      create: {
        // preden se ustvari seja preverimo, ali je uporabnik blokiran
        before: async (seja) => {
          const uporabnik = await prisma.user.findUnique({ where: { id: seja.userId } });
          if (uporabnik?.jeBlokiran) {
            throw new APIError("FORBIDDEN", { message: "Račun je blokiran" });
          }
        },
      },
    },
  },
});
