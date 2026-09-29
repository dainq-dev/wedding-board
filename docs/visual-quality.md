# Chuẩn chất lượng hình ảnh — Visual Quality Bar

> **Bắt buộc** cho mọi mẫu thiệp (2D và 3D) và cho dashboard. Đi kèm [template-spec.md](./template-spec.md).
> Tài liệu này định nghĩa thế nào là **"xong"**. Build / lint / test pass chỉ là **điều kiện cần**, không phải điều kiện đủ.

> ## ⚑ ĐIỀU KIỆN TIÊN QUYẾT: ĐẸP VÀ CÓ GU
> Giao diện **đẹp mắt và có gu** là điều kiện tiên quyết của dự án, đứng **trên** mọi tiêu chí khác (tính năng, số lượng mẫu, tiến độ, test).
> - Một mẫu đủ tính năng nhưng không đẹp = **không có giá trị**, không được đưa lên dashboard.
> - Thà có 5 mẫu tuyệt đẹp hơn 40 mẫu tầm thường. Khi phải đánh đổi, luôn chọn chất lượng.
> - Mọi quyết định thiết kế phải trả lời được câu hỏi: *"Cái này có làm tấm thiệp đẹp và trân trọng người nhận hơn không?"*

---

## 1. Nguyên tắc

1. **Sản phẩm bán được, không phải bản demo.** Đây là thiệp cho một trong những ngày quan trọng nhất đời người. Mỗi trang phải trông như do một studio thiết kế chuyên nghiệp làm: tinh tế, sang, có chủ đích trong từng chi tiết.
2. **"Xong" = chủ dự án duyệt bằng mắt.** Agent / dev **không được** tự đánh `✅ Xong` trong [CHECKLIST.md](./CHECKLIST.md). Trạng thái cao nhất tự đặt được là `🔵 Chờ review` kèm bộ screenshot (§6).
3. **Ảnh cưới là nhân vật chính.** Mọi hiệu ứng tồn tại để tôn ảnh và tên cặp đôi lên, không phải để khoe kỹ thuật.
4. **Ít mà tinh hơn nhiều mà thô.** Một vật thể 3D đẹp hơn mười khối hình học sơ sài. Không đạt chất lượng thì bỏ hẳn phần đó, không để lại bản nháp.

### 1.1 Người nhận là khách thật, không phải người chấm bài

- Người **chọn** mẫu là một cặp đôi đang chuẩn bị ngày trọng đại nhất đời mình. Người **nhận** thiệp là ông bà, cha mẹ, thầy cô, sếp, bạn bè của họ. Thiệp là lời mời thay mặt hai gia đình; một tấm thiệp thô là thất lễ với người nhận.
- **Phép thử cuối cùng:** *"Nếu mình là cô dâu / chú rể, mình có dám gửi thiệp này cho ông bà và sếp của mình không?"* Còn chút ngần ngại nào → chưa xong.
- Một checklist đạt hết mà giao diện vẫn vô hồn, rập khuôn, "trông như template" → **chưa xong**. Checklist chỉ bắt lỗi; nó không tạo ra cái đẹp. Cái đẹp đến từ **gu** (§8).

---

## 2. Điều kiện chặn (tự động KHÔNG đạt)

Chỉ cần xuất hiện một mục dưới đây trên bất kỳ màn hình nào là mẫu bị trả lại, bất kể test pass.

### 2.1 Hình khối & vật liệu (3D)
- [ ] Vật thể chính (hero) dựng bằng **primitive thô** — `sphere`/`box`/`cylinder`/`icosahedron`/`lathe` chưa tạo hình, chưa bo cạnh, đếm được mặt bằng mắt.
- [ ] `flatShading` / low-poly **không chủ đích** (ví dụ tán cây là đống icosahedron, hoa sen là vài mặt phẳng gấp).
- [ ] Vật liệu mặc định: `MeshStandardMaterial` màu trơn, roughness/metalness mặc định, không map, không env — trông như nhựa xám.
- [ ] Mặt phẳng ảnh "trần": plane + texture, không khung, không viền, không bóng đổ, không phản ứng ánh sáng.
- [ ] Khối trắng / đen / hồng do texture lỗi, z-fighting, răng cưa rõ ở cạnh, vật thể xuyên qua nhau (dây xuyên ảnh, thân cây xuyên chữ).

