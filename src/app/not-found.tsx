import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="glass p-12 rounded-2xl text-center space-y-6">
        <h1 className="text-9xl font-bold neon-text">404</h1>
        <p className="text-2xl text-muted-foreground">Link Not Found</p>
        <p className="text-muted-foreground">
          The link you are looking for does not exist or has been deleted.
        </p>
        <Button asChild className="neon-border hover:bg-primary/20">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
