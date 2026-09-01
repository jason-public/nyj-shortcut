import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShortcutItem, CategoryId } from '../types';
import { Keycap } from './Keycap';
import { 
  Search, 
  X, 
  Copy, 
  Check, 
  Bookmark, 
  Maximize2, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Pin,
  Monitor,
  Table,
  Presentation,
  FileText,
  FileCode,
  Globe,
  Layers,
  ChevronDown
} from 'lucide-react';

interface CompactWidgetProps {
  shortcuts: ShortcutItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectDetail: (item: ShortcutItem) => void;
  onToggleBookmark: (id: string) => void;
  bookmarks: Set<string>;
  onExpandToFull: () => void;
}

const CATEGORY_NAMES: Record<CategoryId, { name: string; fullName: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
  all: { name: '전체', fullName: '전체 단축키', dot: 'bg-slate-400', icon: Layers },
  windows: { name: '윈도우', fullName: '윈도우 (Windows)', dot: 'bg-blue-500', icon: Monitor },
  excel: { name: '엑셀', fullName: '엑셀 (Excel)', dot: 'bg-emerald-500', icon: Table },
  ppt: { name: '파워포인트', fullName: '파워포인트 (PPT)', dot: 'bg-orange-500', icon: Presentation },
  word: { name: '워드', fullName: '워드 (Word)', dot: 'bg-indigo-500', icon: FileText },
  hangul: { name: '한글', fullName: '한글 (HWP)', dot: 'bg-sky-500', icon: FileCode },
  chrome: { name: '크롬', fullName: '크롬 브라우저 (Chrome)', dot: 'bg-teal-500', icon: Globe }
};