### 2.2 Ánh sáng & màu
- [ ] Cảnh chỉ có `ambientLight` / `hemisphereLight` — không có key light, không environment map.
- [ ] Không có bóng đổ nào (vật thể "trôi" không tiếp đất).
- [ ] Cảnh quá tối hoặc cháy sáng: vùng quan trọng không đọc được trên màn hình điện thoại độ sáng 50%.
- [ ] Bảng màu lệch khỏi tokens của mẫu; màu ảnh cưới bị tone-map sai (bệt, xám, ám màu).

### 2.3 Bố cục & nội dung
- [ ] Màn hình trống (chỉ nền) kéo dài **quá 1 viewport** khi cuộn.
- [ ] Chữ đặt trực tiếp trên vật thể 3D phức tạp mà không có lớp đệm tương phản (≥ 4.5:1).
- [ ] Hai lớp nội dung chồng nhau (tên hiện 2 lần, card đè card, UI chung đè nội dung).
- [ ] Ảnh bị méo tỉ lệ, bị cắt mất mặt người, hoặc nhỏ hơn 25% chiều rộng màn hình khi đang là tiêu điểm.
- [ ] Placeholder lộ ra người dùng thật (chữ "Ảnh mẫu", khung xám, lorem). Ảnh tạm đánh số chỉ chấp nhận trong giai đoạn dev.

### 2.4 Chuyển động
- [ ] Camera giật, quay ngược, nhìn vào khoảng trống, hoặc đi xuyên vật thể.
- [ ] Pop-in: vật thể / ảnh hiện đột ngột không có transition.
- [ ] Intro > 3 giây không có nút bỏ qua; animation chặn đọc nội dung.

---

## 3. Yêu cầu bắt buộc cho mẫu 3D

### 3.1 Art direction trước khi code
Spec của mẫu (`docs/templates/<slug>.md`) **PHẢI** có mục *Art direction* gồm:
- **3–5 ảnh tham chiếu** (link) thể hiện đúng chất liệu, ánh sáng, không khí muốn đạt.
- **3 hero shot**: mô tả khung hình đẹp nhất của 3 khoảnh khắc (mở thiệp, trưng bày ảnh, kết) — góc máy, tiêu cự, bố cục, ánh sáng.
- **Phong cách hình khối** chọn một, nhất quán toàn cảnh: *photoreal mềm* · *stylized mịn (bo tròn, gradient)* · *giấy / origami* · *particle / ánh sáng*. Không trộn.
- **Chất liệu chính** của từng vật thể hero (ví dụ: vải lụa khinh khí cầu có vân, cánh sen có subsurface, giấy dó có vân sợi).

### 3.2 Hình khối
- Vật thể hero **PHẢI** là một trong:
  1. Model `.glb` có nguồn license rõ (tự dựng Blender, Poly Haven CC0, Sketchfab CC-BY…), tối ưu bằng `gltf-transform` (Draco/Meshopt, texture KTX2/WebP), **≤ 2 MB / mẫu**, ghi nguồn vào `CREDITS.md`.
  2. Procedural nhưng **đạt chất lượng model**: đủ phân đoạn để mịn, bo cạnh, custom shader/material có chi tiết (vân, gradient, fresnel, subsurface giả lập).
- Vật thể phụ (cây nền, mây, hạt) được phép đơn giản nhưng **phải chìm vào hậu cảnh** (fog, depth of field, độ tương phản thấp).

