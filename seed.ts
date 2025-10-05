import { db } from "./server/db";
import bcrypt from "bcrypt";
import { users } from "./shared/schema";

const email = process.env.SEED_ADMIN_EMAIL!;
const password = process.env.SEED_ADMIN_PASSWORD!;

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert pattern using Drizzle
  await db.insert(users).values({
    id: crypto.randomUUID(),     // if your id column needs it
    name: "Admin",
    email: email,
    password: hashedPassword,
    address: "Headquarters",
    role: "admin",
    createdAt: new Date(),
  }).onConflictDoNothing({ target: users.email }); // avoids duplicate error

  console.log("Admin seeding complete.");
}

seedAdmin().catch(console.error);
