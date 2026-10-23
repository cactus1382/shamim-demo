"use strict";
/* ---------- data (sample — salon edits these) ---------- */
const CATS = [
  { id: "hair", name: "مو", icon: "✂️" },
  { id: "color", name: "رنگ و لایت", icon: "🎨" },
  { id: "care", name: "کراتین و احیا", icon: "💧" },
  { id: "nail", name: "ناخن", icon: "💅" },
  { id: "face", name: "صورت و ابرو", icon: "✨" },
  { id: "makeup", name: "میکاپ و شینیون", icon: "💄" }
];
const SERVICES = [
  { id: "cut", cat: "hair", name: "کوتاهی و براشینگ", mins: 60, price: 450000, desc: "مشاوره فرم صورت + شستشو + حالت‌دهی" },
  { id: "blow", cat: "hair", name: "براشینگ و اتو", mins: 45, price: 280000, desc: "حالت‌دهی صاف یا موج‌دار" },
  { id: "balayage", cat: "color", name: "بالیاژ / آمبره", mins: 240, price: 4800000, desc: "از — قیمت نهایی با طول و حجم مو", hot: true },
  { id: "highlight", cat: "color", name: "لایت و هایلایت", mins: 180, price: 3500000, desc: "از — شامل تونر و براشینگ" },
  { id: "root", cat: "color", name: "رنگ ریشه", mins: 90, price: 950000, desc: "ترمیم ریشه تا ۳ سانت" },
  { id: "keratin", cat: "care", name: "کراتین", mins: 150, price: 2600000, desc: "از — صاف و براق تا ۴ ماه", hot: true },
  { id: "botox", cat: "care", name: "بوتاکس و احیا", mins: 120, price: 1900000, desc: "ترمیم موهای آسیب‌دیده" },
  { id: "gel", cat: "nail", name: "ژلیش دست", mins: 60, price: 420000, desc: "شامل مانیکور روسی" },
  { id: "acryl", cat: "nail", name: "کاشت ناخن", mins: 120, price: 950000, desc: "پودری یا ژل، با طراحی ساده" },
  { id: "brow", cat: "face", name: "اصلاح و فرم ابرو", mins: 30, price: 180000, desc: "طراحی فرم با متر صورت" },
  { id: "lash", cat: "face", name: "لیفت مژه", mins: 60, price: 650000, desc: "ماندگاری ۶ تا ۸ هفته" },
  { id: "party", cat: "makeup", name: "میکاپ و شینیون مجلسی", mins: 120, price: 2400000, desc: "با مشاوره استایل" }
];
const STAFF = [
  { id: "any", name: "اولین نوبت آزاد", role: "سریع‌ترین زمان", color: "linear-gradient(135deg,#d49a86,#6b2737)", ini: "⚡" },
  { id: "negar", name: "نگار", role: "رنگ و لایت", color: "linear-gradient(135deg,#8e3a4c,#2b1d1a)", ini: "ن", tags: ["بالیاژ", "آمبره", "رنگ"], cats: ["color", "hair"], stars: "۴.۹" },
  { id: "mahsa", name: "مهسا", role: "کراتین و کوتاهی", color: "linear-gradient(135deg,#b48a4f,#6b4a2a)", ini: "م", tags: ["کراتین", "کوتاهی", "احیا"], cats: ["care", "hair"], stars: "۴.۸" },
  { id: "elham", name: "الهام", role: "ناخن و مژه", color: "linear-gradient(135deg,#d49a86,#9a5a4c)", ini: "ا", tags: ["ژلیش", "کاشت", "لیفت مژه"], cats: ["nail", "face"], stars: "۵.۰" },
  { id: "sara", name: "سارا", role: "میکاپ و شینیون", color: "linear-gradient(135deg,#6b2737,#d49a86)", ini: "س", tags: ["عروس", "مجلسی", "ابرو"], cats: ["makeup", "face"], stars: "۴.۹" }
];
const HOURS = ["۱۰:۰۰", "۱۱:۰۰", "۱۲:۰۰", "۱۳:۰۰", "۱۴:۰۰", "۱۵:۰۰", "۱۶:۰۰", "۱۶:۳۰", "۱۷:۳۰", "۱۸:۳۰"];
const DEPOSIT = 0.2;

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
const en = s => String(s).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
const money = n => n >= 1e6 ? fa(+(n / 1e6).toFixed(2)).replace(".", "٫") + " میلیون تومان" : fa(Math.round(n / 1000)) + " هزار تومان";
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dur = m => m >= 60 ? fa(Math.floor(m / 60)) + " ساعت" + (m % 60 ? " و " + fa(m % 60) + " دقیقه" : "") : fa(m) + " دقیقه";
const fW = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "short" });
const fD = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric" });
const fM = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long" });
const fFull = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", day: "numeric", month: "long" });
const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; };
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2600); }

