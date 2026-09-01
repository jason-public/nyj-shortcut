import React, { useState, useEffect, useCallback } from 'react';
import { ShortcutItem, CategoryId, HighlighterColor } from '../types';
import { CATEGORIES } from '../data/shortcutsData';
import { Keycap } from './Keycap';
import { 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Award,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardStudyProps {
  items: ShortcutItem[];
  userHighlights: Record<string, HighlighterColor>;
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ items, userHighlights }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [cards, setCards] = useState<ShortcutItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(() => new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'highlighted' | 'essential'>('all');

  // Filter cards based on selected category and filter mode
  useEffect(() => {
    let filtered = items;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }
    if (filterMode === 'highlighted') {
      filtered = filtered.filter((i) => !!userHighlights[i.id]);
    } else if (filterMode === 'essential') {
      filtered = filtered.filter((i) => i.isEssential);
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items, selectedCategory, filterMode, userHighlights]);

  const handleShuffle = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (cards.length || 1));
    }, 150);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % (cards.length || 1));
    }, 150);
  }, [cards.length]);

  const currentCard = cards[currentIndex];

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const newMastered = new Set(masteredIds);
    newMastered.add(currentCard.id);
    const newReview = new Set(reviewIds);
    newReview.delete(currentCard.id);

    setMasteredIds(newMastered);
    setReviewIds(newReview);

    if (newMastered.size === cards.length && cards.length > 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    const newReview = new Set(reviewIds);
    newReview.add(currentCard.id);
    const newMastered = new Set(masteredIds);
    newMastered.delete(currentCard.id);

    setReviewIds(newReview);
    setMasteredIds(newMastered);
    handleNext();
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'KeyM') {
        handleMarkMastered();
      } else if (e.code === 'KeyR') {
        handleMarkReview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleMarkMastered, handleMarkReview]);

  if (!currentCard) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto my-8">
        <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">학습할 단축키가 없습니다</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">선택한 필터 조건에 해당하는 카드가 없습니다.</p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setFilterMode('all');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          전체 카테고리로 초기화
        </button>
      </div>
    );
  }

  const highlightColor = userHighlights[currentCard.id];
  const highlightClass = highlightColor ? `highlight-pen-${highlightColor}` : 'highlight-pen';
  const progressPercent = cards.length > 0 ? Math.round((masteredIds.size / cards.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Controls: Category Tabs & Mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Category Selector */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        {/* Filter modes */}
        <div className="flex items-center gap-1 self-end sm:self-auto text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterMode === 'all' ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            전체 ({cards.length})
          </button>
          <button
            onClick={() => setFilterMode('essential')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filterMode === 'essential' ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            핵심만
          </button>
          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            title="카드 무작위 섞기"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            암기 달성률 ({masteredIds.size}/{cards.length})
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flip Card Container */}
      <div className="perspective-1000 min-h-[340px] flex flex-col justify-center">
        <div
          id="flashcard"
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-500 transform shadow-md hover:shadow-xl border-2 flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200/90 dark:border-slate-800'
          }`}
          style={{ minHeight: '320px' }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isFlipped
                    ? 'bg-slate-800 text-blue-300 border-slate-700'
                    : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                }`}
              >
                {currentCard.category.toUpperCase()}
              </span>
              <span className={`text-xs font-medium ${isFlipped ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {currentCard.subCategory}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isFlipped ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                {currentIndex + 1} / {cards.length}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                클릭하여 뒤집기
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="my-auto py-6 text-center">
            {!isFlipped ? (
              /* FRONT: Question & Scenario */
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Q. 다음 기능의 단축키는?</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentCard.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {currentCard.description}
                </p>
                {currentCard.exampleScenario && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg max-w-sm mx-auto border border-transparent dark:border-slate-700">
                    💡 힌트/상황: {currentCard.exampleScenario}
                  </p>
                )}
              </div>
            ) : (
              /* BACK: Answer & Keycap & Highlight Tip */
              <div className="space-y-5 animate-in zoom-in-95 duration-200">
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">A. 정답 단축키</span>
                
                <div className="py-2 flex justify-center">
                  <Keycap keys={currentCard.keys} size="lg" accent={true} />
                </div>

                <div className="max-w-md mx-auto">
                  <h4 className="text-lg font-bold text-white mb-2">{currentCard.title}</h4>
                  {currentCard.tip && (
                    <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-xs text-slate-200 flex items-start gap-2 text-left">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className={highlightColor ? highlightClass : 'text-amber-200'}>
                        {currentCard.tip}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer status info */}
          <div className="text-center text-[11px] text-slate-400">
            {isFlipped ? 'Space: 다시 뒤집기 | M: 외웠음 | R: 복습' : '카드를 클릭하거나 Space바로 정답 확인'}
          </div>
        </div>
      </div>

      {/* Mastery Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 (←)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkReview}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-2xl text-xs font-bold transition-all shadow-2xs"
          >
            <XCircle className="w-4 h-4" />
            <span>아직 헷갈려요 (R)</span>
          </button>

          <button
            onClick={handleMarkMastered}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>완벽히 외웠어요! (M)</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <span>다음 (→)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
