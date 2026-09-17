// Lokasi akurat bengkel (sumber: pemilik).
export const SHOP_COORDS = { lat: -6.253777, lng: 107.140374 };
export const SHOP_ADDRESS_FULL =
  "Jl. K.H. Asmawi, Kalijaya, Kec. Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530, Indonesia";
export const SHOP_ADDRESS_SHORT = "Jl. K.H. Asmawi, Kalijaya, Cikarang Barat";

const QUERY = `${SHOP_COORDS.lat},${SHOP_COORDS.lng}`;

// Google Maps — tanpa API key (embed + link langsung).
// Semua fungsi memakai koordinat akurat; argumen address opsional (fallback display saja).
export function mapsSearchUrl(_address?: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${QUERY}`;
}

export function mapsDirectionUrl(_address?: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`;
}

export function mapsEmbedUrl(_address?: string): string {
  return `https://maps.google.com/maps?q=${QUERY}&z=17&output=embed`;
}