const DAYS = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
const dk = d => d.toISOString().slice(0, 10);
const closed = d => d.getDay() === 5; // Friday
let bookings = store.get("shm_bookings", []);
let blocked = store.get("shm_blocked", []);
const svcOf = id => SERVICES.find(s => s.id === id);
const staffOf = id => STAFF.find(s => s.id === id);
const realStaff = STAFF.filter(s => s.id !== "any");

/* 0 free · 2 busy (sample) · 3 booked here · 4 blocked */
function state(staffId, dIdx, h) {
  const k = `${staffId}|${dk(DAYS[dIdx])}|${h}`;
  if (blocked.includes(k)) return 4;
  if (bookings.some(b => b.key === k)) return 3;
  if (closed(DAYS[dIdx])) return 2;
  if (dIdx === 0 && h < 3) return 2;
  const p = 0.5 + (h >= 6 ? 0.2 : 0) + (DAYS[dIdx].getDay() === 4 ? 0.2 : 0) - dIdx * 0.02;
  return hash(k) < p ? 2 : 0;
}
const staffFor = svc => realStaff.filter(s => s.cats.includes(svc.cat));
function slotFree(staffId, dIdx, h, svc) {
  if (staffId === "any") return staffFor(svc).find(s => state(s.id, dIdx, h) === 0)?.id || null;
  return state(staffId, dIdx, h) === 0 ? staffId : null;
}

/* ---------- marquee + menu ---------- */
const mq = CATS.map(c => `<span>${c.name}</span>`).join("") + "<span>عروس</span><span>مراقبت پوست</span>";
$("#marq").innerHTML = mq + mq;
let cat = "color";
function renderMenu() {
  $("#cats").innerHTML = CATS.map(c => `<button type="button" role="tab" aria-selected="${c.id === cat}" data-c="${c.id}">${c.icon} ${c.name}</button>`).join("");
  $("#menu").innerHTML = SERVICES.filter(s => s.cat === cat).map(s => `
    <div class="item"><h3>${esc(s.name)} ${s.hot ? '<span class="badge">پرطرفدار</span>' : ""}</h3><span class="pr">${money(s.price)}</span>
    <p>${esc(s.desc)} · ${dur(s.mins)}</p><button type="button" data-svc="${s.id}">رزرو ←</button></div>`).join("");
}
$("#cats").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { cat = b.dataset.c; renderMenu(); } });
$("#menu").addEventListener("click", e => { const b = e.target.closest("[data-svc]"); if (b) { pickSvc(b.dataset.svc); go(1); $("#book").scrollIntoView({ behavior: "smooth" }); } });

/* ---------- team ---------- */
$("#teamGrid").innerHTML = realStaff.map(s => `
  <article class="member reveal"><div class="av" style="background:${s.color}">${s.ini}</div><h3>${esc(s.name)}</h3><p>${esc(s.role)} · <span class="stars">★ ${s.stars}</span></p>
  <div class="tags">${s.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div><button class="btn btn-sm btn-line" type="button" data-staff="${s.id}">نوبت با ${esc(s.name)}</button></article>`).join("");
$("#teamGrid").addEventListener("click", e => {
  const b = e.target.closest("[data-staff]"); if (!b) return;
  const st = staffOf(b.dataset.staff);
  if (!S.svc || !st.cats.includes(svcOf(S.svc).cat)) pickSvc(SERVICES.find(s => st.cats.includes(s.cat)).id);
  pickStaff(st.id); go(2); $("#book").scrollIntoView({ behavior: "smooth" });
});

/* ---------- booking wizard ---------- */
const S = { step: 0, svc: null, staff: "any", day: 0, h: null, done: null };
while (closed(DAYS[S.day])) S.day++;

