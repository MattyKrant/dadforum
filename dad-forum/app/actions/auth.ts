"use server"

import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function registerUser(data: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(data)

  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" }
  }

  const { name, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { success: false, message: "User with this email already exists" }
  }

  // Hash the password
  const hashedPassword = await hash(password, 10)

  // Create the user
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, message: "Failed to create user" }
  }
}

