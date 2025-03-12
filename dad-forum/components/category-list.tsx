import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CategoryListProps {
  categories: {
    id: string
    name: string
    slug: string
    description?: string | null
  }[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Badge variant="outline" className="hover:bg-secondary">
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