$("#pickSvc").innerHTML = SERVICES.map(s => { const c = CATS.find(c => c.id === s.cat); return `<button type="button" class="opt" data-id="${s.id}" aria-pressed="false"><i>${c.icon}</i><span><b>${esc(s.name)}</b><small>${dur(s.mins)} · ${money(s.price)}</small></span></button>`; }).join("");
$("#pickSvc").addEventListener("click", e => { const b = e.target.closest(".opt"); if (b) { pickSvc(b.dataset.id); go(1); } });
function pickSvc(id) {
  S.svc = id; S.h = null;
  const svc = svcOf(id);
  if (S.staff !== "any" && !staffOf(S.staff).cats.includes(svc.cat)) S.staff = "any";
  $$(".opt").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === id));
  renderStaff(); renderSummary();
}
function renderStaff() {
  const svc = svcOf(S.svc); if (!svc) return;
  const list = [STAFF[0], ...staffFor(svc)];
  $("#pickStaff").innerHTML = list.map(s => `<button type="button" class="st" data-id="${s.id}" aria-pressed="${s.id === S.staff}"><div class="av" style="background:${s.color}">${s.ini}</div><b>${esc(s.name)}</b><small>${esc(s.role)}</small>${s.stars ? `<span class="stars">★ ${s.stars}</span>` : ""}</button>`).join("");
}
$("#pickStaff").addEventListener("click", e => { const b = e.target.closest(".st"); if (b) { pickStaff(b.dataset.id); go(2); } });
function pickStaff(id) { S.staff = id; S.h = null; renderStaff(); renderSummary(); }

function renderDays() {
  $("#days").innerHTML = DAYS.map((d, i) => `<button type="button" class="day${i === S.day ? " on" : ""}" data-i="${i}" ${closed(d) ? "disabled" : ""}><small>${i === 0 ? "امروز" : i === 1 ? "فردا" : fW.format(d)}</small><b>${fD.format(d)}</b><small>${closed(d) ? "تعطیل" : fM.format(d)}</small></button>`).join("");
}
$("#days").addEventListener("click", e => { const b = e.target.closest(".day"); if (!b || b.disabled) return; S.day = +b.dataset.i; S.h = null; renderDays(); renderSlots(); renderSummary(); });
function renderSlots() {
  const svc = svcOf(S.svc); if (!svc) return;
  const free = HOURS.map((_, h) => slotFree(S.staff, S.day, h, svc));
  const n = free.filter(Boolean).length;
  $("#slots").innerHTML = HOURS.map((t, h) => {
    const ok = !!free[h], few = ok && n <= 3;
    return `<button type="button" class="slot${few ? " few" : ""}${S.h === h ? " on" : ""}" data-h="${h}" ${ok ? "" : "disabled"}>${t}<small>${ok ? (few ? "آخرین‌ها" : "آزاد") : "رزرو شده"}</small></button>`;
  }).join("");
}
$("#slots").addEventListener("click", e => { const b = e.target.closest(".slot"); if (!b || b.disabled) return; S.h = +b.dataset.h; renderSlots(); renderSummary(); });

function renderSummary() {
  const svc = svcOf(S.svc), st = staffOf(S.staff);
  const row = (k, v) => `<div class="sum-row"><span>${k}</span><b>${v}</b></div>`;
  const price = svc ? svc.price : 0;
  $("#summary").innerHTML = `<h4>خلاصه نوبت</h4>
    ${row("خدمت", svc ? esc(svc.name) : "—")}${row("مدت", svc ? dur(svc.mins) : "—")}
    ${row("متخصص", esc(st.name))}${row("روز", fFull.format(DAYS[S.day]))}${row("ساعت", S.h != null ? HOURS[S.h] : "—")}
    <div class="sum-total"><span>هزینه</span><b>${svc ? money(price) : "—"}</b></div>
    <div class="sum-dep"><span>بیعانه آنلاین (۲۰٪)</span><b>${svc ? money(price * DEPOSIT) : "—"}</b></div>`;
}

