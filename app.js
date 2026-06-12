const official = {
  hsp2: "https://www.moj.go.jp/isa/applications/status/designatedactivities02_00004.html#midashi04",
  points: "https://www.moj.go.jp/isa/applications/resources/newimmiact_3_evaluate_index.html",
  form: "https://www.moj.go.jp/isa/content/930001673.xls",
  evidence: "https://www.moj.go.jp/isa/content/001419077.pdf",
  tax: "https://www.nta.go.jp/taxes/nozei/nozei-shomei/01.htm",
  pension: "https://www.nenkin.go.jp/n_net/index.html"
};

const stateKeys = ["route", "scorePath", "residentTax", "pension", "health", "owner", "proxy", "targetDate"];
const groups = [
  ["core", "先确认资格", "先判断能不能走高度 2 号"],
  ["forms", "申请书和基础材料", "提交当天必须带齐"],
  ["points", "分数证明", "够 70/80 分即可，不必证明所有项目"],
  ["tax", "税务材料", "市区町村和税务署多为工作日窗口"],
  ["social", "年金和健康保险", "最容易因为期间不连续而补件"],
  ["extra", "按情况追加", "根据你的选择自动出现"]
];

const baseItems = [
  {
    id: "eligibility-70",
    group: "core",
    party: "本人",
    filter: "me",
    title: "确认当前点数仍为 70 分以上",
    detail: "高度 2 号要求按高度人才ポイント制计算达到 70 分以上。80 分路径可减少部分税、年金、健康保险证明年数。",
    tags: ["官方条件", "先做"],
    priority: "高",
    link: official.points
  },
  {
    id: "eligibility-years",
    group: "core",
    party: "本人",
    filter: "me",
    title: "确认高度 1 号或高度人才特定活动的在留期间",
    detail: "原则上高度 1 号或高度人才特定活动持续 3 年以上；若按 80 分路径准备，税和社保资料可按 1 年规则缩短，但高度 2 号页面仍要求确认既往在留和活动。",
    tags: ["在留履历", "先做"],
    priority: "高"
  },
  {
    id: "application-form",
    group: "forms",
    party: "本人",
    filter: "me",
    title: "在留资格変更許可申請書 1 通",
    detail: "活动内容不变时，使用高度 1 号在留资格变更申请同一类表格；活动变更时，按新活动对应在留资格页面下载。",
    tags: ["申请书", "官方表格"],
    priority: "高",
    link: official.hsp2
  },
  {
    id: "photo",
    group: "forms",
    party: "本人",
    filter: "me",
    title: "照片 1 张",
    detail: "按入管指定规格贴在申请书上；16 岁未满不用提交照片。",
    tags: ["证件照", "当天提交"],
    priority: "高"
  },
  {
    id: "passport-card",
    group: "forms",
    party: "本人",
    filter: "me",
    title: "护照和在留卡原件",
    detail: "官方要求提示。提交当天不要只带复印件。",
    tags: ["原件提示", "当天提交"],
    priority: "高"
  },
  {
    id: "activity-docs",
    group: "forms",
    party: "公司/所属机构",
    filter: "company",
    title: "当前活动对应的就劳资格资料",
    detail: "按你实际活动对应的在留资格准备，例如教授、研究、技术/人文知识/国际业务、经营管理等；若该资格按机构类别区分，也要按类别准备。",
    tags: ["公司资料", "可能要盖章"],
    priority: "高"
  },
  {
    id: "point-sheet",
    group: "points",
    party: "本人",
    filter: "me",
    title: "ポイント計算表 1 通",
    detail: "根据高度 1 号イ/ロ/ハ选择对应分野填写。建议同时保存填写版和 PDF 版。",
    tags: ["Excel", "官方表格"],
    priority: "高",
    link: official.form
  },
  {
    id: "point-evidence",
    group: "points",
    party: "本人 + 公司/学校",
    filter: "company",
    title: "点数项目的证明材料",
    detail: "只需要证明合计 70 分以上；如果想按 80 分路径减少部分材料年数，要能证明 80 分以上。",
    tags: ["学历", "年收", "职历", "日语"],
    priority: "高",
    link: official.evidence
  },
  {
    id: "resident-tax-cert",
    group: "tax",
    party: "市区町村",
    filter: "office",
    title: "住民税课税/非课税证明书及纳税证明书",
    detail: () => `准备${taxYears()}年分。需要能看到一年总所得和纳税状况；如果一个证明能同时显示两者，可以不用分开拿。日本发行证明书通常需 3 个月内。`,
    tags: ["工作日窗口", "3 个月内"],
    priority: "高",
    workday: true
  },
  {
    id: "national-tax",
    group: "tax",
    party: "税务署/国税厅",
    filter: "office",
    title: "国税納税証明書（その3）",
    detail: "对象税目为源泉所得税及复兴特别所得税、申告所得税及复兴特别所得税、消费税及地方消费税、相续税、赠与税，证明日现在无未纳。可线上申请。",
    tags: ["可线上", "5 税目"],
    priority: "高",
    workday: true,
    link: official.tax
  },
  {
    id: "income-proof",
    group: "tax",
    party: "本人",
    filter: "me",
    title: "所得证明补充资料",
    detail: "官方列举预貯金通帳写し或同等资料。Web 通帐可用，但需要打印成不可加工状态，Excel 等可加工文件不可。",
    tags: ["通帐", "收入证明"],
    priority: "中"
  },
  {
    id: "pension-record",
    group: "social",
    party: "年金事务所/日本年金机构",
    filter: "office",
    title: "公的年金缴纳状况证明",
    detail: () => `通常准备近${socialYears()}年。可用年金事务所出具的被保険者記録照会回答票等；也可用全期间ねんきん定期便或ねんきんネット打印。`,
    tags: ["工作日窗口", "可部分线上"],
    priority: "高",
    workday: true,
    link: official.pension
  },
  {
    id: "health-proof",
    group: "social",
    party: "本人/健康保险/市区町村",
    filter: "office",
    title: "公的医疗保险缴纳状况证明",
    detail: () => `通常准备近${socialYears()}年。现在加入公司健康保险时准备健康保险被保险者证等；有国民健康保险期间时，按期间准备纳付证明或领收证书。`,
    tags: ["健康保险", "国民健康保险"],
    priority: "高",
    workday: true
  }
];

