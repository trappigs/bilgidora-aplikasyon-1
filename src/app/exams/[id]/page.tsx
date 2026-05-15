import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Exam, ExamStudent } from "@/lib/types";
import StudentImport from "@/app/exams/_components/student-import";
import StudentTable from "@/app/exams/_components/student-table";
import { deleteExam } from "@/app/exams/actions";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

export default async function ExamDetailPage({
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
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <nav className="mb-4 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Sınavlar
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-600">
            {dateFmt.format(new Date(e.exam_date))}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {e.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {e.city} / {e.district} — {e.school_name}
          </p>
          <p className="text-sm text-slate-500">{e.school_address}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/exams/${e.id}/edit`}
            className="inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Düzenle
          </Link>
          <Link
            href={`/exams/${e.id}/cards`}
            className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Tüm Belgeleri Yazdır
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteExam(e.id);
            }}
          >
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-md border border-red-200 bg-white px-3 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
            >
              Sınavı Sil
            </button>
          </form>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sözel Saati" value={e.sozel_time?.slice(0, 5) ?? "—"} />
        <Stat
          label="Sözel Süre"
          value={e.sozel_duration_min ? `${e.sozel_duration_min} dk` : "—"}
        />
        <Stat label="Sayısal Saati" value={e.sayisal_time?.slice(0, 5) ?? "—"} />
        <Stat
          label="Sayısal Süre"
          value={e.sayisal_duration_min ? `${e.sayisal_duration_min} dk` : "—"}
        />
      </section>

      <section className="mt-8">
        <StudentImport examId={e.id} hasExisting={list.length > 0} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Öğrenciler ({list.length})
          </h2>
        </div>
        <StudentTable examId={e.id} students={list} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