function renderConfirm() {
  if (S.done) return renderTicket();
  $("#confirm").innerHTML = `<div class="form">
    <label class="fld"><span>نام و نام خانوادگی</span><input id="fName" autocomplete="name" placeholder="مثلاً: مریم احمدی"></label>
    <label class="fld"><span>شماره موبایل</span><input id="fPhone" inputmode="tel" autocomplete="tel" placeholder="۰۹۱۵۰۰۰۰۰۰۰" dir="ltr"></label>
    <p class="err" id="err" role="alert"></p>
    <div class="note">🔔<span>تأییدیه و یادآوری یک روز قبل در بله/تلگرام و پیامک ارسال می‌شه. لغو یا جابه‌جایی تا ۲۴ ساعت قبل با یک کلیک انجام می‌شه.</span></div>
    <div class="note">💳<span>بیعانه مستقیم به حساب سالن واریز می‌شه. در این دمو پرداخت واقعی انجام نمی‌شه.</span></div></div>`;
}
function renderTicket() {
  const b = S.done, svc = svcOf(b.svc), st = staffOf(b.staff);
  let q = ""; for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) { const c = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7); if (c || hash(b.code + x + "-" + y) > .5) q += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  $("#confirm").innerHTML = `<p class="ok-badge">✓ نوبتت قطعی شد. تأییدیه در بله/تلگرام ارسال شد.</p>
    <div class="ticket"><div class="tk-main"><small>نوبت سالن زیبایی شمیم</small><h3>${esc(svc.name)}</h3>
      <div class="tk-grid"><div><small>روز</small><b>${fFull.format(DAYS[b.day])}</b></div><div><small>ساعت</small><b>${HOURS[b.h]}</b></div>
      <div><small>متخصص</small><b>${esc(st.name)}</b></div><div><small>به نام</small><b>${esc(b.name)}</b></div></div></div>
      <div class="tk-side"><svg viewBox="0 0 11 11" fill="#2b1d1a" shape-rendering="crispEdges">${q}</svg><code>${b.code}</code></div></div>
    <div class="done-acts"><button class="btn btn-sm btn-line" id="ics" type="button">افزودن به تقویم</button><a class="btn btn-sm btn-line" href="#owner">دیدن در پنل مدیر</a><button class="btn btn-sm btn-line" id="again" type="button">نوبت جدید</button></div>`;
  $("#ics").onclick = () => ics(b);
  $("#again").onclick = () => { S.done = null; S.h = null; go(0); };
}
function ics(b) {
  const svc = svcOf(b.svc), [hh, mm] = en(HOURS[b.h]).split(":").map(Number);
  const s = new Date(DAYS[b.day]); s.setHours(hh, mm, 0, 0); const e = new Date(s.getTime() + svc.mins * 60000);
  const f = t => t.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const txt = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SHM//FA\r\nBEGIN:VEVENT\r\nUID:${b.code}@shamim\r\nDTSTAMP:${f(new Date())}\r\nDTSTART:${f(s)}\r\nDTEND:${f(e)}\r\nSUMMARY:${svc.name} - سالن شمیم\r\nLOCATION:مشهد، نبش پیروزی ۱۰\r\nBEGIN:VALARM\r\nTRIGGER:-PT2H\r\nACTION:DISPLAY\r\nDESCRIPTION:یادآوری نوبت\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar" })); a.download = `shamim-${b.code}.ics`; a.click(); URL.revokeObjectURL(a.href);
}

