interface Complexity {
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
}

interface ComplexityInfoProps {
  complexity: Complexity;
}

export function ComplexityInfo({ complexity }: ComplexityInfoProps) {
  return (
    <div className="complexity-info">
      <div className="cx-badge"><span className="cx-label">Best:</span><span className="cx-val">{complexity.timeBest}</span></div>
      <div className="cx-badge"><span className="cx-label">Avg:</span><span className="cx-val">{complexity.timeAvg}</span></div>
      <div className="cx-badge"><span className="cx-label">Worst:</span><span className="cx-val">{complexity.timeWorst}</span></div>
      <div className="cx-badge"><span className="cx-label">Space:</span><span className="cx-val">{complexity.space}</span></div>
    </div>
  );
}
