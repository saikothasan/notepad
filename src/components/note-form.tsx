"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Note } from "@/lib/types"

interface NoteFormProps {
  onSubmit: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void
  initialNote?: Note | null
}

export function NoteForm({ onSubmit, initialNote = null }: NoteFormProps) {
  const [content, setContent] = useState(initialNote?.content || "")
  const [isPublic, setIsPublic] = useState(initialNote?.isPublic || false)
  const [expiresIn, setExpiresIn] = useState(initialNote?.expiresIn || "never")

  useEffect(() => {
    if (initialNote) {
      setContent(initialNote.content)
      setIsPublic(initialNote.isPublic)
      setExpiresIn(initialNote.expiresIn)
    }
  }, [initialNote])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit({ content, isPublic, expiresIn })
      if (!initialNote) {
        setContent("")
        setIsPublic(false)
        setExpiresIn("never")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your note here..."
        className="min-h-[200px]"
      />
      <div className="flex items-center space-x-2">
        <Switch id="public-switch" checked={isPublic} onCheckedChange={setIsPublic} />
        <Label htmlFor="public-switch">Public</Label>
      </div>
      <Select value={expiresIn} onValueChange={setExpiresIn}>
        <SelectTrigger>
          <SelectValue placeholder="Select expiration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="never">Never</SelectItem>
          <SelectItem value="1h">1 hour</SelectItem>
          <SelectItem value="1d">1 day</SelectItem>
          <SelectItem value="1w">1 week</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">{initialNote ? "Update" : "Add"} Note</Button>
    </form>
  )
}