### 3.3 Ánh sáng & render
- **Environment map** HDRI 1k (file local trong `public/templates/<slug>/` hoặc dùng chung `public/hdri/`, ≤ 1.5 MB) cho phản xạ và ánh sáng tổng.
- **Key light có hướng** + bóng mềm: `ContactShadows` / `AccumulativeShadows` / shadow map có blur — vật thể phải tiếp đất hoặc có bóng trên mặt nước/mây.
- Tone mapping `ACESFilmic` hoặc `AgX`, output sRGB; texture ảnh cưới giữ đúng màu (`toneMapped={false}` hoặc hiệu chỉnh tương đương).
- **Hậu kỳ** bằng `@react-three/postprocessing`: tối thiểu *Bloom chọn lọc* (chỉ nguồn sáng, không làm nhoè chữ/ảnh) + *Vignette* + khử răng cưa (SMAA hoặc MSAA). *Depth of field* khuyến khích cho hero shot trưng bày ảnh.
- Phân tầng thiết bị: desktop đủ hiệu ứng; mobile giảm (dpr ≤ 1.5, bloom nhẹ, tắt DOF) nhưng **vẫn phải đạt §2**. Dùng `PerformanceMonitor` (drei) để tự hạ tầng khi FPS tụt.

### 3.4 Trưng bày ảnh cưới trong 3D
- Mỗi ảnh có **khung có vật liệu**: viền giấy / gỗ / kim loại mảnh, bóng đổ, hơi cong hoặc có độ dày — không phải plane phẳng lì.
- Có khoảnh khắc **ảnh là tiêu điểm**: camera dừng, ảnh chiếm ≥ 40% chiều rộng màn hình mobile, nền lùi (DOF / tối đi).
- Chạm vào ảnh → lightbox HTML chất lượng cao (vuốt qua lại, đóng bằng Esc / vuốt xuống).
- Dùng **mọi** ảnh trong `data.images` (xem `media` trong `meta.ts`), bố cục tự co giãn theo số ảnh.

### 3.5 Camera & nhịp kể chuyện
- Đường camera là spline mượt (CatmullRom) + easing; mỗi chương có **điểm dừng** cho hero shot; không có đoạn camera nhìn vào khoảng trống.
- Kiểm tra chiều nhìn: camera luôn nhìn **về phía nội dung sắp tới** (lỗi thường gặp: chép quaternion của `Object3D.lookAt` sang camera → nhìn ngược).
- Chữ luôn là **HTML** (SEO + a11y), đặt ở vùng yên tĩnh của khung hình, có lớp đệm (kính mờ / gradient) khi nền phức tạp.

---

## 4. Yêu cầu chung (2D + 3D + dashboard)

| Hạng mục | Chuẩn |
|---|---|
| Typography | Tối đa 2 font; thang cỡ chữ rõ ràng (tên ≥ 2.5× body); line-height, tracking có chủ đích; tiếng Việt không vỡ dấu |
| Màu | ≤ 5 màu chính theo tokens; tương phản chữ ≥ 4.5:1 |
| Khoảng trắng | Nhịp khoảng cách đều theo thang (4/8/12/16/24/32/48/64…); không có khối dính mép, không có khối lơ lửng lạc lõng |
| Chuyển động | Ease có chủ đích (không `linear` cho UI); thời lượng 200–1200ms; stagger nhẹ; tôn trọng `prefers-reduced-motion` |
| Chi tiết hoàn thiện | Trạng thái hover / focus / active; loading có thiết kế (không màn trắng); ảnh có tỉ lệ cố định (không CLS) |
| Âm thanh | Nhạc đúng không khí mẫu; bật/tắt rõ ràng; không phát khi chưa tương tác |

---

## 5. Rubric chấm điểm

Chấm 1–5 cho từng mục. **Đạt khi mọi mục ≥ 4**; không có mục nào được bù cho mục khác.

| # | Tiêu chí | 5 điểm trông như thế nào |
|---|---|---|
| 1 | Ấn tượng 3 giây đầu | Màn mở khiến người nhận "wow", muốn bấm mở ngay |
| 2 | Art direction nhất quán | Mọi khung hình cùng một ngôn ngữ hình ảnh, không có chi tiết lạc tông |
| 3 | Chất liệu & ánh sáng | Vật thể có chiều sâu, chất liệu đọc được bằng mắt, ánh sáng có hướng và cảm xúc |
| 4 | Trưng bày ảnh cưới | Ảnh được tôn vinh, dễ xem, bố cục đẹp với 8 ảnh lẫn 24 ảnh |
| 5 | Typography & bố cục | Tên cặp đôi đẹp như thiệp in cao cấp; thông tin dễ đọc trên điện thoại |
| 6 | Chuyển động & nhịp | Mượt, có nhịp nghỉ, chuyển cảnh có ý đồ |
| 7 | Hoàn thiện | Không một lỗi nào ở §2 trên 3 kích thước màn hình |

