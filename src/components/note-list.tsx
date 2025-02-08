import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Note {
  id: string
  content: string
}

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return <p>No notes yet. Create one to get started!</p>
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardContent className="pt-4">
            <p className="whitespace-pre-wrap">{note.content}</p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => onEdit(note)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => onDelete(note.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

