"use client"

import { useState, useEffect } from "react"

interface Note {
  id: string
  content: string
  createdAt: number
  updatedAt: number
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const data: Note[] = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, []) //This is the line that was missing a dependency

  const addNote = async (content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
      if (!response.ok) {
        throw new Error("Failed to add note")
      }
      const newNote: Note = await response.json()
      setNotes((prevNotes) => [...prevNotes, newNote])
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const updateNote = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
      if (!response.ok) {
        throw new Error("Failed to update note")
      }
      const updatedNote: Note = await response.json()
      setNotes((prevNotes) => prevNotes.map((note) => (note.id === id ? updatedNote : note)))
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete note")
      }
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  return { notes, addNote, updateNote, deleteNote }
}

