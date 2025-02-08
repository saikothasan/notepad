"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface NoteFormProps {
  onSubmit: (content: string) => void
  initialContent?: string
}

export function NoteForm({ onSubmit, initialContent = "" }: NoteFormProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your note here..."
        className="min-h-[100px]"
      />
      <Button type="submit">{initialContent ? "Update" : "Add"} Note</Button>
    </form>
  )
}

