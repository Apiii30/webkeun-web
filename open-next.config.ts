import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Halaman yang sudah jadi saat build (beranda, template, semua undangan) dibaca dari file statis Cloudflare, jadi tidak
// dirender ulang tiap dibuka. Situs ini tidak memakai revalidasi halaman, jadi tidak perlu penyimpanan R2/KV.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
