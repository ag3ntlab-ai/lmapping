// A GENERIC, reconstructed Gantt-tool timeline — deliberately dense and hard to
// read, the "you cannot present this to leadership" side of the reconciliation.
// Zero real-company data: invented tickets on the SAME story as the Lmapping board
// (USA Q4 release, Brazil rollout, France localization, DB migration, Jul -> Dec).
// It is a foreign corporate tool on purpose, so it uses its own dull palette, off
// the site's ink-on-paper chrome.

type Row = {
  id?: string;
  label: string;
  epic?: boolean;
  child?: boolean;
  state: "todo" | "prog" | "done" | "review" | "blocked" | "backlog";
  start?: number; // month index 0 = Jul
  span?: number;
};

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATE: Record<Row["state"], { t: string; c: string }> = {
  todo: { t: "TO DO", c: "bg-slate-200 text-slate-600" },
  prog: { t: "IN PROGRESS", c: "bg-blue-100 text-blue-700" },
  done: { t: "DONE", c: "bg-emerald-100 text-emerald-700" },
  review: { t: "IN REVIEW", c: "bg-amber-100 text-amber-700" },
  blocked: { t: "BLOCKED", c: "bg-rose-100 text-rose-700" },
  backlog: { t: "BACKLOG", c: "bg-slate-100 text-slate-500" },
};

const BAR: Record<Row["state"], string> = {
  todo: "bg-slate-300",
  prog: "bg-blue-400",
  done: "bg-emerald-400",
  review: "bg-amber-400",
  blocked: "bg-rose-400",
  backlog: "bg-slate-200",
};

const ROWS: Row[] = [
  { label: "Q4 Product Portfolio", epic: true, state: "prog", start: 0, span: 6 },
  { id: "PRJ-118", label: "USA Q4 release", epic: true, state: "prog", start: 2, span: 4 },
  { id: "PRJ-201", label: "Vblog + media player v2", child: true, state: "todo", start: 5, span: 1 },
  { id: "PRJ-202", label: "Vcard contact update", child: true, state: "todo", start: 5, span: 1 },
  { id: "PRJ-203", label: "FRS usability redesign", child: true, state: "prog", start: 4, span: 2 },
  { id: "PRJ-204", label: "SDK27 + security components", child: true, state: "todo", start: 5, span: 1 },
  { id: "PRJ-090", label: "Brazil rollout", epic: true, state: "done", start: 1, span: 1 },
  { id: "PRJ-131", label: "France localization", epic: true, state: "prog", start: 0, span: 3 },
  { id: "PRJ-210", label: "Solution / RGPD DB", child: true, state: "done", start: 0, span: 1 },
  { id: "PRJ-211", label: "Specs / RGPD variation", child: true, state: "done", start: 0, span: 1 },
  { id: "PRJ-212", label: "Dev / specificities", child: true, state: "prog", start: 1, span: 1 },
  { id: "PRJ-213", label: "QA / UAT", child: true, state: "todo", start: 1, span: 1 },
  { id: "PRJ-214", label: "Rollout / GTM", child: true, state: "todo", start: 2, span: 1 },
  { id: "PRJ-155", label: "DB migration", epic: true, state: "review", start: 0, span: 6 },
  { id: "PRJ-220", label: "UAT env", child: true, state: "blocked", start: 2, span: 1 },
  { id: "PRJ-221", label: "Update systems", child: true, state: "todo", start: 5, span: 1 },
  { id: "PRJ-341", label: "Login & account journey", state: "backlog" },
  { id: "PRJ-342", label: "Onboarding journey", state: "backlog" },
  { id: "PRJ-343", label: "Learning center journey", state: "backlog" },
  { id: "PRJ-344", label: "Homepage journey", state: "backlog" },
  { id: "PRJ-345", label: "Journal entry journey", state: "backlog" },
  { id: "PRJ-346", label: "Account management journey", state: "backlog" },
];

export function JiraMess({ className }: { className?: string }) {
  return (
    <div
      className={
        "select-none overflow-hidden rounded-[10px] border border-slate-300 bg-white font-sans text-slate-700 shadow-[0_1px_0_#fff_inset,0_30px_70px_-52px_rgba(22,24,29,0.35)] " +
        (className ?? "")
      }
      aria-label="A typical Gantt tool timeline: dense, cryptic and unreadable in a meeting"
      role="img"
    >
      {/* toolbar */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-1.5">
        <span className="text-[10px] font-semibold text-slate-500">Q4 Product Portfolio</span>
        <span className="ml-1 flex gap-2 text-[9px] text-slate-400">
          <span className="border-b-2 border-blue-500 pb-1 font-semibold text-blue-600">Timeline</span>
          <span className="pb-1">Summary</span>
          <span className="pb-1">Board</span>
          <span className="pb-1">Calendar</span>
          <span className="pb-1">Dependencies</span>
        </span>
        <span className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-400">
          Filter
        </span>
        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-400">
          Group: none
        </span>
      </div>

      <div className="grid grid-cols-[minmax(150px,44%)_1fr] text-[10px]">
        {/* left: ticket tree */}
        <div className="border-r border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Issue</span>
            <span>Status</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={i}
              className={
                "flex items-center gap-1 border-b border-slate-100 px-2 py-[3px] " +
                (r.epic ? "bg-slate-50/60 font-semibold text-slate-700" : "text-slate-500")
              }
            >
              {(r.epic || r.child) && (
                <span className="shrink-0 text-slate-300">{r.epic ? "▾" : r.child ? "└" : ""}</span>
              )}
              <span className={r.child ? "pl-1" : ""}>
                {r.id && <span className="mr-1 text-[9px] text-slate-400">{r.id}</span>}
                <span className="truncate">{r.label}</span>
              </span>
              <span className={"ml-auto shrink-0 whitespace-nowrap rounded px-1 py-[1px] text-[8px] font-semibold " + STATE[r.state].c}>
                {STATE[r.state].t}
              </span>
            </div>
          ))}
        </div>

        {/* right: cramped gantt grid */}
        <div className="relative">
          {/* month header */}
          <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)` }}>
            {MONTHS.map((m) => (
              <div key={m} className="border-l border-slate-200 px-1 py-1 text-center text-[9px] text-slate-400 first:border-l-0">
                {m}
              </div>
            ))}
          </div>
          {/* today line (mid-Sep) */}
          <div className="pointer-events-none absolute bottom-0 top-[22px] z-[2] w-px bg-blue-400/70" style={{ left: `${(2.5 / MONTHS.length) * 100}%` }} />
          {/* rows */}
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="relative grid border-b border-slate-100"
              style={{ gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)`, height: 22 }}
            >
              {MONTHS.map((_, c) => (
                <div key={c} className="border-l border-slate-100 first:border-l-0" />
              ))}
              {r.start !== undefined && r.span !== undefined && (
                <div
                  className={"absolute top-1/2 h-[8px] -translate-y-1/2 rounded-[2px] " + BAR[r.state]}
                  style={{ left: `${(r.start / MONTHS.length) * 100}%`, width: `${(r.span / MONTHS.length) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
