import { getRequestContext } from "@cloudflare/next-on-pages"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

interface Note {
  id: string
  content: string
  createdAt: number
  updatedAt: number
}

// Helper function to generate a response
function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

// List all notes
export async function GET(request: NextRequest) {
  const { env } = getRequestContext()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    // Get a specific note
    const note = await env.NOTES_KV.get(id)
    if (!note) {
      return jsonResponse({ error: "Note not found" }, 404)
    }
    return jsonResponse(JSON.parse(note))
  } else {
    // List all notes
    const { keys } = await env.NOTES_KV.list()
    const notes = await Promise.all(
      keys.map(async (key) => {
        const note = await env.NOTES_KV.get(key.name)
        return note ? JSON.parse(note) : null
      }),
    )
    return jsonResponse(notes.filter(Boolean))
  }
}

// Create a new note
export async function POST(request: NextRequest) {
  const { env } = getRequestContext()
  const { content } = await request.json()

  if (!content) {
    return jsonResponse({ error: "Content is required" }, 400)
  }

  const id = crypto.randomUUID()
  const note: Note = {
    id,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await env.NOTES_KV.put(id, JSON.stringify(note))
  return jsonResponse(note, 201)
}

// Update an existing note
export async function PUT(request: NextRequest) {
  const { env } = getRequestContext()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const { content } = await request.json()

  if (!id || !content) {
    return jsonResponse({ error: "ID and content are required" }, 400)
  }

  const existingNote = await env.NOTES_KV.get(id)
  if (!existingNote) {
    return jsonResponse({ error: "Note not found" }, 404)
  }

  const updatedNote: Note = {
    ...JSON.parse(existingNote),
    content,
    updatedAt: Date.now(),
  }

  await env.NOTES_KV.put(id, JSON.stringify(updatedNote))
  return jsonResponse(updatedNote)
}

// Delete a note
export async function DELETE(request: NextRequest) {
  const { env } = getRequestContext()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return jsonResponse({ error: "ID is required" }, 400)
  }

  const existingNote = await env.NOTES_KV.get(id)
  if (!existingNote) {
    return jsonResponse({ error: "Note not found" }, 404)
  }

  await env.NOTES_KV.delete(id)
  return jsonResponse({ message: "Note deleted successfully" })
}

