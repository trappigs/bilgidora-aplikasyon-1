import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Exam, ExamStudent } from "@/lib/types";
import ExamCard from "@/app/exams/_components/exam-card";
import PrintButton from "@/app/exams/_components/print-button";

export const dynamic = "force-dynamic";

export default async function SingleCardPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string }>;
}) {
  const { id, studentId } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: exam }, { data: student }] = await Promise.all([
    supabase.from("exams").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("exam_students")
      .select("*")
      .eq("id", studentId)
      .eq("exam_id", id)
      .maybeSingle(),
  ]);

  if (!exam || !student) notFound();

  return (
    <main className="bg-slate-100">
      <div className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-[198mm] max-w-full items-center justify-between px-2 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Tek Belge
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {(student as ExamStudent).ad_soyad}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/exams/${id}`}
              className="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Geri
            </Link>
            <PrintButton />
          </div>
        </div>
      </div>

      <div className="py-6">
        <ExamCard exam={exam as Exam} student={student as ExamStudent} />
      </div>
    </main>
  );
}
