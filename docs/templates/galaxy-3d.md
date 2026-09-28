# 3D-01 · `galaxy-3d` · Hai Vì Sao

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Đây là **mẫu 3D pilot**: bộ công cụ 3D dùng chung (`src/kit/3d/`) được dựng và kiểm chứng qua mẫu này.

---

## 1. Concept

**Một câu:** Hai ngôi sao ở hai đầu dải ngân hà, mỗi lần cuộn là một bước chúng tiến lại gần nhau, cho tới khi va vào nhau và hợp thành một ngôi sao sáng nhất.

**Cảm xúc muốn gợi:** kỳ vĩ, định mệnh, "giữa hàng tỉ người mình đã tìm thấy nhau". Chuyển động chậm, như đang trôi trong vũ trụ.

**Phù hợp với:** cặp đôi hiện đại, yêu khoa học viễn tưởng hoặc thiên văn, muốn một thiệp gây ấn tượng mạnh để chia sẻ.

**Cách kể chuyện:** người xem là **camera trôi giữa vũ trụ**. Chữ là HTML nổi trên nền canvas 3D cố định. Cuộn trang = thời gian trôi. Mỗi "chương" là một vùng progress, camera bay từ điểm dừng này sang điểm dừng khác.

**Moodboard:** ảnh Hubble và James Webb, hạt bụi vũ trụ tím và xanh, chữ serif mảnh màu vàng champagne, glassmorphism tối.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `void` | `#07061A` | Nền canvas và nền trang |
| `nebula` | `#2A1B5C` | Sương tinh vân, gradient phụ |
| `glass` | `#14123A` / 60% + `backdrop-blur-md` | Nền các card chữ |
| `gold` | `#F4D58D` | Tên, số lớn, sao của chú rể |
| `violet` | `#9B8CFF` | Sao của cô dâu, đường chòm sao |
| `star` | `#EEEAFF` | Chữ chính |
| `dim` | `#A9A4C9` | Chữ phụ (tương phản trên glass khoảng 6:1 ✅) |

### Typography
| Vai trò | Font | Mobile | Desktop |
|---|---|---|---|
| Tên | Cormorant Garamond 300 italic | 48px | 88px |
| Tiêu đề chương | Be Vietnam Pro 400, VIẾT HOA, tracking 0.35em | 12px | 13px |
| Số lớn | Cormorant Garamond 300 | 88px | 128px |
| Nội dung | Be Vietnam Pro 300 | 16px / 1.7 | 17px |

### Hình khối
- Card chữ: `rounded-3xl`, `glass`, viền `1px` `#FFFFFF`/10%, rộng tối đa 420px.
- Ảnh trong scene: plane 3:4, viền sáng mỏng (plane lớn hơn phía sau, `violet` 30% additive).
- Motion: camera ease `sine.inOut`; chữ A2/A1 dùng `power2.out` 1s. Không có gì giật hay nảy.

---

## 3. Nhạc
- Ambient piano với pad synth dài, không trống, không lời, khoảng 70 BPM, dài 3:00 trở lên.
- Từ khoá Pixabay: `ambient piano space`, `cinematic ambient romantic`, `interstellar piano`
- Bắt đầu khi bấm "Mở thiệp". Âm lượng tăng 0 → 0.5 trong 3 giây (dài hơn mẫu 2D để hợp với cú bay của camera).
- **Điểm nhấn**: khi 2 sao va nhau (chương 6) giảm âm lượng còn 0.2 trong 0.5 giây rồi tăng trở lại, tạo khoảnh khắc "nín thở".

---

## 4. Cấu trúc trang và chương

Trang HTML dài **900svh**. Canvas `fixed inset-0 -z-10`. `progress` từ 0 đến 1 được tính theo cuộn của toàn trang.

| Chương | Progress | HTML section | Card |
|---|---|---|---|
| 0 | màn mở (trước khi cuộn) | `#gate` | C1 |
| 1 | 0.00–0.12 | `#names` | C2 |
| 2 | 0.12–0.28 | `#couple` | C3 |
| 3 | 0.28–0.45 | `#story` | C4 |
| 4 | 0.45–0.62 | `#album` | C8 |
| 5 | 0.62–0.72 | `#collision` | (khoảnh khắc va chạm) |
| 6 | 0.72–0.84 | `#date` | C5 + C6 |
| 7 | 0.84–0.93 | `#venue` | C7 |
| 8 | 0.93–1.00 | `#thanks` | C9 + C10 |

### Keyframe camera
Toạ độ theo đơn vị three.js. Sao chú rể nằm ở `G`, sao cô dâu ở `B`; hai vị trí này cũng thay đổi theo progress (xem §5).

