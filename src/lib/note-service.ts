import type { Note } from "./types"
import { NotFoundError } from "./errors"
import { env } from "./env"
import type { KVNamespace } from "https://deno.land/x/cloudflare_workers_types@latest/kv_namespace.d.ts"
import { crypto } from "https://deno.land/std@0.201.0/crypto/mod.ts"

export class NoteService {
  private kv: KVNamespace

  constructor(kv: KVNamespace) {
    this.kv = kv
  }

  async listNotes(): Promise<Note[]> {
    const { keys } = await this.kv.list()
    const notes = await Promise.all(
      keys.map(async (key) => {
        const note = await this.kv.get(key.name)
        return note ? JSON.parse(note) : null
      }),
    )
    return notes.filter(Boolean)
  }

  async getNote(id: string): Promise<Note> {
    const note = await this.kv.get(id)
    if (!note) {
      throw new NotFoundError("Note not found")
    }
    return JSON.parse(note)
  }

  async createNote(content: string): Promise<Note> {
    const id = crypto.randomUUID()
    const note: Note = {
      id,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await this.kv.put(id, JSON.stringify(note))
    return note
  }

  async updateNote(id: string, content: string): Promise<Note> {
    const existingNote = await this.getNote(id)
    const updatedNote: Note = {
      ...existingNote,
      content,
      updatedAt: Date.now(),
    }
    await this.kv.put(id, JSON.stringify(updatedNote))
    return updatedNote
  }

  async deleteNote(id: string): Promise<void> {
    await this.getNote(id) // This will throw if the note doesn't exist
    await this.kv.delete(id)
  }
}

export const noteService = new NoteService(env.NOTES_KV as unknown as KVNamespace)

