import React from 'react';
import { ShortcutItem, HighlighterColor } from '../types';
import { Keycap } from './Keycap';
import { X, Bookmark, Copy, Highlighter, Check, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';

interface ShortcutDetailModalProps {
  item: ShortcutItem | null;
  onClose: () => void;
  highlightColor?: HighlighterColor | null;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleHighlight: (id: string, color?: HighlighterColor) => void;
  activeColor: HighlighterColor;
}

export const ShortcutDetailModal: React.FC<ShortcutDetailModalProps> = ({
  item,
  onClose,
  highlightColor,
  isBookmarked,
  onToggleBookmark,
  onToggleHighlight,
  activeColor
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.keys.join(' + '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighlighted = !!highlightColor;
  const highlightClass = highlightColor ? `highlight-pen-${highlightColor}` : 'highlight-pen';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="shortcut-detail-modal"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {item.category.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.subCategory}</span>
              {item.isEssential && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  핵심 추천
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              <span className={isHighlighted ? highlightClass : ''}>{item.title}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Keycap Display */}
        <div className="my-6 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-center shadow-inner">
          <Keycap keys={item.keys} size="lg" accent={isHighlighted} />
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">기능 상세 설명</h4>
            <p className="leading-relaxed bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs text-slate-800 dark:text-slate-200">
              {item.description}
            </p>
          </div>

          {item.tip && (
            <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-amber-200 text-xs mb-1">실무 활용 꿀팁</h4>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className={isHighlighted ? highlightClass : 'highlight-pen'}>{item.tip}</span>
                </p>
              </div>
            </div>
          )}

          {item.exampleScenario && (
            <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-xl p-3 flex items-start gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 dark:text-blue-200 block font-semibold mb-0.5">추천 사용 시점:</strong>
                <span className="text-slate-600 dark:text-slate-300">{item.exampleScenario}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium border border-transparent dark:border-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleHighlight(item.id, activeColor)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isHighlighted
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-700 dark:hover:text-amber-300'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>{isHighlighted ? '형광펜 해제' : '형광펜 밑줄 강조'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isBookmarked
                  ? 'bg-yellow-50 dark:bg-yellow-950/70 text-amber-600 dark:text-yellow-300 border border-amber-300 dark:border-yellow-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span>{isBookmarked ? '즐겨찾기 됨' : '즐겨찾기'}</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료!' : '단축키 복사'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
