import { useState, useEffect, useMemo } from 'react';
import { SHORTCUTS_DATA, CATEGORIES, SCENARIO_PACKS } from './data/shortcutsData';
import { 
  CategoryId, 
  HighlighterColor, 
  ShortcutItem, 
  ViewMode 
} from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { HighlighterToolbar } from './components/HighlighterToolbar';
import { ShortcutCard } from './components/ShortcutCard';
import { ShortcutDetailModal } from './components/ShortcutDetailModal';
import { FlashcardStudy } from './components/FlashcardStudy';
import { QuizMode } from './components/QuizMode';
import { TypingChallenge } from './components/TypingChallenge';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { CheatSheetPrintView } from './components/CheatSheetPrintView';
import { CompactFloatingWidget } from './components/CompactFloatingWidget';
import { ScenarioCurations } from './components/ScenarioCurations';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle,
  Minimize2,
  Target,
  ArrowRight,
  X
} from 'lucide-react';

export default function App() {
  // Navigation & View
  const [currentView, setCurrentView] = useState<ViewMode>('catalog');
  const [isMiniWidgetOpen, setIsMiniWidgetOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('office_shortcuts_theme_v1');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark class with document.documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('office_shortcuts_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('office_shortcuts_theme_v1', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? '다크 모드가 적용되었습니다 🌙' : '라이트 모드가 적용되었습니다 ☀️');
      return next;
    });
  };

  // Scenario Pack Filter (when filtering catalog by a specific pack)
  const [activePackFilter, setActivePackFilter] = useState<{ id: string; title: string; shortcutIds: string[] } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'highlighted' | 'bookmarked'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Highlighter Tool State
  const [activeHighlighterColor, setActiveHighlighterColor] = useState<HighlighterColor>('yellow');
  const [isPenActive, setIsPenActive] = useState(false);
  const [userHighlights, setUserHighlights] = useState<Record<string, HighlighterColor>>(() => {
    try {
      const saved = localStorage.getItem('office_shortcuts_highlights_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default preset highlights for essential top shortcuts
    const initial: Record<string, HighlighterColor> = {};
    SHORTCUTS_DATA.forEach((item) => {
      if (item.defaultHighlight) {
        initial[item.id] = 'yellow';
      }
    });
    return initial;
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('office_shortcuts_bookmarks_v1');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // Detail Modal
  const [detailItem, setDetailItem] = useState<ShortcutItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist highlights to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('office_shortcuts_highlights_v1', JSON.stringify(userHighlights));
    } catch {
      // ignore
    }
  }, [userHighlights]);

  // Persist bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('office_shortcuts_bookmarks_v1', JSON.stringify(Array.from(bookmarks)));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('즐겨찾기에서 제거되었습니다.');
      } else {
        next.add(id);
        showToast('즐겨찾기에 추가되었습니다 ⭐');
      }
      return next;
    });
  };

  // Toggle or change highlight color on an item
  const handleToggleHighlight = (id: string, color: HighlighterColor = activeHighlighterColor) => {
    setUserHighlights((prev) => {
      const next = { ...prev };
      if (next[id] === color) {
        delete next[id];
        showToast('형광펜 표시가 해제되었습니다.');
      } else {
        next[id] = color;
        showToast('형광펜 밑줄이 칠해졌습니다! 🖍️');
      }
      return next;
    });
  };

  // Reset to default recommendations
  const handleResetHighlights = () => {
    const initial: Record<string, HighlighterColor> = {};
    SHORTCUTS_DATA.forEach((item) => {
      if (item.defaultHighlight) {
        initial[item.id] = 'yellow';
      }
    });
    setUserHighlights(initial);
    showToast('추천 핵심 형광펜 목록으로 복원되었습니다.');
  };

  // Clear all highlights
  const handleClearAllHighlights = () => {
    setUserHighlights({});
    showToast('모든 형광펜 표시가 초기화되었습니다.');
  };

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: SHORTCUTS_DATA.length,
      windows: 0,
      excel: 0,
      ppt: 0,
      word: 0,
      hangul: 0,
      chrome: 0
    };

    SHORTCUTS_DATA.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, []);

  // Available subcategories for the currently selected category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const subs = new Set<string>();
    SHORTCUTS_DATA.filter((i) => i.category === selectedCategory).forEach((i) => {
      subs.add(i.subCategory);
    });
    return Array.from(subs);
  }, [selectedCategory]);

  // Filtered shortcut list
  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((item) => {
      // 0. Active Scenario Pack Filter
      if (activePackFilter && !activePackFilter.shortcutIds.includes(item.id)) {
        return false;
      }

      // 1. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Subcategory Filter
      if (selectedSubCategory && item.subCategory !== selectedSubCategory) {
        return false;
      }

      // 3. Quick Filter Type
      if (filterType === 'essential' && !item.isEssential) {
        return false;
      }
      if (filterType === 'highlighted' && !userHighlights[item.id]) {
        return false;
      }
      if (filterType === 'bookmarked' && !bookmarks.has(item.id)) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().replace(/\s+/g, '');
        const titleMatch = item.title.toLowerCase().replace(/\s+/g, '').includes(q);
        const descMatch = item.description.toLowerCase().replace(/\s+/g, '').includes(q);
        const keyMatch = item.keys.join('').toLowerCase().replace(/\s+/g, '').includes(q);
        const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q));
        const tipMatch = item.tip ? item.tip.toLowerCase().includes(q) : false;

        if (!titleMatch && !descMatch && !keyMatch && !tagMatch && !tipMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activePackFilter, selectedCategory, selectedSubCategory, filterType, searchQuery, userHighlights, bookmarks]);

  const highlightCount = Object.keys(userHighlights).length;
  const bookmarkCount = bookmarks.size;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-amber-200 dark:selection:bg-amber-900 selection:text-slate-900 dark:selection:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-800/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        totalCount={SHORTCUTS_DATA.length}
        highlightCount={highlightCount}
        bookmarkCount={bookmarkCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleMiniWidget={() => setIsMiniWidgetOpen(!isMiniWidgetOpen)}
        isMiniWidgetOpen={isMiniWidgetOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: CATALOG & SEARCH VIEW */}
        {currentView === 'catalog' && (
          <div className="space-y-6">
            {/* View Header & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {selectedCategory === 'all'
                    ? '전체 업무 단축키 사전'
                    : selectedCategory === 'windows'
                    ? 'Windows 시스템 단축키'
                    : selectedCategory === 'excel'
                    ? 'MS 엑셀(Excel) 실무 단축키'
                    : selectedCategory === 'ppt'
                    ? 'MS 파워포인트(PPT) 단축키'
                    : selectedCategory === 'word'
                    ? 'MS 워드(Word) 편집 단축키'
                    : selectedCategory === 'hangul'
                    ? '한글(HWP) 문서작성 단축키'
                    : '크롬 브라우저(Chrome) 웹서핑 단축키'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  운영체제 및 오피스 전반에서 활용 가능한 <span className="highlight">핵심 작업 관리</span> 기능 모음
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-open-mini-widget"
                  onClick={() => setIsMiniWidgetOpen(true)}
                  className="px-3 py-1.5 text-xs font-bold border border-blue-200 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 shadow-2xs flex items-center gap-1.5 transition-colors"
                  title="화면 구석에 작게 띄워두고 작업 중 검색할 수 있는 플로팅 위젯"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>미니 위젯 띄우기</span>
                </button>
                <button
                  onClick={() => {
                    setFilterType('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  전체보기
                </button>
                <button
                  onClick={() => setCurrentView('flashcard')}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>학습모드 시작</span>
                </button>
              </div>
            </div>

            {/* Today's Pro Tip Banner */}
            <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 shadow-2xs flex items-start gap-3">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                <span className="highlight font-bold mr-1.5">오늘의 프로 팁:</span>
                브라우저나 문서에서 실수로 탭이나 창을 닫았을 때 <strong className="font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700 mx-0.5">Ctrl + Shift + T</strong>를 누르면 닫힌 탭이 즉시 복구됩니다!
              </div>
            </div>

            {/* Highlighter Pen Toolbar */}
            <HighlighterToolbar
              activeColor={activeHighlighterColor}
              onColorChange={(color) => setActiveHighlighterColor(color)}
              isPenActive={isPenActive}
              onTogglePen={() => setIsPenActive(!isPenActive)}
              highlightCount={highlightCount}
              onResetToDefault={handleResetHighlights}
              onClearAll={handleClearAllHighlights}
            />

            {/* Search and Category Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categories={CATEGORIES}
                categoryCounts={categoryCounts}
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                highlightCount={highlightCount}
                bookmarkCount={bookmarkCount}
                subCategories={subCategories}
                selectedSubCategory={selectedSubCategory}
                onSelectSubCategory={setSelectedSubCategory}
              />
            </div>

            {/* Results Count & Pen Mode Guide */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
              <span>
                검색된 단축키: <strong className="text-slate-900 dark:text-slate-100 font-bold">{filteredShortcuts.length}</strong>개
              </span>
              {isPenActive && (
                <span className="text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 font-medium px-2.5 py-0.5 rounded-md animate-pulse">
                  🖍️ 형광펜 칠하기 모드: 원하는 카드를 클릭하면 즉시 밑줄 강조됩니다!
                </span>
              )}
            </div>

            {/* Shortcuts Grid Cards */}
            {filteredShortcuts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredShortcuts.map((item) => (
                  <ShortcutCard
                    key={item.id}
                    item={item}
                    highlightColor={userHighlights[item.id]}
                    isBookmarked={bookmarks.has(item.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleHighlight={handleToggleHighlight}
                    onSelectDetail={(target) => setDetailItem(target)}
                    isPenActive={isPenActive}
                    activePenColor={activeHighlighterColor}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto my-10">
                <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">검색 결과가 없습니다</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  검색어 철자를 확인하거나 필터 조건을 초기화해 보세요.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setFilterType('all');
                    setSelectedSubCategory(null);
                    setActivePackFilter(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  필터 전체 초기화
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SCENARIO-BASED CURATIONS */}
        {currentView === 'scenario' && (
          <ScenarioCurations
            packs={SCENARIO_PACKS}
            allShortcuts={SHORTCUTS_DATA}
            highlights={userHighlights}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onToggleHighlight={handleToggleHighlight}
            activeHighlightColor={activeHighlighterColor}
            onSelectDetail={(target) => setDetailItem(target)}
            onStartFlashcardWithPack={() => setCurrentView('flashcard')}
            onStartQuizWithPack={() => setCurrentView('quiz')}
            onFilterCatalogByPack={(shortcutIds, packTitle) => {
              const pack = SCENARIO_PACKS.find((p) => p.shortcutIds === shortcutIds);
              setActivePackFilter({
                id: pack?.id || 'custom',
                title: packTitle,
                shortcutIds
              });
              setCurrentView('catalog');
            }}
          />
        )}

        {/* VIEW 3: TYPING CHALLENGE MODE */}
        {currentView === 'typing' && (
          <TypingChallenge
            items={SHORTCUTS_DATA}
            userHighlights={userHighlights}
            onToggleHighlight={handleToggleHighlight}
            onSelectDetail={(target) => setDetailItem(target)}
            isBookmarked={(id) => bookmarks.has(id)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW 4: FLASHCARD STUDY MODE */}
        {currentView === 'flashcard' && (
          <FlashcardStudy items={SHORTCUTS_DATA} userHighlights={userHighlights} />
        )}

        {/* VIEW 5: SPEED QUIZ MODE */}
        {currentView === 'quiz' && <QuizMode items={SHORTCUTS_DATA} />}

        {/* VIEW 6: INTERACTIVE KEYBOARD SIMULATOR */}
        {currentView === 'keyboard' && (
          <KeyboardVisualizer
            items={SHORTCUTS_DATA}
            userHighlights={userHighlights}
            onToggleHighlight={handleToggleHighlight}
            onSelectDetail={(target) => setDetailItem(target)}
            isBookmarked={(id) => bookmarks.has(id)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW 6: PRINTABLE CHEATSHEET */}
        {currentView === 'cheatsheet' && (
          <CheatSheetPrintView
            items={SHORTCUTS_DATA}
            userHighlights={userHighlights}
            onBack={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Program Summary Mini Bar (Desktop Footer) */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-12 text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span>전체 단축키: <strong className="text-slate-800 dark:text-slate-200 font-bold">{SHORTCUTS_DATA.length}개</strong></span>
            <span>형광펜 강조: <strong className="text-amber-700 dark:text-amber-400 font-bold">{highlightCount}개</strong></span>
            {bookmarkCount > 0 && <span>즐겨찾기: <strong className="text-amber-700 dark:text-amber-400 font-bold">{bookmarkCount}개</strong></span>}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>시스템 준비 완료</span>
            </div>
            <button
              onClick={() => setCurrentView('cheatsheet')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              치트시트 인쇄
            </button>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <ShortcutDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        highlightColor={detailItem ? userHighlights[detailItem.id] : null}
        isBookmarked={detailItem ? bookmarks.has(detailItem.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToggleHighlight={handleToggleHighlight}
        activeColor={activeHighlighterColor}
      />

      {/* Compact Floating Search Widget (Dual Monitor / PiP style) */}
      <CompactFloatingWidget
        shortcuts={SHORTCUTS_DATA}
        isOpen={isMiniWidgetOpen}
        onClose={() => setIsMiniWidgetOpen(false)}
        onSelectDetail={(target) => setDetailItem(target)}
        onToggleBookmark={handleToggleBookmark}
        bookmarks={bookmarks}
        onExpandToFull={() => {
          setIsMiniWidgetOpen(false);
          setCurrentView('catalog');
        }}
      />
    </div>
  );
}
