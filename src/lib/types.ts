export type Exam = {
  id: string;
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
  created_at: string;
  updated_at: string;
};

export type ExamStudent = {
  id: string;
  exam_id: string;
  tc_kimlik_no: string;
  ad_soyad: string;
  salon_no: number;
  sira_no: number;
  created_at: string;
};
