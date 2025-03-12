import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, message: "Seeding is not allowed in production" }, { status: 403 })
  }

  const result = await seedDatabase()

  if (result.success) {
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to seed database", error: result.error },
      { status: 500 },
    )
  }
}