| progress | camera.position | lookAt | Ghi chú |
|---|---|---|---|
| 0.00 | `[0, 0, 60]` | `[0,0,0]` | Toàn cảnh, hai sao ở hai mép |
| 0.12 | `[0, 4, 38]` | `[0,0,0]` | Tiến gần, hơi cao |
| 0.28 | `[-14, 2, 22]` | `[0,0,0]` | Lệch trái, nhìn quỹ đạo xoắn |
| 0.45 | `[10, -3, 14]` | `[0,0,-10]` | Bay qua chòm sao |
| 0.62 | `[0, 0, -30]` | `[0,0,-60]` | Xuyên dọc trục xoắn album |
| 0.72 | `[0, 0, 12]` | `[0,0,0]` | Quay lại tâm, cận cảnh va chạm |
| 0.84 | `[0, 18, 40]` | `[0,0,0]` | Kéo xa, thấy hành tinh |
| 1.00 | `[0, 0, 26]` | `[0,0,0]` | Ngôi sao hợp nhất ở giữa |

Nội suy: tìm cặp keyframe bao quanh `progress`, tính `k = (p - a.at) / (b.at - a.at)`, áp `sine.inOut`, rồi `lerpVectors`. Làm **mượt thêm** bằng `camera.position.lerp(target, 1 - Math.exp(-4 * delta))` để camera không giật khi người dùng cuộn nhanh.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Nền sao | drei `<Stars radius={200} depth={80} count factor={4} fade />` | 6000 / 2500 |
| Tinh vân | 3 plane lớn, texture sương mờ (`nebula-*.webp` 1024px), additive, opacity 0.35, xoay rất chậm | 3 / 2 |
| Sao chú rể | sphere r=0.6 `meshBasicMaterial gold` + sprite glow additive (scale 6) + drei `<Sparkles color=gold>` | 1 |
| Sao cô dâu | tương tự, màu `violet` | 1 |
| Quỹ đạo | `G(p) = (R(p)·cos θ, 0, R(p)·sin θ)`, `B(p) = −G(p)`, với `R(p) = lerp(18, 0, smooth(p/0.72))`, `θ = p·6π` | — |
| Chòm sao (C4) | 3 nhóm, mỗi nhóm 5–7 điểm; `Line` (drei) có `drawRange` tăng theo progress; mỗi chòm có 1 ảnh plane bên cạnh | 3 |
| Xoắn album (C8) | ảnh `images[3..6]` đặt theo đường xoắn quanh trục z từ −20 đến −60, xoay mặt về camera (`lookAt` mỗi frame) | 4 |
| Vụ nổ | sprite additive trắng: `scale 0 → 30`, `opacity 1 → 0` trong khoảng progress 0.66–0.72; kèm 300 hạt bắn ra (Points, vận tốc hướng tâm ra) | 1 / 1 (150 hạt) |
| Hành tinh (C7) | sphere r=6, `meshStandardMaterial` màu lam và lục, 1 `directionalLight`; ghim = cone nhỏ màu gold | 1 |
| Ngôi sao hợp nhất | sphere r=1, gradient gold→violet (shader 2 màu theo pháp tuyến) + glow lớn | 1 |

**Tương tác con trỏ:** `camera.position.x += pointer.x * 0.3` (được làm mượt). Trên mobile dùng `DeviceOrientation` **chỉ khi** người dùng đã cho phép (iOS yêu cầu xin quyền, nên xin quyền ngay trong nút "Mở thiệp").

---

## 6. Chi tiết từng section HTML

Mọi card chữ nằm trong một `<section>` cao đúng số svh ở §4. Card được căn theo vị trí cụ thể (trái, phải hoặc giữa) để không che hai ngôi sao.

### C1 · Màn mở
```
┌────────────────────────────┐
│    · ✦    ·      ·   ✧     │  ← canvas sao phía sau
│                            │
│  ✦ gold              violet✦│  ← 2 sao ở 2 mép
│                            │
│      HAI VÌ SAO            │  ← tiêu đề chương, dim
│  Minh Quân  ·  Thu Hà      │  ← Cormorant italic 28px
│                            │
│      ╭───────────────╮     │
│      │  MỞ THIỆP  ✦  │     │  ← nút glass, viền gold, A12
│      ╰───────────────╯     │
│   🎧 Nên dùng tai nghe     │  ← 12px dim
└────────────────────────────┘
```
**Khi bấm (3 giây):** nhạc tăng dần. `Stars.speed` 1 → 8 → 1 (vệt sao). Camera bay từ `z 90 → 60`. Nút và chữ fade ra. Sau đó mở khoá cuộn.
**Trước khi canvas sẵn sàng:** hiện nền `void` với 40 chấm sao CSS để màn hình không bao giờ trắng.

