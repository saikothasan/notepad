"use client"

import { useState } from "react"
import { NoteForm } from "@/components/note-form"
import { NoteList } from "@/components/note-list"
import { SearchBar } from "@/components/search-bar"
import { useNotes } from "@/lib/use-notes"
import type { Note } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const { notes, addNote, updateNote, deleteNote, isLoading, error } = useNotes()
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === "all" || (activeTab === "public" && note.isPublic) || (activeTab === "private" && !note.isPublic)),
  )

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error: {error}</div>
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Professional Notepad</h1>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
            All Notes
          </TabsTrigger>
          <TabsTrigger value="public" onClick={() => setActiveTab("public")}>
            Public
          </TabsTrigger>
          <TabsTrigger value="private" onClick={() => setActiveTab("private")}>
            Private
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{editingNote ? "Edit Note" : "Create Note"}</h2>
          <NoteForm
            onSubmit={(note) => {
              if (editingNote) {
                updateNote(editingNote.id, note)
                setEditingNote(null)
              } else {
                addNote(note)
              }
            }}
            initialNote={editingNote}
          />
        </div>
        <div>
          <SearchBar onSearch={setSearchTerm} />
          <NoteList notes={filteredNotes} onEdit={setEditingNote} onDelete={deleteNote} isLoading={isLoading} />
        </div>
      </div>
    </main>
  )
}

