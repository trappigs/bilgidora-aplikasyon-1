"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ExamPayload = {
  title: string;
  exam_date: string;
  city: string;
  district: string;
  school_name: string;
  school_address: string;
  sozel_time: string | null;
  sozel_duration_min: number | null;
  sayisal_time: string | null;
  sayisal_duration_min: number | null;
  notes: string | null;
};

function parseTime(value: FormDataEntryValue | null): string | null {
  const v = (value ?? "").toString().trim();
  return v.length > 0 ? v : null;
}

function parseInt0(value: FormDataEntryValue | null): number | null {
  const v = (value ?? "").toString().trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function readExamPayload(formData: FormData): ExamPayload {
  return {
    title: (formData.get("title") ?? "").toString().trim(),
    exam_date: (formData.get("exam_date") ?? "").toString(),
    city: (formData.get("city") ?? "").toString().trim().toLocaleUpperCase("tr-TR"),
    district: (formData.get("district") ?? "").toString().trim().toLocaleUpperCase("tr-TR"),
    school_name: (formData.get("school_name") ?? "").toString().trim().toLocaleUpperCase("tr-TR"),
    school_address: (formData.get("school_address") ?? "").toString().trim(),
    sozel_time: parseTime(formData.get("sozel_time")),
    sozel_duration_min: parseInt0(formData.get("sozel_duration_min")),
    sayisal_time: parseTime(formData.get("sayisal_time")),
    sayisal_duration_min: parseInt0(formData.get("sayisal_duration_min")),
    notes: ((formData.get("notes") ?? "").toString().trim() || null),
  };
}

export async function createExam(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const payload = readExamPayload(formData);

  const { data, error } = await supabase
    .from("exams")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect(`/exams/${data.id}`);
}

export async function updateExam(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const payload = readExamPayload(formData);

  const { error } = await supabase.from("exams").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/exams/${id}`);
  redirect(`/exams/${id}`);
}

export async function deleteExam(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

type StudentRow = {
  tc_kimlik_no: string;
  ad_soyad: string;
  salon_no: number;
  sira_no: number;
};

export async function importStudents(examId: string, rows: StudentRow[]) {
  if (rows.length === 0) return { inserted: 0 };

  const supabase = await createSupabaseServerClient();
  const payload = rows.map((r) => ({ ...r, exam_id: examId }));

  const { error, count } = await supabase
    .from("exam_students")
    .insert(payload, { count: "exact" });

  if (error) throw new Error(error.message);

  revalidatePath(`/exams/${examId}`);
  return { inserted: count ?? rows.length };
}

export async function replaceStudents(examId: string, rows: StudentRow[]) {
  const supabase = await createSupabaseServerClient();

  const { error: delErr } = await supabase
    .from("exam_students")
    .delete()
    .eq("exam_id", examId);
  if (delErr) throw new Error(delErr.message);

  if (rows.length > 0) {
    const payload = rows.map((r) => ({ ...r, exam_id: examId }));
    const { error } = await supabase.from("exam_students").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/exams/${examId}`);
  return { inserted: rows.length };
}

export async function deleteStudent(studentId: string, examId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("exam_students")
    .delete()
    .eq("id", studentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/exams/${examId}`);
}