const conditionalItems = [
  {
    id: "changed-activity-form",
    when: (s) => s.route === "changed",
    group: "extra",
    party: "本人 + 公司",
    filter: "company",
    title: "活动或所属机构变化时，重新按新活动准备表格和公司资料",
    detail: "高度 1 号期间内若所属机构变更，本身通常也需要在留资格变更申请。转 2 号时不要沿用旧机构资料。",
    tags: ["条件追加", "公司资料"],
    priority: "高"
  },
  {
    id: "resident-tax-receipts",
    when: (s) => s.residentTax === "mixed",
    group: "tax",
    party: "本人/银行/市区町村",
    filter: "me",
    title: "住民税非工资天引期间的缴纳证明",
    detail: "有普通征收或自己缴纳期间时，准备通帐写し、领收证书等，证明按时缴纳。难以提交时准备理由书。",
    tags: ["条件追加", "普通征收"],
    priority: "高",
    workday: true
  },
  {
    id: "national-pension-receipts",
    when: (s) => s.pension !== "employee",
    group: "social",
    party: "本人",
    filter: "me",
    title: "国民年金期间的各月记录或领收证书",
    detail: "有国民年金期间时，ねんきんネット各月年金记录中还要包含国民年金各月纳付状况；领收证书不足时准备理由书。",
    tags: ["条件追加", "国民年金"],
    priority: "高"
  },
  {
    id: "national-health-proof",
    when: (s) => s.health !== "employee",
    group: "social",
    party: "市区町村/本人",
    filter: "office",
    title: "国民健康保险期间的纳付证明或领收证书",
    detail: "有国民健康保险期间时，按该期间准备国民健康保险料/税纳付证明和领收证书写し；难以提交时准备理由书。",
    tags: ["条件追加", "工作日窗口"],
    priority: "高",
    workday: true
  },
  {
    id: "business-owner-social",
    when: (s) => s.owner,
    group: "extra",
    party: "事业主/日本年金机构",
    filter: "office",
    title: "事业主追加：事业所社会保险料纳付证明",
    detail: "申请时为社会保险适用事业所事业主时，追加健康保险/厚生年金保险料领收证书，或社会保险料纳入证明书/纳入确认书。",
    tags: ["条件追加", "事业主"],
    priority: "高",
    workday: true
  },
  {
    id: "proxy-id",
    when: (s) => s.proxy,
    group: "extra",
    party: "提交人",
    filter: "me",
    title: "本人以外提交时：提交人身份文件",
    detail: "官方要求提示提交人能够提交申请的身份文件，例如公司身分证明书等。",
    tags: ["条件追加", "当天提示"],
    priority: "高"
  }
];

function getState() {
  const result = {};
  stateKeys.forEach((key) => {
    const el = document.getElementById(key);
    result[key] = el.type === "checkbox" ? el.checked : el.value;
  });
  return result;
}

function taxYears() {
  const score = document.getElementById("scorePath").value;
  if (score === "80") return "1";
  if (score === "70") return "3";
  return "5";
}

function socialYears() {
  return document.getElementById("scorePath").value === "80" ? "1" : "2";
}

function allItems(state) {
  return baseItems.concat(conditionalItems.filter((item) => item.when(state)));
}

