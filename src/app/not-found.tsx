import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x max-w-xl py-20 text-center">
      <h1 className="text-4xl font-extrabold">Produk tidak ditemukan.</h1>
      <p className="mt-2 text-slate-600">Halaman yang kamu cari tidak ada atau sudah dihapus.</p>
      <div className="mt-4 flex justify-center gap-2"><Link href="/produk" className="btn-primary">Kembali ke produk</Link><Link href="/kontak" className="btn-outline">Hubungi kami</Link></div>
    </div>
  );
}
