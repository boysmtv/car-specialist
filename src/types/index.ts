export type PriceMode = "FIXED" | "START_FROM" | "RANGE" | "CONTACT";
export type Availability = "AVAILABLE" | "LOW_STOCK" | "PREORDER" | "OUT_OF_STOCK" | "CONTACT";
export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
  active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface ProductFitment {
  id?: string;
  make?: string | null;
  model?: string | null;
  year_from?: number | null;
  year_to?: number | null;
  variant?: string | null;
  notes?: string | null;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  name: string;
  slug: string;
  brand?: string | null;
  sku?: string | null;
  part_number?: string | null;
  short_description?: string | null;
  description?: string | null;
  specifications?: Record<string, string> | null;
  installation_notes?: string | null;
  warranty_text?: string | null;
  price_mode: PriceMode;
  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  installation_price?: number | null;
  availability: Availability;
  stock_quantity?: number | null;
  publication_status?: PublicationStatus;
  active: boolean;
  featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  images: ProductImage[];
  fitments?: ProductFitment[];
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  symptoms: string[];
  diagnostics: string[];
  process: string[];
  duration_text?: string | null;
  price_mode: PriceMode;
  price_from?: number | null;
  price_to?: number | null;
  warranty_text?: string | null;
  image_url?: string | null;
  icon?: string | null;
  featured: boolean;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  vehicle?: string | null;
  caption?: string | null;
  image_url: string;
  before_image_url?: string | null;
  after_image_url?: string | null;
  type: string;
  published: boolean;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export interface SiteSettings {
  business_name: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  maps_url: string;
  opening_hours: Record<string, string>;
  social_links: Record<string, string>;
  default_seo_title: string;
  default_seo_description: string;
  og_image_url?: string | null;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
