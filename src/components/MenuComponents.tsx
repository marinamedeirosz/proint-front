import { Link } from '@tanstack/react-router'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card'

export function CustomLinkCard({
  icon,
  title,
  desc,
  to,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  to: string
}) {
  return (
    <Link to={to}>
      <Card className="h-44 bg-neutral-50/70 backdrop-blur-sm border-slate-300/70 m-4 gap-2 hover:bg-white/90 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
        <CardHeader className="flex flex-col justify-center items-center gap-4">
          <CardContent>{icon}</CardContent>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-slate-700">
            {desc}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
