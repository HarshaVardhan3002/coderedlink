import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createLinkSchema } from "@/lib/validations"
import { generateCode } from "@/lib/utils"
import { z } from "zod"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, code } = createLinkSchema.parse(body)

    if (code) {
      const existing = await prisma.link.findUnique({
        where: { code },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Code already in use" },
          { status: 409 }
        )
      }
    }

    let finalCode = code || undefined
    if (!finalCode) {
      let isUnique = false
      while (!isUnique) {
        finalCode = generateCode(6)
        const existing = await prisma.link.findUnique({
          where: { code: finalCode },
        })
        if (!existing) isUnique = true
      }
    }

    const link = await prisma.link.create({
      data: {
        targetUrl: url,
        code: finalCode!,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(links)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
