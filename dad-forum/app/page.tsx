import { db } from "@/lib/db"
import PostCard from "@/components/post-card"
import CategoryList from "@/components/category-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const posts = await db.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
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
    take: 10,
  })

  const categories = await db.category.findMany({
    take: 5,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <Link href="/new-post">
            <Button>Create Post</Button>
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
                    name: post.author.name || "Anonymous",
                    image: post.author.image,
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
              <h3 className="text-lg font-medium">No posts yet</h3>
              <p className="text-muted-foreground mt-1">Be the first to create a post!</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Welcome to Dad Forum</h2>
          <p className="text-muted-foreground mb-4">
            A community for dads to connect, share experiences, and support each other.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/register">
              <Button className="w-full">Join the Community</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <CategoryList categories={categories} />
          <Link href="/categories" className="text-sm text-primary hover:underline block mt-4">
            View all categories
          </Link>
        </div>
      </div>
    </div>
  )
}

