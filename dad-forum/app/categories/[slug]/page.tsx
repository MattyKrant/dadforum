import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import PostCard from "@/components/post-card"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      name: true,
    },
  })

  if (!category) {
    return {
      title: "Category Not Found | Dad Forum",
    }
  }

  return {
    title: `${category.name} | Dad Forum`,
    description: `Browse posts in the ${category.name} category on Dad Forum`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      posts: {
        where: {
          published: true,
        },
        include: {
          author: true,
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
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/categories" className="text-sm text-primary hover:underline">
          ← Back to Categories
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
      </div>
      <div className="space-y-4">
        {category.posts.length > 0 ? (
          category.posts.map((post) => (
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
                  name: category.name,
                  slug: category.slug,
                },
                voteCount: post.votes.reduce((acc, vote) => acc + vote.value, 0),
                commentCount: post._count.comments,
              }}
            />
          ))
        ) : (
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-lg font-medium">No posts in this category yet</h3>
            <p className="text-muted-foreground mt-1">Be the first to create a post!</p>
            <Link href="/new-post" className="mt-4 inline-block">
              <Button>Create Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

