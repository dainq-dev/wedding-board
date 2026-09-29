import { meta as balloon3d } from "@/app/mau-thiep-cuoi/balloon-3d/meta";
import { meta as editorial2d } from "@/app/mau-thiep-cuoi/editorial-2d/meta";
import { meta as film2d } from "@/app/mau-thiep-cuoi/film-2d/meta";
import { meta as firefly3d } from "@/app/mau-thiep-cuoi/firefly-3d/meta";
import { meta as galaxy3d } from "@/app/mau-thiep-cuoi/galaxy-3d/meta";
import { meta as letter2d } from "@/app/mau-thiep-cuoi/letter-2d/meta";
import { meta as lotus3d } from "@/app/mau-thiep-cuoi/lotus-3d/meta";
import { meta as polaroid2d } from "@/app/mau-thiep-cuoi/polaroid-2d/meta";
import { meta as sakura2d } from "@/app/mau-thiep-cuoi/sakura-2d/meta";
import { meta as seasons3d } from "@/app/mau-thiep-cuoi/seasons-3d/meta";
import type { TemplateMeta } from "@/wedding/types";

// Thêm template mới: import meta.ts của nó và thêm vào mảng.
export const templates: TemplateMeta[] = [
  sakura2d,
  galaxy3d,
  firefly3d,
  balloon3d,
  seasons3d,
  lotus3d,
  letter2d,
  polaroid2d,
  film2d,
  editorial2d,
];

export const getTemplate = (slug: string) =>
  templates.find((t) => t.slug === slug);
