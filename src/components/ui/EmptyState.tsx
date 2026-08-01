import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <div className="py-12 px-6 text-center bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl animate-fade-in flex flex-col items-center justify-center">
      <div className="p-4 bg-teal-50/60 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-full mb-4">
        <Icon size={28} className="animate-pulse-light" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary text-xs px-4 py-1.5 font-semibold"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
