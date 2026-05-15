-- Bilgi Dora etüt merkezi sınav giriş belgesi üreticisi
-- Tablolar: exams (sınav meta), exam_students (her sınava kayıtlı öğrenciler)

create extension if not exists "pgcrypto";

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  exam_date date not null,
  city text not null,
  district text not null,
  school_name text not null,
  school_address text not null,
  sozel_time time,
  sozel_duration_min integer,
  sayisal_time time,
  sayisal_duration_min integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exam_students (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  tc_kimlik_no text not null check (tc_kimlik_no ~ '^[0-9]{11}$'),
  ad_soyad text not null,
  salon_no integer not null check (salon_no > 0),
  sira_no integer not null check (sira_no > 0),
  created_at timestamptz not null default now(),
  unique (exam_id, salon_no, sira_no)
);

create index exam_students_exam_id_idx on public.exam_students (exam_id);
create index exam_students_exam_salon_sira_idx
  on public.exam_students (exam_id, salon_no, sira_no);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger exams_set_updated_at
before update on public.exams
for each row execute function public.set_updated_at();

-- RLS: tool şu an internal kullanım için (auth yok), bu yüzden anon role'üne
-- tam yetki veriyoruz. Production'a alındığında auth eklenip policy'ler
-- daraltılmalı.
alter table public.exams enable row level security;
alter table public.exam_students enable row level security;

create policy "anon full access exams"
on public.exams for all
to anon, authenticated
using (true) with check (true);

create policy "anon full access exam_students"
on public.exam_students for all
to anon, authenticated
using (true) with check (true);
