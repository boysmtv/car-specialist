import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, strip"),
  brand: z.string().optional(),
  category_id: z.string().min(1, "Kategori wajib"),
  sku: z.string().optional(),
  part_number: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price_mode: z.enum(["FIXED", "START_FROM", "RANGE", "CONTACT"]),
  price: z.coerce.number().optional(),
  price_min: z.coerce.number().optional(),
  price_max: z.coerce.number().optional(),
  availability: z.enum(["AVAILABLE", "LOW_STOCK", "PREORDER", "OUT_OF_STOCK", "CONTACT"]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const consultSchema = z.object({
  customer_name: z.string().min(3, "Nama minimal 3 karakter"),
  vehicle: z.string().min(3, "Isi jenis mobil, cth: Honda BR-V 2019"),
  service_id: z.string().optional(),
  service_type: z.enum(["WORKSHOP", "HOME_SERVICE"]).default("WORKSHOP"),
  home_address: z.string().optional(),
  complaint: z.string().min(5, "Ceritakan keluhan minimal 5 karakter"),
}).refine((v) => v.service_type === "WORKSHOP" || (v.home_address || "").trim().length >= 10, {
  message: "Alamat lengkap wajib diisi untuk Home Service",
  path: ["home_address"],
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

export const serviceSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  short_description: z.string().min(10),
  description: z.string().min(20),
  duration_text: z.string().optional(),
  price_mode: z.enum(["FIXED", "START_FROM", "RANGE", "CONTACT"]),
  price_from: z.coerce.number().optional(),
  price_to: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});
