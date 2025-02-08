"use client"

import { useState } from "react"
import { NoteForm } from "@/components/note-form"
import { NoteList } from "@/components/note-list"
import { useNotes } from "@/lib/use-notes"
import type { Note } from "@/lib/types"

export default function Home() {
  const { notes, addNote, updateNote, deleteNote } = useNotes()
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleSubmit = (content: string, isPublic: boolean, expiresIn?: number) => {
    if (editingNote) {
      updateNote(editingNote.id, content, isPublic, expiresIn)
      setEditingNote(null)
    } else {
      addNote(content, isPublic, expiresIn)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notepad App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">{editingNote ? "Edit Note" : "Create Note"}</h2>
          <NoteForm
            onSubmit={handleSubmit}
            initialContent={editingNote?.content}
            initialIsPublic={editingNote?.isPublic}
            initialExpiresIn={editingNote?.expiresIn}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <NoteList notes={notes} onEdit={setEditingNote} onDelete={deleteNote} />
        </div>
      </div>
    </main>
  )
}

