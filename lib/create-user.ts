import "dotenv/config"
import { createClient } from "@supabase/supabase-js"
import { hashPassword } from "./auth"
import * as path from "path"
import * as fs from "fs"

async function main() {
  console.log("Creating user...")
  console.log("Current working directory:", process.cwd())
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), ".env")
  const envExists = fs.existsSync(envPath)
  console.log(".env file exists:", envExists ? "✅ Yes" : "❌ No")
  
  if (envExists) {
    const envContent = fs.readFileSync(envPath, "utf-8")
    const hasSupabaseUrl = envContent.includes("SUPABASE_URL")
    const hasSupabaseKey = envContent.includes("SUPABASE_SERVICE_ROLE_KEY")
    console.log("SUPABASE_URL in .env:", hasSupabaseUrl ? "✅ Yes" : "❌ No")
    console.log("SUPABASE_SERVICE_ROLE_KEY in .env:", hasSupabaseKey ? "✅ Yes" : "❌ No")
    
    // Show actual values from file (for debugging)
    const urlMatch = envContent.match(/^SUPABASE_URL=(.+)$/m)
    const keyMatch = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)
    if (urlMatch) {
      const urlValue = urlMatch[1].trim()
      console.log("  SUPABASE_URL value from file:", urlValue ? `"${urlValue.substring(0, 30)}..."` : "(empty)")
    }
    if (keyMatch) {
      const keyValue = keyMatch[1].trim()
      console.log("  SUPABASE_SERVICE_ROLE_KEY value from file:", keyValue ? `"${keyValue.substring(0, 20)}..." (length: ${keyValue.length})` : "(empty)")
    }
  }
  
  console.log("\nChecking environment variables after dotenv load...")
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // Check for placeholder values
  if (supabaseUrl && (supabaseUrl.includes("your_supabase_url") || supabaseUrl.includes("xxxxx"))) {
    console.error("\n❌ ERROR: SUPABASE_URL contains placeholder value!")
    console.error("Current value:", supabaseUrl)
    console.error("\nPlease replace it with your actual Supabase URL from:")
    console.error("1. Go to https://supabase.com and open your project")
    console.error("2. Navigate to Settings → API")
    console.error("3. Copy the 'Project URL' (looks like: https://xxxxx.supabase.co)")
    console.error("4. Update SUPABASE_URL in your .env file")
    process.exit(1)
  }
  
  if (supabaseKey && (supabaseKey.includes("your_service_role_key") || supabaseKey.includes("your_actual"))) {
    console.error("\n❌ ERROR: SUPABASE_SERVICE_ROLE_KEY contains placeholder value!")
    console.error("\nPlease replace it with your actual service role key from:")
    console.error("1. Go to https://supabase.com and open your project")
    console.error("2. Navigate to Settings → API")
    console.error("3. Copy the 'service_role' key (starts with 'eyJ...')")
    console.error("4. Update SUPABASE_SERVICE_ROLE_KEY in your .env file")
    process.exit(1)
  }
  
  console.log("SUPABASE_URL:", supabaseUrl ? `✅ Set (${supabaseUrl.substring(0, 30)}...)` : "❌ Missing")
  console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✅ Set (hidden)" : "❌ Missing")

  if (!supabaseUrl || !supabaseKey) {
    console.error("\n❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables")
    console.error("\nMake sure your .env file is in the project root and contains:")
    console.error("SUPABASE_URL=https://xxxxx.supabase.co")
    console.error("SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
    console.error("\nNote: Variable names are case-sensitive and should not have spaces around the = sign")
    process.exit(1)
  }

  // Validate URL format
  if (!supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://")) {
    console.error("\n❌ ERROR: SUPABASE_URL must start with http:// or https://")
    console.error("Current value:", supabaseUrl)
    console.error("\nIt should look like: https://xxxxx.supabase.co")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const email = "sales@scalemako.com"
    const password = "Nalasimba2!"
    const hashedPassword = await hashPassword(password)

    console.log("\nChecking if user exists...")
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching user:", fetchError)
      throw fetchError
    }

    if (existingUser) {
      console.log("User exists, updating...")
      // Update existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password: hashedPassword,
          business_name: "ScaleMako",
          role: "admin",
          failed_login_count: 0,
          lock_until: null,
        })
        .eq("id", existingUser.id)

      if (updateError) {
        throw updateError
      }

      console.log("\n✅ User updated!")
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
      console.log(`User ID: ${existingUser.id}`)
    } else {
      console.log("User doesn't exist, creating...")
      // Create new user
      const { data: user, error: insertError } = await supabase
        .from("users")
        .insert({
          email: email,
          password: hashedPassword,
          business_name: "ScaleMako",
          role: "admin",
          failed_login_count: 0,
          lock_until: null,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      console.log("\n✅ User created!")
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
      console.log(`User ID: ${user.id}`)
    }
  } catch (error: any) {
    console.error("\n❌ Error creating user:", error)
    console.error("Error message:", error.message)
    if (error.details) {
      console.error("Error details:", error.details)
    }
    if (error.hint) {
      console.error("Hint:", error.hint)
    }
    process.exit(1)
  }
}

main()
