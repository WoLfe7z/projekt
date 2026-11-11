// Testni uporabniki za lokalni razvoj. Zagon: pnpm db:seed
import { config } from "dotenv";
config({ path: "../.env" });

import { auth } from "../src/auth";
import { prisma } from "../src/db";

const geslo = "geslo1234";

const uporabniki = [
  { name: "Testni menedžer", email: "menedzer@prvihxi.si", vloga: "menedzer" },
  { name: "Testni urednik", email: "urednik@prvihxi.si", vloga: "urednik" },
  { name: "Testni admin", email: "admin@prvihxi.si", vloga: "admin" },
] as const;

async function main() {
  for (const u of uporabniki) {
    const obstaja = await prisma.user.findUnique({ where: { email: u.email } });

    if (!obstaja)
      await auth.api.signUpEmail({ body: { name: u.name, email: u.email, password: geslo } });

    await prisma.user.update({ where: { email: u.email }, data: { vloga: u.vloga } });
    console.log(`${obstaja ? "obstaja" : "ustvarjen"}: ${u.email} (${u.vloga})`);
  }
}

main()
  .catch((napaka) => {
    console.error(napaka);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
