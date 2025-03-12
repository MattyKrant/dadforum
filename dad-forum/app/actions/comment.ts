"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const commentSchema = z.object({
  content: z.string().min(3).max(500),
  postId: z.string(),
  authorId: z.string(),
})

export async function createComment(data: z.infer<typeof commentSchema>) {
  const validatedFields = commentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" }
  }

  const { content, postId, authorId } = validatedFields.data

  try {
    const comment = await db.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    })

    revalidatePath(`/posts/${postId}`)
    return { success: true, commentId: comment.id }
  } catch (error) {
    return { success: false, message: "Failed to create comment" }
  }
}