### C2 · Tên (progress 0–0.12), căn giữa
```
│   Hai tâm hồn, một định mệnh│  ← dim 14px
│        Minh Quân           │  ← gold, 48px, A2 theo ký tự
│            &               │
│         Thu Hà             │  ← violet
```
Chữ nổi trực tiếp trên canvas, không có nền glass, để tên trông như viết giữa bầu trời.

### C3 · Cặp đôi (0.12–0.28), hai card hai bên
```
│┌──────────┐                │
││ CHÚ RỂ    │  ← card trái, gần sao gold
││ Minh Quân │
││ Quận 1…   │
│└──────────┘   ┌──────────┐ │
│               │ CÔ DÂU    │ │  ← card phải, gần sao violet
│               │ Thu Hà    │ │
│               └──────────┘ │
```
Ảnh chân dung `images[1]` và `images[2]` là **plane 3D bay quanh sao tương ứng**, không nằm trong card HTML. Card chỉ chứa chữ. Mỗi card A1 khi section vào viewport 40%.

### C4 · Chuyện tình (0.28–0.45)
3 card nhỏ lần lượt, mỗi card đồng bộ với một chòm sao đang được vẽ:
| Mốc | Tiêu đề | Nội dung mẫu (viết sẵn) | Ảnh |
|---|---|---|---|
| 1 | Lần đầu gặp gỡ | "Một buổi chiều bình thường, hai quỹ đạo vô tình giao nhau." | `images[3]` |
| 2 | Thương nhau | "Từ đó, mọi con đường đều dẫn về một người." | `images[4]` |
| 3 | Lời hứa | "Và rồi một câu hỏi, một cái gật đầu, cả vũ trụ như lặng đi." | `images[5]` |

### C8 · Album (0.45–0.62)
Chỉ có tiêu đề HTML "KHOẢNH KHẮC" (A2), vì ảnh nằm trong scene 3D. Bấm vào ảnh 3D (raycast bằng `onClick` của R3F) thì mở lightbox HTML (A10). Có thêm nút "Xem tất cả ảnh" mở lưới ảnh HTML để người dùng không phải "săn" ảnh trong không gian 3D.

### Va chạm (0.62–0.72)
Không có chữ. Màn hình loé trắng 0.3 giây (div `bg-white` với opacity scrub 0 → 0.9 → 0), nhạc giảm âm lượng (§3).

### C5 + C6 · Ngày (0.72–0.84), căn giữa, glass
```
│   ╭────────────────────╮   │
│   │  NGÀY CHÚNG TA      │   │
│   │  VỀ CHUNG MỘT NHÀ   │   │
│   │        14           │   │  ← 88px gold
│   │   THÁNG 11 · 2026   │   │
│   │ 45 : 06 : 12 : 33   │   │  ← A7
│   │ ─────────────────── │   │
│   │ Lễ thành hôn  17:00 │   │
│   │ Tiệc cưới     18:00 │   │
│   ╰────────────────────╯   │
```

### C7 · Địa điểm (0.84–0.93)
Card glass nằm ở nửa dưới màn hình (hành tinh chiếm nửa trên). Gồm `venue.name`, `<MapEmbed>` cao 200px, nút "Chỉ đường".

### C9 + C10 · Kết (0.93–1.00)
```
│   Cảm ơn bạn đã là một     │
│   vì sao trong bầu trời    │
│   của chúng tôi.           │
│    Minh Quân & Thu Hà      │
│   [ ▶ Xem video của chúng tôi ] │  ← chỉ khi có videos[0]
```
Video mở trong lightbox; khi video phát thì nhạc nền tạm dừng.

---

