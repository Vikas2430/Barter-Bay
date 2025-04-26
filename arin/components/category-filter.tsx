import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Armchair, Shirt, Book, Dumbbell, Trophy, type LucideIcon } from "lucide-react"

interface CategoryFilterProps {
  category: string
  icon: string
}

export default function CategoryFilter({ category, icon }: CategoryFilterProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case "smartphone":
        return Smartphone
      case "armchair":
        return Armchair
      case "shirt":
        return Shirt
      case "book":
        return Book
      case "dumbbell":
        return Dumbbell
      case "trophy":
        return Trophy
      default:
        return Smartphone
    }
  }

  const Icon = getIcon()

  return (
    <Link href={`/category/${category.toLowerCase()}`}>
      <Card className="hover:border-primary transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Icon className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">{category}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

