import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { Flower } from "../svg/decor";
import { t } from "../tokens";

function PortraitColumn({
  img,
  role,
  name,
  address,
  className = "",
}: {
  img: string | undefined;
  role: string;
  name: string;
  address: string;
  className?: string;
}) {
  return (
    <div className={`c3-col ${className}`}>
      {img ? (
        // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
        <img
          src={img}
          width={360}
          height={480}
          alt={`Chân dung ${role.toLowerCase()} ${name}`}
          className={`c3-img aspect-3/4 w-full ${t.arch}`}
        />
      ) : null}
      <h3 className={`${t.heading} mt-4`}>{role}</h3>
      <p className={`${t.script} mt-1 text-[26px] leading-tight break-words`}>
        {name}
      </p>
      <p className={`mt-1 line-clamp-3 text-[15px] ${t.soft}`}>{address}</p>
    </div>
  );
}

// C3 · Nhà trai / nhà gái (spec §5): hai cột ảnh vòm, cột phải lệch xuống 48px.
export function FamiliesSection({
  groom,
  groomAddress,
  groomImg,
  bride,
  brideAddress,
  brideImg,
}: {
  groom: string;
  groomAddress: string;
  groomImg: string | undefined;
  bride: string;
  brideAddress: string;
  brideImg: string | undefined;
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        const tl = gsap.timeline();
        const cols = gsap.utils.toArray<HTMLElement>(".c3-col");
        cols.forEach((col, i) => {
          const img = col.querySelector(".c3-img");
          if (img) tl.add(clipReveal(img), i * 0.2);
          tl.add(fadeUp(col, { stagger: 0 }), i * 0.2);
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Nhà trai và nhà gái"
      className="relative flex min-h-[100svh] items-center justify-center py-24"
    >
      <Flower size={30} className="absolute top-14 left-0 lg:left-[7vw]" />
      <div
        className={`${t.col} grid grid-cols-2 gap-5 max-[340px]:grid-cols-1`}
      >
        <PortraitColumn
          img={groomImg}
          role="Nhà trai"
          name={groom}
          address={groomAddress}
        />
        <PortraitColumn
          img={brideImg}
          role="Nhà gái"
          name={bride}
          address={brideAddress}
          className="mt-12 max-[340px]:mt-0"
        />
      </div>
    </section>
  );
}
