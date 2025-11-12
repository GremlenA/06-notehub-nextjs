"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient({ id: initialId }: { id?: string }) {
  const params = useParams();
  const id = initialId ?? (params?.id as string);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    staleTime: 1000 * 60,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
