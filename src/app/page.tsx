import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*")
    .order("exam_date", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/bilgidora-logo.png"
            alt="Bilgi Dora Kurs Merkezi"
            width={160}
            height={38}
            priority
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Sınav Giriş Belgesi Üreticisi
            </h1>
            <p className="text-sm text-slate-500">
              Etüt merkezi sınavları için öğrenci listelerini yönetip giriş
              belgesi üret.
            </p>
          </div>
        </div>
        <Link
          href="/exams/new"
          className="inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          + Yeni Sınav
        </Link>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Sınavlar
        </h2>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Sınavlar yüklenemedi: {error.message}
          </p>
        ) : !exams || exams.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-500">Henüz sınav kaydedilmemiş.</p>
            <Link
              href="/exams/new"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              İlk sınavı oluştur →
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(exams as Exam[]).map((exam) => (
              <li key={exam.id}>
                <Link
                  href={`/exams/${exam.id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow"
                >
                  <p className="text-xs uppercase tracking-wide text-blue-600">
                    {dateFmt.format(new Date(exam.exam_date))}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {exam.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {exam.city} / {exam.district} — {exam.school_name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
