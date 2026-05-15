import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";
import ExamForm from "@/app/exams/_components/exam-form";
import { updateExam } from "@/app/exams/actions";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const exam = data as Exam;

  const action = updateExam.bind(null, id);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <nav className="mb-4 text-sm">
        <Link
          href={`/exams/${id}`}
          className="text-blue-600 hover:underline"
        >
          ← Sınav detayına dön
        </Link>
      </nav>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">
        Sınavı Düzenle
      </h1>
      <ExamForm action={action} submitLabel="Kaydet" exam={exam} />
    </main>
  );
}
