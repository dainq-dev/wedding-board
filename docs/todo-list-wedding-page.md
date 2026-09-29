# Todo list — 40 mẫu thiệp cưới online

> Kế hoạch triển khai 40 mẫu thiệp: **10 mẫu 3D** kể chuyện theo kiểu parallax scroll và **30 mẫu 2D** dùng HTML + Tailwind + GSAP.
> Khi code phải tuân thủ thêm [template-spec.md](./template-spec.md) và [architecture.md](./architecture.md).
> Mỗi mẫu gồm: ý tưởng, design tokens, nhạc, số ảnh/video, kịch bản từng card (bố cục, animation, cách chuyển sang card sau) và điểm nhấn riêng.

---

## 0. Kết quả research (đã kiểm chứng trước khi lập plan)

| Vấn đề | Kết luận | Nguồn / cách kiểm |
|---|---|---|
| GSAP có miễn phí không? | **Có.** Từ 29/04/2025, toàn bộ GSAP miễn phí kể cả khi dùng thương mại, gồm cả các plugin trước đây phải trả tiền (ScrollSmoother, SplitText, DrawSVG, MorphSVG, Flip…). Tất cả nằm sẵn trong package `gsap` trên npm. | [gsap.com/blog/3-13](https://gsap.com/blog/3-13/), [Webflow blog](https://webflow.com/blog/gsap-becomes-free) |
| Phiên bản hiện tại | `gsap@3.15.0`, `@gsap/react@2.1.2`, `three@0.186.1`, `@react-three/fiber@9.8.1`, `@react-three/drei@10.7.9` | `npm view` (29/09/2026) |
| R3F có chạy với React 19 không? | **Có.** R3F v9 yêu cầu `react >=19 <19.4`, dự án đang dùng 19.2.8. Lỗi không tương thích mà nhiều bài viết cũ nhắc tới là của R3F v8 với React 19. | `npm view @react-three/fiber peerDependencies` |
| Kết hợp R3F + ScrollTrigger | Đã có nhiều dự án dùng: Next 16 + R3F + drei + ScrollTrigger điều khiển camera theo các keyframe khi cuộn. | [alisleiman-3d](https://github.com/AliSleiman0/alisleiman-3d), [GSAP CodePen](https://codepen.io/GreenSock/pen/eYRzLJw) |
| Có tự phát nhạc được không? | **Không.** Chrome và Safari chặn `audio.play()` khi người dùng chưa tương tác (click hoặc tap; cuộn trang không tính). Vì vậy **mọi mẫu phải có card "Mở thiệp"**, và nhạc bắt đầu phát khi người dùng bấm nút đó. | [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay) |
| Nguồn nhạc | **Pixabay Music**: được dùng thương mại, không bắt buộc ghi nguồn (nhưng vẫn ghi vào `CREDITS.md`). Không được đăng ký bản nhạc làm của mình. | [Pixabay License](https://pixabay.com/service/license-summary/), [FAQ](https://pixabay.com/service/faq/) |
| Font có hỗ trợ tiếng Việt không? | Đã kiểm từng font trong `font-data.json` của `next/font`. **Không có** subset `vietnamese` nên **không dùng**: Cinzel, Bodoni Moda, DM Serif Display, Parisienne, Sacramento, Tangerine, Italiana, Marcellus, Monoton, Syne, Bebas Neue, Press Start 2P, Special Elite, Courier Prime, Libre Baskerville, Gloock, Archivo Black, Petit Formal Script. **Mọi font dùng trong plan này đều đã được kiểm là có tiếng Việt.** | `node_modules/next/dist/.../font-data.json` |

---

## 1. Quyết định kỹ thuật

| Hạng mục | Chọn | Lý do |
|---|---|---|
| Animation 2D | `gsap` + `@gsap/react` (`useGSAP`) | Miễn phí toàn bộ; `useGSAP` tự dọn khi unmount |
| Cuộn mượt | **ScrollSmoother** (có sẵn trong `gsap`) | Không cần thêm thư viện (không dùng Lenis). Tắt khi người dùng bật `prefers-reduced-motion` |
| Chữ | SplitText | Tách chữ để làm hiệu ứng hiện tên |
| Đường nét SVG | DrawSVG | Vẽ dần hoạ tiết, đường đi |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` | Viết dạng component React; drei có sẵn `Stars`, `Sparkles`, `Cloud`, `Float`, `useTexture`… |
| Điều khiển 3D khi cuộn | ScrollTrigger cập nhật `progress` (0→1) vào một ref, và `useFrame` nội suy vị trí camera theo keyframe | Chữ vẫn là HTML thật (tốt cho SEO và accessibility); canvas nằm cố định phía sau |
| Post-processing (bloom…) | **Không dùng ở MVP** | Nặng trên mobile. Dùng vật liệu emissive + additive blending để giả ánh sáng |
| Nhạc | `<audio>` HTML với `loop`, âm lượng tăng dần trong 1.5 giây | Không cần Web Audio API |

Lưu ý với ScrollSmoother: nội dung phải nằm trong `#smooth-wrapper > #smooth-content`. Các thành phần `position: fixed` (nút Quay lại, Dùng thử, Nhạc) **phải đặt ngoài wrapper**. Hiện layout chung đã đặt chúng ngoài nên không có vấn đề. Bên trong wrapper **không dùng `position: sticky`**, muốn ghim card thì dùng `pin` của ScrollTrigger.

---

## 2. Quy ước dùng chung (mọi mẫu đều tham chiếu)

### 2.1 Thư viện card (C)
Mỗi thiệp là một chuỗi card. Card có mã **C** để phần kịch bản bên dưới viết gọn.

| Mã | Card | Nội dung | Dữ liệu |
|---|---|---|---|
| **C1** | Mở thiệp | Màn hình che phủ + nút "Mở thiệp". Bấm vào thì phát nhạc và chạy intro | `images[0]` (tuỳ mẫu) |
| **C2** | Tên cặp đôi | Tên chú rể & cô dâu, dòng "Trân trọng kính mời" | `groom.name`, `bride.name` |
| **C3** | Cặp đôi | Ảnh chân dung 2 người, nhà trai / nhà gái | `images[1]`, `images[2]`, `*.address` |
| **C4** | Chuyện tình | 3 mốc (gặp gỡ → yêu → cầu hôn), lời văn viết sẵn trong mẫu | `images[3..5]` |
| **C5** | Save the date | Ngày cưới + đếm ngược | `date` ⚠️ (xem §3 P0) |
| **C6** | Sự kiện | Lễ gia tiên / lễ thành hôn / tiệc cưới, giờ viết sẵn | hardcode |
| **C7** | Địa điểm | Tên nhà hàng + `<MapEmbed>` + nút "Chỉ đường" | `venue` |
| **C8** | Album | Lưới hoặc chuỗi ảnh | `images[3..]` |
| **C9** | Video | Chỉ có khi `media.videos > 0` | `videos[0]` |
| **C10** | Lời cảm ơn | Câu kết + ảnh cuối | `images[n-1]` |

**Thứ tự ảnh cố định** (form "Dùng thử" hiển thị nhãn theo đúng thứ tự này):
`images[0]` ảnh bìa · `images[1]` chú rể · `images[2]` cô dâu · `images[3..]` chuyện tình / album.

### 2.2 Thư viện animation (A)
| Mã | Tên | Thông số mặc định |
|---|---|---|
| **A1** | fadeUp | `y: 40 → 0`, `opacity 0 → 1`, `0.8s`, `power3.out`, stagger `0.1` |
| **A2** | splitReveal | SplitText theo `chars` hoặc `lines`, mask, `yPercent 100 → 0`, stagger `0.03` |
| **A3** | clipReveal | Ảnh hiện dần bằng `clip-path: inset(100% 0 0 0) → inset(0)`, `1.1s`, `expo.out` |
| **A4** | parallaxLayers | Các lớp nền `yPercent` khác tốc độ, `scrub: true` |
| **A5** | horizontalTrack | Ghim section, dịch ngang theo cuộn (`x: -(scrollWidth - innerWidth)`) |
| **A6** | drawLine | DrawSVG `0% → 100%`, `scrub` |
| **A7** | countdownFlip | Mỗi chữ số lật `rotateX` khi thay đổi |
| **A8** | particles | Hạt rơi hoặc bay (cánh hoa, confetti…), 20–40 hạt, **tắt khi reduced-motion** |
| **A9** | marquee | Dòng chữ chạy ngang vô hạn |
| **A10** | flipZoom | GSAP Flip: bấm ảnh thumbnail phóng thành lightbox |
| **A11** | typewriter | Hiện từng ký tự (TextPlugin) |
| **A12** | float | Lơ lửng nhẹ `y ±8px`, `rotation ±2°`, `sine.inOut`, lặp vô hạn |

### 2.3 Thư viện chuyển cảnh (T)
| Mã | Cách chuyển từ card này sang card sau |
|---|---|
| **T1** | Cuộn tự nhiên, card sau hiện bằng A1 hoặc A3 |
| **T2** | Ghim card hiện tại, card sau hiện đè lên (crossfade) |
| **T3** | Xếp chồng: card sau trượt lên che card trước, card trước thu nhỏ còn 0.9 và tối đi |
| **T4** | Màn che: `clip-path` circle hoặc inset mở ra để lộ card sau |
| **T5** | Chuyển sang đoạn cuộn ngang (A5) |
| **T6** | Zoom xuyên qua: phóng to một phần tử (cửa, khung, lỗ) để đi vào card sau |
| **T7** | Lật trang: `rotateY` như trang sách, `transform-origin: left` |
| **T8** | 3D: camera di chuyển tới cảnh kế tiếp (chỉ dùng cho mẫu 3D) |

### 2.4 Nhạc
- File `public/templates/<slug>/music.mp3`, MP3 **96–128 kbps**, **≤ 3MB**, dài 2–3 phút, tìm trên Pixabay theo từ khoá ghi trong từng mẫu.
- Nút bật/tắt đặt ở **góc trên phải** (góc trên trái là nút Quay lại, góc dưới phải là Dùng thử).
- Khi mở thiệp: âm lượng tăng 0 → 0.6 trong 1.5 giây. Khi tab bị ẩn: tạm dừng. Khi `prefers-reduced-motion`: vẫn phát nhạc, chỉ tắt chuyển động.

### 2.5 Design tokens
Mỗi mẫu có bộ tokens sau, khai báo bằng **arbitrary value Tailwind** trên phần tử gốc (không viết CSS thuần, theo spec §5):
`bg` · `surface` · `primary` · `accent` · `text` · font `display` · font `body` · `radius` · `ease` chủ đạo.

---

## 3. Lộ trình

| Giai đoạn | Việc | Ước lượng |
|---|---|---|
| **P0 – Nền tảng** | Bộ component dùng chung + mở rộng dữ liệu | 4–5 ngày |
| **P1 – Pilot** | 1 mẫu 2D mới + làm lại sakura-2d + 1 mẫu 3D, để kiểm chứng bộ component dùng chung | 5–6 ngày |
| **P2 – 2D đợt A** | Mẫu 2D số 02–11 | 10–12 ngày |
| **P3 – 3D đợt A** | Mẫu 3D số 02–05 | 12–14 ngày |
| **P4 – 2D đợt B** | Mẫu 2D số 12–21 | 10–12 ngày |
| **P5 – 3D đợt B** | Mẫu 3D số 06–10 | 15–18 ngày |
| **P6 – 2D đợt C** | Mẫu 2D số 22–30 | 9–11 ngày |
| **Tổng** | | **≈ 65–78 ngày công** (mẫu 2D ≈ 1–1.5 ngày, mẫu 3D ≈ 3–4 ngày) |

Các ước lượng trên là **dự đoán**, chưa đo thực tế. Sau P1 sẽ đo lại tốc độ thật và điều chỉnh.

### P0 — Nền tảng (làm trước mọi mẫu)
- [ ] **Chốt với chủ dự án**: thêm trường `date` (ngày + giờ tiệc) vào `WeddingData` và form "Dùng thử". Card C5 và C6 cần trường này. Nếu không thêm thì C5 phải dùng ngày viết sẵn.
- [ ] `bun add gsap @gsap/react`
- [ ] `src/kit/gsap.ts`: đăng ký ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, Flip, TextPlugin (một lần duy nhất)
- [ ] `src/kit/smooth-scroll.tsx`: wrapper ScrollSmoother, tắt khi reduced-motion
- [ ] `src/kit/open-gate.tsx`: card C1 dùng chung (children + callback `onOpen`), có unlock audio
- [ ] `src/kit/music-player.tsx`: nút bật/tắt nhạc, fade, tạm dừng khi tab ẩn
- [ ] `src/kit/countdown.tsx`: đếm ngược theo ngày cưới, hỗ trợ A7
- [ ] `src/kit/use-reduced-motion.ts`
- [ ] `src/kit/presets.ts`: A1–A12 viết thành hàm, ví dụ `fadeUp(targets, opts)`
- [ ] Cập nhật `template-spec.md`: cho phép import từ `@/kit`; §8 đổi thành **bắt buộc có nhạc**; thêm quy ước thứ tự ảnh §2.1
- [ ] Form "Dùng thử": hiện nhãn cho từng vị trí ảnh (Ảnh bìa, Chú rể, Cô dâu, Album 1…)

### P3 bổ sung — Nền tảng 3D (làm ở đầu P1 cùng mẫu 3D pilot)
- [ ] `bun add three @react-three/fiber @react-three/drei` + `bun add -D @types/three`
- [ ] `src/kit/3d/scene-canvas.tsx`: `<Canvas>` cố định phía sau nội dung, `dpr={[1, 2]}`, kiểm tra WebGL rồi dùng fallback nếu không có, `frameloop="demand"` khi tab ẩn
- [ ] `src/kit/3d/scroll-rig.ts`: ScrollTrigger lưu progress vào ref, kèm hàm `lerpKeyframes(progress, keyframes)` cho camera
- [ ] `src/kit/3d/load-client.tsx`: wrapper `next/dynamic` với `ssr: false`
- [ ] Đo bundle: JS của `/` **không đổi** sau khi thêm three

---

## 4. Danh sách 40 mẫu

> **Spec chi tiết của từng mẫu nằm ở `docs/templates/<slug>.md`**: concept, tokens, wireframe từng section, nội dung, timeline animation, cách triển khai code, asset và tiêu chí nghiệm thu. **Khi code một mẫu, đọc file đó.** Phần §5–§6 bên dưới chỉ là tóm tắt.

| # | Slug | Tên | Loại | Styles | Colors | Đợt |
|---|---|---|---|---|---|---|
| 3D-01 | `galaxy-3d` | Hai Vì Sao | 3D | cinematic, modern | black, purple, gold | P1 |
| 3D-02 | `ocean-3d` | Thư Trong Chai | 3D | cinematic, playful | blue, beige | P3 |
| 3D-03 | `lantern-3d` | Phố Hội Đèn Lồng | 3D | traditional, cinematic | red, gold | P3 |
| 3D-04 | `paper-crane-3d` | Ngàn Hạc Giấy | 3D | minimalist, playful | white, pink | P3 |
| 3D-05 | `firefly-3d` | Rừng Đom Đóm | 3D | cinematic, floral | green, gold | P3 |
| 3D-06 | `train-3d` | Chuyến Tàu Thống Nhất | 3D | vintage, cinematic | red, beige | P5 |
| 3D-07 | `seasons-3d` | Bốn Mùa Yêu | 3D | floral, cinematic | pink, green | P5 |
| 3D-08 | `museum-3d` | Bảo Tàng Kỷ Niệm | 3D | luxury, modern | white, gold | P5 |
| 3D-09 | `balloon-3d` | Khinh Khí Cầu | 3D | playful, cinematic | blue, pink | P5 |
| 3D-10 | `lotus-3d` | Đầm Sen | 3D | traditional, floral | pink, green | P5 |
| 2D-01 | `sakura-2d` | Sakura (làm lại) | 2D | minimalist, floral | pink, white | P1 |
| 2D-02 | `letter-2d` | Phong Thư Sáp | 2D | vintage | beige, red | P1 |
| 2D-03 | `polaroid-2d` | Sổ Polaroid | 2D | playful, vintage | beige, white | P2 |
| 2D-04 | `film-2d` | Thước Phim | 2D | cinematic | black, white | P2 |
| 2D-05 | `editorial-2d` | Tạp Chí Cưới | 2D | modern, luxury | white, black | P2 |
| 2D-06 | `song-hy-2d` | Song Hỷ | 2D | traditional | red, gold | P2 |
| 2D-07 | `ao-dai-2d` | Áo Dài Tím Huế | 2D | traditional, floral | purple, white | P2 |
| 2D-08 | `swiss-2d` | Swiss Mono | 2D | minimalist, modern | white, black | P2 |
| 2D-09 | `botanical-2d` | Vườn Màu Nước | 2D | floral | green, white | P2 |
| 2D-10 | `boho-2d` | Boho Đất Nung | 2D | vintage, floral | beige, red | P2 |
| 2D-11 | `tropical-2d` | Biển Nhiệt Đới | 2D | playful | blue, green | P2 |
| 2D-12 | `picnic-2d` | Tiệc Vườn Picnic | 2D | playful | red, white | P4 |
| 2D-13 | `gatsby-2d` | Gatsby | 2D | luxury, vintage | black, gold | P4 |
| 2D-14 | `vinyl-2d` | Đĩa Than 70s | 2D | vintage, playful | beige, red | P4 |
| 2D-15 | `comic-2d` | Truyện Tranh | 2D | playful | red, blue | P4 |
| 2D-16 | `pixel-2d` | Nhiệm Vụ 8-bit | 2D | playful | blue, green | P4 |
| 2D-17 | `boarding-2d` | Thẻ Lên Máy Bay | 2D | modern, playful | blue, white | P4 |
| 2D-18 | `lich-to-2d` | Lịch Bloc | 2D | traditional, vintage | red, white | P4 |
| 2D-19 | `newspaper-2d` | Báo Tin Vui | 2D | vintage | beige, black | P4 |
| 2D-20 | `cafe-2d` | Cà Phê Sài Gòn | 2D | vintage, playful | beige, black | P4 |
| 2D-21 | `chat-2d` | Tin Nhắn Đầu Tiên | 2D | modern, playful | blue, white | P4 |
| 2D-22 | `rustic-2d` | Gỗ Mộc Đèn Dây | 2D | vintage, floral | beige, green | P6 |
| 2D-23 | `neon-2d` | Neon Sài Gòn | 2D | modern, cinematic | black, pink | P6 |
| 2D-24 | `son-mai-2d` | Sơn Mài | 2D | traditional, luxury | black, red, gold | P6 |
| 2D-25 | `dong-ho-2d` | Tranh Đông Hồ | 2D | traditional, playful | beige, red | P6 |
| 2D-26 | `da-lat-2d` | Sương Đà Lạt | 2D | minimalist, cinematic | green, white | P6 |
| 2D-27 | `route-map-2d` | Bản Đồ Hành Trình | 2D | modern, playful | beige, blue | P6 |
| 2D-28 | `marble-2d` | Đá Cẩm Thạch | 2D | luxury, minimalist | white, gold | P6 |
| 2D-29 | `crayon-2d` | Nét Sáp Màu | 2D | playful | white, pink | P6 |
| 2D-30 | `starry-2d` | Đêm Đầy Sao | 2D | cinematic, floral | blue, gold | P6 |

---

## 5. Mẫu 3D — parallax scroll storytelling

**Khung chung cho mọi mẫu 3D**
- Canvas cố định (`fixed inset-0 -z-10`). Nội dung HTML (các card) cuộn phía trên. Mỗi card chiếm khoảng `100–150vh`.
- ScrollTrigger (`trigger: #smooth-content`, `scrub: 1`) cập nhật `progress` từ 0 đến 1. Mỗi "cảnh" ứng với một khoảng progress. Camera nội suy giữa các keyframe `{ at, pos, lookAt }` bằng easing `sine.inOut`.
- Chữ luôn là HTML, đặt trên nền trong suốt hoặc `backdrop-blur` để dễ đọc.
- **Fallback** (khi không có WebGL hoặc bật reduced-motion): ẩn canvas, thay bằng ảnh nền tĩnh, cảnh chụp sẵn từ scene và lưu tại `public/templates/<slug>/fallback-*.webp`. Card vẫn hiện bằng A1.
- Trên mobile: số hạt giảm còn 50%, `dpr` tối đa 1.5, tắt shadow.
- Ảnh người dùng đưa vào scene: dùng `useTexture` với URL (có thể là `blob:`). Plane tỉ lệ 3:4, `meshBasicMaterial` để không phụ thuộc ánh sáng.

### 3D-01 · `galaxy-3d` · Hai Vì Sao
- **Ý tưởng**: Hai ngôi sao ở hai đầu vũ trụ, bay theo quỹ đạo xoắn tới gần nhau rồi hợp làm một.
- **Tokens**: bg `#07061a` · surface `#14123a/70` · primary `#f4d58d` · accent `#9b8cff` · text `#eeeaff` · display **Cormorant Garamond** · body **Be Vietnam Pro** · radius `1.5rem` · ease `power2.inOut`
- **Nhạc**: ambient piano kèm pad, khoảng 70 BPM, cảm giác lơ lửng. Từ khoá Pixabay: `ambient piano space`, `cinematic ambient romantic`
- **Media**: 8 ảnh, 1 video

| % cuộn | Card | Cảnh 3D / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–8 | C1 | Trường sao (drei `Stars`, 5000 sao), camera đứng yên và trôi rất chậm | Nút "Mở thiệp" phát sáng (A12) | Bấm nút: camera lao về phía trước 2 giây, sao kéo thành vệt (tăng `speed`) |
| 8–20 | C2 | Hai điểm sáng (sphere emissive + Sparkles) hiện ở hai phía màn hình | Tên xuất hiện bằng A2, mỗi tên nằm gần ngôi sao của mình | T8: camera lùi xa để thấy quỹ đạo |
| 20–35 | C3 | Hai sao bay theo quỹ đạo xoắn lại gần. Hai plane ảnh chân dung bay quanh mỗi sao | Card nhà trai / nhà gái A1 nằm hai bên | T8: camera bay xuyên giữa hai sao |
| 35–50 | C4 | 3 chòm sao: các đường nối được vẽ dần (`setDrawRange` theo progress), mỗi chòm có 1 ảnh | 3 mốc chuyện tình, A1 lần lượt | T8: bay qua từng chòm |
| 50–65 | C8 | Ảnh album xếp theo đường xoắn ốc, camera bay dọc trục xoắn | Tiêu đề "Khoảnh khắc" dùng A2 | T8 |
| 65–78 | C5 + C6 | Hai sao chạm nhau, tạo vụ nổ ánh sáng (scale + opacity của sprite additive) | Đếm ngược A7 hiện ngay sau vụ nổ | Màn trắng loé 0.3 giây |
| 78–90 | C7 | Camera kéo xa thấy một hành tinh xanh, đặt ghim ở vị trí tiệc | Card bản đồ nền `backdrop-blur` | T8 |
| 90–100 | C9 + C10 | Hai sao đã thành một, quay chậm | Lời cảm ơn A2, nút "Xem video" mở lightbox A10 | — |

- **Điểm nhấn**: di chuột hoặc nghiêng điện thoại làm lệch nhẹ góc nhìn (parallax theo con trỏ, ±0.3).
- **Fallback**: nền gradient tím và ảnh tĩnh `fallback-stars.webp`.

### 3D-02 · `ocean-3d` · Thư Trong Chai
- **Ý tưởng**: Một chai thư trôi từ bãi biển lúc hoàng hôn, lặn xuống đáy biển, rồi nổi lên ở bến cảng về đêm.
- **Tokens**: bg `#0b2a3c` · surface `#fdf6ec/85` · primary `#f2a65a` · accent `#5cc8d7` · text `#0b2a3c` (trên surface) · display **Playfair Display** · body **Quicksand** · radius `1rem` · ease `sine.inOut`
- **Nhạc**: guitar mộc kèm tiếng sóng nhẹ, khoảng 80 BPM. Từ khoá: `acoustic guitar ocean romantic`
- **Media**: 8 ảnh, 1 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Mặt biển low-poly với sóng tạo bằng vertex shader (sin theo thời gian), mặt trời lặn, chai thư ở mép sóng | "Mở thiệp" nằm trên cát | Bấm: chai trôi ra xa |
| 10–25 | C2 | Camera theo chai, mặt trời chìm dần | Tên A2 xuất hiện như viết trên cát | Camera chui xuống dưới mặt nước: fog xanh tăng dần, có tia sáng (cone additive) |
| 25–45 | C3 + C4 | Đáy biển: rạn san hô (các khối low-poly), bong bóng (instanced) | Mỗi mốc chuyện tình là một "cuộn giấy" mở ra (scaleY) | T8 |
| 45–60 | C8 | Ảnh nằm trong các bong bóng lớn nổi lên (A12) | Tiêu đề A1 | T8: đi lên theo bong bóng |
| 60–75 | C5 + C6 | Nổi lên ở bến cảng về đêm, có đèn trên cầu tàu | Đếm ngược viết trên tấm biển gỗ | T8 |
| 75–88 | C7 | Ngọn hải đăng quét chùm sáng về phía hướng nhà hàng | Card bản đồ | T8 |
| 88–100 | C9 + C10 | Pháo hoa (particles) trên mặt biển | Cảm ơn và nút video | — |

- **Điểm nhấn**: nửa trên của màn hình là cảnh mặt nước, nửa dưới là dưới nước, ngăn cách bằng một đường sóng.
- **Fallback**: ảnh gradient hoàng hôn và đáy biển.

### 3D-03 · `lantern-3d` · Phố Hội Đèn Lồng
- **Ý tưởng**: Ngồi thuyền trôi dọc sông Hoài, hai bên là đèn lồng. Mỗi căn nhà cổ trên bờ là một chương của câu chuyện.
- **Tokens**: bg `#1a0f0a` · surface `#f7ecd8/90` · primary `#d9361e` · accent `#f5b83d` · text `#2b1a10` · display **Playfair Display** · body **Lora** · radius `0.5rem` · ease `power2.out`
- **Nhạc**: đàn tranh và sáo trúc, chậm, khoảng 65 BPM. Từ khoá: `vietnamese traditional zither`, `asian flute calm`
- **Media**: 8 ảnh, 0 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Mũi thuyền nhìn ra sông tối, một chiếc đèn lồng đỏ ở gần | "Mở thiệp": đèn bật sáng (tăng emissive), sau đó cả dãy đèn sáng lần lượt | Thuyền bắt đầu trôi |
| 10–25 | C2 | Hai bờ có đèn lồng (instanced, lắc nhẹ) | Tên viết trên tấm biển gỗ treo ở mái nhà | T8: trôi dọc sông |
| 25–40 | C3 | Hai ngôi nhà đối diện nhau, cửa sổ hiện ảnh chân dung | Nhà trai bên trái, nhà gái bên phải | T8 |
| 40–60 | C4 | Hoa đăng trôi trên mặt nước, mỗi chiếc mang một ảnh | 3 mốc chuyện tình A1 | T8 |
| 60–75 | C8 | Cầu Chùa: ảnh treo dưới mái cầu | A3 | Thuyền đi qua dưới gầm cầu |
| 75–88 | C5 + C6 + C7 | Bến đỗ | Đếm ngược, sự kiện, bản đồ | T8 |
| 88–100 | C10 | Thả hàng trăm đèn trời bay lên (instanced, bay theo trục y) | Lời cảm ơn | — |

- **Điểm nhấn**: chạm vào hoa đăng thì nó toả sáng và phát tiếng chuông nhỏ.
- **Fallback**: ảnh phố cổ về đêm vẽ minh hoạ và đèn lồng CSS.

### 3D-04 · `paper-crane-3d` · Ngàn Hạc Giấy
- **Ý tưởng**: Thế giới làm bằng giấy gấp. Một con hạc giấy dẫn đường, cuối cùng là 1000 con hạc (theo truyền thuyết gấp đủ 1000 con hạc thì được một điều ước).
- **Tokens**: bg `#faf7f2` · surface `#ffffff` · primary `#e76f7e` · accent `#7aa6c2` · text `#3a3a3a` · display **Fraunces** · body **Nunito** · radius `0.25rem` · ease `back.out(1.4)`
- **Nhạc**: music box và piano, khoảng 90 BPM, trong trẻo. Từ khoá: `music box lullaby`, `soft piano happy`
- **Media**: 6 ảnh, 0 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Tờ giấy phẳng giữa màn hình | "Mở thiệp": tờ giấy tự gấp thành hạc (morph targets hoặc animation có sẵn trong `.glb`) | Hạc cất cánh |
| 10–25 | C2 | Hạc bay qua các ngọn núi giấy (bóng flat shading) | Tên dùng A2 | T8: bám theo hạc |
| 25–40 | C3 | Hai ngôi nhà giấy dạng pop-up bật lên (scaleY từ 0) | Nhà trai và nhà gái | T8 |
| 40–60 | C4 | Ba tờ giấy dựng thành khung ảnh | Chuyện tình | T8 |
| 60–75 | C8 | Ảnh là các tấm thiệp giấy treo trên dây | A12 | T8 |
| 75–90 | C5 + C6 + C7 | Thung lũng giấy | Đếm ngược, sự kiện, bản đồ | T8 |
| 90–100 | C10 | 1000 hạc (instanced mesh) bay lên tạo thành hình trái tim | Cảm ơn | — |

- **Tài nguyên cần tạo**: `crane.glb` có animation gấp, dung lượng ≤ 300KB (làm bằng Blender hoặc tìm model CC0).
- **Fallback**: SVG hạc giấy chạy bằng A6.

### 3D-05 · `firefly-3d` · Rừng Đom Đóm
- **Ý tưởng**: Đi trên lối mòn trong rừng đêm, đom đóm dẫn đường tới khoảng rừng trống có đèn dây, nơi hai người gặp nhau.
- **Tokens**: bg `#050d0a` · surface `#0f1f18/75` · primary `#e9f59a` · accent `#7fd1a8` · text `#eef7ea` · display **Great Vibes** · body **Be Vietnam Pro** · radius `1rem` · ease `sine.inOut`
- **Nhạc**: piano, celesta và tiếng côn trùng đêm, khoảng 72 BPM. Từ khoá: `magical forest night piano`
- **Media**: 8 ảnh, 1 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Tối hoàn toàn, chỉ vài con đom đóm | "Mở thiệp": hàng trăm đom đóm bay ra (drei `Sparkles`, lập loè bằng sin) | Camera tiến vào lối mòn |
| 10–25 | C2 | Hai bên là thân cây (các cylinder đặt ngẫu nhiên, fog) | Tên hiện sáng dần như được đom đóm vẽ | T8 |
| 25–45 | C3 + C4 | Ảnh treo trên cành bằng dây đay (plane lắc nhẹ) | Card A1 | T8 |
| 45–60 | C8 | Hành lang ảnh treo hai bên lối đi | A3 | T8 |
| 60–78 | C5 + C6 | Khoảng rừng trống có đèn dây vòm (points theo đường catenary) | Đếm ngược | T8 |
| 78–90 | C7 | Đom đóm xếp thành mũi tên chỉ hướng | Bản đồ | T8 |
| 90–100 | C9 + C10 | Đom đóm tụ lại thành chữ tên viết tắt của hai người | Cảm ơn và video | — |

- **Điểm nhấn**: đom đóm né theo con trỏ hoặc ngón tay.
- **Fallback**: nền tối và đom đóm CSS (A8).

### 3D-06 · `train-3d` · Chuyến Tàu Thống Nhất
- **Ý tưởng**: Tàu chạy từ ga quê chú rể tới ga quê cô dâu. Mỗi ga dừng là một chương của câu chuyện.
- **Tokens**: bg `#f3e7d3` · surface `#fffaf0` · primary `#b3261e` · accent `#1f4e5f` · text `#2d2419` · display **Old Standard TT** · body **Roboto Slab** · radius `0.25rem` · ease `power1.inOut`
- **Nhạc**: nhạc retro vui kèm tiếng tàu nhịp đều, khoảng 100 BPM. Từ khoá: `vintage travel acoustic`, `train journey happy`
- **Media**: 8 ảnh, 1 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Sân ga, tàu đỗ | Vé tàu (HTML) có nút "Soát vé" = Mở thiệp. Bấm thì vé bị bấm lỗ (A1) và tàu kéo còi | Tàu chuyển bánh |
| 10–25 | C2 + C3 | Ga 1 mang tên địa chỉ nhà trai (lấy từ `groom.address`) | Tên và ảnh chú rể | T8: camera nhìn ngang, cảnh vật chạy lùi (A4 3D) |
| 25–45 | C4 | Phong cảnh ruộng lúa, núi, biển lần lượt thay nhau (các lớp parallax) | Ba mốc chuyện tình hiện như cửa sổ toa tàu | T8 |
| 45–60 | C3 (cô dâu) | Ga 2 mang tên địa chỉ nhà gái | Ảnh cô dâu | T8 |
| 60–75 | C8 | Ảnh dán trên cửa sổ các toa | A5 ngang trong HTML | T8 |
| 75–90 | C5 + C6 + C7 | Ga cuối "Hạnh Phúc" | Bảng giờ tàu dạng split-flap hiện ngày giờ (A7), bản đồ | T8 |
| 90–100 | C9 + C10 | Tàu chạy vào hoàng hôn | Cảm ơn | — |

- **Điểm nhấn**: bảng giờ kiểu split-flap lật từng ký tự.
- **Fallback**: SVG tàu chạy ngang và ảnh phong cảnh tĩnh.

### 3D-07 · `seasons-3d` · Bốn Mùa Yêu
- **Ý tưởng**: Một cây duy nhất ở giữa, camera quay vòng quanh cây. Mỗi góc quay là một mùa, ứng với một giai đoạn tình yêu.
- **Tokens**: bg thay đổi theo mùa (xuân `#fdeef2`, hạ `#e8f6e9`, thu `#fbe8d3`, đông `#eef3f8`) · primary `#c2410c` · accent `#16a34a` · text `#1f2937` · display **Playfair Display** · body **Manrope** · radius `1.25rem` · ease `sine.inOut`
- **Nhạc**: dàn dây nhẹ nhàng (theo phong cách Vivaldi hiện đại), khoảng 85 BPM. Từ khoá: `romantic strings seasons`
- **Media**: 8 ảnh, 0 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Cây trơ cành trên nền trắng | Mở thiệp: cây đâm chồi | Camera bắt đầu quay quanh cây |
| 10–30 | C2 + C3 | **Xuân**: hoa hồng rơi (particles hồng) | Tên, cặp đôi | Màu lá và nền chuyển dần (lerp) |
| 30–50 | C4 | **Hạ**: lá xanh, ánh nắng | Chuyện tình | T8: quay 90° |
| 50–70 | C8 | **Thu**: lá cam rơi, ảnh treo trên cành | Album | T8 |
| 70–85 | C5 + C6 + C7 | **Đông**: tuyết rơi, cây phủ đèn | Đếm ngược, sự kiện, bản đồ | T8 |
| 85–100 | C10 | Trở lại **xuân**, cây nở rộ | Cảm ơn | — |

- **Điểm nhấn**: chỉ dùng một hệ particles, đổi màu và vật lý theo mùa (rơi, bay, xoay).
- **Fallback**: 4 ảnh minh hoạ, crossfade theo cuộn.

### 3D-08 · `museum-3d` · Bảo Tàng Kỷ Niệm
- **Ý tưởng**: Tham quan một bảo tàng trưng bày kỷ vật của hai người. Mỗi phòng là một chương, ảnh treo trong khung và được đèn rọi.
- **Tokens**: bg `#f5f2ed` · surface `#ffffff` · primary `#1c1c1c` · accent `#b8924a` · text `#1c1c1c` · display **Cormorant Garamond** · body **Inter** · radius `0` · ease `power3.inOut`
- **Nhạc**: piano cổ điển solo, khoảng 60 BPM. Từ khoá: `classical piano elegant`
- **Media**: **12 ảnh**, 1 video (mẫu dùng nhiều ảnh nhất)

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–8 | C1 | Cửa bảo tàng đóng | Vé vào cửa, "Mở thiệp" | T6: cửa mở, camera đi vào |
| 8–20 | C2 | Sảnh chính, tên khắc trên tường đá | A2 | T8 |
| 20–35 | C3 | Phòng 1: hai bức chân dung đối diện, có spotlight | Bảng chú thích kiểu bảo tàng | T8 |
| 35–55 | C4 | Phòng 2: 3 khung ảnh và bệ trưng bày | Chú thích mỗi mốc | T8 |
| 55–75 | C8 | Hành lang dài với 6 khung ảnh, camera đi dọc | Bấm vào ảnh thì phóng to (A10) | T8 |
| 75–88 | C5 + C6 + C7 | Phòng cuối: tủ kính trưng "giấy mời" | Đếm ngược, bản đồ | T8 |
| 88–100 | C9 + C10 | Màn chiếu phim trong phòng tối | Video và cảm ơn | — |

- **Điểm nhấn**: spotlight bật dần khi camera tới gần bức ảnh.
- **Fallback**: lưới ảnh kiểu gallery trắng.

### 3D-09 · `balloon-3d` · Khinh Khí Cầu
- **Ý tưởng**: Bay khinh khí cầu từ mái nhà thành phố lên trên biển mây, rồi lên bầu trời sao.
- **Tokens**: bg gradient trời thay đổi theo độ cao (`#bfe3f7` → `#f9c6c9` → `#1b1f4b`) · surface `#ffffff/85` · primary `#ef6f6c` · accent `#3d84a8` · text `#23303f` · display **Pacifico** · body **Quicksand** · radius `1.5rem` · ease `sine.inOut`
- **Nhạc**: ukulele và glockenspiel, vui, khoảng 110 BPM. Từ khoá: `ukulele happy wedding`
- **Media**: 8 ảnh, 0 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Khinh khí cầu trên sân thượng | Mở thiệp: đốt lửa (ánh sáng chớp) | Khinh khí cầu bay lên |
| 10–30 | C2 + C3 | Mái nhà thành phố thu nhỏ dần | Tên trên dải băng treo ở giỏ | T8: đi lên |
| 30–50 | C4 | Xuyên qua mây (drei `Cloud`) | Chuyện tình | T8 |
| 50–65 | C8 | Trên biển mây: nhiều khinh khí cầu nhỏ, mỗi chiếc mang một ảnh | A12 | T8 |
| 65–85 | C5 + C6 + C7 | Hoàng hôn trên mây | Đếm ngược, bản đồ | T8 |
| 85–100 | C10 | Trời sao | Cảm ơn | — |

- **Fallback**: các lớp mây SVG parallax (A4).

### 3D-10 · `lotus-3d` · Đầm Sen
- **Ý tưởng**: Bình minh trên đầm sen. Camera lướt sát mặt nước, mỗi nụ sen nở ra là một card.
- **Tokens**: bg `#f6efe7` · surface `#ffffff/80` · primary `#d9577a` · accent `#4f7d4a` · text `#2f2a26` · display **Noto Serif Display** · body **Be Vietnam Pro** · radius `1rem` · ease `sine.out`
- **Nhạc**: sáo trúc và đàn bầu, rất chậm, khoảng 60 BPM. Từ khoá: `vietnamese bamboo flute`, `zen lotus calm`
- **Media**: 8 ảnh, 0 video

| % | Card | Cảnh / camera | HTML & animation | Chuyển tiếp |
|---|---|---|---|---|
| 0–10 | C1 | Mặt nước phủ sương, trời sắp sáng | Mở thiệp: mặt trời lên, sương tan | Camera lướt tới |
| 10–25 | C2 | Nụ sen lớn nở (cánh xoay quanh trục, stagger) | Tên | T8 |
| 25–40 | C3 | Hai lá sen, trên mỗi lá là một ảnh chân dung | Cặp đôi | T8 |
| 40–60 | C4 | Chuồn chuồn bay dẫn tới ba bông sen | Chuyện tình | T8 |
| 60–75 | C8 | Ảnh phản chiếu dưới mặt nước (mirror plane) | Album | T8 |
| 75–90 | C5 + C6 + C7 | Nhà thuỷ tạ | Đếm ngược, bản đồ | T8 |
| 90–100 | C10 | Cánh sen bay lên | Cảm ơn | — |

- **Fallback**: minh hoạ sen màu nước và A8 cánh sen.

---

## 6. Mẫu 2D — HTML + Tailwind + GSAP

**Khung chung cho mọi mẫu 2D**
- Bọc toàn bộ nội dung trong ScrollSmoother (`smooth: 1.2`, `effects: true` để dùng `data-speed` cho parallax).
- Mỗi card là một `<section>` cao tối thiểu `100svh` trên mobile.
- Mặc định mỗi card dùng A1 cho chữ và A3 cho ảnh, trừ khi bảng ghi khác.
- Khi reduced-motion: tắt ScrollSmoother, A4, A5, A8; giữ A1 với thời lượng 0.3 giây.

### 2D-01 · `sakura-2d` · Sakura (làm lại mẫu đang có)
- **Ý tưởng**: Tối giản kiểu Nhật, cánh anh đào rơi, nhiều khoảng trắng.
- **Tokens**: bg `#fff7f8` · surface `#ffffff` · primary `#d9667f` · accent `#f4b6c2` · text `#5b3a44` · display **Dancing Script** · body **Playfair Display** · radius `1rem` · ease `power2.out`
- **Nhạc**: piano solo nhẹ, khoảng 70 BPM. Từ khoá: `japanese piano calm romantic`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Nền hồng, cành anh đào SVG ở góc, nút tròn "Mở" | A6 vẽ cành hoa, A12 nút | T4: hình tròn mở từ nút |
| C2 | Tên xếp dọc, "&" ở giữa, khung ảnh bìa hình vòm | A2 chữ, A3 ảnh | T1 |
| C3 | Hai cột: ảnh vòm + nhà trai / nhà gái | A1 so le | T1 |
| C4 | Timeline dọc, cánh hoa là các điểm mốc | A6 đường timeline theo scrub | T1 |
| C11 + C5 | Lịch tháng với trái tim khoanh ngày cưới + đếm ngược | A7 | T1 |
| C6 + C7 | Hai thẻ sự kiện + bản đồ | A1 | T1 |
| C8 | Lưới 2 cột so le (masonry) | A3, `data-speed` | T1 |
| C14 + C10 | QR mừng cưới + lời cảm ơn | A1 | — |
- **Điểm nhấn**: A8 cánh hoa rơi suốt trang, mật độ tăng dần theo cuộn.

### 2D-02 · `letter-2d` · Phong Thư Sáp
- **Ý tưởng**: Phong bì kín có con dấu sáp. Mở thư ra sẽ rút ra từng tấm thiệp (lấy cảm hứng từ các mẫu phong bì ở mục tham khảo §7).
- **Tokens**: bg `#efe8dc` · surface `#fbf8f2` · primary `#6b7b5a` (xanh olive) · accent `#8a3b2e` (sáp) · text `#3b362e` · display **Pinyon Script** · body **Cormorant Garamond** · radius `0.25rem` · ease `power3.inOut`
- **Nhạc**: dàn dây và piano cổ điển, khoảng 66 BPM. Từ khoá: `romantic strings piano wedding`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Phong bì giữa màn hình, dấu sáp khắc chữ viết tắt, dòng "Chạm vào dấu sáp để mở" | Dấu sáp A12. Bấm vào: sáp vỡ (scale + rotate), nắp phong bì lật lên (`rotateX` 180°), ảnh bìa trượt ra | T6: phóng to tấm thiệp |
| C16 | Thanh phát nhạc "Chạm để nghe bài hát của chúng tôi" | A1 | T1 |
| C2 | Thiệp giấy có viền răng cưa, tên viết tay | A11 viết tên | T3 |
| C3 | Hai thẻ nhỏ ghim bằng kẹp giấy, ảnh polaroid | A1 kèm xoay ±3° | T3 |
| C5 + C11 | Ngày cưới số lớn, lịch tháng | A7 | T3 |
| C6 + C12 | Các thẻ sự kiện, lịch trình dạng icon nét mảnh | A6 icon | T3 |
| C7 | Thẻ bản đồ | A1 | T3 |
| C13 | Dress code: 3 chấm màu | A1 | T3 |
| C8 | Các tấm thiệp xếp chồng, vuốt để lướt | A10 | T1 |
| C14 + C15 + C10 | QR mừng cưới, form RSVP (chỉ UI), lời cảm ơn trong phong bì đóng lại | Phong bì gập lại (đảo ngược C1) | — |
- **Điểm nhấn**: T3 xếp chồng, mỗi card trông như một tấm thiệp rút ra từ phong bì.

### 2D-03 · `polaroid-2d` · Sổ Polaroid
- **Ý tưởng**: Cuốn scrapbook có ảnh polaroid, băng dính washi và chữ viết tay.
- **Tokens**: bg `#f4efe6` (giấy kraft) · surface `#ffffff` · primary `#e07a5f` · accent `#81b29a` · text `#3d405b` · display **Patrick Hand** · body **Nunito** · radius `0.125rem` · ease `back.out(1.7)`
- **Nhạc**: indie folk, ukulele, khoảng 100 BPM. Từ khoá: `indie folk happy acoustic`
- **Media**: 10 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Bìa sổ vải, nhãn tên | Bấm: bìa lật mở | T7 |
| C2 | Trang đầu, tên viết tay, dán sticker trái tim | A11, sticker bật `back.out` | T7 |
| C3 | Hai polaroid dán washi | Rơi xuống, xoay ngẫu nhiên ±8° | T1 |
| C4 | Ba polaroid dọc theo đường chỉ đỏ | A6 đường chỉ | T1 |
| C8 | Ảnh vương vãi trên bàn, **kéo thả được** (GSAP Draggable) | Rơi xuống lần lượt | T1 |
| C5 + C6 + C7 | Tờ note vàng ghim, bản đồ dán băng dính | A1 | T1 |
| C10 | Trang cuối, dấu mộc "Just married" | Dấu mộc đập xuống (scale 1.4 → 1 kèm rung nhẹ) | — |

### 2D-04 · `film-2d` · Thước Phim
- **Ý tưởng**: Phim điện ảnh đen trắng. Mỗi card là một "cảnh" có clapperboard.
- **Tokens**: bg `#0d0d0d` · surface `#1a1a1a` · primary `#f5f5f0` · accent `#c9a227` · text `#e8e8e3` · display **Playfair Display** (italic) · body **Space Mono** · radius `0` · ease `power4.inOut`
- **Nhạc**: jazz piano noir, khoảng 80 BPM. Từ khoá: `noir jazz piano romantic`
- **Media**: 8 ảnh, **1 video**

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Đếm ngược phim 3-2-1 (vòng tròn quét) | Kim quét dùng conic-gradient + GSAP | Bấm: hiệu ứng nhiễu film grain, T4 |
| C2 | "A film by…" và tên hai người, có letterbox | A2 | T2 |
| C3 | Hai "diễn viên chính" dạng thẻ nhân vật | A3 | T2 |
| C4 | Dải film strip ngang, mỗi khung là một mốc | A5 | T5 |
| C9 | Màn chiếu video | A3 | T2 |
| C5 + C6 + C7 | "Công chiếu": ngày giờ, rạp (nhà hàng) | Chữ credit cuộn lên | T2 |
| C10 | "The End", cuộn credits | A9 dọc | — |
- **Điểm nhấn**: lớp nhiễu film grain phủ cả trang (SVG noise, `mix-blend-overlay`). **Không dùng canvas.**

### 2D-05 · `editorial-2d` · Tạp Chí Cưới
- **Ý tưởng**: Tạp chí thời trang kiểu Vogue, ảnh bìa lớn, typography mạnh.
- **Tokens**: bg `#ffffff` · surface `#f3f1ee` · primary `#111111` · accent `#b91c1c` · text `#111111` · display **Playfair Display** (900) · body **Manrope** · radius `0` · ease `expo.out`
- **Nhạc**: nhạc thời trang chill-house, khoảng 110 BPM. Từ khoá: `fashion chill house`
- **Media**: 8 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Bìa tạp chí: ảnh bìa tràn màn hình, tên tạp chí đè lên | A3 | Bấm: T7 lật bìa |
| C2 | Tiêu đề chữ cực lớn cắt mép, số phát hành = ngày cưới | A2 theo dòng | T1 |
| C3 | Bài phỏng vấn "Q&A" 2 cột | A1 | T1 |
| C4 | Bố cục lưới 12 cột, trích dẫn lớn | Trích dẫn hiện dần bằng A6 gạch chân | T1 |
| C8 | Ảnh tràn lề, kèm chú thích | A4 `data-speed` | T1 |
| C5 + C6 + C7 | Trang "Lịch sự kiện" | A1 | T1 |
| C10 | Bìa sau | A9 tên hai người | — |

### 2D-06 · `song-hy-2d` · Song Hỷ
- **Ý tưởng**: Truyền thống Việt Nam: chữ Hỷ đôi, đỏ và vàng kim, hoạ tiết mây. Đây là dòng mẫu được ưa chuộng nhất trên các nền tảng Việt Nam (xem §7).
- **Tokens**: bg `#9b1b1e` · surface `#fff4e0` · primary `#d4a24c` · accent `#6b0f12` · text `#4a1a0c` · display **Noto Serif Display** · body **Noto Serif** · radius `0.5rem` · ease `power2.out`
- **Nhạc**: nhạc cưới truyền thống bằng nhạc cụ dân tộc (hoà tấu), khoảng 90 BPM. Từ khoá: `chinese wedding traditional instrumental`, `asian celebration`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Hai cánh cửa gỗ son đỏ đóng, có chữ Hỷ ở giữa | Bấm: hai cánh cửa mở ra hai bên (`rotateY` ±100°, `perspective`) | T6 |
| C2 | "Lễ Thành Hôn", tên, có tên bố mẹ hai bên ⚠️ | A2, chữ Hỷ A6 viền vàng | T1 |
| C3 | Hai khung tròn, hoạ tiết mây | A3 dạng hình tròn | T1 |
| C6 | **Lễ Vu Quy** (tại nhà gái, dùng `bride.address`) và **Lễ Thành Hôn** (tại nhà trai, dùng `groom.address`) | A1 | T1 |
| C5 + C11 | Lịch âm và lịch dương | A7 | T1 |
| C7 | Bản đồ khung viền mây | A1 | T1 |
| C8 | Lưới ảnh khung vàng | A3 | T1 |
| C14 + C10 | QR mừng cưới, lời cảm ơn | A8 pháo giấy đỏ | — |
- **Điểm nhấn**: mây lành trôi hai bên (A4); card sự kiện dùng địa chỉ nhà trai và nhà gái, đúng với phong tục đám cưới Việt.

### 2D-07 · `ao-dai-2d` · Áo Dài Tím Huế
- **Ý tưởng**: Huế thơ mộng: tím Huế, nón lá, sông Hương, chữ thư pháp.
- **Tokens**: bg `#f5f0f7` · surface `#ffffff` · primary `#5b2a86` · accent `#c9a0dc` · text `#2e1a40` · display **Ephesis** · body **Lora** · radius `1rem` · ease `sine.inOut`
- **Nhạc**: đàn tranh hoà tấu nhạc Huế, khoảng 60 BPM. Từ khoá: `vietnamese zither slow`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tà áo dài (SVG) bay | A12 và nút | T4 dạng tấm lụa quét ngang |
| C2 | Tên viết thư pháp | A6 vẽ nét chữ (SVG path) | T1 |
| C3 | Ảnh khung nón lá | A3 | T1 |
| C4 | Dòng sông (SVG path) uốn qua 3 mốc | A6 theo scrub | T1 |
| C5 + C6 + C7 | | A1 | T1 |
| C8 | Cuộn ngang như bức tranh lụa | A5 | T5 |
| C10 | | A8 hoa sen | — |

### 2D-08 · `swiss-2d` · Swiss Mono
- **Ý tưởng**: Thiết kế kiểu Thuỵ Sĩ: lưới nghiêm ngặt, chữ cực lớn, chỉ đen trắng và một màu nhấn.
- **Tokens**: bg `#ffffff` · surface `#f2f2f2` · primary `#000000` · accent `#ff3b30` · text `#000000` · display **Inter** (900, tracking chặt) · body **Inter** · radius `0` · ease `expo.inOut`
- **Nhạc**: nhạc điện tử tối giản, khoảng 120 BPM. Từ khoá: `minimal electronic modern`
- **Media**: 4 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Số thứ tự "01" rất to và nút "Mở" | Bấm: các khối lưới trượt ra | T4 dạng các dải inset |
| C2 | Tên chữ cỡ `20vw` cắt ra ngoài mép | A2 theo ký tự | T1 |
| C3 → C10 | Mỗi card có số thứ tự 02, 03… và ô lưới 12 cột | A1 nhanh (0.5s) | T3 |
- **Điểm nhấn**: đường kẻ lưới vẽ dần bằng A6 khi cuộn tới.

### 2D-09 · `botanical-2d` · Vườn Màu Nước
- **Ý tưởng**: Lá cây màu nước xanh sage, rất giống hai mẫu hoa rum xanh ở mục tham khảo §7.
- **Tokens**: bg `#f7f6f1` · surface `#ffffff` · primary `#5f7a5a` · accent `#c8d5b9` · text `#34402f` · display **Great Vibes** · body **Cormorant Garamond** · radius `9999px` (khung vòm) · ease `sine.out`
- **Nhạc**: guitar mộc và piano, khoảng 76 BPM. Từ khoá: `acoustic wedding soft guitar`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Phong bì trắng, cành lá tràn mép | Lá mọc dần (A6 và scale), mở phong bì | T6 |
| C16 + C2 | Thanh nhạc, tên và ảnh vòm | A2, A3 | T1 |
| C5 + C11 | Ngày "06" cỡ lớn, lịch tháng | A7 | T1 |
| C6 | Khối xanh bo vòm trên đầu (giống ảnh tham khảo) | A1 | T1 |
| C12 | Lịch trình, timeline có icon | A6 | T1 |
| C7 + C13 + C14 + C15 + C10 | | A1 | — |
- **Điểm nhấn**: các lớp lá ở mép màn hình có `data-speed` khác nhau, tạo chiều sâu.

### 2D-10 · `boho-2d` · Boho Đất Nung
- **Ý tưởng**: Boho: màu đất nung, cỏ lau pampas, hình vòm, mặt trời.
- **Tokens**: bg `#f3e9dc` · surface `#fffaf3` · primary `#c0673e` · accent `#8a9a5b` · text `#4a3426` · display **Fraunces** (italic) · body **Josefin Sans** · radius `9999px 9999px 0 0` (vòm) · ease `power2.out`
- **Nhạc**: folk mộc mạc, khoảng 92 BPM. Từ khoá: `boho folk acoustic`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Mặt trời vòm, cỏ lau lay động | A12 | T4 dạng vòm mở lên |
| C2 → C10 | Mỗi card nằm trong một khung vòm, màu nền thay đổi dần | A3 dạng vòm (`clip-path: inset(... round)`) | T1 |
- **Điểm nhấn**: màu nền trang nội suy theo tiến độ cuộn (cát → đất nung → olive).

### 2D-11 · `tropical-2d` · Biển Nhiệt Đới
- **Ý tưởng**: Đám cưới bãi biển: lá cọ, sóng, hoàng hôn cam hồng.
- **Tokens**: bg `#fff5e9` · surface `#ffffff` · primary `#ff7f50` · accent `#2bb3a3` · text `#1e3a4c` · display **Pacifico** · body **Quicksand** · radius `1.5rem` · ease `sine.inOut`
- **Nhạc**: bossa nova, khoảng 100 BPM. Từ khoá: `bossa nova beach`
- **Media**: 8 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Hoàng hôn, sóng SVG | Sóng dịch ngang (A9 SVG) | T4: sóng tràn lên che màn hình |
| C2 → C10 | Card trắng, lá cọ ở góc | A1, lá cọ đung đưa A12 | T1; giữa các card có đường sóng |
| C8 | Cuộn ngang như "bưu thiếp" | A5 | T5 |

### 2D-12 · `picnic-2d` · Tiệc Vườn Picnic
- **Ý tưởng**: Khăn caro đỏ trắng, giỏ picnic, mọi thứ vui tươi.
- **Tokens**: bg `#fffdf7` · surface `#ffffff` · primary `#d62828` · accent `#f4a261` · text `#2b2d42` · display **Lobster** · body **Nunito** · radius `1rem` · ease `back.out(1.7)`
- **Nhạc**: swing vui, huýt sáo, khoảng 120 BPM. Từ khoá: `happy whistle picnic`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tấm khăn caro trải | Bấm: khăn giũ ra (`scaleY` kèm skew) | T1 |
| C2 → C10 | Card dạng "thẻ menu" trên nền caro | Các vật (bánh, hoa) bật vào bằng `back.out` | T1 |
| C12 | Lịch trình như thực đơn: khai vị, món chính… | A1 | T1 |

### 2D-13 · `gatsby-2d` · Gatsby
- **Ý tưởng**: Art Deco thập niên 1920: đen, vàng kim, hoạ tiết đối xứng hình quạt.
- **Tokens**: bg `#0c0c0c` · surface `#161616` · primary `#d4af37` · accent `#f5e6b8` · text `#f5e6b8` · display **Playfair Display** (small caps) · body **Josefin Sans** · radius `0` · ease `power4.out`
- **Nhạc**: electro swing, khoảng 125 BPM. Từ khoá: `electro swing 1920s`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Khung Art Deco đối xứng | A6 vẽ viền vàng | Bấm: rèm nhung mở (hai nửa trượt ra) |
| C2 → C10 | Mỗi card có khung hình học | A6 viền, A2 chữ | T2 |
| C10 | Ly champagne, bong bóng | A8 bong bóng bay lên | — |

### 2D-14 · `vinyl-2d` · Đĩa Than 70s
- **Ý tưởng**: Mỗi card là một "bài hát" trên album đĩa than. Nhạc nền trở thành trung tâm của trải nghiệm.
- **Tokens**: bg `#f2e3c6` · surface `#fff4dc` · primary `#d35400` · accent `#6d4c41` · text `#3e2723` · display **Fraunces** (900) · body **Space Grotesk** · radius `9999px` · ease `power2.out`
- **Nhạc**: funk/soul 70s, khoảng 105 BPM. Từ khoá: `70s funk soul groove`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Bìa album, đĩa than lấp ló | Bấm: đĩa trượt ra, quay 33 vòng/phút, kim đặt xuống, nhạc bắt đầu | T1 |
| C2 | "Side A", tracklist gồm tên các card | A1 | T1 |
| C3 → C8 | Mỗi card là "Track 0x" | Đĩa nhỏ cố định ở góc, xoay theo cuộn | T1 |
| C10 | "Side B – The End" | Đĩa dừng quay | — |
- **Điểm nhấn**: tốc độ quay của đĩa gắn với nhạc: tạm dừng nhạc thì đĩa cũng dừng.

### 2D-15 · `comic-2d` · Truyện Tranh
- **Ý tưởng**: Truyện tranh pop art: khung panel, bong bóng thoại, chấm Ben-Day.
- **Tokens**: bg `#fff9e6` · surface `#ffffff` · primary `#e63946` · accent `#1d3557` · text `#111111` · display **Bangers** · body **Nunito** · radius `0`, viền 3px đen · ease `steps(1)` hoặc `back.out(2)`
- **Nhạc**: nhạc vui kiểu hoạt hình, khoảng 130 BPM. Từ khoá: `funny cartoon upbeat`
- **Media**: 8 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Bìa truyện "Số đặc biệt" | Chữ "POW!" bật ra | T7 |
| C2 → C10 | Trang truyện chia 3–4 panel, lời kể trong bong bóng thoại | Từng panel lần lượt A3 theo `steps` | T1 |
- **Điểm nhấn**: ảnh được lọc kiểu halftone bằng lớp phủ `mix-blend` và radial-gradient chấm.

### 2D-16 · `pixel-2d` · Nhiệm Vụ 8-bit
- **Ý tưởng**: Game nhập vai 8-bit: "Nhiệm vụ: Cưới". Mỗi card là một màn chơi.
- **Tokens**: bg `#1a1c2c` · surface `#333c57` · primary `#ffcd75` · accent `#38b764` · text `#f4f4f4` · display **VT323** · body **VT323** · radius `0` · ease `steps(4)`
- **Nhạc**: nhạc chiptune, khoảng 140 BPM. Từ khoá: `8bit chiptune happy`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | "PRESS START" nhấp nháy | `steps` | Bấm: màn hình nhiễu, chuyển màn |
| C2 | Chọn nhân vật: 2 người chơi | A11 hiện chữ | T1 |
| C3 | Chỉ số nhân vật (thanh máu = năm sinh ⚠️ vui) | Thanh máu chạy đầy | T1 |
| C4 | Màn 1–3 | Nhân vật sprite chạy theo cuộn | T1 |
| C5 + C6 + C7 | "Trận cuối": ngày, địa điểm | A7 | T1 |
| C10 | "CONGRATULATIONS" | A8 pixel confetti | — |
- **Lưu ý**: dùng ảnh có `image-rendering: pixelated` qua class Tailwind `[image-rendering:pixelated]`.

### 2D-17 · `boarding-2d` · Thẻ Lên Máy Bay
- **Ý tưởng**: Vé máy bay và hộ chiếu. Chuyến bay "Hạnh Phúc Airlines".
- **Tokens**: bg `#eef4fb` · surface `#ffffff` · primary `#0b3d91` · accent `#f7b32b` · text `#0b1f3a` · display **Montserrat** (800) · body **Space Mono** · radius `1rem` (có khấc vé) · ease `power3.out`
- **Nhạc**: lounge nhẹ, khoảng 95 BPM. Từ khoá: `travel lounge chill`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Hộ chiếu đóng | Bấm: mở hộ chiếu (T7) | T7 |
| C2 + C3 | Trang thông tin hộ chiếu của hai người | A1 | T1 |
| C4 | Các con dấu nhập cảnh (mốc chuyện tình) | Dấu đập xuống | T1 |
| C5 + C6 + C7 | **Boarding pass**: FROM (`groom.address`) → TO (`bride.address`), giờ bay = giờ tiệc | Máy bay SVG bay theo đường nét đứt (A6 và MotionPath) | T1 |
| C10 | "Chúc chuyến bay vui vẻ" | Vé bị xé cuống (tách đôi) | — |

### 2D-18 · `lich-to-2d` · Lịch Bloc
- **Ý tưởng**: Tờ lịch bloc Việt Nam: xé từng tờ để đếm tới ngày cưới. Có ngày âm lịch và câu ca dao.
- **Tokens**: bg `#f7f3ea` · surface `#ffffff` · primary `#c1121f` · accent `#003049` · text `#1b1b1b` · display **Oswald** · body **Noto Serif** · radius `0.25rem` · ease `power2.in`
- **Nhạc**: hoà tấu nhạc xuân / dân ca, khoảng 90 BPM. Từ khoá: `vietnamese folk instrumental`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Bloc lịch hiện ngày hôm nay | Bấm: các tờ lịch bị xé liên tục (rơi và xoay) cho tới ngày cưới | T1 |
| C5 | Tờ lịch ngày cưới: số dương rất to, dòng âm lịch, câu ca dao | A7 | T1 |
| C2 → C10 | Mỗi card là một tờ lịch | Cuộn tới thì tờ trước bị "xé" bay lên (pin kèm rotate) | T3 |
- **Kỹ thuật**: đổi dương lịch sang âm lịch cần một hàm nhỏ trong `src/kit/lunar.ts` (thuật toán Hồ Ngọc Đức, có test).

### 2D-19 · `newspaper-2d` · Báo Tin Vui
- **Ý tưởng**: Tờ báo cũ đưa tin "Tin vui", dàn trang nhiều cột.
- **Tokens**: bg `#efe6d2` · surface `#f7f0e1` · primary `#1a1a1a` · accent `#8b0000` · text `#1a1a1a` · display **Playfair Display** (900) · body **Old Standard TT** · radius `0` · ease `power2.out`
- **Nhạc**: jazz cổ điển thập niên 1940, khoảng 90 BPM. Từ khoá: `old jazz vintage radio`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tờ báo gấp đôi, quay vào giữa màn hình (kiểu phim cũ) | `rotate: 720` và `scale: 0 → 1` | Bấm: mở tờ báo |
| C2 | Tiêu đề trang nhất | A2 | T1 |
| C3 + C4 | Bài viết 3 cột, ảnh đen trắng (`grayscale`) | A1 | T1 |
| C8 | Mục "Ảnh phóng sự" | Ảnh từ đen trắng chuyển sang màu khi cuộn tới | T1 |
| C5 + C6 + C7 | Mục "Thông báo" | A1 | T1 |

### 2D-20 · `cafe-2d` · Cà Phê Sài Gòn
- **Ý tưởng**: Quán cà phê vỉa hè Sài Gòn: phin, ly nhựa, bảng menu phấn.
- **Tokens**: bg `#2b1d14` · surface `#f5ecd9` · primary `#c58b4e` · accent `#e9c46a` · text `#2b1d14` · display **Pangolin** · body **Be Vietnam Pro** · radius `0.75rem` · ease `power1.inOut`
- **Nhạc**: lo-fi acoustic, khoảng 80 BPM. Từ khoá: `lofi coffee acoustic`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Phin cà phê đang nhỏ giọt | Giọt rơi (A8, 1 hạt) | Bấm: ly đầy cà phê, T4 |
| C2 | Bảng phấn: "Menu hôm nay: Cưới" | A11 như viết phấn | T1 |
| C3 → C10 | Mỗi card là một món trên menu: "Cà phê gặp gỡ", "Bạc xỉu yêu thương"… | A1 | T1 |

### 2D-21 · `chat-2d` · Tin Nhắn Đầu Tiên
- **Ý tưởng**: Kể chuyện tình qua đoạn chat giữa hai người, bong bóng tin nhắn hiện dần theo cuộn.
- **Tokens**: bg `#eaf2ff` · surface `#ffffff` · primary `#2f6bff` (tin chú rể) · accent `#ff5c8a` (tin cô dâu) · text `#0f172a` · display **Plus Jakarta Sans** (800) · body **Plus Jakarta Sans** · radius `1.25rem` · ease `back.out(1.5)`
- **Nhạc**: pop acoustic nhẹ, khoảng 100 BPM. Từ khoá: `cute pop acoustic love`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Màn hình khoá điện thoại, thông báo "1 tin nhắn mới" | Bấm vào thông báo | T6 |
| C2 → C4 | Khung chat: tin nhắn trái/phải, có dấu "đang nhập…" rồi mới hiện tin | Mỗi tin `back.out` pop theo scrub | T1 |
| C8 | Tin nhắn chứa ảnh | A10 phóng to | T1 |
| C5 + C6 + C7 | Tin nhắn "ghim": thiệp mời, vị trí được chia sẻ | A1 | T1 |
| C10 | "Đã xem ✓✓" | — | — |

### 2D-22 · `rustic-2d` · Gỗ Mộc Đèn Dây
- **Ý tưởng**: Đám cưới đồng quê: vân gỗ, đèn dây, lọ thuỷ tinh, hoa baby.
- **Tokens**: bg `#3b2a1e` · surface `#f4ead9` · primary `#c89f65` · accent `#8aa17c` · text `#3b2a1e` · display **Great Vibes** · body **Lora** · radius `0.5rem` · ease `sine.out`
- **Nhạc**: country guitar, khoảng 88 BPM. Từ khoá: `country acoustic wedding`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tối, một dây đèn | Bấm: đèn sáng lần lượt (stagger), nền sáng dần | T1 |
| C2 → C10 | Card dạng tấm bảng gỗ, treo bằng dây | Lắc nhẹ khi xuất hiện (`rotation` elastic) | T1 |
| C8 | Ảnh kẹp trên dây phơi bằng kẹp gỗ | A5 | T5 |

### 2D-23 · `neon-2d` · Neon Sài Gòn
- **Ý tưởng**: Biển hiệu neon Sài Gòn về đêm, mưa và phản chiếu.
- **Tokens**: bg `#0a0612` · surface `#140d24/80` · primary `#ff3cac` · accent `#2bd2ff` · text `#f5f3ff` · display **Unbounded** · body **Be Vietnam Pro** · radius `1rem` · ease `power2.out`
- **Nhạc**: synthwave, khoảng 100 BPM. Từ khoá: `synthwave romantic night`
- **Media**: 6 ảnh, **1 video**

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Biển neon "Mở cửa" | Bấm: neon chập chờn rồi bật sáng hẳn (keyframe nhấp nháy, xem spec §5 ngoại lệ) | T1 |
| C2 | Tên hai người dạng chữ neon (`drop-shadow` nhiều lớp) | A6 viền chữ | T1 |
| C3 → C10 | Card kính mờ trên nền phố | A1 | T1 |
- **Điểm nhấn**: vệt mưa (A8 hạt dài), phản chiếu dưới card bằng `scaleY(-1)` kèm mask gradient.

### 2D-24 · `son-mai-2d` · Sơn Mài
- **Ý tưởng**: Tranh sơn mài Việt: nền đen son, vàng lá, đỏ son, vỏ trứng.
- **Tokens**: bg `#120a07` · surface `#1f120c` · primary `#c9a24a` · accent `#a4161a` · text `#f3e3c3` · display **Noto Serif Display** · body **Noto Serif** · radius `0.25rem` · ease `power3.out`
- **Nhạc**: nhạc thiền kèm đàn nguyệt, khoảng 60 BPM. Từ khoá: `asian meditation instrumental`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tấm tranh sơn mài đen | Bấm: lớp vàng lá "mài" lộ ra (mask gradient chạy qua) | T4 |
| C2 → C10 | Khung viền vàng, hoạ tiết hạc và sen | Ánh vàng quét ngang qua chữ (gradient `background-position`) | T1 |

### 2D-25 · `dong-ho-2d` · Tranh Đông Hồ
- **Ý tưởng**: Tranh dân gian Đông Hồ (Đám cưới chuột, Lợn đàn…) trên nền giấy dó.
- **Tokens**: bg `#efe1c6` · surface `#f7ecd6` · primary `#b5382a` · accent `#2f5d50` · text `#2b1d12` · display **Noto Serif Display** · body **Arima** · radius `0` · ease `steps(6)` (chuyển động kiểu tranh khắc)
- **Nhạc**: nhạc dân gian vui (sáo, trống), khoảng 110 BPM. Từ khoá: `vietnamese folk happy`
- **Media**: 6 ảnh, 0 video
- **Tài nguyên**: tranh minh hoạ phải **tự vẽ lại theo phong cách** Đông Hồ, không dùng bản quét tranh của người khác. Ghi rõ vào CREDITS.

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Tranh "Đám cưới chuột" | Đoàn rước chuột đi ngang (A5 tự chạy) | T1 |
| C2 → C10 | Mỗi card có khung tranh gỗ khắc | A3 | T1 |

### 2D-26 · `da-lat-2d` · Sương Đà Lạt
- **Ý tưởng**: Đồi thông, sương mù, ngôi nhà gỗ. Sương tan dần theo cuộn để lộ nội dung.
- **Tokens**: bg `#e7ece8` · surface `#ffffff/80` · primary `#2f4f3e` · accent `#b7c4b0` · text `#1f2d25` · display **Cormorant Garamond** · body **Manrope** · radius `1rem` · ease `sine.inOut`
- **Nhạc**: indie piano buồn nhẹ, khoảng 70 BPM. Từ khoá: `indie piano misty`
- **Media**: 8 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Đồi thông 4 lớp SVG, sương dày | Bấm: sương dạt sang hai bên | T1 |
| C2 → C10 | Card kính mờ | Mỗi card hiện ra từ sau lớp sương (`filter: blur` 12px → 0) | T1 |
- **Điểm nhấn**: các lớp đồi thông dùng `data-speed` 0.6/0.8/1/1.2 (A4).

### 2D-27 · `route-map-2d` · Bản Đồ Hành Trình
- **Ý tưởng**: Bản đồ kho báu. Đường nét đứt đi từ nhà chú rể qua các mốc chuyện tình tới nhà cô dâu, kết thúc ở nhà hàng.
- **Tokens**: bg `#f3ead7` · surface `#fbf6ea` · primary `#1f4e79` · accent `#c0392b` · text `#2c2416` · display **Fraunces** · body **Nunito** · radius `0.5rem` · ease `none` (theo scrub)
- **Nhạc**: nhạc phiêu lưu nhẹ, khoảng 100 BPM. Từ khoá: `adventure acoustic happy`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Cuộn bản đồ | Bấm: bản đồ mở cuộn (`scaleX` từ giữa) | T1 |
| C2 → C10 | Một SVG path dài xuyên suốt trang, các card nằm ở những điểm dừng | A6 theo scrub trên toàn trang; icon la bàn chạy theo đường (MotionPath) | T1 |
- **Điểm nhấn**: đường đi được vẽ khớp đúng với vị trí cuộn, mỗi điểm dừng có dấu ✕ đỏ.

### 2D-28 · `marble-2d` · Đá Cẩm Thạch
- **Ý tưởng**: Sang trọng: vân đá cẩm thạch trắng, chữ vàng ánh kim, monogram (giống mẫu "Aureline" ở mục tham khảo §7).
- **Tokens**: bg `#f7f5f2` · surface `#ffffff` · primary `#b08d57` · accent `#1f1f1f` · text `#2a2a2a` · display **Cormorant Garamond** (600, caps) · body **Montserrat** (300) · radius `9999px 9999px 1rem 1rem` (vòm) · ease `power3.out`
- **Nhạc**: piano và dàn dây sang trọng, khoảng 70 BPM. Từ khoá: `elegant piano strings luxury`
- **Media**: 8 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Monogram "S \| P" lớn trên nền đá | A6 vẽ monogram | Bấm: T4 dạng vòm |
| C2 | Ảnh vòm tràn màn hình, "We are getting married" | A3 | T1 |
| C3 | Bố mẹ hai bên ⚠️, 2 cột | A1 | T1 |
| C5 + C11 | Lịch tháng có vòng tròn vàng quanh ngày cưới | A7 | T1 |
| C12 | Lịch trình dạng zigzag trái phải có icon tròn (như ảnh tham khảo Aureline) | A6 đường trục, icon A1 | T1 |
| C7 + C8 + C15 + C10 | | A1, A3 | — |
- **Điểm nhấn**: chữ vàng ánh kim bằng `bg-clip-text` với gradient động.

### 2D-29 · `crayon-2d` · Nét Sáp Màu
- **Ý tưởng**: Tranh vẽ sáp màu kiểu trẻ con, ngây ngô và đáng yêu.
- **Tokens**: bg `#fffdf8` · surface `#ffffff` · primary `#ff6b9a` · accent `#4ea8de` · text `#333333` · display **Mali** · body **Itim** · radius `1.5rem` (viền nguệch ngoạc SVG) · ease `back.out(2)`
- **Nhạc**: glockenspiel và ukulele, khoảng 115 BPM. Từ khoá: `cute kids ukulele`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Hình vẽ ngôi nhà, mặt trời | A6 vẽ nét sáp | T1 |
| C2 → C10 | Khung ảnh viền nguệch ngoạc, chữ viết tay | A6 và pop bằng `back.out` | T1 |
- **Điểm nhấn**: nét vẽ SVG có filter `feTurbulence` để giống vết sáp.

### 2D-30 · `starry-2d` · Đêm Đầy Sao
- **Ý tưởng**: Bầu trời đêm theo phong cách tranh Van Gogh, có nét xoáy và trăng vàng. Đây là bản 2D nhẹ, dành cho người thích chủ đề sao nhưng không cần mẫu 3D.
- **Tokens**: bg `#0e1a3a` · surface `#15254f/80` · primary `#f6c945` · accent `#6fa3d9` · text `#f1f4ff` · display **Great Vibes** · body **Lora** · radius `1rem` · ease `sine.inOut`
- **Nhạc**: piano và dàn dây, khoảng 68 BPM. Từ khoá: `starry night piano`
- **Media**: 6 ảnh, 0 video

| Card | Bố cục | Animation | Chuyển tiếp |
|---|---|---|---|
| C1 | Trăng lưỡi liềm và nút | Nét xoáy SVG quay chậm | T4 dạng hình tròn từ mặt trăng |
| C2 → C10 | Card kính mờ | A1, sao lấp lánh A8 | T1 |

---

## 7. Tham khảo thị trường (đã xem)

| Nguồn | Quan sát | Áp dụng vào plan |
|---|---|---|
| [songhy.online/kho-mau-thiep](https://songhy.online/kho-mau-thiep) | Khoảng 41 mẫu, nhiều nhất là dòng **truyền thống** (Song Hỷ, Long Phụng, Song Long, Hoàng Kim), sau đó là **hoa / vườn** (Hoa Mộc, Vườn Kính, Vườn Xuân, Anh Đào) và **tối giản**. **Mỗi mẫu có nhiều biến thể màu** (Đỏ, Xanh, Nâu…). Nhóm theo màu: đỏ, xanh… | Có `song-hy-2d`, `son-mai-2d`, `lantern-3d`. Chưa có dòng **Long Phụng**, cân nhắc thêm vào đợt sau. Xem ý tưởng biến thể màu ở §8 |
| [chungdoi.com/vi/mau-thiep](https://chungdoi.com/vi/mau-thiep) | Chủ đề tương tự (Song Long, Long Phụng, Minimalism, Anh Đào, Lâu Đài, Baroque, Chibi). Thiệp có: RSVP, **album**, **lịch**, **nhạc**, **QR mừng cưới**, **đếm ngược**. Cho **dùng thử 3 ngày**, giá 199.000đ/mẫu | Bổ sung card C11 (lịch), C14 (QR mừng cưới), C15 (RSVP chỉ UI). Xác nhận "Dùng thử" là tính năng thị trường đã có |
| Ảnh tham khảo (Aureline, Digital elegance, Romina & Federico, Diana & Charles, Fernanda & Gustavo) | Mẫu chung: **phong bì có dấu sáp** ở màn mở · **thanh phát nhạc** "chạm để nghe" · tên viết chữ script · ngày cưới số lớn · **lịch tháng khoanh ngày** · đếm ngược · **lịch trình dạng timeline có icon** · **dress code có chấm màu** · QR quà mừng · RSVP · ảnh khung vòm · monogram | Đưa vào `letter-2d`, `botanical-2d`, `marble-2d` và thư viện card bổ sung bên dưới |

### Card bổ sung (từ tham khảo)
| Mã | Card | Ghi chú |
|---|---|---|
| **C11** | Lịch tháng | Lưới tháng, ngày cưới được khoanh (trái tim hoặc vòng tròn). Cần `date` ⚠️ |
| **C12** | Lịch trình | Timeline có icon: đón khách, lễ, khai tiệc… Viết sẵn trong mẫu |
| **C13** | Dress code | 3–5 chấm màu và mô tả ngắn |
| **C14** | QR mừng cưới | Ảnh QR mẫu (placeholder). ⚠️ Người dùng thật sẽ muốn đưa QR ngân hàng của mình, xem §8 |
| **C15** | RSVP | **Chỉ là giao diện**, bấm gửi thì hiện "Cảm ơn!" và không gửi đi đâu (theo requirement) |
| **C16** | Thanh nhạc | Thanh phát nhạc nằm ngay trong trang (ngoài nút nổi), dòng "Chạm để nghe bài hát của chúng tôi" |

---

## 8. Cần chốt trước khi code (⚠️)

1. **Trường `date`** (ngày + giờ tiệc) trong `WeddingData` và form "Dùng thử". Các card C5, C6, C11 và nhiều mẫu cần trường này. **Đề xuất: thêm.**
2. **Tên bố mẹ hai bên**: thiệp cưới Việt gần như luôn có "Ông bà …". Card C2, C3 của `song-hy-2d`, `marble-2d` cần. **Đề xuất: thêm 4 trường tuỳ chọn.**
3. **QR mừng cưới**: cho người dùng upload ảnh QR của họ trong form "Dùng thử" (dùng thêm một vị trí ảnh), hay chỉ hiển thị QR mẫu?
4. **Biến thể màu**: đối thủ bán mỗi mẫu với 2–4 màu. Có thể làm bằng cách cho mỗi mẫu 2–3 bộ tokens và hiển thị trên dashboard như một lựa chọn. Việc này làm tăng số lựa chọn mà không tăng số mẫu. Có muốn đưa vào phạm vi không?
5. **Nhạc do người dùng chọn**: có cho upload mp3 riêng trong form "Dùng thử" không? Đề xuất: **không** trong MVP.
6. **Năm sinh** hiện đã có trong form nhưng hầu như mẫu nào cũng không cần hiển thị (chỉ `pixel-2d` dùng cho vui). Có giữ lại không?
7. **Dòng Long Phụng**: có thêm vào danh sách để thay một mẫu 2D ít phổ biến ở Việt Nam hơn (ví dụ `comic-2d` hoặc `pixel-2d`) không?

---

## Nguồn
- [GSAP 3.13 release](https://gsap.com/blog/3-13/) · [Webflow: GSAP becomes free](https://webflow.com/blog/gsap-becomes-free)
- [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay)
- [Pixabay Content License](https://pixabay.com/service/license-summary/) · [Pixabay FAQ](https://pixabay.com/service/faq/)
- [alisleiman-3d (Next 16 + R3F + GSAP)](https://github.com/AliSleiman0/alisleiman-3d) · [GSAP ScrollTrigger + R3F CodePen](https://codepen.io/GreenSock/pen/eYRzLJw)
- [songhy.online – kho mẫu thiệp](https://songhy.online/kho-mau-thiep) · [chungdoi.com – mẫu thiệp](https://chungdoi.com/vi/mau-thiep)
- Kiểm tra font và phiên bản: `node_modules/next/dist/.../font-data.json`, `npm view` (29/09/2026)
