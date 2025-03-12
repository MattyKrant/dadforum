"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const postSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  categoryId: z.string(),
  authorId: z.string(),
})

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedFields = postSchema.safeParse(data)

  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" }
  }

  const { title, content, categoryId, authorId } = validatedFields.data

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        categoryId,
        authorId,
      },
    })

    revalidatePath("/")
    return { success: true, postId: post.id }
  } catch (error) {
    return { success: false, message: "Failed to create post" }
  }
}

const voteSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  value: z.number().min(-1).max(1),
})

export async function votePost(data: z.infer<typeof voteSchema>) {
  const validatedFields = voteSchema.safeParse(data)

  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" }
  }

  const { postId, userId, value } = validatedFields.data

  try {
    // Check if user has already voted on this post
    const existingVote = await db.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking the same button
        await db.vote.delete({
          where: {
            id: existingVote.id,
          },
        })
      } else {
        // Update vote if changing from upvote to downvote or vice versa
        await db.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            value,
          },
        })
      }
    } else {
      // Create new vote
      await db.vote.create({
        data: {
          postId,
          userId,
          value,
        },
      })
    }

    // Get updated vote count
    const votes = await db.vote.findMany({
      where: {
        postId,
      },
    })

    const voteCount = votes.reduce((acc, vote) => acc + vote.value, 0)

    revalidatePath(`/posts/${postId}`)
    return { success: true, voteCount }
  } catch (error) {
    return { success: false, message: "Failed to vote on post" }
  }
}

