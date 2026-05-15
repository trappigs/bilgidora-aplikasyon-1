import Link from "next/link";
import { createExam } from "@/app/exams/actions";
import ExamForm from "@/app/exams/_components/exam-form";

export default function NewExamPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <nav className="mb-4 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Sınavlar
        </Link>
      </nav>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">
        Yeni Sınav
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Sınav bilgilerini gir; sonraki adımda öğrenci listesini ekleyebileceksin.
      </p>

      <ExamForm action={createExam} submitLabel="Sınavı Oluştur" />
    </main>
  );
}
