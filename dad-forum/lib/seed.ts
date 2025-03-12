import { db } from "@/lib/db"
import { hash } from "bcrypt"

export async function seedDatabase() {
  try {
    // Check if we already have categories
    const categoryCount = await db.category.count()

    if (categoryCount === 0) {
      // Create categories
      const categories = [
        {
          name: "New Dads",
          description: "For first-time fathers navigating the early days of parenthood",
          slug: "new-dads",
        },
        {
          name: "Toddler Years",
          description: "Discussing the challenges and joys of raising toddlers",
          slug: "toddler-years",
        },
        {
          name: "School Age",
          description: "Topics related to school-age children and education",
          slug: "school-age",
        },
        {
          name: "Teenagers",
          description: "Support and advice for dads with teenage children",
          slug: "teenagers",
        },
        {
          name: "Work-Life Balance",
          description: "Balancing career and family responsibilities",
          slug: "work-life-balance",
        },
        {
          name: "Dad Jokes",
          description: "Share your best (or worst) dad jokes",
          slug: "dad-jokes",
        },
        {
          name: "Health & Fitness",
          description: "Staying healthy and fit as a dad",
          slug: "health-fitness",
        },
        {
          name: "General Discussion",
          description: "General topics for dads to discuss",
          slug: "general-discussion",
        },
      ]

      for (const category of categories) {
        await db.category.create({
          data: category,
        })
      }

      console.log("Categories seeded successfully")
    }

    // Check if we already have a demo user
    const userCount = await db.user.count()

    if (userCount === 0) {
      // Create a demo user
      const hashedPassword = await hash("password123", 10)

      await db.user.create({
        data: {
          name: "Demo Dad",
          email: "demo@dadforum.com",
          password: hashedPassword,
        },
      })

      console.log("Demo user seeded successfully")
    }

    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}

