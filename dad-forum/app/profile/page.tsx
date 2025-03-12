import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Profile | Dad Forum",
  description: "View and manage your Dad Forum profile",
}

export default async function ProfilePage() {
  const user = await requireAuth()

  const userData = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          category: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
          votes: true,
        },
      },
    },
  })

  if (!userData) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.image || ""} alt={userData.name || ""} />
                  <AvatarFallback className="text-2xl">{userData.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.name || "Anonymous"}</h2>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Member since {formatDistanceToNow(userData.createdAt, { addSuffix: true })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Posts</span>
                  <span className="font-medium">{userData._count.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comments</span>
                  <span className="font-medium">{userData._count.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Votes</span>
                  <span className="font-medium">{userData._count.votes}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your most recent contributions to the community</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.posts.length > 0 ? (
                <div className="space-y-4">
                  {userData.posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        <h3 className="font-medium">{post.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>in {post.category.name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{post._count.comments} comments</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <Link href="/my-posts" className="text-sm text-primary hover:underline">
                      View all your posts →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">You haven't created any posts yet.</p>
                  <Link href="/new-post" className="text-primary hover:underline mt-2 inline-block">
                    Create your first post →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

