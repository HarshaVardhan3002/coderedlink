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
      include: {
        clicks: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!link || link.deletedAt) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link || link.deletedAt) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    await prisma.link.update({
      where: { code },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ message: "Link deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
