"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
    >
      Yazdır
    </button>
  );
}
