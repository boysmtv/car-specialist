"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import type { Service } from "@/types";
import { SERVICE_ICONS } from "@/components/marketing/ServiceIcon";
import { cloudDeleteService, cloudListServices, cloudSaveService, refreshPublic } from "@/lib/adminDb";

const DEFAULT_PROCESS = "Konsultasi via WhatsApp\nPemeriksaan\nEstimasi\nPengerjaan";
const ERR = "Gagal. Pastikan migrasi 0001+0002 sudah dijalankan & login akun Supabase.";

const lines = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);

interface FormState {
  editId: string | null;
  editSlug: string;
  name: string;
  icon: string;
  short: string;
  desc: string;
  symptoms: string;
  diagnostics: string;
  process: string;
  duration: string;
}

const EMPTY_FORM: FormState = {
  editId: null, editSlug: "", name: "", icon: "wrench", short: "", desc: "",
  symptoms: "", diagnostics: "", process: DEFAULT_PROCESS, duration: "",
};

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function refresh() {
    try {
      setItems(await cloudListServices());
    } catch {
      toast.error(ERR);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function startAdd() {
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function startEdit(s: Service) {
    const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    setForm({
      editId: s.id, editSlug: s.slug, name: s.name, icon: s.icon || "wrench",
      short: s.short_description, desc: s.description,
      symptoms: arr(s.symptoms).join("\n"), diagnostics: arr(s.diagnostics).join("\n"),
      process: arr(s.process).join("\n"), duration: s.duration_text || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (form.name.trim().length < 3) { toast.error("Nama layanan minimal 3 karakter"); return; }
    if (form.short.trim().length < 10) { toast.error("Deskripsi singkat minimal 10 karakter"); return; }
    const isEdit = !!form.editId;
    const item: Service = {
      id: form.editId || (crypto.randomUUID ? crypto.randomUUID() : `svc-${Date.now()}`),
      name: form.name.trim(),
      slug: isEdit ? form.editSlug : slugify(form.name),
      icon: form.icon,
      short_description: form.short.trim(),
      description: form.desc.trim() || form.short.trim(),
      symptoms: lines(form.symptoms),
      diagnostics: lines(form.diagnostics),
      process: lines(form.process),
      duration_text: form.duration.trim() || null,
      price_mode: "CONTACT", featured: false, active: true,
    };
    if (!isEdit && items.some((s) => s.slug === item.slug)) { toast.error("Layanan dengan nama itu sudah ada"); return; }
    try {
      await cloudSaveService(item, isEdit);
      refreshPublic(["/", "/layanan", `/layanan/${item.slug}`]);
      toast.success(isEdit ? "Layanan diperbarui." : "Layanan ditambahkan.");
    } catch {
      toast.error(ERR);
      return;
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
    refresh();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Hapus "${name}"? Halaman /layanan-nya ikut hilang.`)) return;
    try {
      await cloudDeleteService(id);
      refreshPublic(["/", "/layanan"]);
      toast.success("Layanan dihapus.");
    } catch {
      toast.error(ERR);
      return;
    }
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Layanan ({items.length})</h1>
          <p className="mt-0.5 text-sm text-slate-500">Kelola detail lengkap: gejala, pemeriksaan, proses & estimasi waktu.</p>
        </div>
        {!showForm && <button onClick={startAdd} className="btn-gold !py-2 text-xs"><Plus size={15} /> Tambah Layanan</button>}
      </div>

      {showForm && (
        <div className="card-luxe mt-4 grid gap-3 border-orange-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <b>{form.editId ? "Edit layanan" : "+ Tambah layanan"}</b>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="btn-outline !px-2 !py-1 !text-xs"><X size={14} /> Batal</button>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div><label className="label">Nama layanan*</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="cth: Cuci Evaporator" className="input" /></div>
            <div><label className="label">Estimasi waktu</label><input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="cth: 1–2 jam" className="input" /></div>
          </div>
          <div>
            <span className="label">Icon*</span>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {SERVICE_ICONS.map((ic) => (
                <button
                  key={ic.value} type="button" title={ic.label}
                  onClick={() => set("icon", ic.value)}
                  className={`grid aspect-square place-items-center rounded-xl border-2 transition ${form.icon === ic.value ? "border-primary bg-orange-100 text-primary" : "border-border bg-white text-slate-400 hover:border-orange-200"}`}
                >
                  {ic.node}
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Deskripsi singkat* (tampil di kartu)</label><textarea value={form.short} onChange={(e) => set("short", e.target.value)} rows={2} className="input" /></div>
          <div><label className="label">Deskripsi lengkap (tampil di halaman detail)</label><textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} rows={3} className="input" placeholder="Kosongkan = pakai deskripsi singkat" /></div>
          <div className="grid gap-3 lg:grid-cols-3">
            <div><label className="label">Gejala umum (satu per baris)</label><textarea value={form.symptoms} onChange={(e) => set("symptoms", e.target.value)} rows={4} placeholder={"AC tidak dingin\nAC bau"} className="input" /></div>
            <div><label className="label">Pemeriksaan (satu per baris)</label><textarea value={form.diagnostics} onChange={(e) => set("diagnostics", e.target.value)} rows={4} placeholder={"Cek tekanan freon\nCek kebocoran"} className="input" /></div>
            <div><label className="label">Proses pengerjaan (satu per baris)</label><textarea value={form.process} onChange={(e) => set("process", e.target.value)} rows={4} className="input" /></div>
          </div>
          <button onClick={save} className="btn-gold w-fit !py-2 text-xs"><Plus size={15} /> {form.editId ? "Simpan Perubahan" : "Tambah & Tampilkan"}</button>
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Memuat…</p>
      ) : items.length === 0 ? (
        <div className="card-luxe mt-4 p-8 text-center text-sm text-slate-500">Belum ada layanan. Tambahkan yang pertama di atas.</div>
      ) : (
        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {items.map((s) => (
            <div key={s.id} className="card-luxe p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <b className="block truncate">{s.name}</b>
                  <p className="text-xs text-slate-500">/layanan/{s.slug}{s.duration_text ? ` · ${s.duration_text}` : ""}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => startEdit(s)} title="Edit detail" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-slate-500 transition hover:border-orange-300 hover:text-primary"><Pencil size={15} /></button>
                  <button onClick={() => remove(s.id, s.name)} title="Hapus" className="grid h-8 w-8 place-items-center rounded-lg border border-border text-slate-500 transition hover:border-red-300 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{s.short_description}</p>
              <p className="mt-1 text-[11px] text-slate-400">{(Array.isArray(s.symptoms) ? s.symptoms.length : 0)} gejala · {(Array.isArray(s.diagnostics) ? s.diagnostics.length : 0)} pemeriksaan · {(Array.isArray(s.process) ? s.process.length : 0)} tahap proses</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
