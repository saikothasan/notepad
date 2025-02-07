import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Note } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Copy, Globe, Lock } from "lucide-react"
import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  isLoading: boolean
}

export function NoteList({ notes, onEdit, onDelete, isLoading }: NoteListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return <div className="text-center">Loading notes...</div>
  }

  if (notes.length === 0) {
    return <div className="text-center">No notes found. Create one to get started!</div>
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{note.content.split("\n")[0]}</span>
              {note.isPublic ? (
                <Globe className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-yellow-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="javascript" style={tomorrow} className="text-sm">
              {note.content}
            </SyntaxHighlighter>
            <p className="text-sm text-muted-foreground mt-2">
              Created {formatDistanceToNow(new Date(note.createdAt))} ago
              {note.expiresIn !== "never" && <span> • Expires in {note.expiresIn}</span>}
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <div>
              <Button variant="outline" size="sm" onClick={() => onEdit(note)} className="mr-2">
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
                Delete
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(note.content, note.id)}>
              {copiedId === note.id ? "Copied!" : <Copy className="w-4 h-4" />}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

