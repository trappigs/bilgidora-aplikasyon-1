import type { Exam } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  exam?: Exam;
};

const labelCls = "block text-sm font-medium text-slate-700";
const inputCls =
  "mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function ExamForm({ action, submitLabel, exam }: Props) {
  return (
    <form action={action} className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Sınav Bilgileri
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelCls}>
              Sınav Başlığı
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={exam?.title}
              placeholder="Ör. 2026 Sözel/Sayısal Deneme Sınavı"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="exam_date" className={labelCls}>
              Sınav Tarihi
            </label>
            <input
              id="exam_date"
              name="exam_date"
              type="date"
              required
              defaultValue={exam?.exam_date}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Sınav Yeri
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelCls}>
              İl
            </label>
            <input
              id="city"
              name="city"
              required
              defaultValue={exam?.city ?? "BURSA"}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="district" className={labelCls}>
              İlçe
            </label>
            <input
              id="district"
              name="district"
              required
              defaultValue={exam?.district ?? "OSMANGAZİ"}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="school_name" className={labelCls}>
              Okul Adı
            </label>
            <input
              id="school_name"
              name="school_name"
              required
              defaultValue={exam?.school_name ?? "BURSA ERKEK LİSESİ"}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="school_address" className={labelCls}>
              Okul Adresi
            </label>
            <input
              id="school_address"
              name="school_address"
              required
              defaultValue={
                exam?.school_address ?? "İbrahimpaşa, Öğreten Sk. No:1, 16010"
              }
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">
          Oturumlar
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          Yalnızca düzenlenecek oturumları doldur. Boş bırakılan oturum belgede
          gözükmez.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="sozel_time" className={labelCls}>
              Sözel Alan Saati
            </label>
            <input
              id="sozel_time"
              name="sozel_time"
              type="time"
              defaultValue={exam?.sozel_time ?? "09:30"}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sozel_duration_min" className={labelCls}>
              Sözel Süre (dk)
            </label>
            <input
              id="sozel_duration_min"
              name="sozel_duration_min"
              type="number"
              min={1}
              defaultValue={exam?.sozel_duration_min ?? 75}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sayisal_time" className={labelCls}>
              Sayısal Alan Saati
            </label>
            <input
              id="sayisal_time"
              name="sayisal_time"
              type="time"
              defaultValue={exam?.sayisal_time ?? "11:00"}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sayisal_duration_min" className={labelCls}>
              Sayısal Süre (dk)
            </label>
            <input
              id="sayisal_duration_min"
              name="sayisal_duration_min"
              type="number"
              min={1}
              defaultValue={exam?.sayisal_duration_min ?? 80}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="notes" className={labelCls}>
          Belgede Çıkacak Not (opsiyonel)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={exam?.notes ?? ""}
          placeholder="Boş bırakılırsa varsayılan uyarı yazısı kullanılır."
          className={inputCls}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-md bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