Mốc tham chiếu chất lượng: các site thắng *Awwwards / FWA Site of the Day* dùng WebGL, và portfolio của các studio như Lusion, Active Theory. Không cần bằng họ về quy mô, nhưng **từng khung hình** phải cùng đẳng cấp hoàn thiện.

---

## 6. Quy trình duyệt (Definition of Done)

1. **Kỹ thuật**: `bun run build` (route `○ Static`), `bun run lint`, `bun test` pass.
2. **Bộ screenshot** — chụp bằng trình duyệt thật (Playwright), nộp kèm PR:
   - 3 kích thước: 390×844, 768×1024, 1440×900.
   - Mỗi kích thước: màn mở, sau khi mở, mỗi chương / hero shot, trưng bày ảnh (với **8** và **24** ảnh), màn kết.
   - Với 3D: thêm 1 bản `prefers-reduced-motion` và 1 bản không WebGL (fallback).
3. **Tự chấm rubric §5** và liệt kê mọi mục §2 đã kiểm, ghi vào mô tả PR.
4. **Chủ dự án duyệt** bằng mắt trên điện thoại thật → mới được chuyển `✅ Xong` trong CHECKLIST.

---

## 8. Gu thiết kế — phần quan trọng nhất

Checklist (§2) chỉ loại bỏ cái xấu. **Gu** mới tạo ra cái đẹp. Mỗi mẫu phải trông như do một designer có tay nghề chọn lựa từng chi tiết, không phải "đủ các khối là xong".

### 8.1 Bắt buộc đọc trước khi thiết kế / code giao diện
- [`.claude/skills/taste-skill/taste-skill/SKILL.md`](../.claude/skills/taste-skill/taste-skill/SKILL.md) — chống giao diện "AI slop" / template: Design Read, 3 dial, bias correction, danh sách AI tells.
- [`.claude/skills/taste-skill/soft-skill/SKILL.md`](../.claude/skills/taste-skill/soft-skill/SKILL.md) — cảm giác "đắt tiền": khoảng trắng lớn, bóng mềm khuếch tán, khung lồng nhau (double-bezel), chuyển động có khối lượng.
- [`.claude/skills/taste-skill/redesign-skill/SKILL.md`](../.claude/skills/taste-skill/redesign-skill/SKILL.md) — khi làm lại mẫu cũ: audit trước khi sửa.
- `.claude/skills/hallmark/SKILL.md` — ⚠️ hiện là symlink hỏng (trỏ tới `.agents/skills/hallmark/` không có trong repo). Cần bổ sung file thật; khi có, bắt buộc đọc như các skill trên.

### 8.2 Design Read + dial (ghi vào đầu spec mẫu, trước khi code)
Một câu theo taste-skill §0.B: *"Đọc là: thiệp cưới online cho khách mời của \<cặp đôi kiểu gì>, ngôn ngữ \<vibe>, nghiêng về \<họ thẩm mỹ>."* + 3 dial `DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY`.
- Mặc định cho thiệp cưới: **VARIANCE 6–8 · MOTION 5–7 · DENSITY 2–3** (thoáng như gallery, chuyển động có chủ đích, không nhồi nhét).
- 40 mẫu **không được** trông giống nhau: mỗi mẫu một Design Read khác, một họ bố cục khác.

### 8.3 Diễn giải gu cho bối cảnh thiệp cưới
Áp dụng taste-skill với các điều chỉnh sau (bối cảnh cưới hỏi là *heritage / luxury / editorial* nên một số mặc định của skill được override có lý do):

