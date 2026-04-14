import { RecursionStep } from "@/lib/algorithms/recursion/types";

interface CallStackProps {
  activeSteps: RecursionStep[];
}

export function CallStack({ activeSteps }: CallStackProps) {
  const stack = activeSteps.filter((s) => s.action === 'push').filter((push, i, arr) =>
    arr.findIndex((p) => p.frame.id === push.frame.id) === i
  ).filter((push) =>
    !activeSteps.some((pop) => pop.action === 'pop' && pop.frame.id === push.frame.id)
  );

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--bdr)", borderRadius: "var(--r)", overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", fontSize: 8, color: "var(--textdim)", letterSpacing: 2, textTransform: "uppercase", borderBottom: "1px solid var(--bdr)" }}>Call Stack</div>
      <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 3, minHeight: 80 }}>
        {stack.length === 0 && <div style={{ fontSize: 9, color: "var(--textdim)" }}>Empty</div>}
        {stack.map((frame) => (
          <div key={frame.frame.id} style={{
            background: "var(--bg3)", borderRadius: 4, padding: "5px 8px",
            fontSize: 9, fontFamily: "'Fira Code', monospace", color: "var(--lime)",
            borderLeft: "2px solid var(--lime)",
          }}>
            {frame.frame.name}({frame.frame.args?.join(', ')})
            {frame.frame.result && <div style={{ fontSize: 8, marginTop: 2, color: "var(--coral)" }}>← {frame.frame.result}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
