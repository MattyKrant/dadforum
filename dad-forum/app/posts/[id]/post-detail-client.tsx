"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { VoteButtons } from "@/components/vote-buttons"
import { CommentForm } from "@/components/comment-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

interface PostDetailClientProps {
  post: {
    id: string
    title: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
    }
    category: {
      name: string
      slug: string
    }
  }
  initialComments: Comment[]
  initialVoteCount: number
  initialUserVote: number
  currentUser: {
    id: string
    name?: string | null
  } | null
}

export default function PostDetailClient({
  post,
  initialComments,
  initialVoteCount,
  initialUserVote,
  currentUser,
}: PostDetailClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const router = useRouter()

  const handleCommentAdded = () => {
    router.refresh()
  }

  return (
    <div className="flex gap-4">
      {currentUser && (
        <div className="flex flex-col items-center">
          <VoteButtons
            postId={post.id}
            initialVoteCount={initialVoteCount}
            initialUserVote={initialUserVote}
            userId={currentUser.id}
          />
        </div>
      )}
      <div className="flex-1 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Link href={`/categories/${post.category.slug}`}>
              <Badge variant="secondary">{post.category.name}</Badge>
            </Link>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </div>
          </div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center mt-4 space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.image || ""} alt={post.author.name || ""} />
              <AvatarFallback>{post.author.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name || "Anonymous"}</p>
            </div>
          </div>
        </div>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p>{post.content}</p>
        </div>
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.author.image || ""} alt={comment.author.name || ""} />
                      <AvatarFallback>{comment.author.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{comment.author.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
          {currentUser ? (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Add a Comment</h3>
              <CommentForm postId={post.id} userId={currentUser.id} onCommentAdded={handleCommentAdded} />
            </div>
          ) : (
            <div className="mt-6 text-center p-4 border rounded-lg">
              <p className="text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to leave a comment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