| Hạng mục | Làm | Không làm |
|---|---|---|
| Chữ | Tên cặp đôi là "logo" của thiệp: font script / serif được **chọn riêng cho từng mẫu** và giải thích được vì sao hợp. Tối đa 2 font. Italic có dấu tiếng Việt phải đủ line-height (không cắt dấu, không cắt chân chữ) | Dùng lại cùng một cặp font cho nhiều mẫu; mix serif + script + sans trong một khối; tên cặp đôi nhỏ hơn tiêu đề phụ |
| Màu | 1 bảng màu khoá cho cả trang, 1 màu nhấn; bão hoà vừa phải; bóng đổ nhuốm màu nền | Tím-xanh "AI glow", gradient neon, đen thuần `#000`, đổi tông giữa trang, bóng đen xám trên nền sáng |
| Bố cục | Nhịp đa dạng: mỗi họ bố cục xuất hiện tối đa 1 lần; khoảng trắng hào phóng (`py-24`+ desktop); ảnh cưới lớn, tràn, là tâm điểm | Chuỗi card giống hệt nhau; zigzag ảnh-chữ 3 lần liên tiếp; card trong card vô nghĩa; mọi section đều có nhãn chữ in hoa nhỏ phía trên |
| Chất liệu | Khung ảnh có chiều sâu (viền giấy, double-bezel, bóng mềm); texture tinh tế (vân giấy, grain ≤ 3%) | Plane / div phẳng lì; viền xám 1px mặc định; `shadow-md` mặc định |
| Chuyển động | Ease có khối lượng (`cubic-bezier(0.32,0.72,0,1)`, `expo.out`); fade-up có blur nhẹ; một khoảnh khắc "wow" rõ ràng cho mỗi mẫu | `linear` / `ease-in-out` mặc định; mọi thứ cùng nảy; animation lặp vô hạn khắp nơi |
| Icon | Một bộ icon mảnh, nhất quán (Phosphor Light / Tabler) | Tự vẽ SVG icon nguệch ngoạc; emoji thay icon (🔥 🎧 ✦ trên nút) |

### 8.4 Văn phong & nghi thức (sự trân trọng)
- Lời lẽ trang trọng, ấm áp, đúng nghi thức cưới hỏi Việt: *"Trân trọng kính mời"*, thứ tự nhà trai / nhà gái, lễ vu quy / thành hôn / tiệc cưới đúng ngữ cảnh.
- Không câu chữ "AI dễ thương" gượng ép, không chơi chữ vô nghĩa, không tiếng Anh chen ngang khi không có chủ đích (ví dụ "A film by two hearts" chỉ hợp mẫu phong cách điện ảnh).
- Không dấu gạch dài `—` trong chữ hiển thị (taste-skill §9.G): dùng dấu phẩy, dấu chấm hoặc xuống dòng.
- Không emoji trong nút và tiêu đề. Thiệp cưới không phải tin nhắn chat.
- Tự rà lại **mọi chuỗi chữ** hiển thị trước khi nộp (taste-skill §4.9 Copy self-audit).

### 8.5 Pre-flight gu (trả lời "có" cho tất cả trước khi nộp)
- [ ] Có Design Read + dial trong spec, và giao diện thực tế khớp với nó.
- [ ] Nhìn screenshot không đọc chữ, vẫn nhận ra đây là mẫu nào (có cá tính riêng).
- [ ] Không có một AI tell nào của taste-skill §9 trên trang.
- [ ] Mỗi màn hình đều có một điểm nhìn chính rõ ràng; không màn nào "lưng chừng".
- [ ] Đặt cạnh các thiệp online cao cấp trên thị trường, mẫu này **nổi bật hơn**, không phải "cũng được".
- [ ] Phép thử §1.1: dám gửi cho ông bà và sếp.

---

## 7. Hiện trạng (29/09/2026)

Đánh giá của chủ dự án: **5 mẫu 3D hiện tại không đạt** — hình khối thô (primitive, flat-shading), vật liệu mặc định, ánh sáng phẳng, không hậu kỳ, ảnh là plane trần. Cả 5 chuyển về `⛔ Làm lại` trong [CHECKLIST.md](./CHECKLIST.md) và phải làm lại theo tài liệu này, bắt đầu từ mục *Art direction* (§3.1) trong spec của từng mẫu.
