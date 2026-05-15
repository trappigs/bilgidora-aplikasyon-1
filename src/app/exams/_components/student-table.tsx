"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ExamStudent } from "@/lib/types";
import { deleteStudent } from "@/app/exams/actions";

export default function StudentTable({
  examId,
  students,
}: {
  examId: string;
  students: ExamStudent[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (q === "") return students;
    return students.filter(
      (s) =>
        s.ad_soyad.toLocaleLowerCase("tr-TR").includes(q) ||
        s.tc_kimlik_no.includes(q),
    );
  }, [query, students]);

  function handleDelete(s: ExamStudent) {
    if (!confirm(`${s.ad_soyad} silinsin mi?`)) return;
    startTransition(async () => {
      await deleteStudent(s.id, examId);
      router.refresh();
    });
  }

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Henüz öğrenci eklenmemiş. Üstteki alandan listeyi yapıştırabilirsin.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ada göre veya TC ile ara…"
          className="block w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">TC Kimlik No</th>
              <th className="px-4 py-2 font-medium">Adı Soyadı</th>
              <th className="px-4 py-2 font-medium">Salon</th>
              <th className="px-4 py-2 font-medium">Sıra</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-xs text-slate-700">
                  {s.tc_kimlik_no}
                </td>
                <td className="px-4 py-2 font-medium text-slate-900">
                  {s.ad_soyad}
                </td>
                <td className="px-4 py-2 text-slate-700">{s.salon_no}</td>
                <td className="px-4 py-2 text-slate-700">{s.sira_no}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/exams/${examId}/cards/${s.id}`}
                    className="mr-3 text-xs font-medium text-blue-600 hover:underline"
                  >
                    Belge
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(s)}
                    className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Arama sonucu yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
