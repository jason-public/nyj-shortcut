import React from 'react';
import { CategoryId, CategoryMeta } from '../types';
import { Search, X, Sparkles, Highlighter, Bookmark, Filter } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categories: CategoryMeta[];
  categoryCounts: Record<CategoryId, number>;
  filterType: 'all' | 'essential' | 'highlighted' | 'bookmarked';
  onFilterTypeChange: (type: 'all' | 'essential' | 'highlighted' | 'bookmarked') => void;
  highlightCount: number;
  bookmarkCount: number;
  subCategories: string[];
  selectedSubCategory: string | null;
  onSelectSubCategory: (sub: string | null) => void;
}

const CATEGORY_DOTS: Record<CategoryId, string> = {
  all: 'bg-slate-400',
  windows: 'bg-blue-500',
  excel: 'bg-emerald-500',
  ppt: 'bg-orange-500',
  word: 'bg-indigo-500',
  hangul: 'bg-sky-500',
  chrome: 'bg-teal-500'
};

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  categoryCounts,
  filterType,
  onFilterTypeChange,
  highlightCount,
  bookmarkCount,
  subCategories,
  selectedSubCategory,
  onSelectSubCategory
}) => {
  return (
    <div className="space-y-4">
      {/* Category Pills Bar with Dot Indicators */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const dotColor = CATEGORY_DOTS[cat.id] || 'bg-blue-500';

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectSubCategory(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold shadow-2xs'
                  : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? dotColor : 'bg-slate-300 dark:bg-slate-600'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded font-semibold ${
                  isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Search Input & Quick Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-shortcut-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="필요한 단축키를 검색하세요 (예: 엑셀 행 고정, Win+V, 자간, 캡처)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onFilterTypeChange('all')}
            className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            전체보기
          </button>

          <button
            onClick={() => onFilterTypeChange('essential')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
              filterType === 'essential'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>핵심 필수</span>
          </button>

          <button
            onClick={() => onFilterTypeChange('highlighted')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
              filterType === 'highlighted'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <span>형광펜 ({highlightCount})</span>
          </button>

          <button
            onClick={() => onFilterTypeChange('bookmarked')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
              filterType === 'bookmarked'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>즐겨찾기 ({bookmarkCount})</span>
          </button>
        </div>
      </div>

      {/* Subcategory Filter chips */}
      {subCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            소분류:
          </span>
          <button
            onClick={() => onSelectSubCategory(null)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors border ${
              selectedSubCategory === null
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            전체 소분류
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubCategory(selectedSubCategory === sub ? null : sub)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors border ${
                selectedSubCategory === sub
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