## 7. Fallback (không có WebGL hoặc bật reduced-motion)
- Không mount canvas. Nền dùng `void` với gradient radial tím và ảnh `fallback-stars.webp` cố định.
- Ảnh (chân dung, chuyện tình, album) hiện trong HTML: chân dung đặt trong card C3, album thành lưới 2 cột.
- Hiệu ứng va chạm thay bằng crossfade.
- Kiểm tra WebGL: `!!document.createElement("canvas").getContext("webgl2")`.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`. Khi tab ẩn hoặc chưa mở thiệp: `frameloop="demand"`.
- Texture ảnh người dùng: resize về tối đa 1024px trước khi đưa vào `useTexture` (vẽ lên canvas 2D rồi `toBlob`), tránh tràn VRAM trên iPhone khi ảnh gốc 12MP.
- Mục tiêu JS riêng của route ≤ 350KB gzip (three + r3f + drei tree-shaken + gsap).
- Dọn dẹp: R3F tự dispose geometry và material khi unmount; texture tạo thủ công phải gọi `.dispose()`.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, ảnh nền lightbox |
| `images[1]` / `images[2]` | Plane chân dung quanh sao chú rể / cô dâu |
| `images[3..5]` | 3 chòm sao C4 |
| `images[3..6]` | Xoắn album C8 (dùng lại 3..5 + thêm 6) |
| `images[7]` | Ảnh C10 |
| `videos[0]` | C9 |

`meta.media = { images: 8, videos: 1 }`

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/galaxy-3d/
├── meta.ts, layout.tsx, page.tsx
└── _components/
    ├── galaxy-invite.tsx     # "use client": HTML sections + OpenGate + ScrollRig + <GalaxyCanvas/>
    ├── galaxy-canvas.tsx     # next/dynamic(() => import("./scene"), { ssr: false }) + fallback
    ├── scene.tsx             # <Canvas> + các đối tượng bên dưới
    ├── camera-rig.tsx        # đọc progressRef, nội suy keyframe §4
    ├── twin-stars.tsx        # 2 sao + quỹ đạo §5
    ├── constellations.tsx    # 3 chòm C4
    ├── album-spiral.tsx      # C8
    ├── collision.tsx         # vụ nổ
    ├── planet.tsx            # C7
    ├── keyframes.ts          # mảng keyframe camera + hàm sampleKeyframes (có test)
    └── sections/*.tsx        # C1…C10 HTML
```
Dùng chung từ `@/kit/3d`: `SceneCanvas` (kiểm tra WebGL, dpr, frameloop), `useScrollProgress()` (ScrollTrigger → ref), `useSafeTexture(url)` (resize xuống 1024px).

### 10.2 Nối cuộn với camera
```tsx
// @/kit/3d/use-scroll-progress.ts
export function useScrollProgress(trigger: RefObject<HTMLElement>) {
  const progress = useRef(0);
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: trigger.current, start: "top top", end: "bottom bottom",
      scrub: true, onUpdate: (s) => { progress.current = s.progress; },
    });
  });
  return progress; // ref, KHÔNG phải state, để không re-render React mỗi frame
}

// camera-rig.tsx
useFrame(({ camera }, delta) => {
  const { pos, look } = sampleKeyframes(KEYFRAMES, progress.current);
  const k = 1 - Math.exp(-4 * delta);
  camera.position.lerp(pos, k);
  lookTarget.lerp(look, k);
  camera.lookAt(lookTarget);
});
```

### 10.3 `keyframes.ts` (logic cần test)
```ts
export type Keyframe = { at: number; pos: [number, number, number]; look: [number, number, number] };
export function sampleKeyframes(kfs: Keyframe[], p: number): { pos: Vector3; look: Vector3 }
```
Test `keyframes.test.ts`: `p = 0` trả keyframe đầu; `p = 1` trả keyframe cuối; `p` nằm giữa hai keyframe thì kết quả nằm giữa hai vị trí; `p` ngoài [0, 1] thì bị kẹp lại.

### 10.4 Thứ tự làm
1. `@/kit/3d` (SceneCanvas, useScrollProgress, useSafeTexture) + test `sampleKeyframes`
2. HTML sections tĩnh, cuộn được, chưa có canvas → kiểm tra bố cục
3. Canvas: Stars + camera rig theo keyframe
4. Hai sao và quỹ đạo, đồng bộ với C2 và C3
5. Chòm sao, xoắn album, vụ nổ, hành tinh
6. Màn mở, nhạc, con trỏ và gyro
7. Fallback, đo bundle, Lighthouse mobile ≥ 75
8. Checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `nebula-1..3.webp` (1024px, tự tạo bằng noise hoặc lấy ảnh NASA thuộc public domain, ghi nguồn)
- [ ] `glow.png` 128px (sprite radial)
- [ ] `fallback-stars.webp`
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 8 ảnh mẫu + 1 video mẫu ≤ 8MB (Pexels)
- [ ] `thumb.webp`, `opengraph-image.png` (chụp từ scene)

## 12. Tiêu chí nghiệm thu riêng
- [ ] Cuộn nhanh từ đầu tới cuối: camera không giật, không nhảy cóc
- [ ] iPhone 12 / Android tầm trung: ≥ 45fps trong cảnh xoắn album
- [ ] Tắt WebGL (chrome://flags) vẫn đọc được đầy đủ thiệp và xem được toàn bộ ảnh
- [ ] Ảnh 12MP từ "Dùng thử" không làm crash tab trên iOS
- [ ] JS của `/` không tăng sau khi thêm mẫu này
