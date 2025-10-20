import React from 'react';
import { Step } from './types';

export const Stepper: React.FC<{ steps: Step[]; current: number }> = ({ steps, current }) => {
  const progress = Math.max(0, Math.min(1, (current - 1) / (steps.length - 1)));
  return (
    <div className="w-full overflow-x-auto">
      <div className="relative mb-5 h-1.5 w-full rounded-full bg-lightGray">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <ol className="flex items-center justify-between gap-3 md:gap-5">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = current === s.key;
          const isDone = current > s.key;
          return (
            <li key={s.key} className="flex-1 min-w-[140px]">
              <div
                className={`flex items-center gap-2 p-2 rounded-2xl ring-1 transition-all ${
                  isDone
                    ? 'bg-primary/10 ring-primary text-primary'
                    : isActive
                    ? 'bg-secondary/10 ring-secondary text-secondary'
                    : 'bg-white/60 ring-lightGray text-darkGray backdrop-blur'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-xl ring-1 ${
                    isDone
                      ? 'bg-primary text-white ring-primary'
                      : isActive
                      ? 'bg-secondary text-white ring-secondary'
                      : 'bg-white text-darkGray ring-lightGray'
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">{s.label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
