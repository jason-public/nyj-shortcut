import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ShortcutItem, CategoryId } from '../types';
import { CATEGORIES } from '../data/shortcutsData';
import { Keycap } from './Keycap';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Zap, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModeProps {
  items: ShortcutItem[];
}

interface QuizQuestion {
  item: ShortcutItem;
  options: string[];
  correctAnswer: string;
}

export const QuizMode: React.FC<QuizModeProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Filter candidate pool
  const candidatePool = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const generateQuiz = useCallback(() => {
    if (candidatePool.length < 4) return;
    const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);
    const selected10 = shuffled.slice(0, Math.min(10, shuffled.length));

    const questions: QuizQuestion[] = selected10.map((targetItem) => {
      const correct = targetItem.keys.join(' + ');
      
      // Get 3 incorrect choices from same or other items
      const wrongCandidates = candidatePool
        .filter((i) => i.id !== targetItem.id)
        .map((i) => i.keys.join(' + '))
        .filter((val, idx, arr) => arr.indexOf(val) === idx && val !== correct);

      const shuffledWrongs = wrongCandidates.sort(() => Math.random() - 0.5).slice(0, 3);

      // Fallback if not enough unique wrong choices
      const genericWrongs = ['Ctrl + Shift + P', 'Alt + Shift + Enter', 'Win + Alt + K', 'Ctrl + Alt + Del'];
      while (shuffledWrongs.length < 3) {
        const fallback = genericWrongs[shuffledWrongs.length];
        if (!shuffledWrongs.includes(fallback) && fallback !== correct) {
          shuffledWrongs.push(fallback);
        }
      }

      const options = [correct, ...shuffledWrongs].sort(() => Math.random() - 0.5);

      return {
        item: targetItem,
        options,
        correctAnswer: correct
      };
    });

    setQuizQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setIsQuizComplete(false);
  }, [candidatePool]);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
    setIsAnswerChecked(true);

    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsQuizComplete(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }
  };

  // Keyboard shortcut numbers 1-4 for rapid quiz taking!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isQuizComplete || !currentQ) return;

      if (!isAnswerChecked) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          if (currentQ.options[index]) {
            handleSelectOption(currentQ.options[index]);
          }
        }
      } else {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerChecked, isQuizComplete, currentQ, currentIndex, quizQuestions.length]);

  if (candidatePool.length < 4) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto my-8">
        <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">퀴즈를 생성하기 위한 단축키가 부족합니다</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">선택한 카테고리에 최소 4개 이상의 단축키가 필요합니다.</p>
        <button
          onClick={() => setSelectedCategory('all')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          전체 카테고리로 퀴즈 풀기
        </button>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let title = '단축키 초보 탐험가 🌱';
    let subtitle = '조금만 더 연습하면 칼퇴 요정이 될 수 있어요!';
    if (percentage === 100) {
      title = '단축키 마스터 👑';
      subtitle = '모든 단축키를 완벽하게 정복하셨습니다! 업무 효율 200% 달성!';
    } else if (percentage >= 70) {
      title = '칼퇴 보증수표 ⚡';
      subtitle = '실무에서 손에 익은 단축키 고수입니다!';
    }

    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/70 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400 shadow-inner">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
          퀴즈 완료
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-3 mb-1">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{subtitle}</p>

        {/* Score Card */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-4 rounded-2xl mb-8">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">최종 점수</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {score} / {quizQuestions.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">정답률</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{percentage}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">최대 연속 정답</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{bestStreak}회 🔥</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={generateQuiz}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새 퀴즈 도전하기</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Category selector & Streak stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
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

        <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-semibold">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl">
            <Zap className="w-3.5 h-3.5 fill-amber-500" />
            연속 {streak}콤보
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            문제 {currentIndex + 1} / {quizQuestions.length}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            {currentQ.item.category.toUpperCase()} • {currentQ.item.subCategory}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">키보드 1~4번 키로 선택 가능</span>
        </div>

        {/* Question Title & Description */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
          {currentQ.item.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {currentQ.item.description}
        </p>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((option, idx) => {
            let btnStyle = 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
            
            if (isAnswerChecked) {
              if (option === currentQ.correctAnswer) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400 shadow-xs';
              } else if (option === selectedAnswer) {
                btnStyle = 'bg-red-50 dark:bg-red-950/70 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 ring-1 ring-red-300';
              } else {
                btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={isAnswerChecked}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-2xl border-2 font-mono text-sm sm:text-base font-bold flex items-center justify-between transition-all text-left shadow-2xs ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerChecked && option === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswerChecked && option === selectedAnswer && option !== currentQ.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback callout after selecting answer */}
        {isAnswerChecked && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isCorrect ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' : 'bg-red-50/70 dark:bg-red-950/50 border-red-200 dark:border-red-800'
            }`}>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm mb-1">
                  {isCorrect ? (
                    <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 정답입니다! 멋져요!
                    </span>
                  ) : (
                    <span className="text-red-700 dark:text-red-300 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> 아쉬워요! 정답은 &apos;{currentQ.correctAnswer}&apos; 입니다.
                    </span>
                  )}
                </div>

                {currentQ.item.tip && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    <strong className="text-slate-900 dark:text-slate-100">💡 꿀팁: </strong>
                    <span className="highlight-pen font-medium">{currentQ.item.tip}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <span>{currentIndex + 1 === quizQuestions.length ? '결과 보기' : '다음 문제 (Space)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
