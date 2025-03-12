"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createComment } from "@/app/actions/comment"

const formSchema = z.object({
  content: z
    .string()
    .min(3, {
      message: "Comment must be at least 3 characters",
    })
    .max(500, {
      message: "Comment must not exceed 500 characters",
    }),
})

interface CommentFormProps {
  postId: string
  userId: string
  onCommentAdded: () => void
}

export function CommentForm({ postId, userId, onCommentAdded }: CommentFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await createComment({
        content: values.content,
        postId,
        authorId: userId,
      })

      if (result.success) {
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully.",
        })
        form.reset()
        onCommentAdded()
      } else {
        toast({
          title: "Something went wrong",
          description: result.message || "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write your comment here..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

