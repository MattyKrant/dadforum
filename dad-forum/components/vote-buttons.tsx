"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { votePost } from "@/app/actions/post"
import { toast } from "@/components/ui/use-toast"

interface VoteButtonsProps {
  postId: string
  userId: string
  initialVoteCount: number
  initialUserVote: number
}

export function VoteButtons({ postId, userId, initialVoteCount, initialUserVote }: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVote, setUserVote] = useState(initialUserVote)
  const [isLoading, setIsLoading] = useState(false)

  async function handleVote(value: number) {
    setIsLoading(true)

    try {
      const result = await votePost({
        postId,
        userId,
        value,
      })

      if (result.success) {
        setVoteCount(result.voteCount)
        setUserVote(userVote === value ? 0 : value)
      } else {
        toast({
          title: "Something went wrong",
          description: result.message || "Failed to vote on post. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to vote on post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote(1)}
        disabled={isLoading}
        aria-label="Upvote"
        className={userVote === 1 ? "text-primary" : ""}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
      <span className="text-center font-medium">{voteCount}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        aria-label="Downvote"
        className={userVote === -1 ? "text-primary" : ""}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  )
}

