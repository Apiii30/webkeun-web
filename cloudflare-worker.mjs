// Pintu masuk Worker di Cloudflare (wrangler.jsonc → "main"). Semua permintaan diteruskan ke Worker buatan OpenNext,
// kecuali foto next/image (/_next/image) yang diberi cache lebih dulu.
//
// Bawaan OpenNext, foto hasil pengecilan dikirim tanpa header Cache-Control, jadi browser tidak menyimpannya dan setiap
// foto diproses ulang lewat Cloudflare Images di setiap kunjungan (±0,3–1,5 detik per foto). Di sini hasilnya disimpan di
// cache Cloudflare (dipakai bersama semua pengunjung di kota/data center yang sama) dan di browser selama 30 hari.
// Aman disimpan lama karena foto yang isinya berubah selalu diberi nama file baru.

// .open-next/worker.js dibuat oleh `opennextjs-cloudflare build`
import handler from "./.open-next/worker.js";

const SIMPAN = "public, max-age=2592000, stale-while-revalidate=86400"; // 30 hari

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method !== "GET" || url.pathname !== "/_next/image") return handler.fetch(request, env, ctx);

    // Format hasil (AVIF/WebP/asli) dipilih dari header Accept browser, jadi ikut jadi bagian kunci cache
    const terima = request.headers.get("accept") ?? "";
    const format = terima.includes("image/avif") ? "avif" : terima.includes("image/webp") ? "webp" : "asli";
    const kunci = new Request(`${url.origin}/_next/image${url.search}&_format=${format}`);
    const cache = caches.default;

    const tersimpan = await cache.match(kunci);
    if (tersimpan) return tersimpan;

    const asli = await handler.fetch(request, env, ctx);
    if (asli.status !== 200) return asli;
    const respons = new Response(asli.body, asli);
    respons.headers.set("Cache-Control", SIMPAN);
    ctx.waitUntil(cache.put(kunci, respons.clone()));
    return respons;
  },
};

export default worker;
