import Image from "next/image";
import type { Exam, ExamStudent } from "@/lib/types";

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

const DEFAULT_NOTE =
  "Öğrenciler sınava gelirken yanlarında bu belgeyle birlikte geçerli kimlik belgesi (T.C. kimlik numaralı nüfus cüzdanı veya T.C. kimlik kartı veya geçerlilik süresi devam eden pasaport, yabancı uyruklu öğrenciler için İçişleri Bakanlığı Göç İdaresi Müdürlüğü tarafından verilen resimli, mühürlü kimlik belgesi), en az iki adet koyu siyah ve yumuşak kurşun kalem, kalemtraş ve leke bırakmayan silgi bulunduracak ancak elektronik iletişim araçları (cep telefonu, hesap makinesi vs) kesinlikle bulundurmayacaklardır.";

function fmtTime(t: string | null): string {
  if (!t) return "";
  return t.slice(0, 5);
}

export default function ExamCard({
  exam,
  student,
}: {
  exam: Exam;
  student: ExamStudent;
}) {
  const hasSozel = !!exam.sozel_time;
  const hasSayisal = !!exam.sayisal_time;
  const note =
    exam.notes && exam.notes.trim().length > 0 ? exam.notes : DEFAULT_NOTE;

  return (
    <article className="print-card mx-auto box-border flex h-[85mm] w-[198mm] flex-col gap-1 border border-slate-300 bg-white p-2 text-[9px] leading-tight text-slate-900">
      {/* Üst başlık satırı */}
      <header className="grid grid-cols-[100px_1fr] items-center gap-2">
        <div className="flex items-center justify-center">
          <Image
            src="/bilgidora-logo.svg"
            alt="Bilgi Dora"
            width={95}
            height={40}
            priority
          />
        </div>
        <div>
          <h1 className="text-center text-[10px] font-semibold leading-tight text-blue-700">
            Sınavla Öğrenci Alacak Ortaöğretim Kurumlarına İlişkin
            <br />
            Merkezi Sınav Giriş Belgesi
          </h1>
          <table className="mt-1 w-full border-collapse border border-slate-700">
            <tbody>
              <tr>
                <td className="w-28 border border-slate-700 bg-slate-100 px-1.5 py-0.5 text-right text-[9px] font-semibold">
                  T.C. Kimlik No
                </td>
                <td className="border border-slate-700 px-1.5 py-0.5 font-mono text-[10px]">
                  {student.tc_kimlik_no}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-700 bg-slate-100 px-1.5 py-0.5 text-right text-[9px] font-semibold">
                  Adı Soyadı
                </td>
                <td className="border border-slate-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                  {student.ad_soyad}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>

      {/* Orta bölüm: tarih kutusu + yer kutusu + onay */}
      <div className="grid flex-1 grid-cols-[95px_1fr_70px] gap-1.5">
        {/* Sol: tarih ve saat */}
        <div className="flex flex-col justify-center rounded-sm border border-slate-700 p-1 text-center">
          <p className="text-[9px] font-semibold text-blue-700">
            Sınav Tarihi ve Saati
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-red-600">
            {dateFmt.format(new Date(exam.exam_date))}
          </p>
          <div className="mt-1.5 space-y-1">
            {hasSozel && (
              <p className="text-[10px] font-semibold text-red-600">
                Sözel: {fmtTime(exam.sozel_time)}
              </p>
            )}
            {hasSayisal && (
              <p className="text-[10px] font-semibold text-red-600">
                Sayısal: {fmtTime(exam.sayisal_time)}
              </p>
            )}
          </div>
        </div>

        {/* Orta: sınava gireceği yer */}
        <div className="flex flex-col justify-between rounded-sm border border-slate-700 px-1 py-0.5">
          <div className="text-center leading-tight">
            <p className="text-[9px] font-semibold text-blue-700">
              Sınava Gireceği Yer
            </p>
            <p className="text-[10px] font-semibold uppercase">
              {exam.city} / {exam.district}
            </p>
            <p className="text-[10px] font-semibold uppercase">
              {exam.school_name}
            </p>
            <p className="text-[8px] text-slate-700">{exam.school_address}</p>
          </div>

          {(hasSozel || hasSayisal) && (
            <div className="space-y-0.5">
              {hasSozel && (
                <SessionRow
                  label="Sözel Alan"
                  salon={student.salon_no}
                  sira={student.sira_no}
                  duration={exam.sozel_duration_min}
                />
              )}
              {hasSayisal && (
                <SessionRow
                  label="Sayısal Alan"
                  salon={student.salon_no}
                  sira={student.sira_no}
                  duration={exam.sayisal_duration_min}
                />
              )}
            </div>
          )}
        </div>

        {/* Sağ: onay */}
        <div className="flex flex-col items-center justify-center rounded-sm border border-slate-700 p-1 text-center">
          <p className="text-[9px] font-semibold">ONAY</p>
          <div className="h-8 w-full" />
          <p className="text-[8px] text-slate-700">Okul Müdürlüğü</p>
          <p className="text-[8px] text-slate-700">İmza · Mühür</p>
        </div>
      </div>

      {/* Alt not */}
      <div className="rounded-sm border border-slate-700 px-1.5 py-0.5 text-[7px] leading-snug text-slate-800">
        <span className="font-semibold">Not: </span>
        {note}
      </div>
    </article>
  );
}

function SessionRow({
  label,
  salon,
  sira,
  duration,
}: {
  label: string;
  salon: number;
  sira: number;
  duration: number | null;
}) {
  return (
    <div className="border border-slate-700">
      <p className="bg-slate-100 text-center text-[9px] font-semibold leading-tight text-blue-700">
        {label}
      </p>
      <div className="grid grid-cols-3 divide-x divide-slate-700 text-center">
        <div className="px-1 py-0.5 text-[9px]">
          <span className="font-semibold">Salon: </span>
          <span className="font-bold">{salon}</span>
        </div>
        <div className="px-1 py-0.5 text-[9px]">
          <span className="font-semibold">Sıra: </span>
          <span className="font-bold">{sira}</span>
        </div>
        <div className="px-1 py-0.5 text-[9px]">
          <span className="font-semibold">Süre: </span>
          <span className="font-bold">{duration ? `${duration} dk` : "—"}</span>
        </div>
      </div>
    </div>
  );
}
