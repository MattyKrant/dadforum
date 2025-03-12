import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ This script cannot be run in production")
    process.exit(1)
  }

  try {
    console.log("🗑️ Resetting database...")

    // Delete all records from tables in the correct order to respect foreign key constraints
    await prisma.comment.deleteMany({})
    await prisma.vote.deleteMany({})
    await prisma.post.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.verificationToken.deleteMany({})

    console.log("✅ Database reset successfully")
  } catch (error) {
    console.error("Error resetting database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

