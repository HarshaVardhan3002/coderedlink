import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createLinkSchema = z.object({
  url: z.string().url("Invalid URL format"),
  code: z
    .string()
    .min(4, "Code must be at least 4 characters")
    .max(8, "Code must be at most 8 characters")
    .regex(/^[A-Za-z0-9]+$/, "Code must be alphanumeric")
    .optional()
    .or(z.literal("")),
})

function generateCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createLinkSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    const { url, code } = parsed.data

    // Check if custom code already exists
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

    // Generate unique code if not provided
    let finalCode = code || ""
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

    // Create the link
    const link = await prisma.link.create({
      data: {
        targetUrl: url,
        code: finalCode,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
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
      take: 50,
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
