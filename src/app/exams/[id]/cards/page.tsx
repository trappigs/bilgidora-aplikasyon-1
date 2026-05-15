import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Exam, ExamStudent } from "@/lib/types";
import ExamCard from "@/app/exams/_components/exam-card";
import PrintButton from "@/app/exams/_components/print-button";

export const dynamic = "force-dynamic";

export default async function CardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: exam }, { data: students }] = await Promise.all([
    supabase.from("exams").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("exam_students")
      .select("*")
      .eq("exam_id", id)
      .order("salon_no", { ascending: true })
      .order("sira_no", { ascending: true }),
  ]);

  if (!exam) notFound();
  const e = exam as Exam;
  const list = (students ?? []) as ExamStudent[];

  return (
    <main className="bg-slate-100">
      <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-[198mm] max-w-full items-center justify-between px-2 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Yazdırma Önizleme
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {e.title} — {list.length} öğrenci
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/exams/${e.id}`}
              className="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Geri
            </Link>
            <PrintButton />
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mx-auto max-w-xl p-10 text-center text-sm text-slate-500">
          Bu sınava ait öğrenci yok. Önce öğrenci listesini ekle.
        </p>
      ) : (
        <div className="print-stack space-y-3 py-6">
          {list.map((s) => (
            <ExamCard key={s.id} exam={e} student={s} />
          ))}
        </div>
      )}
    </main>
  );
}
