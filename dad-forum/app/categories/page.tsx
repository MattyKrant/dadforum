import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Categories | Dad Forum",
  description: "Browse all categories on Dad Forum",
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="h-full hover:bg-secondary/50 transition-colors">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>
                  {category._count.posts} {category._count.posts === 1 ? "post" : "posts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description || "No description available"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

