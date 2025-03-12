import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { NewPostForm } from "@/components/new-post-form"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"

export const metadata: Metadata = {
  title: "Create New Post | Dad Forum",
  description: "Create a new post on Dad Forum",
}

export default async function NewPostPage() {
  // Check if user is authenticated
  const user = await requireAuth()

  // Get categories for the form
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  if (categories.length === 0) {
    // If no categories exist, redirect to home
    redirect("/")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <NewPostForm categories={categories} userId={user.id} />
    </div>
  )
}

