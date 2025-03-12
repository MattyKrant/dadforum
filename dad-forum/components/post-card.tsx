import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    createdAt: Date
    author: {
      name: string
      image?: string | null
    }
    category: {
      name: string
      slug: string
    }
    voteCount: number
    commentCount: number
  }
}

export default function PostCard({ post }: PostCardProps) {
  const contentPreview = post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              <CardTitle>{post.title}</CardTitle>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={post.author.image || ""} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              <span>•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </time>
            </div>
          </div>
          <Link href={`/categories/${post.category.slug}`}>
            <Badge variant="secondary">{post.category.name}</Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{contentPreview}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.voteCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="text-sm text-primary hover:underline">
          Read more
        </Link>
      </CardFooter>
    </Card>
  )
}

