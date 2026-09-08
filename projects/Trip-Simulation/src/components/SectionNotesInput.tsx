import React from 'react';
import { FileText } from 'lucide-react';

interface SectionNotesInputProps {
  label?: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  hint?: string;
}

export const SectionNotesInput: React.FC<SectionNotesInputProps> = ({
  label = '* Catatan (opsional)',
  value = '',
  onChange,
  placeholder = 'Tulis catatan khusus untuk bagian ini (akan muncul di cetak/PDF jika diisi)...',
  id,
  hint,
}) => {
  return (
    <div className="pt-2.5 border-t border-slate-100/90 space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>{label}</span>
        </label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      <input
        type="text"
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 text-slate-700"
      />
    </div>
  );
};
