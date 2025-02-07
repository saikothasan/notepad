"use client"

import { useState, useEffect } from "react"
import type { Note } from "./types"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/notes")
      if (!response.ok) {
        throw new Error("Failed to fetch notes")
      }
      const data = await response.json()
      setNotes(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      })
      if (!response.ok) {
        throw new Error("Failed to add note")
      }
      const data = await response.json()
      setNotes((prevNotes) => [...prevNotes, data.data])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updateNote = async (id: string, note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      })
      if (!response.ok) {
        throw new Error("Failed to update note")
      }
      const data = await response.json()
      setNotes((prevNotes) => prevNotes.map((n) => (n.id === id ? data.data : n)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return { notes, addNote, updateNote, deleteNote, isLoading, error }
}

