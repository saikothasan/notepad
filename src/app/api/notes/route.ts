import { getRequestContext } from "@cloudflare/next-on-pages"
import { type NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { noteService } from "@/lib/note-service"
import { ApiError, BadRequestError } from "@/lib/errors"
import { noteSchema, idSchema } from "@/lib/validation"
import type { ApiResponse } from "@/lib/types"

export const runtime = "edge"

/**
 * Helper function to generate a consistent API response
 */
function apiResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

/**
 * Helper function to handle errors and generate error responses
 */
function handleError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error(error)

  if (error instanceof ZodError) {
    return NextResponse.json({ success: false, error: "Validation error", data: error.errors }, { status: 400 })
  }

  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode })
  }

  return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
}

/**
 * Rate limiting middleware
 */
async function rateLimit(request: NextRequest): Promise<void> {
  const { env } = getRequestContext()
  const ip = request.ip ?? "127.0.0.1"
  const key = `rate_limit:${ip}`
  const limit = env.RATE_LIMIT_REQUESTS
  const duration = env.RATE_LIMIT_DURATION

  const current = await env.NOTES_KV.get(key)
  const count = current ? Number.parseInt(current, 10) : 0

  if (count >= limit) {
    throw new ApiError(429, "Too many requests")
  }

  await env.NOTES_KV.put(key, (count + 1).toString(), { expirationTtl: duration })
}

/**
 * GET /api/notes
 * GET /api/notes?id=:id
 *
 * Retrieve all notes or a specific note
 */
export async function GET(request: NextRequest) {
  try {
    await rateLimit(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const validatedId = idSchema.parse(id)
      const note = await noteService.getNote(validatedId)
      return apiResponse(note)
    } else {
      const notes = await noteService.listNotes()
      return apiResponse(notes)
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * POST /api/notes
 *
 * Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    await rateLimit(request)

    const body = await request.json()
    const { content } = noteSchema.parse(body)
    const note = await noteService.createNote(content)
    return apiResponse(note, 201)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * PUT /api/notes?id=:id
 *
 * Update an existing note
 */
export async function PUT(request: NextRequest) {
  try {
    await rateLimit(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      throw new BadRequestError("ID is required")
    }

    const validatedId = idSchema.parse(id)
    const body = await request.json()
    const { content } = noteSchema.parse(body)

    const updatedNote = await noteService.updateNote(validatedId, content)
    return apiResponse(updatedNote)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * DELETE /api/notes?id=:id
 *
 * Delete a note
 */
export async function DELETE(request: NextRequest) {
  try {
    await rateLimit(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      throw new BadRequestError("ID is required")
    }

    const validatedId = idSchema.parse(id)
    await noteService.deleteNote(validatedId)
    return apiResponse({ message: "Note deleted successfully" })
  } catch (error) {
    return handleError(error)
  }
}

