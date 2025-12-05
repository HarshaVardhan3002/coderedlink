import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link || link.deletedAt) {
      return NextResponse.redirect(new URL("/404", req.url))
    }

    // Async update stats (fire and forget)
    prisma.link.update({
      where: { id: link.id },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
        clicks: {
          create: {}
        }
      },
    }).catch(console.error)

    return NextResponse.redirect(link.targetUrl)
  } catch (error) {
    return NextResponse.redirect(new URL("/404", req.url))
  }
}
