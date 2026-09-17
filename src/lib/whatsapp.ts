export function waNumber(): string {
  return process.env.NEXT_PUBLIC_WA_NUMBER || "6282111906994";
}

export function waLink(message: string, number?: string): string {
  const num = number || waNumber();
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function productWaMessage(p: { name: string; slug: string }, vehicle = "-", year = "-"): string {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/produk/${p.slug}`
      : `/produk/${p.slug}`;
  return `Halo Specialist AC Mobil,\n\nSaya ingin menanyakan produk:\n\nProduk: ${p.name}\nMobil: ${vehicle}\nTahun: ${year}\nLink: ${url}\n\nApakah produk tersedia dan berapa estimasi harga pemasangannya?`;
}

export function consultWaMessage(b: {
  customer_name: string;
  service_type?: string;
  home_address?: string;
  vehicle: string;
  service_name: string;
  complaint: string;
}): string {
  const isHome = b.service_type === "HOME_SERVICE";
  const tipe = isHome ? "Home Service (teknisi ke rumah)" : "Datang ke bengkel";
  const alamat = isHome && b.home_address ? `\nAlamat: ${b.home_address}` : "";
  return `Halo Specialist AC Mobil,\n\nSaya ingin konsultasi.\n\nNama: ${b.customer_name}\nMobil: ${b.vehicle}\nLayanan: ${b.service_name}\nTipe: ${tipe}${alamat}\nKeluhan: ${b.complaint}\n\nMohon infonya.`;
}
