"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "@/app/components/NoteList/NoteList";
import SearchBox from "@/app/components/SearchBox/SearchBox";
import Modal from "@/app/components/Modal/Modal";
import NoteForm from "@/app/components/NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/app/lib/api";
import type { FetchNotesResponse } from "@/app/lib/api";
import dynamic from "next/dynamic";
import css from "./NotesPage.module.css";

// ✅ Динамический импорт Pagination (иначе ошибка document is not defined при билде)
const Pagination = dynamic(
  () => import("@/app/components/Pagination/Pagination"),
  { ssr: false }
);

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const queryKey = ["notes", page, debouncedSearch] as const;

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse,
    readonly [string, number, string]
  >({
    queryKey,
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    placeholderData: keepPreviousData,
    staleTime: 2000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading && !isFetching) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage: number) => setPage(nextPage)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <NoteList
          notes={notes}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
        />
      ) : (
        !isFetching && <p className={css.empty}>Not found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