function render() {
  const state = getState();
  localStorage.setItem("hsp2-state", JSON.stringify(state));
  const filter = document.querySelector(".tabs .active").dataset.filter;
  const checked = JSON.parse(localStorage.getItem("hsp2-checked") || "{}");
  const items = allItems(state).filter((item) => filter === "all" || item.filter === filter || (filter === "online" && item.tags.includes("可线上")));
  const container = document.getElementById("groups");
  container.innerHTML = "";

  groups.forEach(([id, title, subtitle]) => {
    const groupItems = items.filter((item) => item.group === id);
    if (!groupItems.length) return;
    const done = groupItems.filter((item) => checked[item.id]).length;
    const section = document.createElement("section");
    section.className = "group";
    section.innerHTML = `
      <div class="groupHeader">
        <div>
          <h3>${title}</h3>
          <span>${subtitle}</span>
        </div>
        <span>${done}/${groupItems.length}</span>
      </div>
      ${groupItems.map((item) => itemHtml(item, checked)).join("")}
    `;
    container.appendChild(section);
  });

  const visibleDone = items.filter((item) => checked[item.id]).length;
  document.getElementById("doneCount").textContent = `${visibleDone}/${items.length}`;
  document.getElementById("summaryText").textContent = summaryText(state);
  renderDateAdvice();
}

function itemHtml(item, checked) {
  const detail = typeof item.detail === "function" ? item.detail() : item.detail;
  const tags = [...item.tags];
  if (item.workday) tags.push("周末不可假定能办理");
  if (item.link) tags.push("官方链接");
  return `
    <article class="item">
      <input type="checkbox" data-id="${item.id}" ${checked[item.id] ? "checked" : ""} aria-label="完成 ${item.title}">
      <div>
        <h4>${item.title}</h4>
        <p>${detail}</p>
        <div class="chips">
          <span class="chip">${item.party}</span>
          ${tags.map((tag) => `<span class="chip ${tag.includes("周末") ? "workday" : ""} ${tag.includes("官方") ? "official" : ""}">${tag}</span>`).join("")}
          ${item.link ? `<a class="chip official" href="${item.link}" target="_blank" rel="noreferrer">查看来源</a>` : ""}
        </div>
      </div>
      <span class="priority ${item.priority === "高" ? "high" : ""}">${item.priority}优先</span>
    </article>
  `;
}

function summaryText(state) {
  const routeText = state.route === "same" ? "活动内容不变，通常沿用高度 1 号对应的变更申请书。" : "活动或所属机构变化，要按新活动重新确认表格和公司材料。";
  const scoreText = state.scorePath === "80"
    ? "按 80 分以上路径，住民税、年金、健康保险部分材料年数可按官方缩短规则准备。"
    : state.scorePath === "70"
      ? "按 70 分以上路径，住民税通常准备 3 年分，年金/健康保险通常准备 2 年分。"
      : "你选择按官方原始年数准备，住民税按 5 年、年金/健康保险按 2 年。";
  return `${routeText} ${scoreText} 日本发行证明书请尽量安排在提交前 3 个月内取得。`;
}

function nextWeekday(date) {
  const result = new Date(date);
  while ([0, 6].includes(result.getDay())) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

function fmt(date) {
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
}

function renderDateAdvice() {
  const input = document.getElementById("targetDate").value;
  const box = document.getElementById("dateAdvice");
  if (!input) {
    box.textContent = "选一个预计提交日后，我会自动提醒是否踩到周末，并倒推出最晚开始跑窗口的日期。";
    return;
  }
  const target = new Date(`${input}T12:00:00`);
  const submit = nextWeekday(target);
  const start = addBusinessDays(submit, -10);
  const changed = submit.getTime() !== target.getTime();
  box.textContent = `${changed ? "你选的日期是周末，建议改到 " : "预计提交日："}${fmt(submit)}。市区町村、税务署、年金事务所资料建议最晚从 ${fmt(start)} 开始跑；ねんきんネット用户 ID 明信片可能要 5 个工作日左右。`;
}

function loadSavedState() {
  const saved = JSON.parse(localStorage.getItem("hsp2-state") || "{}");
  stateKeys.forEach((key) => {
    const el = document.getElementById(key);
    if (!el || saved[key] === undefined) return;
    if (el.type === "checkbox") el.checked = saved[key];
    else el.value = saved[key];
  });
}

function addBusinessDays(date, delta) {
  const result = new Date(date);
  const direction = Math.sign(delta);
  let left = Math.abs(delta);
  while (left > 0) {
    result.setDate(result.getDate() + direction);
    if (![0, 6].includes(result.getDay())) left -= 1;
  }
  return result;
}

loadSavedState();
stateKeys.forEach((key) => document.getElementById(key).addEventListener("change", render));
document.getElementById("groups").addEventListener("change", (event) => {
  if (!event.target.matches("input[type='checkbox']")) return;
  const checked = JSON.parse(localStorage.getItem("hsp2-checked") || "{}");
  checked[event.target.dataset.id] = event.target.checked;
  localStorage.setItem("hsp2-checked", JSON.stringify(checked));
  render();
});
document.querySelectorAll(".tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("hsp2-checked");
  render();
});

render();
