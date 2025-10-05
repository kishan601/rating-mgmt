import { db } from "./server/db";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";

const adminEmail = "admin@example.com";

try {
  const rows = await db.select().from(users).where(eq(users.email, adminEmail));

  if (rows.length) {
    const a = rows[0];
    console.log("Admin found");
    console.log("ID :", a.id);
    console.log("Email :", a.email);
    console.log("Role :", a.role);
    console.log("Hashed password :", a.password);
  } else {
    console.log("No admin found for", adminEmail);
  }
} catch (err) {
  console.error("Error querying DB:", err);
} finally {
  process.exit();
}