function validate() {
  if (S.step === 0 && !S.svc) { toast("یه خدمت انتخاب کن"); return false; }
  if (S.step === 2 && S.h == null) { toast("یه ساعت انتخاب کن"); return false; }
  if (S.step === 3) {
    const err = $("#err"), name = $("#fName").value.trim(), ph = en($("#fPhone").value).replace(/\D/g, "");
    err.textContent = "";
    if (name.length < 2) { err.textContent = "نامت رو وارد کن."; $("#fName").focus(); return false; }
    if (!/^09\d{9}$/.test(ph)) { err.textContent = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع بشه."; $("#fPhone").focus(); return false; }
  }
  return true;
}
function go(step) {
  S.step = step;
  $$(".steps li").forEach((li, i) => { li.classList.toggle("on", i === step); li.classList.toggle("done", i < step); });
  $$(".pane").forEach(p => p.classList.toggle("on", +p.dataset.pane === step));
  $("#back").style.visibility = step === 0 || S.done ? "hidden" : "visible";
  const nx = $("#next"); nx.style.display = S.done ? "none" : "";
  const svc = svcOf(S.svc);
  nx.textContent = step === 3 ? `ثبت و پرداخت بیعانه ${svc ? money(svc.price * DEPOSIT) : ""}` : "ادامه";
  if (step === 1) renderStaff();
  if (step === 2) { renderDays(); renderSlots(); }
  if (step === 3) renderConfirm();
  renderSummary();
}
$("#back").onclick = () => go(Math.max(0, S.step - 1));
$("#next").onclick = () => {
  if (!validate()) return;
  if (S.step === 1 && !S.staff) S.staff = "any";
  if (S.step < 3) return go(S.step + 1);
  const nx = $("#next"); nx.disabled = true; nx.textContent = "در حال اتصال به درگاه…";
  setTimeout(() => {
    const svc = svcOf(S.svc), staff = slotFree(S.staff, S.day, S.h, svc) || S.staff;
    const b = { code: "SHM-" + fa(Math.floor(1000 + Math.random() * 9000)), svc: S.svc, staff, day: S.day, h: S.h, name: $("#fName").value.trim(), key: `${staff}|${dk(DAYS[S.day])}|${S.h}`, dep: svc.price * DEPOSIT };
    bookings.push(b); store.set("shm_bookings", bookings);
    S.done = b; nx.disabled = false; go(3); renderOwner(); botBooking(b); toast("نوبت ثبت شد ✓");
  }, 1100);
};

/* ---------- bride ---------- */
const bDates = Array.from({ length: 60 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + 7 + i); return d; }).filter(d => [3, 4].includes(d.getDay()));
$("#bDate").innerHTML = bDates.map((d, i) => `<option value="${i}">${fFull.format(d)}</option>`).join("");
function bAvail() {
  const d = bDates[+$("#bDate").value], left = Math.floor(hash(dk(d) + "bride") * 3);
  const p = $("#bAvail");
  p.className = "avail " + (left ? "ok" : "no");
  p.textContent = left ? `✓ این تاریخ ${fa(left)} ظرفیت عروس باقی مونده` : "این تاریخ تکمیله. لطفاً تاریخ دیگه‌ای انتخاب کن یا وارد لیست انتظار شو.";
}
$("#bDate").onchange = bAvail; bAvail();
$("#brideForm").addEventListener("submit", e => {
  e.preventDefault();
  const err = $("#bErr"), n = $("#bName").value.trim(), ph = en($("#bPhone").value).replace(/\D/g, "");
  err.textContent = "";
  if (n.length < 2) return void (err.textContent = "نام رو وارد کن.");
  if (!/^09\d{9}$/.test(ph)) return void (err.textContent = "شماره موبایل معتبر نیست.");
  e.target.reset(); bAvail(); toast("درخواستت ثبت شد. برای وقت مشاوره باهات تماس می‌گیریم 🤍");
});

/* ---------- bot mock ---------- */
const BOT = [
  { t: "سلام مریم جان 🌸\nنوبتت قطعی شد:\nبالیاژ با نگار · سه‌شنبه ساعت ۱۱:۰۰\n📍 نبش پیروزی ۱۰", kb: ["مسیریابی", "جابه‌جایی نوبت"] },
  { t: "⏰ یادآوری: فردا ساعت ۱۱ منتظرتیم.\nلطفاً با موی خشک و بدون شستشو تشریف بیارید 🙏", kb: ["میام ✅", "لغو"] },
  { me: true, t: "میام ✅" },
  { t: "ممنون از اعتمادت 🤍\nنظرت درباره‌ی کار نگار چی بود؟", kb: ["⭐️⭐️⭐️⭐️⭐️"] },
  { t: "۶ هفته از رنگت گذشته ✨\nوقت ترمیم ریشه‌ست. نگار پنجشنبه ساعت ۱۴ و ۱۶ آزاده.", kb: ["رزرو ۱۴:۰۰", "رزرو ۱۶:۰۰"] }
];
const msg = m => `<div class="msg${m.me ? " me" : ""}">${esc(m.t)}${m.kb ? `<div class="kb">${m.kb.map(k => `<span>${esc(k)}</span>`).join("")}</div>` : ""}</div>`;
let botT;
function playBot() {
  const c = $("#chat"); c.innerHTML = ""; let i = 0; clearInterval(botT);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { c.innerHTML = BOT.slice(-3).map(msg).join(""); return; }
  botT = setInterval(() => { c.insertAdjacentHTML("beforeend", msg(BOT[i++])); while (c.children.length > 3) c.firstElementChild.remove(); if (i >= BOT.length) { clearInterval(botT); setTimeout(playBot, 4500); } }, 1700);
}
function botBooking(b) {
  clearInterval(botT); const c = $("#chat"), svc = svcOf(b.svc), st = staffOf(b.staff);
  c.insertAdjacentHTML("beforeend", msg({ t: `🆕 نوبت جدید (اعلان مدیر)\n${svc.name} · ${st.name}\n${fFull.format(DAYS[b.day])} ساعت ${HOURS[b.h]}\n${b.name} · بیعانه ${money(b.dep)} ✅`, kb: ["تأیید", "تماس"] }));
  while (c.children.length > 3) c.firstElementChild.remove();
  setTimeout(playBot, 9000);
}

