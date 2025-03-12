import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import PostCard from "@/components/post-card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "My Posts | Dad Forum",
  description: "View and manage your posts on Dad Forum",
}

export default async function MyPostsPage() {
  const user = await requireAuth()

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      category: true,
      votes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link href="/new-post">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                author: {
                  name: user.name || "Anonymous",
                  image: user.image,
                },
                category: {
                  name: post.category.name,
                  slug: post.category.slug,
                },
                voteCount: post.votes.reduce((acc, vote) => acc + vote.value, 0),
                commentCount: post._count.comments,
              }}
            />
          ))
        ) : (
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-lg font-medium">You haven't created any posts yet</h3>
            <p className="text-muted-foreground mt-1">Share your thoughts with the community!</p>
            <Link href="/new-post" className="mt-4 inline-block">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

