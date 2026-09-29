import { meta as aoDai2d } from "@/app/mau-thiep-cuoi/ao-dai-2d/meta";
import { meta as balloon3d } from "@/app/mau-thiep-cuoi/balloon-3d/meta";
import { meta as boho2d } from "@/app/mau-thiep-cuoi/boho-2d/meta";
import { meta as botanical2d } from "@/app/mau-thiep-cuoi/botanical-2d/meta";
import { meta as editorial2d } from "@/app/mau-thiep-cuoi/editorial-2d/meta";
import { meta as film2d } from "@/app/mau-thiep-cuoi/film-2d/meta";
import { meta as firefly3d } from "@/app/mau-thiep-cuoi/firefly-3d/meta";
import { meta as galaxy3d } from "@/app/mau-thiep-cuoi/galaxy-3d/meta";
import { meta as gatsby2d } from "@/app/mau-thiep-cuoi/gatsby-2d/meta";
import { meta as letter2d } from "@/app/mau-thiep-cuoi/letter-2d/meta";
import { meta as lotus3d } from "@/app/mau-thiep-cuoi/lotus-3d/meta";
import { meta as picnic2d } from "@/app/mau-thiep-cuoi/picnic-2d/meta";
import { meta as polaroid2d } from "@/app/mau-thiep-cuoi/polaroid-2d/meta";
import { meta as sakura2d } from "@/app/mau-thiep-cuoi/sakura-2d/meta";
import { meta as seasons3d } from "@/app/mau-thiep-cuoi/seasons-3d/meta";
import { meta as songHy2d } from "@/app/mau-thiep-cuoi/song-hy-2d/meta";
import { meta as swiss2d } from "@/app/mau-thiep-cuoi/swiss-2d/meta";
import { meta as tropical2d } from "@/app/mau-thiep-cuoi/tropical-2d/meta";
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
  songHy2d,
  aoDai2d,
  swiss2d,
  botanical2d,
  boho2d,
  picnic2d,
  tropical2d,
  gatsby2d,
];

export const getTemplate = (slug: string) =>
  templates.find((t) => t.slug === slug);
