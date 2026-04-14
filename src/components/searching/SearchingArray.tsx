import { SearchStep } from "@/lib/algorithms/searching/types";

interface SearchingArrayProps {
  array: number[];
  activeSteps: SearchStep[];
  target: number;
}

export function SearchingArray({ array, activeSteps, target }: SearchingArrayProps) {
  const latestStep = activeSteps[activeSteps.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 justify-center items-end min-h-[80px]">
        {array.map((val, i) => {
          let state = 'default' as string;
          for (const step of activeSteps) {
            if (step.index === i) {
              if (step.action === 'found') state = 'found';
              else if (step.action === 'eliminate') state = 'eliminated';
              else if (step.action === 'midpoint') state = 'midpoint';
              else if (step.action === 'check') state = 'checking';
            }
          }

          const color = state === 'found' ? 'bg-green-500 text-white ring-2 ring-green-300' :
            state === 'eliminated' ? 'bg-red-300 dark:bg-red-800 opacity-50' :
              state === 'midpoint' ? 'bg-yellow-400 dark:bg-yellow-500' :
                state === 'checking' ? 'bg-blue-500 text-white ring-2 ring-blue-300' :
                  'bg-indigo-200 dark:bg-indigo-800';

          return (
            <div key={i} className={`${color} rounded px-2 py-1 text-sm font-mono transition-all duration-150 min-w-[2.5rem] text-center`}>
              {val}
            </div>
          );
        })}
      </div>
      {latestStep && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {latestStep.action === 'found' && <span className="text-green-600 dark:text-green-400 font-semibold">Found {target} at index {latestStep.index}!</span>}
          {latestStep.action === 'notFound' && <span className="text-red-600 dark:text-red-400 font-semibold">{target} not found in array</span>}
          {latestStep.action === 'check' && <span>Checking index {latestStep.index} (value: {array[latestStep.index]})</span>}
          {latestStep.action === 'midpoint' && <span>Midpoint: index {latestStep.index} (value: {array[latestStep.index]})</span>}
          {latestStep.action === 'eliminate' && <span>Eliminated index {latestStep.index}</span>}
        </div>
      )}
    </div>
  );
}
