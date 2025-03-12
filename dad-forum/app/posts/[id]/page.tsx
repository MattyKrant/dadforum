import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"
import PostDetailClient from "./post-detail-client"

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await db.post.findUnique({
    where: {
      id: params.id,
    },
    select: {
      title: true,
    },
  })

  if (!post) {
    return {
      title: "Post Not Found | Dad Forum",
    }
  }

  return {
    title: `${post.title} | Dad Forum`,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const user = await getCurrentUser()

  const post = await db.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: true,
      category: true,
      votes: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const voteCount = post.votes.reduce((acc, vote) => acc + vote.value, 0)
  const userVote = user ? post.votes.find((vote) => vote.userId === user.id)?.value || 0 : 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
      <PostDetailClient
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          author: {
            id: post.author.id,
            name: post.author.name,
            image: post.author.image,
          },
          category: {
            name: post.category.name,
            slug: post.category.slug,
          },
        }}
        initialComments={post.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            name: comment.author.name,
            image: comment.author.image,
          },
        }))}
        initialVoteCount={voteCount}
        initialUserVote={userVote}
        currentUser={user ? { id: user.id, name: user.name } : null}
      />
    </div>
  )
}

