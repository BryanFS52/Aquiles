import React from 'react';
import { Step } from './types';

export const Stepper: React.FC<{ steps: Step[]; current: number }> = ({ steps, current }) => {
  const progress = Math.max(0, Math.min(1, (current - 1) / (steps.length - 1)));
  return (
    <div className="w-full">
      <div className="relative mb-6 h-2 w-full rounded-full bg-lightGray">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="overflow-x-auto pb-2">
        <ol className="flex items-center justify-between gap-2 md:gap-4 min-w-max md:min-w-0">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = current === s.key;
            const isDone = current > s.key;
            return (
              <li key={s.key} className="flex-1 min-w-[120px] md:min-w-[140px]">
                <div
                  className={`flex items-center gap-2 p-2 md:p-2.5 rounded-xl md:rounded-2xl ring-1 transition-all ${
                    isDone
                      ? 'bg-primary/10 ring-primary text-primary'
                      : isActive
                      ? 'bg-secondary/10 ring-secondary text-secondary'
                      : 'bg-white/60 ring-lightGray text-darkGray backdrop-blur'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl ring-1 flex-shrink-0 ${
                      isDone
                        ? 'bg-primary text-white ring-primary'
                        : isActive
                        ? 'bg-secondary text-white ring-secondary'
                        : 'bg-white text-darkGray ring-lightGray'
                    }`}
                  >
                    <Icon size={14} className="md:w-4 md:h-4" />
                  </span>
                  <span className="text-xs md:text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    {s.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
