import React, { useState } from 'react';
import { ShortcutItem, HighlighterColor } from '../types';
import { Keycap } from './Keycap';
import { 
  Bookmark, 
  Copy, 
  Check, 
  Highlighter, 
  Lightbulb, 
  ExternalLink,
  Monitor,
  Table,
  Presentation,
  FileText,
  FileCode,
  Globe
} from 'lucide-react';

interface ShortcutCardProps {
  item: ShortcutItem;
  highlightColor?: HighlighterColor | null;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleHighlight: (id: string, color?: HighlighterColor) => void;
  onSelectDetail: (item: ShortcutItem) => void;
  isPenActive: boolean;
  activePenColor: HighlighterColor;
}

const CATEGORY_STYLES = {
  windows: {
    badgeBg: 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: '윈도우',
    icon: Monitor
  },
  excel: {
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'MS 엑셀',
    icon: Table
  },
  ppt: {
    badgeBg: 'bg-orange-50 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-50 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
    label: 'MS 파워포인트',
    icon: Presentation
  },
  word: {
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
    label: 'MS 워드',
    icon: FileText
  },
  hangul: {
    badgeBg: 'bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    iconBg: 'bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400',
    dot: 'bg-sky-500',
    label: '한글(HWP)',
    icon: FileCode
  },
  chrome: {
    badgeBg: 'bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400',
    dot: 'bg-teal-500',
    label: '크롬 브라우저',
    icon: Globe
  }
};

export const ShortcutCard: React.FC<ShortcutCardProps> = ({
  item,
  highlightColor,
  isBookmarked,
  onToggleBookmark,
  onToggleHighlight,
  onSelectDetail,
  isPenActive,
  activePenColor
}) => {
  const [copied, setCopied] = useState(false);
  const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.windows;
  const CategoryIcon = catStyle.icon;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const keyCombo = item.keys.join(' + ');
    navigator.clipboard.writeText(keyCombo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    if (isPenActive) {
      onToggleHighlight(item.id, activePenColor);
    } else {
      onSelectDetail(item);
    }
  };

  const isHighlighted = !!highlightColor;
  const highlightClass = highlightColor ? `highlight-pen-${highlightColor}` : '';
  const highlightCardClass = highlightColor 
    ? `highlight-card-${highlightColor} hover:shadow-md hover:scale-[1.01]` 
    : 'bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-slate-950/50 hover:-translate-y-1.5';

  return (
    <div
      id={`card-${item.id}`}
      onClick={handleCardClick}
      className={`group relative p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer ${highlightCardClass} ${
        isPenActive ? 'hover:ring-2 hover:ring-amber-400' : ''
      }`}
    >
      <div>
        {/* Top Header Row: Category Icon & Tag Badge + Actions */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${catStyle.iconBg} transition-transform duration-200 group-hover:scale-110 shadow-2xs`}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {catStyle.label}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {item.subCategory}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {item.isEssential && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded uppercase border border-blue-100 dark:border-blue-900/60 transition-colors group-hover:bg-blue-100/80">
                Essential
              </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
              <button
                id={`btn-highlight-${item.id}`}
                onClick={() => onToggleHighlight(item.id, activePenColor)}
                className={`p-1.5 rounded-lg transition-all ${
                  isHighlighted
                    ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-600'
                    : 'text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 group-hover:text-slate-500 dark:group-hover:text-slate-400'
                }`}
                title={isHighlighted ? '형광펜 해제하기' : '형광펜으로 밑줄 강조하기'}
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>

              <button
                id={`btn-bookmark-${item.id}`}
                onClick={() => onToggleBookmark(item.id)}
                className={`p-1.5 rounded-lg transition-all ${
                  isBookmarked
                    ? 'bg-yellow-50 dark:bg-yellow-950/70 text-amber-500 dark:text-yellow-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:text-slate-500 dark:group-hover:text-slate-400'
                }`}
                title={isBookmarked ? '즐겨찾기' : '즐겨찾기 추가'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>

              <button
                id={`btn-copy-${item.id}`}
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all"
                title="단축키 복사"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-50" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Shortcut Keys Row */}
        <div className="flex items-center gap-2 mb-3 transition-transform duration-200 group-hover:translate-x-0.5">
          <Keycap keys={item.keys} size="md" accent={isHighlighted} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1 leading-snug tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          <span className={isHighlighted ? highlightClass : ''}>{item.title}</span>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal mb-3 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {item.description}
        </p>

        {/* Smooth Hover-revealed Practical Context & Mac Alternative */}
        {(item.exampleScenario || item.macAlternative) && (
          <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300 ease-out mb-0 group-hover:mb-3">
            <div className="p-2.5 bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 flex flex-col gap-1 shadow-2xs">
              {item.exampleScenario && (
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 shrink-0">실무 상황:</span>
                  <span className="truncate">{item.exampleScenario}</span>
                </div>
              )}
              {item.macAlternative && (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Mac 대체:</span>
                  <span className="font-mono text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold">{item.macAlternative}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tip Box Callout */}
        {item.tip && (
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100/90 dark:border-blue-900/60 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
              <span className={isHighlighted ? highlightClass : 'highlight'}>오늘의 팁:</span> {item.tip}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-auto">
        <div className="flex items-center gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded group-hover:bg-slate-200/70 dark:group-hover:bg-slate-700 transition-colors">
              #{t}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectDetail(item);
          }}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>상세보기</span>
          <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

