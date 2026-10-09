import manifest from "./photos.json";

// Foto demo tema Rose Plum (WebP + blur placeholder), di public/undangan/002/.

export type Photo = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

const photos = manifest as Record<string, Photo>;

export function photo(id: string): Photo {
  const p = photos[id];
  if (!p) throw new Error(`Foto "${id}" tidak ada.`);
  return p;
}
