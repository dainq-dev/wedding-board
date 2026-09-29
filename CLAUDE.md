# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.


### Đẹp và có gu là điều kiện tiên quyết (bắt buộc)

Đầu ra là thiệp cưới cho khách mời thật của một đám cưới thật. **Giao diện đẹp mắt và có gu là điều kiện tiên quyết**, đứng trên tính năng, số lượng và tiến độ. Không bao giờ nộp một giao diện "cho có". Trước khi thiết kế, code hoặc báo "xong" một trang/mẫu:
- Đọc `.claude/skills/taste-skill/taste-skill/SKILL.md`, `.claude/skills/taste-skill/soft-skill/SKILL.md` và [`docs/visual-quality.md`](docs/visual-quality.md) (đặc biệt §8 Gu thiết kế). Viết Design Read + 3 dial trước khi code.
- Đọc và tuân thủ [`docs/visual-quality.md`](docs/visual-quality.md). Vi phạm bất kỳ điều kiện chặn nào ở §2 = chưa xong, dù build/lint/test pass.
- Đạt checklist mà vẫn rập khuôn, vô hồn = chưa xong. Phép thử cuối: *"Cô dâu chú rể có dám gửi thiệp này cho ông bà và sếp của họ không?"*
- Luôn tự chụp screenshot bằng trình duyệt thật (390 / 768 / 1440px) và **tự nhìn** trước khi báo kết quả; tự chấm rubric §5.
- Không tự đánh `✅ Xong`; tối đa `🔵 Chờ review` kèm screenshot. Không đạt thì nói thẳng phần nào chưa đạt.

### Quy ước tách logic và UI (bắt buộc)

Mỗi feature có interactive UI phải bắt đầu bằng hai file cùng cấp:

```text
app/<feature>/
  index.logic.ts    # lifecycle, subscriptions, query/mutation, controller, view model
  type.d.ts         # declare type | interface strict follow typesafe
  page.tsx          # render view model và UI event adapter tối thiểu
```

> Không dùng đồng thời `index.ts` và `index.tsx` cho public import — Next.js resolver có thể chọn nhầm entrypoint và làm production build fail. `index.ts` là barrel duy nhất; UI đặt ở `screen.tsx`.

`index.logic.ts` là feature controller hook. File này được phép gọi TanStack Query, Zustand, `useEffect`, controller, mapping DTO/state thành **view model** và expose callback có ý nghĩa nghiệp vụ (`onPublish`, `setTitle`, `removeSection`). File này **không được** có JSX, Tailwind class hoặc import primitive UI.

`screen.tsx` là presentation boundary. File này chỉ gọi hook logic, render các trạng thái `loading/error/empty/content`, chuyển browser event tối thiểu (`event.target.value`) vào callback của view model và compose `components/ui`. Nó **không được** import API client, query key, store, controller hay tự tạo `useEffect`/network request. (File UI đặt tên `screen.tsx` để tránh xung đột với barrel `index.ts`.)

Lifecycle vẫn thuộc `index.logic.ts`: subscription được đăng ký/cleanup tại đó; UI unmount thì cleanup được React gọi qua hook. Không đưa state remote vào props drill qua nhiều layer chỉ để “dumb UI”, và không tách một static one-line component một cách máy móc. Với feature lớn, `screen.tsx` có thể compose các leaf presentational component trong `ui/`, nhưng không đảo dependency ngược vào logic.