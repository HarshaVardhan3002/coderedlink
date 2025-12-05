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

    // Extract IP and user agent for analytics
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"
    const referer = req.headers.get("referer") || null

    // Update stats and create click record with IP tracking
    prisma.link.update({
      where: { id: link.id },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
        clicks: {
          create: {
            ipAddress,
            userAgent,
            referer,
          }
        }
      },
    }).catch(console.error)

    return NextResponse.redirect(link.targetUrl)
  } catch (error) {
    return NextResponse.redirect(new URL("/404", req.url))
  }
}