/* ---------- owner ---------- */
let od = 0; while (closed(DAYS[od])) od++;
function renderOwner() {
  let busy = 0, mine = 0;
  const rows = realStaff.map(s => `<tr><td class="rn">${esc(s.name)}</td>${HOURS.map((t, h) => {
    const st = state(s.id, od, h), k = `${s.id}|${dk(DAYS[od])}|${h}`;
    if (st === 2) busy++; if (st === 3) mine++;
    const b = st === 3 && bookings.find(x => x.key === k);
    const cls = st === 3 ? "s-new" : st === 2 ? "s-busy" : st === 4 ? "s-block" : "s-free";
    const lbl = st === 3 ? `جدید<br>${esc(b.name)}` : st === 2 ? "رزرو" : st === 4 ? "بسته" : "خالی";
    return `<td class="${cls}" data-k="${k}">${lbl}</td>`;
  }).join("")}</tr>`).join("");
  $("#sched").innerHTML = `<thead><tr><th>${od === 0 ? "امروز" : fFull.format(DAYS[od])}</th>${HOURS.map(t => `<th>${t}</th>`).join("")}</tr></thead><tbody>${rows}</tbody>`;
  const cap = realStaff.length * HOURS.length, filled = busy + mine;
  const kpi = (k, v, e = "") => `<div class="kpi"><span>${k}</span><b>${v}</b>${e ? `<em>${e}</em>` : ""}</div>`;
  $("#kpis").innerHTML = kpi("نوبت‌های امروز", fa(filled)) + kpi("پر بودن ظرفیت", fa(Math.round(filled / cap * 100)) + "٪") +
    kpi("رزرو بدون تماس", fa(Math.round(filled * .7)), "منشی آزادتر") + kpi("یادآور ترمیم این هفته", fa(23), "۲۳ مشتری برگشتی");
}
$("#sched").addEventListener("click", e => {
  const td = e.target.closest("td[data-k]"); if (!td) return; const k = td.dataset.k;
  if (td.classList.contains("s-block")) blocked = blocked.filter(x => x !== k);
  else if (td.classList.contains("s-free")) blocked.push(k);
  else return toast("این ساعت رزرو شده");
  store.set("shm_blocked", blocked); renderOwner(); if (S.svc) renderSlots(); toast("تقویم به‌روزرسانی شد");
});

/* ---------- hero numbers, reveal, sw ---------- */
const todayFree = realStaff.flatMap(s => HOURS.map((_, h) => [s.id, h])).filter(([s, h]) => state(s, od, h) === 0);
$("#todayLeft").textContent = fa(todayFree.length); $("#todayLbl").textContent = od === 0 ? "امروز" : od === 1 ? "فردا" : fW.format(DAYS[od]);
const nf = todayFree.sort((a, b) => a[1] - b[1])[0];
if (nf) $("#nextFree").textContent = (od === 0 ? "امروز " : fW.format(DAYS[od]) + " ") + HOURS[nf[1]];
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 }) : null;
$$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

renderMenu(); renderOwner(); go(0); playBot();
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
$$(".lk").forEach(a => a.addEventListener("click", () => { cat = a.dataset.cat; renderMenu(); }));
