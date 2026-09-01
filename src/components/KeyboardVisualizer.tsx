import React, { useState, useEffect } from 'react';
import { ShortcutItem } from '../types';
import { ShortcutCard } from './ShortcutCard';
import { HighlighterColor } from '../types';
import { Keyboard as KeyboardIcon, Sparkles } from 'lucide-react';

interface KeyboardVisualizerProps {
  items: ShortcutItem[];
  userHighlights: Record<string, HighlighterColor>;
  onToggleHighlight: (id: string, color?: HighlighterColor) => void;
  onSelectDetail: (item: ShortcutItem) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  items,
  userHighlights,
  onToggleHighlight,
  onSelectDetail,
  isBookmarked,
  onToggleBookmark
}) => {
  const [activeModifiers, setActiveModifiers] = useState<{
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    win: boolean;
  }>({
    ctrl: false,
    alt: false,
    shift: false,
    win: false
  });

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      setActiveModifiers({
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        win: e.metaKey
      });

      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        setSelectedKey(e.key.toUpperCase());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      setActiveModifiers({
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        win: e.metaKey
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const toggleModifier = (mod: 'ctrl' | 'alt' | 'shift' | 'win') => {
    setActiveModifiers((prev) => ({ ...prev, [mod]: !prev[mod] }));
  };

  // Find matching shortcuts
  const matchedShortcuts = items.filter((item) => {
    const keysStr = item.keys.join(' ').toLowerCase();
    
    // If modifiers are active, check if item contains them
    const matchCtrl = !activeModifiers.ctrl || keysStr.includes('ctrl');
    const matchAlt = !activeModifiers.alt || keysStr.includes('alt');
    const matchShift = !activeModifiers.shift || keysStr.includes('shift');
    const matchWin = !activeModifiers.win || keysStr.includes('win');

    let matchKey = true;
    if (selectedKey) {
      matchKey = item.keys.some((k) => k.toUpperCase().includes(selectedKey) || selectedKey.includes(k.toUpperCase()));
    }

    const hasAnyFilter = activeModifiers.ctrl || activeModifiers.alt || activeModifiers.shift || activeModifiers.win || selectedKey;
    if (!hasAnyFilter) return false;

    return matchCtrl && matchAlt && matchShift && matchWin && matchKey;
  });

  const commonFunctionKeys = ['F1', 'F2', 'F4', 'F5', 'F7', 'F10', 'F11'];
  const commonCharKeys = ['C', 'V', 'D', 'E', 'L', 'R', 'S', 'W', 'H', 'M', 'P', 'G', 'Z', 'Enter', 'Spacebar'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Keyboard Interactive Control Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <KeyboardIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">인터랙티브 키보드 시뮬레이터</h3>
              <p className="text-xs text-slate-500">
                키보드를 직접 누르거나 아래 버튼을 클릭하여 조합별 단축키를 탐색하세요.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModifiers({ ctrl: false, alt: false, shift: false, win: false });
              setSelectedKey(null);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            선택 초기화
          </button>
        </div>

        {/* Virtual Modifier Keys Bar */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. 보조키 (Modifiers)</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleModifier('ctrl')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                  activeModifiers.ctrl
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Ctrl {activeModifiers.ctrl && '✓'}
              </button>

              <button
                onClick={() => toggleModifier('alt')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                  activeModifiers.alt
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Alt {activeModifiers.alt && '✓'}
              </button>

              <button
                onClick={() => toggleModifier('shift')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                  activeModifiers.shift
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Shift {activeModifiers.shift && '✓'}
              </button>

              <button
                onClick={() => toggleModifier('win')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                  activeModifiers.win
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Win (Windows) {activeModifiers.win && '✓'}
              </button>
            </div>
          </div>

          {/* Function Keys Row */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. 기능키 (F1~F12)</div>
            <div className="flex flex-wrap gap-1.5">
              {commonFunctionKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(selectedKey === k ? null : k)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                    selectedKey === k
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet & Action Keys */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">3. 알파벳 및 주요키</div>
            <div className="flex flex-wrap gap-1.5">
              {commonCharKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(selectedKey === k ? null : k)}
                  className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                    selectedKey === k
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Matched Shortcuts List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            선택한 키 조합에 해당하는 단축키 ({matchedShortcuts.length}개)
          </h4>
          {matchedShortcuts.length === 0 && (
            <span className="text-xs text-slate-500">위 키 버튼을 눌러 조합을 선택해 보세요.</span>
          )}
        </div>

        {matchedShortcuts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {matchedShortcuts.map((item) => (
              <ShortcutCard
                key={item.id}
                item={item}
                highlightColor={userHighlights[item.id]}
                isBookmarked={isBookmarked(item.id)}
                onToggleBookmark={onToggleBookmark}
                onToggleHighlight={onToggleHighlight}
                onSelectDetail={onSelectDetail}
                isPenActive={false}
                activePenColor="yellow"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
            조합된 단축키가 없습니다. <br />
            <strong className="text-slate-700">Ctrl</strong>, <strong className="text-slate-700">Alt</strong>, <strong className="text-slate-700">Win</strong> 키를 눌러보세요!
          </div>
        )}
      </div>
    </div>
  );
};
