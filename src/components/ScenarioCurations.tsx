import React, { useState, useMemo, useRef } from 'react';
import { ScenarioPack, ShortcutItem, UserHighlightMap, HighlighterColor } from '../types';
import { Keycap } from './Keycap';
import { 
  Rocket, 
  Table, 
  FileText, 
  Presentation, 
  Cpu, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Bookmark, 
  Highlighter, 
  BrainCircuit, 
  HelpCircle, 
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

interface ScenarioCurationsProps {
  packs: ScenarioPack[];
  allShortcuts: ShortcutItem[];
  highlights: UserHighlightMap;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
  onToggleHighlight: (id: string, color: HighlighterColor) => void;
  activeHighlightColor: HighlighterColor;
  onSelectDetail: (item: ShortcutItem) => void;
  onStartFlashcardWithPack?: (shortcutIds: string[]) => void;
  onStartQuizWithPack?: (shortcutIds: string[]) => void;
  onFilterCatalogByPack?: (shortcutIds: string[], packTitle: string) => void;
}

const COLOR_STYLES = {
  blue: {
    badgeBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    cardBorder: 'border-blue-200 dark:border-blue-800/80 hover:border-blue-400 dark:hover:border-blue-600',
    activeRing: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40 dark:bg-blue-950/50',
    iconBg: 'bg-blue-600 text-white',
    accentText: 'text-blue-700 dark:text-blue-300',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    lightBg: 'bg-blue-50/70 dark:bg-blue-950/40',
    stepCircle: 'bg-blue-600 text-white'
  },
  emerald: {
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cardBorder: 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/50',
    iconBg: 'bg-emerald-600 text-white',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
    stepCircle: 'bg-emerald-600 text-white'
  },
  indigo: {
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    cardBorder: 'border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600',
    activeRing: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/50',
    iconBg: 'bg-indigo-600 text-white',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    lightBg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
    stepCircle: 'bg-indigo-600 text-white'
  },
  orange: {
    badgeBg: 'bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    cardBorder: 'border-orange-200 dark:border-orange-800/80 hover:border-orange-400 dark:hover:border-orange-600',
    activeRing: 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/40 dark:bg-orange-950/50',
    iconBg: 'bg-orange-600 text-white',
    accentText: 'text-orange-700 dark:text-orange-300',
    btnBg: 'bg-orange-600 hover:bg-orange-700 text-white',
    lightBg: 'bg-orange-50/70 dark:bg-orange-950/40',
    stepCircle: 'bg-orange-600 text-white'
  },
  purple: {
    badgeBg: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    cardBorder: 'border-purple-200 dark:border-purple-800/80 hover:border-purple-400 dark:hover:border-purple-600',
    activeRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/40 dark:bg-purple-950/50',
    iconBg: 'bg-purple-600 text-white',
    accentText: 'text-purple-700 dark:text-purple-300',
    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    lightBg: 'bg-purple-50/70 dark:bg-purple-950/40',
    stepCircle: 'bg-purple-600 text-white'
  },
  amber: {
    badgeBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cardBorder: 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-600',
    activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40 dark:bg-amber-950/50',
    iconBg: 'bg-amber-600 text-white',
    accentText: 'text-amber-700 dark:text-amber-300',
    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    lightBg: 'bg-amber-50/70 dark:bg-amber-950/40',
    stepCircle: 'bg-amber-600 text-white'
  }
};

const PACK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Table,
  FileText,
  Presentation,
  Cpu
};

