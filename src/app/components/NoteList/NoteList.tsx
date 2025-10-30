"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/app/types/note";
import { deleteNote } from "@/app/lib/api";
import css from "./NoteList.module.css";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
}

export default function NoteList({ notes, deletingId, setDeletingId }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  if (!notes.length) return <p>No notes found</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <div className={css.footer}>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>

            <button
              className={css.button}
              disabled={deletingId === note.id || deleteMutation.isPending}
              onClick={() => {
                if (confirm("Delete this note?")) deleteMutation.mutate(note.id);
              }}
            >
              {deletingId === note.id || deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
