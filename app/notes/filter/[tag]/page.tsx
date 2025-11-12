import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

export default async function NotesByTagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params;

  const data = await fetchNotes(
    tag === "all" ? {} : { tag }
  );

  return (
    <NoteList notes={data.notes} />
  );
}
