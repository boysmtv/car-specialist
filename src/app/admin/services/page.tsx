"use client";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import type { Service } from "@/types";
import { SERVICE_ICONS } from "@/components/marketing/ServiceIcon";
import { cloudDb, cloudDeleteService, cloudListServices, cloudSaveService, isLocalHost, refreshPublic } from "@/lib/adminDb";

const LS = "demo_services";
const DEFAULT_PROCESS = "Konsultasi via WhatsApp\nPemeriksaan\nEstimasi\nPengerjaan";

async function fetchDemo(): Promise<Service[]> {
  try {
    const r = await fetch("/api/demo?entity=services", { cache: "no-store" });
    const j = await r.json();
    return j.success ? (j.data as Service[]) : [];
  } catch { return []; }
}

function loadLocal(): Service[] {
  try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; }
}

function saveLocal(items: Service[]) {
  try { localStorage.setItem(LS, JSON.stringify(items)); } catch {}
}

function dedupe(lists: Service[][]): Service[] {
  const ids = new Set<string>();
  const out: Service[] = [];
  for (const x of lists.flat()) {
    if (!ids.has(x.id)) { ids.add(x.id); out.push(x); }
  }
  return out;
}

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

const CLOUD_ERR = "Gagal menyimpan ke database. Pastikan login dengan akun Supabase & migrasi 0002 sudah dijalankan.";

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [cloud, setCloud] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function refresh() {
    // Cloud dulu (Supabase = tampil publik permanen), fallback demo lokal
    try {
      const data = await cloudListServices();
      setCloud(true);
      setItems(data);
      return;
    } catch {}
    setCloud(false);
    const [api, local] = await Promise.all([fetchDemo(), Promise.resolve(loadLocal())]);
    setItems(dedupe([api, local]));
  }

  useEffect(() => { refresh(); }, []);

  function startAdd() {
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function startEdit(s: Service) {
    setForm({
      editId: s.id, editSlug: s.slug, name: s.name, icon: s.icon || "wrench",
      short: s.short_description, desc: s.description,
      symptoms: s.symptoms.join("\n"), diagnostics: s.diagnostics.join("\n"),
      process: s.process.join("\n"), duration: s.duration_text || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveToCloud(item: Service, isEdit: boolean): Promise<boolean> {
    try {
      await cloudSaveService(item, isEdit);
      return true;
    } catch { return false; }
  }

  async function saveToDemo(item: Service): Promise<"server" | "local"> {
    try {
      if (form.editId) {
        await fetch("/api/demo", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "services", id: item.id }),
        }).catch(() => {});
        saveLocal(loadLocal().filter((x) => x.id !== item.id));
      }
      const r = await fetch("/api/demo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "services", item }),
      });
      if (!r.ok) throw new Error();
      return "server";
    } catch {
      const prev = loadLocal().filter((x) => x.id !== item.id);
      prev.unshift(item);
      saveLocal(prev);
      return "local";
    }
  }

  async function save() {
    if (form.name.trim().length < 3) { toast.error("Nama layanan minimal 3 karakter"); return; }
    if (form.short.trim().length < 10) { toast.error("Deskripsi singkat minimal 10 karakter"); return; }
    const isEdit = !!form.editId;
    const item: Service = {
      id: form.editId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `demo-svc-${Date.now()}`),
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
    if (cloudDb()) {
      if (await saveToCloud(item, isEdit)) {
        refreshPublic(["/", "/layanan", `/layanan/${item.slug}`]);
        toast.success(isEdit ? "Layanan diperbarui & tampil di website." : "Layanan ditambahkan & tampil di website.");
      } else {
        toast.error(CLOUD_ERR);
        return;
      }
    } else {
      const where = await saveToDemo(item);
      if (where === "server") {
        toast.success(isEdit ? "Layanan diperbarui & tampil di website." : "Layanan ditambahkan & tampil di website.");
      } else if (isLocalHost()) {
        toast.success(isEdit ? "Layanan diperbarui (tersimpan lokal)." : "Layanan ditambahkan (tersimpan lokal).");
      } else {
        toast.warning("Hanya tersimpan di browser ini — TIDAK tampil publik. Jalankan migrasi 0001+0002 & login akun Supabase.", { duration: 7000 });
      }
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
    refresh();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Hapus "${name}"? Halaman /layanan-nya ikut hilang.`)) return;
    if (cloudDb()) {
      try {
        await cloudDeleteService(id);
        toast.success("Layanan dihapus.");
      } catch {
        toast.error(CLOUD_ERR);
        return;
      }
    } else {
      try {
        await fetch("/api/demo", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entity: "services", id }),
        });
      } catch {}
      saveLocal(loadLocal().filter((x) => x.id !== id));
      toast.success("Layanan dihapus.");
    }
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Layanan ({items.length})</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {cloud ? "Terhubung database — perubahan tampil permanen." : "Mode lokal — hubungkan Supabase agar permanen."}
          </p>
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
            <p className="mt-1 text-[11px] text-slate-400">{s.symptoms.length} gejala · {s.diagnostics.length} pemeriksaan · {s.process.length} tahap proses</p>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="card-luxe mt-3 p-8 text-center text-sm text-slate-500">Belum ada layanan. Tambahkan yang pertama di atas.</div>
      )}
    </div>
  );
}
