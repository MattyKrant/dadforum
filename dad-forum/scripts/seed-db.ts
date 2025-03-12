import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if we already have categories
    const categoryCount = await prisma.category.count()

    if (categoryCount === 0) {
      console.log("Seeding categories...")

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
        await prisma.category.create({
          data: category,
        })
      }

      console.log("✅ Categories seeded successfully")
    } else {
      console.log("Categories already exist, skipping seed")
    }

    // Check if we already have a demo user
    const userCount = await prisma.user.count()

    if (userCount === 0) {
      console.log("Seeding demo user...")

      // Create a demo user
      const hashedPassword = await hash("password123", 10)

      await prisma.user.create({
        data: {
          name: "Demo Dad",
          email: "demo@dadforum.com",
          password: hashedPassword,
        },
      })

      console.log("✅ Demo user seeded successfully")
    } else {
      console.log("Users already exist, skipping seed")
    }

    // Create some sample posts if none exist
    const postCount = await prisma.post.count()

    if (postCount === 0) {
      console.log("Seeding sample posts...")

      // Get the demo user
      const demoUser = await prisma.user.findFirst({
        where: {
          email: "demo@dadforum.com",
        },
      })

      // Get categories
      const categories = await prisma.category.findMany()

      if (demoUser && categories.length > 0) {
        const samplePosts = [
          {
            title: "Introduction: New Dad Here!",
            content:
              "Hi everyone! I'm a new dad to a beautiful 2-month-old daughter. Looking forward to connecting with other dads and learning from your experiences. What advice do you wish someone had given you when you first became a dad?",
            categoryId: categories.find((c) => c.slug === "new-dads")?.id || categories[0].id,
            authorId: demoUser.id,
          },
          {
            title: "Balancing Work and Family Time",
            content:
              "I've been struggling to balance my work commitments with family time. My job demands long hours, but I don't want to miss important moments with my kids. How do you all manage this balance? Any practical tips would be appreciated!",
            categoryId: categories.find((c) => c.slug === "work-life-balance")?.id || categories[0].id,
            authorId: demoUser.id,
          },
          {
            title: "Best Dad Joke of the Week",
            content:
              "Why don't scientists trust atoms? Because they make up everything! 😂\n\nShare your best (or worst) dad jokes below!",
            categoryId: categories.find((c) => c.slug === "dad-jokes")?.id || categories[0].id,
            authorId: demoUser.id,
          },
        ]

        for (const post of samplePosts) {
          await prisma.post.create({
            data: post,
          })
        }

        console.log("✅ Sample posts seeded successfully")
      }
    } else {
      console.log("Posts already exist, skipping seed")
    }

    console.log("🌱 Seeding completed successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