export const ScenarioCurations: React.FC<ScenarioCurationsProps> = ({
  packs,
  allShortcuts,
  highlights,
  bookmarks,
  onToggleBookmark,
  onToggleHighlight,
  activeHighlightColor,
  onSelectDetail,
  onStartFlashcardWithPack,
  onStartQuizWithPack,
  onFilterCatalogByPack
}) => {
  const [selectedPackId, setSelectedPackId] = useState<string>(packs[0]?.id || 'rookie-exit');
  const [copiedPackId, setCopiedPackId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    setTimeout(() => {
      detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const activePack = useMemo(() => {
    return packs.find((p) => p.id === selectedPackId) || packs[0];
  }, [packs, selectedPackId]);

  // Lookup shortcuts for the active pack
  const packShortcuts = useMemo(() => {
    if (!activePack) return [];
    const map = new Map(allShortcuts.map((s) => [s.id, s]));
    return activePack.shortcutIds
      .map((id) => map.get(id))
      .filter((item): item is ShortcutItem => item !== undefined);
  }, [activePack, allShortcuts]);

  const colorStyle = COLOR_STYLES[activePack?.accentColor || 'blue'];
  const IconComponent = PACK_ICONS[activePack?.iconName || 'Rocket'] || Rocket;

  const handleCopyPackShortcuts = () => {
    if (!activePack) return;
    const text = packShortcuts
      .map((s, idx) => `${idx + 1}. [${s.title}] : ${s.keys.join(' + ')} (${s.description})`)
      .join('\n');
    navigator.clipboard.writeText(`📌 ${activePack.title} 단축키 모음:\n\n${text}`);
    setCopiedPackId(activePack.id);
    setTimeout(() => setCopiedPackId(null), 2000);
  };

  const handleCopySingleKey = (e: React.MouseEvent, item: ShortcutItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.keys.join(' + '));
    setCopiedKeyId(item.id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const handleHighlightAllInPack = () => {
    packShortcuts.forEach((s) => {
      onToggleHighlight(s.id, activeHighlightColor);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>실무 상황별 큐레이션 코스 (Scenario-based Curations)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            프로그램 경계를 넘어, <span className="text-blue-400">실제 업무 흐름</span>에 맞춘 단축키 팩
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            윈도우, 엑셀, 한글, PPT를 따로 외울 필요 없이, 신입사원 칼퇴, 엑셀 데이터 가공, 보고서 작성 등 
            직무 상황별 최적의 순서와 꿀팁을 패키지로 완성하세요.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">추천 코스</span>
              <strong className="text-white text-base font-bold">5대 직무 팩</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">엄선 단축키</span>
              <strong className="text-blue-300 text-base font-bold">총 38개 실무 키</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">예상 절약 시간</span>
              <strong className="text-emerald-400 text-base font-bold">하루 45분+</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">연계 학습</span>
              <strong className="text-amber-300 text-base font-bold">퀴즈 / 플래시카드</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Pack Selector Tabs / Cards */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>원하는 업무 맞춤 팩을 선택하세요</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            클릭하여 세부 워크플로우와 단축키 목록 확인
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {packs.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            const style = COLOR_STYLES[pack.accentColor];
            const CardIcon = PACK_ICONS[pack.iconName] || Rocket;

            return (
              <button
                key={pack.id}
                id={`pack-btn-${pack.id}`}
                onClick={() => handleSelectPack(pack.id)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? `${style.activeRing} shadow-md`
                    : `bg-white dark:bg-slate-800 ${style.cardBorder} shadow-2xs hover:shadow-sm`
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="absolute transform rotate-45 bg-blue-600 dark:bg-blue-500 text-white font-bold text-[9px] py-0.5 right-[-35px] top-[15px] w-[120px] text-center">
                      선택됨
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-2xl">{pack.emoji}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
                      {pack.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pack.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {pack.subtitle}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    단축키 <strong className="text-slate-900 dark:text-slate-100">{pack.shortcutIds.length}개</strong>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-0.5 text-[10px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/80 px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5" />
                    {pack.estimatedTimeSaved}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pack Full Showcase */}
      {activePack && (
        <div
          ref={detailSectionRef}
          id="selected-pack-detail-section"
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8 scroll-mt-6"
        >
          {/* Active Pack Hero Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-3xl">{activePack.emoji}</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {activePack.title}
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colorStyle.badgeBg}`}>
                  {activePack.badge}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activePack.estimatedTimeSaved} 절약
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {activePack.description}
              </p>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">🎯 추천 대상:</span>
                <span>{activePack.targetAudience}</span>
              </div>
            </div>

            {/* Quick Action Buttons for this pack */}
            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
              {onFilterCatalogByPack && (
                <button
                  onClick={() => onFilterCatalogByPack(activePack.shortcutIds, activePack.title)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>사전에서 이 팩만 보기</span>
                </button>
              )}

              {onStartFlashcardWithPack && (
                <button
                  onClick={() => onStartFlashcardWithPack(activePack.shortcutIds)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>이 팩으로 플래시카드</span>
                </button>
              )}

              {onStartQuizWithPack && (
                <button
                  onClick={() => onStartQuizWithPack(activePack.shortcutIds)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>이 팩으로 퀴즈 도전</span>
                </button>
              )}

              <button
                onClick={handleCopyPackShortcuts}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  copiedPackId === activePack.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {copiedPackId === activePack.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>목록 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>단축키 전체 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Step-by-Step Workflow Guide */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>추천 실무 워크플로우 (Step-by-Step)</span>
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">순서대로 따라 하며 업무 속도를 극대화하세요</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {activePack.workflowSteps.map((ws) => {
                const shortcut = allShortcuts.find((s) => s.id === ws.shortcutId);
                const isCopied = copiedKeyId === ws.shortcutId;

                return (
                  <div
                    key={ws.step}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {ws.step}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                          Step {ws.step}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1.5 leading-snug">
                        {ws.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {ws.actionDescription}
                      </p>
                    </div>

                    {shortcut && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/80">
                        <div className="mb-2">
                          <Keycap keys={shortcut.keys} size="sm" />
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <button
                            onClick={(e) => handleCopySingleKey(e, shortcut)}
                            className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5 font-medium"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? '복사됨' : '복사'}</span>
                          </button>

                          <button
                            onClick={() => onSelectDetail(shortcut)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5"
                          >
                            <span>상세</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Full Pack Shortcuts Grid */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>패키지 포함 단축키 전체 목록 ({packShortcuts.length}개)</span>
              </h4>

              <button
                onClick={handleHighlightAllInPack}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                title="이 팩의 모든 단축키에 현재 선택된 형광펜 색상을 칠합니다."
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                <span>이 팩 전체 형광펜 칠하기</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {packShortcuts.map((item) => {
                const isBookmarked = bookmarks.has(item.id);
                const isCopied = copiedKeyId === item.id;
                const highlightColor = highlights[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectDetail(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-1 ${
                      highlightColor
                        ? 'border-l-4 border-l-amber-400 border-slate-200 dark:border-slate-700'
                        : 'border-slate-200/90 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            {item.category.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400">
                            {item.subCategory}
                          </span>
                          {item.isEssential && (
                            <span className="text-[9px] font-bold bg-blue-50 dark:bg-blue-950/90 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded border border-blue-200/50 dark:border-blue-800/50">
                              ★ 핵심
                            </span>
                          )}
                        </div>

                        <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h5>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleCopySingleKey(e, item)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="단축키 복사"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onToggleBookmark(item.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400 hover:text-amber-500 transition-colors"
                          title="즐겨찾기"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                      <Keycap keys={item.keys} size="sm" />
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
                        상세보기
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Productivity Benefits Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>이 팩을 마스터했을 때 얻는 업무 효과</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activePack.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/90 p-3 rounded-xl border border-blue-100/60 dark:border-slate-700 shadow-2xs">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
