"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface NoteFormProps {
  onSubmit: (content: string, isPublic: boolean, expiresIn?: number) => void
  initialContent?: string
  initialIsPublic?: boolean
  initialExpiresIn?: number
}

export function NoteForm({ onSubmit, initialContent = "", initialIsPublic = false, initialExpiresIn }: NoteFormProps) {
  const [content, setContent] = useState(initialContent)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [expiresIn, setExpiresIn] = useState(initialExpiresIn?.toString() || "")

  useEffect(() => {
    setContent(initialContent)
    setIsPublic(initialIsPublic)
    setExpiresIn(initialExpiresIn?.toString() || "")
  }, [initialContent, initialIsPublic, initialExpiresIn])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content, isPublic, expiresIn ? Number.parseInt(expiresIn) : undefined)
      setContent("")
      setIsPublic(false)
      setExpiresIn("")
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
      <div className="flex items-center space-x-2">
        <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
        <label htmlFor="isPublic">Make note public</label>
      </div>
      <Input
        type="number"
        value={expiresIn}
        onChange={(e) => setExpiresIn(e.target.value)}
        placeholder="Expires in (minutes)"
      />
      <Button type="submit">{initialContent ? "Update" : "Add"} Note</Button>
    </form>
  )
}

