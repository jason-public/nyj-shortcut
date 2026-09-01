import React, { useState, useRef } from 'react';
import { ShortcutItem, HighlighterColor } from '../types';
import { CATEGORIES } from '../data/shortcutsData';
import { Keycap } from './Keycap';
import { 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Filter, 
  LayoutGrid, 
  FileText, 
  Droplet,
  Highlighter,
  Bookmark
} from 'lucide-react';

interface CheatSheetPrintViewProps {
  items: ShortcutItem[];
  userHighlights: Record<string, HighlighterColor>;
  onBack: () => void;
}

type PrintLayout = 'grid-2' | 'grid-3' | 'table';
type FontSizeOption = 'normal' | 'compact' | 'mini';

export const CheatSheetPrintView: React.FC<CheatSheetPrintViewProps> = ({
  items,
  userHighlights,
  onBack
}) => {
  // Print Customizer States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyHighlighted, setOnlyHighlighted] = useState(false);
  const [onlyEssential, setOnlyEssential] = useState(false);
  const [layoutMode, setLayoutMode] = useState<PrintLayout>('grid-2');
  const [fontSize, setFontSize] = useState<FontSizeOption>('normal');
  const [inkSaver, setInkSaver] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const printIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Filter items
  const filteredCategories = CATEGORIES.filter((c) => c.id !== 'all' && (selectedCategory === 'all' || c.id === selectedCategory));

  const getCategoryItems = (catId: string) => {
    return items.filter((i) => {
      if (i.category !== catId) return false;
      if (onlyHighlighted && !userHighlights[i.id]) return false;
      if (onlyEssential && !i.isEssential) return false;
      return true;
    });
  };

  const totalFilteredCount = filteredCategories.reduce((acc, cat) => acc + getCategoryItems(cat.id).length, 0);

  // Helper to generate standalone printable HTML
  const generatePrintableHtml = (): string => {
    const isGrid3 = layoutMode === 'grid-3';
    const isTable = layoutMode === 'table';

    let categoriesHtml = '';

    filteredCategories.forEach((cat) => {
      const catItems = getCategoryItems(cat.id);
      if (catItems.length === 0) return;

      let itemsContent = '';

      if (isTable) {
        // Table layout
        const rowsHtml = catItems.map((item) => {
          const isHigh = !!userHighlights[item.id];
          const highlightBg = isHigh && !inkSaver ? 'background-color: #fef3c7;' : '';
          const keyBadges = item.keys
            .map(
              (k) =>
                `<span style="display:inline-block; padding: 2px 6px; margin: 1px 2px; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; background: ${
                  inkSaver ? '#ffffff' : '#f1f5f9'
                }; border: 1px solid ${inkSaver ? '#000000' : '#cbd5e1'}; border-bottom: 2px solid ${
                  inkSaver ? '#000000' : '#94a3b8'
                }; border-radius: 4px; color: #0f172a;">${k}</span>`
            )
            .join(' ');

          return `
            <tr style="border-bottom: 1px solid #e2e8f0; ${highlightBg}">
              <td style="padding: 6px 8px; font-weight: 700; font-size: 11px; color: #0f172a; width: 35%;">
                ${item.isEssential ? '<span style="color:#d97706; margin-right:3px;">★</span>' : ''}
                ${item.title}
                <div style="font-weight: 400; font-size: 10px; color: #64748b; margin-top: 1px;">${item.description}</div>
              </td>
              <td style="padding: 6px 8px; white-space: nowrap; width: 35%;">
                ${keyBadges}
              </td>
              <td style="padding: 6px 8px; font-size: 10px; color: #64748b; font-style: italic; width: 30%;">
                ${item.tip ? `Tip: ${item.tip}` : ''}
              </td>
            </tr>
          `;
        }).join('');

        itemsContent = `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px;">
            <thead>
              <tr style="background: ${inkSaver ? '#ffffff' : '#f8fafc'}; border-bottom: 2px solid #cbd5e1; text-align: left;">
                <th style="padding: 6px 8px; font-size: 11px; color: #475569;">기능 설명</th>
                <th style="padding: 6px 8px; font-size: 11px; color: #475569;">단축키 조합</th>
                <th style="padding: 6px 8px; font-size: 11px; color: #475569;">실무 활용 팁</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        `;
      } else {
        // Grid cards layout (2 or 3 cols)
        const gridCols = isGrid3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';
        const cardsHtml = catItems.map((item) => {
          const isHigh = !!userHighlights[item.id];
          const bg = inkSaver ? '#ffffff' : isHigh ? '#fffbeb' : '#f8fafc';
          const border = inkSaver ? '#000000' : isHigh ? '#fcd34d' : '#e2e8f0';

          const keyBadges = item.keys
            .map(
              (k) =>
                `<span style="display:inline-block; padding: 2px 5px; margin: 1px 1px; font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 700; background: ${
                  inkSaver ? '#ffffff' : '#ffffff'
                }; border: 1px solid ${inkSaver ? '#000000' : '#cbd5e1'}; border-bottom: 2px solid ${
                  inkSaver ? '#000000' : '#94a3b8'
                }; border-radius: 4px; color: #0f172a;">${k}</span>`
            )
            .join(' ');

          return `
            <div style="padding: 8px 10px; border-radius: 8px; border: 1px solid ${border}; background-color: ${bg}; page-break-inside: avoid; break-inside: avoid; display: flex; flex-direction: column; justify-content: space-between; gap: 4px;">
              <div>
                <div style="font-weight: 700; font-size: 11.5px; color: #0f172a; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                  ${item.isEssential ? '<span style="color:#d97706;">★</span>' : ''}
                  <span>${item.title}</span>
                </div>
                <div style="font-size: 10px; color: #475569; line-height: 1.35;">${item.description}</div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-top: 4px; padding-top: 4px; border-top: 1px dashed ${inkSaver ? '#cbd5e1' : '#e2e8f0'};">
                <div>${keyBadges}</div>
                ${item.tip ? `<div style="font-size: 9px; color: #64748b; font-style: italic; text-align: right; max-width: 50%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.tip}</div>` : ''}
              </div>
            </div>
          `;
        }).join('');

        itemsContent = `
          <div style="display: grid; grid-template-columns: ${gridCols}; gap: 8px; margin-bottom: 16px;">
            ${cardsHtml}
          </div>
        `;
      }

      categoriesHtml += `
        <div style="page-break-inside: avoid; break-inside: avoid; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 6px; border-bottom: 2px solid ${inkSaver ? '#000000' : '#334155'}; padding-bottom: 4px; margin-bottom: 8px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #0f172a;"></span>
            <span style="font-weight: 800; font-size: 13px; color: #0f172a;">${cat.name}</span>
            <span style="font-size: 11px; font-weight: 600; color: #64748b;">(${catItems.length}개)</span>
          </div>
          ${itemsContent}
        </div>
      `;
    });

    const fontScale = fontSize === 'mini' ? '9px' : fontSize === 'compact' ? '10px' : '11px';

    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>직장인 필수 업무 단축키 치트시트</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 8mm 8mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
            background: #ffffff;
            color: #0f172a;
            font-size: ${fontScale};
            line-height: 1.4;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: -0.5px;
          }
          .header p {
            margin: 3px 0 0 0;
            font-size: 10px;
            color: #475569;
          }
          .footer {
            margin-top: 12px;
            padding-top: 6px;
            border-top: 1px solid #cbd5e1;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚡ 직장인 필수 업무 단축키 치트시트</h1>
          <p>윈도우(Windows) • 엑셀(Excel) • 파워포인트(PPT) • 워드(Word) • 한글(HWP) • 크롬(Chrome)</p>
        </div>
        
        ${categoriesHtml}

        <div class="footer">
          업무 생산성 향상을 위한 필수 단축키 모음집 • 인쇄일자: ${new Date().toLocaleDateString('ko-KR')}
        </div>
      </body>
      </html>
    `;
  };

  // 1. Primary Print Handler: uses an invisible isolated iframe
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      let iframe = printIframeRef.current;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('title', 'Cheatsheet Print Frame');
        document.body.appendChild(iframe);
        printIframeRef.current = iframe;
      }

      const printableHtml = generatePrintableHtml();
      const doc = iframe.contentWindow?.document || iframe.contentDocument;

      if (doc) {
        doc.open();
        doc.write(printableHtml);
        doc.close();

        setTimeout(() => {
          try {
            iframe?.contentWindow?.focus();
            iframe?.contentWindow?.print();
          } catch {
            // Fallback to window.print if iframe.print fails
            window.print();
          } finally {
            setIsPrinting(false);
          }
        }, 350);
      } else {
        window.print();
        setIsPrinting(false);
      }
    } catch {
      window.print();
      setIsPrinting(false);
    }
  };

  // 2. Open in New Tab Print Handler (Fallback for browser iframe restrictions)
  const handleOpenInNewTab = () => {
    const printableHtml = generatePrintableHtml();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(printableHtml);
      newWindow.document.close();
      setTimeout(() => {
        newWindow.focus();
        newWindow.print();
      }, 300);
    } else {
      handlePrint();
    }
  };

  // 3. Download standalone HTML
  const handleDownloadHtml = () => {
    const printableHtml = generatePrintableHtml();
    const blob = new Blob([printableHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `업무_단축키_치트시트_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 4. Copy as Markdown / Text Table
  const handleCopyMarkdown = () => {
    let md = `# ⚡ 직장인 필수 업무 단축키 치트시트\n\n`;

    filteredCategories.forEach((cat) => {
      const catItems = getCategoryItems(cat.id);
      if (catItems.length === 0) return;

      md += `## 📌 ${cat.name} (${catItems.length}개)\n`;
      md += `| 기능명 | 단축키 | 설명 | 실무 팁 |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;

      catItems.forEach((item) => {
        const keysStr = item.keys.join(' + ');
        md += `| ${item.title} | \`${keysStr}\` | ${item.description} | ${item.tip || '-'} |\n`;
      });
      md += `\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Hidden printing iframe */}
      <iframe
        ref={printIframeRef}
        title="print-sandbox"
        className="hidden"
        style={{ width: 0, height: 0, position: 'absolute', border: 'none' }}
      />

      {/* Top Action Bar (hidden on print) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Row 1: Back + Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>단축키 사전으로 돌아가기</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* Primary Print / Save PDF Button */}
            <button
              id="btn-print-cheatsheet"
              onClick={handlePrint}
              disabled={isPrinting || totalFilteredCount === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 animate-pulse" />
              <span>치트시트 인쇄 / PDF 저장</span>
            </button>

            {/* Open in New Tab Button (Sandbox Fallback) */}
            <button
              onClick={handleOpenInNewTab}
              title="브라우저 제한 없이 새 탭에서 즉시 인쇄창 열기"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 탭에서 열기</span>
            </button>

            {/* Download HTML Button */}
            <button
              onClick={handleDownloadHtml}
              title="오프라인 보관용 단독 HTML 파일 다운로드"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">HTML 저장</span>
            </button>

            {/* Copy Markdown Button */}
            <button
              onClick={handleCopyMarkdown}
              title="노션, 슬랙, 문서 등에 붙여넣을 수 있는 마크다운 복사"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? '복사 완료!' : '표 복사'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Interactive Print Customizer Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          {/* Category & Scope Filter */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>인쇄 대상 범위 ({totalFilteredCount}개)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOnlyHighlighted(!onlyHighlighted)}
                className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                  onlyHighlighted
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Highlighter className="w-3 h-3 text-amber-500" />
                <span>형광펜만</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyEssential(!onlyEssential)}
                className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                  onlyEssential
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>핵심만</span>
              </button>
            </div>
          </div>

          {/* Layout Mode */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              <span>용지 배치 레이아웃</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLayoutMode('grid-2')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all ${
                  layoutMode === 'grid-2'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                표준 2열
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid-3')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all ${
                  layoutMode === 'grid-3'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="A4 1장에 더 많이 담기"
              >
                초밀착 3열
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('table')}
                className={`flex-1 py-1 px-2 rounded-md font-semibold transition-all ${
                  layoutMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                테이블 표
              </button>
            </div>
          </div>

          {/* Print Optimization (Ink Saver & Font Size) */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-500" />
              <span>인쇄 옵션 & 절약</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInkSaver(!inkSaver)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                  inkSaver
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{inkSaver ? '✓ 흑백 잉크 절약 켜짐' : '잉크 절약 모드'}</span>
              </button>

              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSizeOption)}
                className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="normal">글자: 보통</option>
                <option value="compact">글자: 작게</option>
                <option value="mini">글자: 매우 작게</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Sheet Area (Live Preview on screen, pure A4 on print) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm print:border-0 print:p-2 print:bg-white text-slate-900 dark:text-slate-100 transition-colors">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
            <span>⚡ 직장인 필수 업무 단축키 치트시트</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            윈도우(Windows) • 엑셀(Excel) • 파워포인트(PPT) • 워드(Word) • 한글(HWP) • 크롬(Chrome)
          </p>
        </div>

        {/* Grouped by categories */}
        {filteredCategories.length === 0 || totalFilteredCount === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">선택한 필터 조건에 해당하는 단축키가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((cat) => {
              const catItems = getCategoryItems(cat.id);
              if (catItems.length === 0) return null;

              return (
                <div key={cat.id} className="card-print">
                  <div className="flex items-center gap-2 border-b-2 border-slate-300 dark:border-slate-700 pb-1.5 mb-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-blue-500 inline-block" />
                      {cat.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({catItems.length}개)</span>
                  </div>

                  {layoutMode === 'table' ? (
                    /* Table Layout View */
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                            <th className="py-2 px-3 font-bold">기능명</th>
                            <th className="py-2 px-3 font-bold">단축키</th>
                            <th className="py-2 px-3 font-bold">설명 및 실무 팁</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {catItems.map((item) => {
                            const isHigh = !!userHighlights[item.id];
                            return (
                              <tr
                                key={item.id}
                                className={isHigh && !inkSaver ? 'bg-amber-50/60 dark:bg-amber-950/40' : ''}
                              >
                                <td className="py-2 px-3 font-bold text-slate-900 dark:text-slate-100">
                                  {item.isEssential && <span className="text-amber-500 mr-1">★</span>}
                                  {item.title}
                                </td>
                                <td className="py-2 px-3 whitespace-nowrap">
                                  <Keycap keys={item.keys} size="sm" accent={isHigh} />
                                </td>
                                <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                                  <div>{item.description}</div>
                                  {item.tip && <div className="text-[10px] text-slate-400 italic mt-0.5">Tip: {item.tip}</div>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Grid Layout (2 or 3 Columns) */
                    <div
                      className={`grid gap-3 ${
                        layoutMode === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
                      }`}
                    >
                      {catItems.map((item) => {
                        const highlightColor = userHighlights[item.id];
                        const isHighlighted = !!highlightColor;
                        const highlightClass = highlightColor ? `highlight-pen-${highlightColor}` : '';

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2.5 transition-colors ${
                              inkSaver
                                ? 'bg-white border-slate-300 dark:bg-slate-900 dark:border-slate-700'
                                : isHighlighted
                                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80'
                                : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 mb-1">
                                  {item.isEssential && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                  <span className={isHighlighted ? highlightClass : ''}>{item.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700/80 mt-1">
                              <Keycap keys={item.keys} size="sm" accent={isHighlighted} />
                              {item.tip && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 italic max-w-[50%] truncate text-right">
                                  Tip: {item.tip}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500">
          업무에 활용하는 단축키 • 직장인 칼퇴를 위한 필수 단축키 모음집
        </div>
      </div>
    </div>
  );
};
