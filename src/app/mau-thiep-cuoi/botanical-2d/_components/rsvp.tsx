"use client";

import { useState } from "react";

export function Rsvp() {
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="rounded-t-[3rem] bg-white px-7 py-14 text-center text-xl italic shadow-[0_20px_60px_-38px_rgba(74,97,70,0.6)]">Cảm ơn {name || "bạn"}! Hẹn gặp bạn trong vườn nhỏ của chúng tôi.</p>;
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="rounded-t-[3rem] rounded-b-2xl bg-white p-7 shadow-[0_20px_60px_-38px_rgba(74,97,70,0.6)]">
      <label className="block text-[15px] italic text-[#6B7565]" htmlFor="guest-name">Họ và tên</label>
      <input id="guest-name" required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-11 w-full border-b border-[#C8D5B9] bg-transparent px-1 text-lg outline-none focus:border-[#5F7A5A]" />
      <fieldset className="mt-6">
        <legend className="text-[15px] italic text-[#6B7565]">Bạn sẽ tham dự chứ?</legend>
        <div className="mt-2 flex gap-5"><label><input defaultChecked type="radio" name="attendance" /> Tôi sẽ đến</label><label><input type="radio" name="attendance" /> Xin phép vắng mặt</label></div>
      </fieldset>
      <label className="mt-6 block text-[15px] italic text-[#6B7565]" htmlFor="guest-count">Số người tham dự</label>
      <select id="guest-count" defaultValue="1" className="mt-1 min-h-11 w-full rounded-full border border-[#C8D5B9] bg-white px-4"><option value="1">01 người</option><option value="2">02 người</option><option value="3">03 người</option></select>
      <button type="submit" className="mt-7 min-h-11 w-full rounded-full bg-[#5F7A5A] px-6 text-white transition-colors hover:bg-[#4A6146] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F7A5A]">Gửi lời hồi đáp</button>
      <p className="mt-3 text-center text-sm italic text-[#6B7565]">Bản xem thử, xác nhận không được gửi đi.</p>
    </form>
  );
}
