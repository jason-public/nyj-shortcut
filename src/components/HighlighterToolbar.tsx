import React from 'react';
import { HighlighterColor } from '../types';
import { Highlighter, Sparkles, RotateCcw, Check } from 'lucide-react';

interface HighlighterToolbarProps {
  activeColor: HighlighterColor;
  onColorChange: (color: HighlighterColor) => void;
  isPenActive: boolean;
  onTogglePen: () => void;
  highlightCount: number;
  onResetToDefault: () => void;
  onClearAll: () => void;
}

const HIGHLIGHTER_COLORS: { id: HighlighterColor; name: string; bg: string; border: string; previewClass: string }[] = [
  { id: 'yellow', name: '형광 노랑', bg: 'bg-yellow-300', border: 'border-yellow-400', previewClass: 'highlight-pen-yellow' },
  { id: 'green', name: '네온 연두', bg: 'bg-emerald-300', border: 'border-emerald-400', previewClass: 'highlight-pen-green' },
  { id: 'pink', name: '파스텔 핑크', bg: 'bg-pink-300', border: 'border-pink-400', previewClass: 'highlight-pen-pink' },
  { id: 'blue', name: '스카이 블루', bg: 'bg-sky-300', border: 'border-sky-400', previewClass: 'highlight-pen-blue' },
  { id: 'orange', name: '소프트 오렌지', bg: 'bg-amber-300', border: 'border-amber-400', previewClass: 'highlight-pen-orange' }
];

export const HighlighterToolbar: React.FC<HighlighterToolbarProps> = ({
  activeColor,
  onColorChange,
  isPenActive,
  onTogglePen,
  highlightCount,
  onResetToDefault,
  onClearAll
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-800 dark:text-slate-200 transition-all">
      {/* Left: Pen Mode Indicator & Color Picker */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          id="btn-toggle-highlighter-pen"
          onClick={onTogglePen}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
            isPenActive
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="클릭하여 단축키 카드에 직접 형광펜 밑줄을 칠하거나 지우는 모드"
        >
          <Highlighter className="w-4 h-4" />
          <span>{isPenActive ? '형광펜 펜 모드 활성중' : '형광펜 칠하기 모드'}</span>
          {isPenActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
        </button>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1.5 hidden sm:inline">펜 색상:</span>
          {HIGHLIGHTER_COLORS.map((c) => {
            const isSelected = activeColor === c.id;
            return (
              <button
                key={c.id}
                id={`btn-color-${c.id}`}
                onClick={() => onColorChange(c.id)}
                className={`group relative w-6 h-6 rounded-md ${c.bg} border ${c.border} transition-all flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-slate-800 dark:ring-slate-100 ring-offset-1 dark:ring-offset-slate-900 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              >
                {isSelected && <Check className="w-3 h-3 text-slate-900 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="mr-1.5">미리보기:</span>
          <span className={`font-semibold text-slate-800 dark:text-slate-200 highlight-pen-${activeColor}`}>
            중요 단축키 밑줄 강조
          </span>
        </div>
      </div>

      {/* Right: Status & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto text-xs">
        <span className="text-slate-600 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-md">
          강조된 항목: <strong className="text-amber-800 dark:text-amber-200 font-bold">{highlightCount}</strong>개
        </span>

        <div className="flex items-center gap-1">
          <button
            id="btn-reset-highlights"
            onClick={onResetToDefault}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title="기본 추천 핵심 형광펜으로 복원"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>추천 복원</span>
          </button>

          <button
            id="btn-clear-highlights"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/60 transition-colors"
            title="모든 형광펜 표시 지우기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
};

