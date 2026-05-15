"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importStudents, replaceStudents } from "@/app/exams/actions";

type ParsedRow = {
  tc_kimlik_no: string;
  ad_soyad: string;
  salon_no: number;
  sira_no: number;
};

type ParseError = {
  line: number;
  raw: string;
  reason: string;
};

type ParseResult = {
  rows: ParsedRow[];
  errors: ParseError[];
};

function turkishUpper(s: string) {
  return s.toLocaleUpperCase("tr-TR");
}

function parseClipboard(
  text: string,
  defaults: { salon: number; startSira: number },
): ParseResult {
  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];
  const lines = text.split(/\r?\n/);

  let runningSira = defaults.startSira;
  let lineNo = 0;

  for (const raw of lines) {
    lineNo += 1;
    const trimmed = raw.trim();
    if (trimmed === "") continue;

    // Tab veya çoklu boşluk veya noktalı virgül ile böl. Önce tab dene.
    let cells: string[];
    if (trimmed.includes("\t")) {
      cells = trimmed.split("\t").map((c) => c.trim());
    } else if (trimmed.includes(";")) {
      cells = trimmed.split(";").map((c) => c.trim());
    } else {
      // İlk 11 karakter TC ise onu ayır, gerisi isim
      const m = trimmed.match(/^(\d{11})\s+(.+)$/);
      if (m) {
        cells = [m[1], m[2]];
      } else {
        cells = [trimmed];
      }
    }

    // Başlık satırlarını atla
    const firstLower = (cells[0] ?? "").toLocaleLowerCase("tr-TR");
    if (
      firstLower.startsWith("t.c") ||
      firstLower === "tc" ||
      firstLower === "tc kimlik no" ||
      firstLower.startsWith("kimlik")
    ) {
      continue;
    }

    const tc = (cells[0] ?? "").replace(/\D/g, "");
    const ad = (cells[1] ?? "").trim();
    const salon = cells[2] ? Number(cells[2]) : defaults.salon;
    const sira = cells[3] ? Number(cells[3]) : runningSira++;

    if (!/^\d{11}$/.test(tc)) {
      errors.push({ line: lineNo, raw, reason: "TC kimlik 11 hane değil" });
      continue;
    }
    if (ad.length < 2) {
      errors.push({ line: lineNo, raw, reason: "Ad/soyad boş" });
      continue;
    }
    if (!Number.isFinite(salon) || salon <= 0) {
      errors.push({ line: lineNo, raw, reason: "Salon numarası geçersiz" });
      continue;
    }
    if (!Number.isFinite(sira) || sira <= 0) {
      errors.push({ line: lineNo, raw, reason: "Sıra numarası geçersiz" });
      continue;
    }

    rows.push({
      tc_kimlik_no: tc,
      ad_soyad: turkishUpper(ad),
      salon_no: salon,
      sira_no: sira,
    });
  }

  return { rows, errors };
}

export default function StudentImport({
  examId,
  hasExisting,
}: {
  examId: string;
  hasExisting: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [salon, setSalon] = useState(1);
  const [startSira, setStartSira] = useState(1);
  const [mode, setMode] = useState<"append" | "replace">(
    hasExisting ? "replace" : "append",
  );
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const preview = parseClipboard(text, { salon, startSira });

  function handleSubmit() {
    if (preview.rows.length === 0) {
      setStatus("İçe aktarılacak geçerli satır yok.");
      return;
    }
    if (mode === "replace" && hasExisting) {
      if (
        !confirm(
          `Mevcut tüm öğrenciler silinip ${preview.rows.length} yeni kayıt yazılacak. Devam edilsin mi?`,
        )
      ) {
        return;
      }
    }
    startTransition(async () => {
      try {
        const fn = mode === "replace" ? replaceStudents : importStudents;
        const res = await fn(examId, preview.rows);
        setStatus(`${res.inserted} öğrenci kaydedildi.`);
        setText("");
        router.refresh();
      } catch (err) {
        setStatus(
          "Hata: " + (err instanceof Error ? err.message : String(err)),
        );
      }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        Öğrenci Listesi Yapıştır
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Excel/Sheets&apos;ten kopyaladığın hücreleri aşağıya yapıştır.
        Sütun sırası: <strong>TC Kimlik No · Adı Soyadı · Salon · Sıra</strong>.
        Salon ve Sıra sütunları yoksa varsayılan değerlerden başlayarak otomatik
        atanır.
      </p>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"12345678901\tADA GÜLER\t1\t12\n..."}
        className="mt-3 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">
            Varsayılan Salon No
          </label>
          <input
            type="number"
            min={1}
            value={salon}
            onChange={(e) => setSalon(Number(e.target.value) || 1)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">
            Başlangıç Sıra No
          </label>
          <input
            type="number"
            min={1}
            value={startSira}
            onChange={(e) => setStartSira(Number(e.target.value) || 1)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">
            Mod
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "append" | "replace")}
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="append">Üzerine ekle</option>
            <option value="replace">Tüm listeyi değiştir</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-600">
          {preview.rows.length} geçerli satır,{" "}
          <span
            className={
              preview.errors.length > 0
                ? "text-red-600"
                : "text-slate-400"
            }
          >
            {preview.errors.length} hata
          </span>
          .
        </p>
        <button
          type="button"
          disabled={isPending || preview.rows.length === 0}
          onClick={handleSubmit}
          className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Kaydediliyor…" : "İçe Aktar"}
        </button>
      </div>

      {status && (
        <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700">
          {status}
        </p>
      )}

      {preview.errors.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-medium text-red-600">
            Hatalı satırları göster ({preview.errors.length})
          </summary>
          <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-red-200 bg-red-50 p-2 text-xs">
            {preview.errors.map((e) => (
              <li key={e.line} className="text-red-700">
                Satır {e.line}: {e.reason} — <code>{e.raw}</code>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
