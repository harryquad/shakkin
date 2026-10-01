// 借金・ローン返済サイトのツール一覧と共通の計算（このサイト専用。ほかのサイトとは別管理）
const TOOLS = [
  { path: "/shakkin/", name: "借金返済シミュレーション", desc: "毎月の返済額から完済までの期間と利息の総額、期間から毎月の返済額を計算" },
  { path: "/shakkin/ribo/", name: "リボ払い 手数料・返済期間 計算", desc: "リボ払いの手数料の総額と、完済までの期間。増額返済の効果も" },
  { path: "/shakkin/omatome/", name: "おまとめローン 比較", desc: "複数の借入を1つにまとめると、利息と返済期間がどう変わるか" },
  { path: "/shakkin/saimu/", name: "債務整理 シミュレーション", desc: "任意整理・個人再生をした場合の、毎月の返済額の目安" },
  { path: "/shakkin/kabarai/", name: "過払い金 計算（目安）", desc: "昔の高い金利で返していた場合に、払いすぎた利息の目安と時効" },
  { path: "/shakkin/soryo/", name: "総量規制 計算", desc: "年収の3分の1まで、あといくら借りられるかの目安" },
  { path: "/shakkin/entai/", name: "遅延損害金・上限金利 チェック", desc: "延滞した場合の遅延損害金と、金利が法律の上限を超えていないか" },
];

const MAN = 10000;
const yen = n => Math.round(n).toLocaleString("ja-JP") + "円";
const man = n => (Math.round(n / 1000) / 10).toLocaleString("ja-JP") + "万円";
const num = id => Math.max(0, Number(document.getElementById(id).value) || 0);
const ym = m => `${Math.floor(m / 12)}年${m % 12}か月`;

// 利息制限法の上限金利（元本による）
const legalRate = p => (p < 100000 ? 0.2 : p < 1000000 ? 0.18 : 0.15);

// 毎月一定額を返す（元利定額）場合の完済までの期間と利息の総額
// 利息は日割り（年利 ÷ 365 × 30日）ではなく、年利 ÷ 12 で計算した目安
function payoff(balance, annualRate, monthly, maxMonths = 600) {
  const r = annualRate / 12;
  let bal = balance, months = 0, interest = 0;
  if (monthly <= bal * r) return { months: Infinity, interest: Infinity };
  while (bal > 0.5 && months < maxMonths) {
    const i = bal * r;
    interest += i;
    bal = bal + i - Math.min(monthly, bal + i);
    months++;
  }
  return { months, interest, total: balance + interest };
}
// 期間（月）を決めて返す場合の毎月の返済額
function payment(balance, annualRate, months) {
  const r = annualRate / 12;
  return r ? balance * r / (1 - Math.pow(1 + r, -months)) : balance / months;
}

// 困ったときの相談先（すべてのページで同じ文言）
const HELP = `<div class="help"><strong>返済が苦しいときは、ひとりで抱え込まずに相談を。</strong><br>
  国が設立した「法テラス」では、収入などの条件を満たせば弁護士・司法書士に無料で相談できます。借金の問題に強い弁護士・司法書士事務所でも、無料相談を受け付けているところが多くあります。</div>`;

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("related");
  if (!el) return;
  const here = location.pathname.replace(/index\.html$/, "");
  el.innerHTML = `<h2>ほかのツール</h2><ul class="tools">${TOOLS.filter(t => t.path !== here)
    .map(t => `<li><a href="${t.path}"><b>${t.name}</b><span>${t.desc}</span></a></li>`).join("")}</ul>`;
});
