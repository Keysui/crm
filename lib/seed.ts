import { db } from "./db"
import { hashPassword } from "./auth"

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await hashPassword("password123")

  const { data: existingUser } = await db
    .from("users")
    .select("*")
    .eq("email", "admin@example.com")
    .single()

  if (existingUser) {
    await db
      .from("users")
      .update({
        password: hashedPassword,
        business_name: "Test Business",
        role: "admin",
        email_verified: true,
      })
      .eq("id", existingUser.id)
    console.log("✅ Test user updated!")
    console.log("Email: admin@example.com")
    console.log("Password: password123")
    console.log("User ID:", existingUser.id)
  } else {
    const { data: user, error } = await db
      .from("users")
      .insert({
        email: "admin@example.com",
        password: hashedPassword,
        business_name: "Test Business",
        role: "admin",
        email_verified: true,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log("✅ Test user created!")
    console.log("Email: admin@example.com")
    console.log("Password: password123")
    console.log("User ID:", user.id)
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
