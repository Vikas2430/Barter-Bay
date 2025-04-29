import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Armchair, Shirt, Book, Dumbbell, Trophy, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface CategoryFilterProps {
  category: string
  icon: string
}

export default function CategoryFilter({ category, icon }: CategoryFilterProps) {
  const router = useRouter()

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/category/${category.toLowerCase()}`)
  }

  return (
    <Card 
      className="hover:border-primary transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium">{category}</span>
      </CardContent>
    </Card>
  )
}

