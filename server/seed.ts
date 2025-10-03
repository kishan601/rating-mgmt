import { db } from "./db";
import { users, stores } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Check if admin already exists
  const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@example.com"));
  
  if (existingAdmin.length > 0) {
    console.log("✅ Admin user already exists");
    return;
  }

  // Create initial admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  
  const [admin] = await db.insert(users).values({
    name: "System Administrator Account",
    email: "admin@example.com",
    password: hashedPassword,
    address: "123 Admin Street, City, State 12345",
    role: "admin",
  }).returning();

  console.log("✅ Created admin user:");
  console.log("   Email: admin@example.com");
  console.log("   Password: Admin123!");
  console.log("");
  console.log("🌱 Seed completed successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