export const CompactFloatingWidget: React.FC<CompactWidgetProps> = ({
  shortcuts,
  isOpen,
  onClose,
  onSelectDetail,
  onToggleBookmark,
  bookmarks,
  onExpandToFull
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId>('all');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'bookmarked'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ShortcutItem | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: shortcuts.length,
      windows: 0,
      excel: 0,
      ppt: 0,
      word: 0,
      hangul: 0,
      chrome: 0
    };
    shortcuts.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [shortcuts]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Filtered list
  const filtered = useMemo(() => {
    return shortcuts.filter((item) => {
      // Category filter
      if (selectedCat !== 'all' && item.category !== selectedCat) return false;

      // Special Filter
      if (filterType === 'essential' && !item.isEssential) return false;
      if (filterType === 'bookmarked' && !bookmarks.has(item.id)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inKeys = item.keys.some((k) => k.toLowerCase().includes(query));
        const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const inSub = item.subCategory.toLowerCase().includes(query);
        const inScenario = item.exampleScenario ? item.exampleScenario.toLowerCase().includes(query) : false;
        return inTitle || inDesc || inKeys || inTags || inSub || inScenario;
      }

      return true;
    });
  }, [shortcuts, selectedCat, filterType, bookmarks, searchQuery]);

  const handleCopy = (e: React.MouseEvent, item: ShortcutItem) => {
    e.stopPropagation();
    const text = item.keys.join(' + ');
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!isOpen) return null;

  // If collapsed to floating bubble button
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg border border-blue-400 font-bold text-xs transition-all hover:scale-105"
        >
          <div className="w-5 h-5 bg-white text-blue-600 rounded flex items-center justify-center font-black text-xs">
            K
          </div>
          <span>미니 퀵서치 켜기</span>
          <span className="bg-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            {shortcuts.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-80px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300/80 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-200 animate-in slide-in-from-bottom-5 duration-200"
      style={{
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)'
      }}
    >
      {/* Widget Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 select-none border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
            K
          </div>
          <span className="font-bold text-xs tracking-tight">단축키 미니 퀵서치</span>
          <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
            Compact
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
              isPinned ? 'text-amber-400' : 'text-slate-400'
            }`}
            title={isPinned ? '화면 고정 됨' : '화면 고정'}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExpandToFull}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="전체 화면으로 전환"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="최소화 (버블로 접기)"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500 hover:text-white text-slate-400 transition-colors"
            title="닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단축키/기능 실시간 검색 (예: 복사, F4, 줄바꿈)..."
            className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Dropdown & Quick Filter Controls */}
        <div className="flex items-center justify-between gap-2 mt-2">
          {/* Dropdown Menu Container */}
          <div ref={dropdownRef} className="relative flex-1">
            <button
              id="compact-category-dropdown-btn"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-2xs ${
                isDropdownOpen
                  ? 'bg-blue-50/80 dark:bg-blue-950/80 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-200 ring-2 ring-blue-100 dark:ring-blue-900/50'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_NAMES[selectedCat]?.dot || 'bg-blue-500'}`} />
                <span className="truncate">{CATEGORY_NAMES[selectedCat]?.fullName || '전체 단축키'}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                  {categoryCounts[selectedCat]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu Options */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-30 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-50 dark:divide-slate-700/50">
                {(['all', 'windows', 'excel', 'ppt', 'word', 'hangul', 'chrome'] as CategoryId[]).map((cat) => {
                  const info = CATEGORY_NAMES[cat];
                  const isSelected = selectedCat === cat;
                  const Icon = info.icon;
                  const count = categoryCounts[cat];

                  return (
                    <button
                      key={cat}
                      id={`compact-dropdown-opt-${cat}`}
                      onClick={() => {
                        setSelectedCat(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${info.dot}`} />
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                        <span className="truncate">{info.fullName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setFilterType(filterType === 'essential' ? 'all' : 'essential')}
              className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
                filterType === 'essential'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 ring-2 ring-amber-100 dark:ring-amber-900/50'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="핵심 단축키만 보기"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>
            <button
              onClick={() => setFilterType(filterType === 'bookmarked' ? 'all' : 'bookmarked')}
              className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 border transition-all ${
                filterType === 'bookmarked'
                  ? 'bg-yellow-100 dark:bg-yellow-950/80 text-amber-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700 ring-2 ring-yellow-100 dark:ring-yellow-900/50'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="즐겨찾기 항목만 보기"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-1.5 space-y-1">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isBookmarked = bookmarks.has(item.id);
            const isCopied = copiedId === item.id;
            const isSelected = activeItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(isSelected ? null : item)}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800 shadow-2xs'
                    : 'bg-white dark:bg-slate-800/90 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {CATEGORY_NAMES[item.category]?.name || item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {item.subCategory}
                      </span>
                      {item.isEssential && (
                        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-1 py-0.2 rounded">
                          ★
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                      {item.title}
                    </h4>
                  </div>

                  {/* Actions & Keycap preview */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleCopy(e, item)}
                      className={`p-1 rounded text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        isCopied ? 'text-emerald-600 dark:text-emerald-400' : ''
                      }`}
                      title="단축키 복사"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="즐겨찾기"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Keys Row */}
                <div className="mt-1.5 flex items-center justify-between">
                  <Keycap keys={item.keys} size="sm" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 hover:text-blue-600 dark:hover:text-blue-400">
                    {isSelected ? '접기' : '팁 보기'}
                    <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </span>
                </div>

                {/* Expanded Details when clicked */}
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-blue-100/80 dark:border-slate-700 text-[11px] space-y-1.5 animate-in fade-in duration-150">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.tip && (
                      <div className="p-2 bg-blue-100/60 dark:bg-blue-950/60 rounded-lg text-blue-900 dark:text-blue-200 font-medium">
                        <span className="font-bold mr-1">💡 꿀팁:</span>
                        {item.tip}
                      </div>
                    )}

                    {item.macAlternative && (
                      <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px]">
                        <span className="font-semibold">Mac 대체:</span>
                        <span className="font-mono bg-white dark:bg-slate-800 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">{item.macAlternative}</span>
                      </div>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDetail(item);
                        }}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>전체 상세 모달 열기</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">검색 결과가 없습니다</p>
            <p className="text-[11px]">단어 철자를 확인하거나 다른 검색어를 입력해보세요.</p>
          </div>
        )}
      </div>

      {/* Widget Footer */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
        <span>
          결과: <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong>개
        </span>
        <button
          onClick={onExpandToFull}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
        >
          <span>큰 화면 전체보기</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
