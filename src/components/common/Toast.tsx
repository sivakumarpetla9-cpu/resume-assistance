import React from 'react';
import { useCareer } from '../../store/CareerContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCareer();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0C1118] border border-[#35C6FF] shadow-[0_0_20px_rgba(53,198,255,0.25)] rounded-xl animate-bounce-short">
      <CheckCircle2 className="w-5 h-5 text-[#35D399]" />
      <span className="text-xs font-mono font-medium text-[#F3F5F7]">
        {toastMessage}
      </span>
    </div>
  );
};
