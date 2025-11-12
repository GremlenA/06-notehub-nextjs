import { fetchNoteById } from "../..//app/lib/api";
import css from "./NotePreview.module.css";

export default async function NotePreview({ id }: { id: string }) {
  const note = await fetchNoteById(id);

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>{note.title}</h2>
      <span className={css.tag}>{note.tag}</span>
      <p className={css.content}>{note.content}</p>
    </div>
  );
}
