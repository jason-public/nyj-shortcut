import React from 'react';
import { ViewMode } from '../types';
import { 
  Keyboard, 
  Search, 
  Layers, 
  HelpCircle, 
  Printer, 
  Highlighter, 
  Sparkles, 
  Minimize2, 
  Target,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  totalCount: number;
  highlightCount: number;
  bookmarkCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMiniWidget?: () => void;
  isMiniWidgetOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  totalCount,
  highlightCount,
  bookmarkCount,
  isDarkMode,
  onToggleDarkMode,
  onToggleMiniWidget,
  isMiniWidgetOpen
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'catalog', label: '단축키 사전 & 검색', icon: <Search className="w-4 h-4" /> },
    { id: 'scenario', label: '🎯 상황별 맞춤 팩', icon: <Target className="w-4 h-4" /> },
    { id: 'typing', label: '⚡ 타이핑 챌린지', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'flashcard', label: '플래시카드 학습', icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: '스피드 퀴즈', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'keyboard', label: '키보드 시뮬레이터', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'cheatsheet', label: '치트시트 인쇄', icon: <Printer className="w-4 h-4" /> }
  ];

  return (
    <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 py-3.5">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  업무 효율의 정석: <span className="text-blue-600 dark:text-blue-400">단축키 마스터</span>
                </h1>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded uppercase">
                  Professional
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                윈도우 • 엑셀 • 파워포인트 • 워드 • 한글(HWP) • 크롬 <span className="highlight">핵심 작업 관리</span> 기능 사전
              </p>
            </div>
          </div>

          {/* Quick Stats Badges, Dark Mode & Mini Widget Quick Button */}
          <div className="flex items-center gap-2 text-xs font-medium self-end md:self-auto flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              전체: <strong className="text-slate-900 dark:text-slate-100">{totalCount}개</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Highlighter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              형광펜: <strong>{highlightCount}개</strong>
            </span>
            {bookmarkCount > 0 && (
              <span className="px-2.5 py-1 rounded-md bg-yellow-50 dark:bg-yellow-950/60 text-amber-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-yellow-400" />
                즐겨찾기: <strong>{bookmarkCount}개</strong>
              </span>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              id="btn-toggle-dark-mode"
              onClick={onToggleDarkMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all border shadow-2xs ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-slate-600 ring-1 ring-amber-400/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 ring-1 ring-slate-200'
              }`}
              title={isDarkMode ? '밝은 라이트 모드로 전환' : '눈이 편안한 다크 모드로 전환'}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span className="text-amber-200 font-bold text-xs">라이트 모드</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-slate-700 font-bold text-xs">다크 모드</span>
                </>
              )}
            </button>

            {onToggleMiniWidget && (
              <button
                id="btn-toggle-mini-widget"
                onClick={onToggleMiniWidget}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all border shadow-2xs ${
                  isMiniWidgetOpen
                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200 dark:ring-blue-900'
                    : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
                title="듀얼모니터/작업창 옆에 띄워두는 미니 퀵서치 위젯 열기"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>미니 위젯 {isMiniWidgetOpen ? 'ON' : '열기'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 flex items-center overflow-x-auto gap-1 scrollbar-none py-1.5">
          {navItems.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onViewChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

