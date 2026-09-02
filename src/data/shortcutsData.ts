import { CategoryMeta, ShortcutItem, ScenarioPack } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    name: '전체 단축키',
    shortName: '전체',
    iconName: 'LayoutGrid',
    color: 'slate',
    badgeBg: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    badgeText: 'text-slate-700',
    description: '모든 프로그램의 업무 필수 단축키를 한눈에 확인합니다.'
  },
  {
    id: 'windows',
    name: '윈도우 (Windows)',
    shortName: '윈도우',
    iconName: 'Laptop',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badgeText: 'text-blue-700',
    description: '창 분할, 클립보드 기록, 캡처, 가상 데스크톱 등 OS 제어 필수 단축키'
  },
  {
    id: 'excel',
    name: '엑셀 (Excel)',
    shortName: '엑셀',
    iconName: 'Sheet',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    badgeText: 'text-emerald-700',
    description: '절대참조, 연속 복사, 셀 서식, 자동 합계, 데이터 이동/선택 꿀팁'
  },
  {
    id: 'ppt',
    name: '파워포인트 (PowerPoint)',
    shortName: '파워포인트',
    iconName: 'Presentation',
    color: 'orange',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    badgeText: 'text-orange-700',
    description: '개체 복제, 서식 복사, 슬라이드 쇼 제어, 수평/수직 정렬 제어'
  },
  {
    id: 'word',
    name: '워드 (Word)',
    shortName: '워드',
    iconName: 'FileText',
    color: 'indigo',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    badgeText: 'text-indigo-700',
    description: '서식 지우기, 단락 정렬, 페이지 나누기, 대소문자 일괄 변환'
  },
  {
    id: 'hangul',
    name: '한글 (HWP)',
    shortName: '한글',
    iconName: 'BookOpen',
    color: 'sky',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
    badgeText: 'text-sky-700',
    description: '모양 복사(Alt+C), 표 셀 편집(F5/M/S/W/H), 자간·장평 조절 등 공문서 필수'
  },
  {
    id: 'chrome',
    name: '크롬 브라우저 (Chrome)',
    shortName: '크롬',
    iconName: 'Globe',
    color: 'teal',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    badgeText: 'text-teal-700',
    description: '탭 복구(Ctrl+Shift+T), 주소창 이동(Ctrl+L), 시크릿창(Ctrl+Shift+N), 강력 새로고침 등 웹서핑 필수'
  }
];

export const SHORTCUTS_DATA: ShortcutItem[] = [
  // ===================== 1. 윈도우 (Windows) =====================
  {
    id: 'win-01',
    category: 'windows',
    subCategory: '클립보드 & 캡처',
    keys: ['Win', 'V'],
    title: '클립보드 검색 기록 열기',
    description: '과거에 복사했던 여러 개의 텍스트나 캡처 이미지를 목록에서 골라 붙여넣기할 수 있습니다.',
    tip: '최초 1회 실행 시 활성화 버튼을 누르면 이후 복사한 25개 항목이 보존되며 고정도 가능합니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['클립보드', '복사', '붙여넣기', '히스토리', '생산성'],
    exampleScenario: '여러 웹페이지의 텍스트를 한 번에 복사해 두고 차례대로 보고서에 붙여넣을 때 필수!'
  },
  {
    id: 'win-02',
    category: 'windows',
    subCategory: '클립보드 & 캡처',
    keys: ['Win', 'Shift', 'S'],
    title: '캡처 도구 (영역 지정 캡처)',
    description: '원하는 화면 영역을 사각형, 자유형, 또는 창 단위로 즉시 캡처하여 클립보드에 저장합니다.',
    tip: '캡처 후 바로 Ctrl + V로 메신저나 슬라이드, 문서에 붙여넣을 수 있어 매우 빠릅니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['캡처', '스크린샷', '화면 캡처', '클립보드'],
    exampleScenario: '화면 특정 부분만 깔끔하게 따서 동료에게 Slack/카카오톡으로 전송할 때'
  },
  {
    id: 'win-03',
    category: 'windows',
    subCategory: '창 관리 & 멀티태스킹',
    keys: ['Win', 'D'],
    title: '바탕화면 즉시 보기 (모든 창 최소화)',
    description: '열려 있는 모든 창을 한 번에 최소화하고 바탕화면을 표시합니다. 다시 누르면 원래대로 복원됩니다.',
    tip: '급하게 바탕화면의 파일을 찾아야 하거나 회의실에서 화면을 가릴 때 유용합니다.',
    isEssential: true,
    tags: ['바탕화면', '최소화', '창 정리'],
    exampleScenario: '작업 창이 10개 넘게 열려 있어 바탕화면 바로가기 아이콘을 클릭하기 어려울 때'
  },
  {
    id: 'win-04',
    category: 'windows',
    subCategory: '창 관리 & 멀티태스킹',
    keys: ['Win', '← / → / ↑ / ↓'],
    title: '창 화면 분할 & 스냅 (Snap)',
    description: '현재 활성화된 창을 화면 좌/우/상/하 또는 4분할로 정밀하게 정렬 및 최대화/최소화합니다.',
    tip: 'Win + 좌/우 방향키를 누른 후 다른 창을 선택하면 완벽한 2분할 듀얼 작업 환경이 완성됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['창 분할', '스냅', '멀티모니터', '화면 정리'],
    exampleScenario: '왼쪽엔 참고자료 브라우저, 오른쪽엔 보고서 작성 창을 5:5로 띄울 때'
  },
  {
    id: 'win-05',
    category: 'windows',
    subCategory: '창 관리 & 멀티태스킹',
    keys: ['Alt', 'Tab'],
    title: '실행 중인 앱 전환',
    description: '현재 실행 중인 프로그램 목록을 미리보기로 띄우고 빠르게 전환합니다.',
    tip: 'Alt를 누른 상태에서 Tab을 톡톡 누르거나 Shift+Alt+Tab으로 역방향 전환할 수 있습니다.',
    isEssential: true,
    tags: ['앱 전환', '작업 전환', '멀티태스킹']
  },
  {
    id: 'win-06',
    category: 'windows',
    subCategory: '창 관리 & 멀티태스킹',
    keys: ['Win', 'Tab'],
    title: '작업 보기 (가상 데스크톱 관리)',
    description: '모든 열린 창을 조감도로 보고, 상단에서 새로운 가상 데스크톱을 생성하고 전환합니다.',
    tip: 'Ctrl + Win + D는 새 데스크톱 생성, Ctrl + Win + 좌/우 화살표는 가상 데스크톱 간 빠른 전환입니다.',
    tags: ['가상 데스크톱', '작업 보기', '타임라인']
  },
  {
    id: 'win-07',
    category: 'windows',
    subCategory: '시스템 & 편의',
    keys: ['Win', 'E'],
    title: '파일 탐색기 열기',
    description: '새로운 파일 탐색기 창을 즉시 실행합니다.',
    tip: '마우스로 탐색기 아이콘을 찾는 것보다 훨씬 빠르며, 여러 창을 동시에 띄울 때 유용합니다.',
    isEssential: true,
    tags: ['파일 탐색기', '폴더', '내 PC']
  },
  {
    id: 'win-08',
    category: 'windows',
    subCategory: '시스템 & 편의',
    keys: ['Win', 'L'],
    title: 'PC 즉시 잠금 (화면 잠금)',
    description: '자리 비움 시 개인정보와 업무 보안을 위해 1초 만에 화면을 잠금 상태로 전환합니다.',
    tip: '자리에서 일어날 때 습관적으로 누르는 보안 필수 단축키 (Lock의 L)!',
    isEssential: true,
    defaultHighlight: true,
    tags: ['보안', '화면 잠금', '자리비움', '로그아웃']
  },
  {
    id: 'win-09',
    category: 'windows',
    subCategory: '시스템 & 편의',
    keys: ['Win', '.'],
    title: '이모지 및 특수기호 / GIF 입력창',
    description: '😊 이모지, 기호(℃, ±, ★, №), 카오모지 등을 검색하고 문서에 바로 입력할 수 있는 팝업창을 띄웁니다.',
    tip: '이모지뿐만 아니라 기호(심볼) 탭에서 수학 기호, 통화 기호, 특수 문자를 손쉽게 찾을 수 있습니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['이모지', '특수문자', '기호', '이모티콘']
  },
  {
    id: 'win-10',
    category: 'windows',
    subCategory: '시스템 & 편의',
    keys: ['Ctrl', 'Shift', 'Esc'],
    title: '작업 관리자 직접 실행',
    description: '응답 없는 프로그램 강제 종료 및 CPU/메모리 점유율을 확인하는 작업 관리자를 한 번에 엽니다.',
    tip: 'Ctrl + Alt + Del의 파란 화면을 거치지 않고 바로 작업 관리자 창만 다이렉트로 실행됩니다.',
    isEssential: true,
    tags: ['작업 관리자', '강제 종료', '응답 없음', '시스템']
  },
  {
    id: 'win-11',
    category: 'windows',
    subCategory: '창 관리 & 멀티태스킹',
    keys: ['Win', '숫자(1~9)'],
    title: '작업표시줄 고정 앱 빠른 실행/전환',
    description: '작업표시줄 왼쪽부터 1번째, 2번째... 고정된 앱을 즉시 실행하거나 해당 앱으로 전환합니다.',
    tip: '자주 쓰는 크롬(1번), 엑셀(2번), 슬랙(3번)을 고정해 두면 Win+1, Win+2로 순식간에 전환됩니다.',
    tags: ['작업표시줄', '단축키 실행', '빠른 실행']
  },
  {
    id: 'win-12',
    category: 'windows',
    subCategory: '탐색기 & 파일 관리',
    keys: ['F2'],
    title: '선택한 파일/폴더 이름 바꾸기',
    description: '마우스 우클릭할 필요 없이 선택된 파일이나 폴더의 이름을 즉시 수정 모드로 진입합니다.',
    tip: '이름 수정 후 Tab을 누르면 다음 파일로 연속해서 이름 변경 모드가 이동합니다.',
    isEssential: true,
    tags: ['이름 바꾸기', '파일 관리', '탐색기']
  },
  {
    id: 'win-13',
    category: 'windows',
    subCategory: '탐색기 & 파일 관리',
    keys: ['Shift', 'Delete'],
    title: '휴지통 거치지 않고 영구 삭제',
    description: '선택한 대용량 파일이나 불필요한 파일을 휴지통에 넣지 않고 즉각 영구 삭제합니다.',
    tags: ['영구 삭제', '휴지통', '파일 삭제']
  },
  {
    id: 'win-14',
    category: 'windows',
    subCategory: '시스템 & 편의',
    keys: ['Win', 'I'],
    title: 'Windows 설정(Settings) 즉시 열기',
    description: '디스플레이, 블루투스/장치, 네트워크, 사운드 등 윈도우 환경설정 창을 한 번에 실행합니다.',
    tip: '듀얼 모니터 연결이나 회의실 빔프로젝터/이어폰 블루투스 연결 시 즉시 진입할 수 있어 편리합니다.',
    isEssential: true,
    tags: ['설정', 'Settings', '블루투스', '디스플레이', '사운드'],
    exampleScenario: '외부 미팅룸에서 무선 이어폰이나 보조 모니터를 빠르게 연결/설정할 때'
  },

  // ===================== 2. 엑셀 (Excel) =====================
  {
    id: 'xl-01',
    category: 'excel',
    subCategory: '수식 & 참조',
    keys: ['F4'],
    title: '절대참조 토글 ($) & 직전 작업 반복',
    description: '수식 입력 중 셀 주소($A$1 ↔ A$1 ↔ $A1 ↔ A1)를 순환 변경하며, 일반 편집 중엔 방금 실행한 작업을 그대로 반복합니다.',
    tip: '행 삽입, 셀 색상 지정 등을 한 번 하고 다른 셀에서 F4만 누르면 똑같이 적용되는 마법의 키!',
    isEssential: true,
    defaultHighlight: true,
    tags: ['절대참조', '작업 반복', '수식', '셀 서식'],
    exampleScenario: 'VLOOKUP이나 수식 작성 시 참조 범위를 고정할 때 F4를 눌러 $ 표기를 즉시 붙입니다.'
  },
  {
    id: 'xl-02',
    category: 'excel',
    subCategory: '데이터 입력',
    keys: ['Alt', 'Enter'],
    title: '셀 안에서 줄바꿈 (줄바꿈)',
    description: '하나의 셀 안에서 다음 줄로 텍스트를 넘겨 여러 줄을 입력할 수 있습니다.',
    tip: '그냥 Enter를 누르면 아래 셀로 이동하므로, 반드시 Alt 키를 누른 상태에서 Enter를 입력하세요.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['줄바꿈', '셀 입력', '엔터', '텍스트']
  },
  {
    id: 'xl-03',
    category: 'excel',
    subCategory: '데이터 입력',
    keys: ['Ctrl', ';'],
    title: '오늘 날짜 즉시 입력',
    description: '현재 컴퓨터 기준 오늘의 날짜(예: 2026-09-01)를 고정된 값으로 셀에 빠르게 입력합니다.',
    tip: 'Ctrl + Shift + : (세미콜론 옆 콜론)을 누르면 현재 시간이 입력됩니다!',
    isEssential: true,
    tags: ['날짜', '시간', '오늘 날짜', '자동 입력']
  },
  {
    id: 'xl-04',
    category: 'excel',
    subCategory: '데이터 복사 & 채우기',
    keys: ['Ctrl', 'D'],
    title: '위쪽 셀 내용 아래로 복사 (Down)',
    description: '선택한 셀에 바로 위 셀의 데이터나 수식, 서식을 즉시 복제하여 채웁니다.',
    tip: '여러 셀 범위를 드래그한 후 Ctrl + D를 누르면 첫 번째 행의 내용이 아래로 쫙 복사됩니다. (오른쪽 복사는 Ctrl + R)',
    isEssential: true,
    defaultHighlight: true,
    tags: ['아래로 복사', '채우기', '수식 복사', '데이터 복제']
  },
  {
    id: 'xl-05',
    category: 'excel',
    subCategory: '수식 & 계산',
    keys: ['Alt', '='],
    title: '자동 합계 (SUM 수식 자동 삽입)',
    description: '선택한 셀의 위쪽 또는 왼쪽 연속된 숫자 데이터 범위를 자동으로 감지해 =SUM() 수식을 완성합니다.',
    tip: '데이터 표 전체와 합계 들어갈 빈 셀들을 함께 드래그하고 Alt + =를 누르면 행/열 합계가 1초 만에 생성됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['자동 합계', 'SUM', '수식', '합계 계산']
  },
  {
    id: 'xl-06',
    category: 'excel',
    subCategory: '서식 & 표시 형식',
    keys: ['Ctrl', '1'],
    title: '셀 서식 대화상자 열기',
    description: '표시 형식, 맞춤, 글꼴, 테두리, 채우기 등 셀의 모든 서식을 상세 설정할 수 있는 창을 호출합니다.',
    tip: '엑셀 작업 중 가장 빈번하게 열리는 대화상자로 마우스 우클릭을 완전히 대체합니다.',
    isEssential: true,
    tags: ['셀 서식', '표시 형식', '테두리', '서식 설정']
  },
  {
    id: 'xl-07',
    category: 'excel',
    subCategory: '탐색 & 범위 선택',
    keys: ['Ctrl', '방향키(↑↓←→)'],
    title: '데이터 연속 영역의 끝으로 점프',
    description: '수천 줄의 데이터가 있어도 스크롤하지 않고 데이터의 맨 처음/맨 끝 행이나 열로 단숨에 이동합니다.',
    tip: 'Ctrl + Shift + 방향키를 누르면 점프하는 모든 범위가 한 번에 블록으로 선택됩니다!',
    isEssential: true,
    defaultHighlight: true,
    tags: ['이동', '점프', '범위 선택', '대용량 데이터']
  },
  {
    id: 'xl-08',
    category: 'excel',
    subCategory: '행/열 조작',
    keys: ['Ctrl', 'Shift', '+'],
    title: '셀 / 행 / 열 삽입',
    description: '현재 위치에 새로운 행이나 열, 또는 셀을 삽입합니다. (Shift + Space로 행 선택 후 누르면 행 바로 삽입)',
    tip: '반대로 삭제할 때는 Ctrl + - (마이너스)를 누르면 선택한 셀/행/열이 즉시 삭제됩니다.',
    isEssential: true,
    tags: ['행 삽입', '열 삽입', '행 삭제', '셀 조작']
  },
  {
    id: 'xl-09',
    category: 'excel',
    subCategory: '탐색 & 범위 선택',
    keys: ['Ctrl', 'Spacebar'],
    title: '현재 위치의 열(Column) 전체 선택',
    description: '현재 커서가 위치한 열 전체를 선택합니다. (Shift + Spacebar는 행 전체 선택)',
    tip: 'Ctrl + Spacebar 누르고 Ctrl + Shift + + 를 누르면 빈 열이 즉시 생성됩니다.',
    tags: ['열 선택', '행 선택', '전체 선택']
  },
  {
    id: 'xl-10',
    category: 'excel',
    subCategory: '필터 & 테이블',
    keys: ['Ctrl', 'Shift', 'L'],
    title: '자동 필터 적용 / 해제',
    description: '표의 머리글에 데이터 필터 드롭다운 화살표를 켜거나 끕니다.',
    tip: '표 안에 커서를 두고 이 단축키를 누르면 데이터 탭으로 마우스를 가져가지 않고 필터를 즉시 켭니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['필터', '정렬', '자동 필터', '데이터 정리']
  },
  {
    id: 'xl-11',
    category: 'excel',
    subCategory: '서식 & 표시 형식',
    keys: ['Ctrl', 'Shift', '4 ($)'],
    title: '통화 표시 형식 (₩ 및 천단위 콤마)',
    description: '숫자를 통화 형식(원화 표시 및 자리수 구분 쉼표)으로 신속하게 변경합니다.',
    tip: 'Ctrl + Shift + 5 (%)는 백분율 형식, Ctrl + Shift + 1은 일반 콤마(,) 숫자 서식입니다.',
    tags: ['통화 서식', '콤마', '회계 서식', '퍼센트']
  },
  {
    id: 'xl-12',
    category: 'excel',
    subCategory: '데이터 입력',
    keys: ['Ctrl', 'Enter'],
    title: '선택한 모든 셀에 동일한 값 일괄 입력',
    description: '떨어져 있거나 넓게 드래그한 여러 셀에 텍스트나 수식을 한 번에 동시에 채워 넣습니다.',
    tip: 'Ctrl을 누른 채 원하는 셀들을 다중 선택하고 값을 타이핑한 뒤 Ctrl + Enter를 누르면 끝납니다.',
    tags: ['일괄 입력', '동일값 채우기', '다중 셀']
  },
  {
    id: 'xl-13',
    category: 'excel',
    subCategory: '피벗 & 데이터 분석',
    keys: ['Alt', 'N, V'],
    title: '피벗 테이블 (Pivot Table) 마법사 삽입',
    description: '방대한 원본 표를 바탕으로 요약, 통계, 교차 분석용 피벗 테이블을 즉시 생성합니다.',
    tip: '데이터 표 안에 커서를 둔 뒤 Alt를 누르고 N, V를 차례로 누르면 피벗 생성 대화상자가 열립니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['피벗테이블', '데이터 분석', '통계 요약', '피벗'],
    exampleScenario: '수만 건의 거래 내역을 부서별/월별 합계로 1초 만에 요약 집계할 때'
  },

  // ===================== 3. 파워포인트 (PowerPoint) =====================
  {
    id: 'ppt-01',
    category: 'ppt',
    subCategory: '개체 편집 & 정렬',
    keys: ['Ctrl', 'D'],
    title: '개체 / 슬라이드 간격 복제 (Duplicate)',
    description: '도형이나 텍스트 상자를 일정한 간격과 각도로 스마트 복제합니다.',
    tip: 'Ctrl+D로 복제 후 원하는 위치로 옮겨두고 다시 Ctrl+D를 누르면 그 간격 그대로 무한 복제됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['복제', '도형 복사', '등간격 복제', '슬라이드 복제'],
    exampleScenario: '동일한 크기의 카드형 박스 4개를 일정한 여백으로 나란히 배치할 때'
  },
  {
    id: 'ppt-02',
    category: 'ppt',
    subCategory: '개체 편집 & 정렬',
    keys: ['Ctrl', 'Shift', 'C / V'],
    title: '개체 서식 복사 및 붙여넣기',
    description: '선택한 도형/텍스트의 글꼴, 색상, 테두리, 그림자 서식만 쏙 복사하여 다른 개체에 그대로 바릅니다.',
    tip: 'Ctrl + Shift + C로 서식을 복사하고 다른 도형을 클릭한 후 Ctrl + Shift + V를 누르면 디자인 통일이 순식간에 끝납니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['서식 복사', '디자인 통일', '스타일 복사', '스포이트']
  },
  {
    id: 'ppt-03',
    category: 'ppt',
    subCategory: '개체 편집 & 정렬',
    keys: ['Ctrl', 'G'],
    title: '선택 개체 그룹화 (Group)',
    description: '여러 개의 도형, 아이콘, 텍스트 상자를 하나의 단일 개체로 묶습니다.',
    tip: '그룹을 풀 때는 Ctrl + Shift + G를 누르면 즉시 해제됩니다.',
    isEssential: true,
    tags: ['그룹화', '개체 묶기', '그룹 해제']
  },
  {
    id: 'ppt-04',
    category: 'ppt',
    subCategory: '개체 편집 & 정렬',
    keys: ['Shift', '드래그'],
    title: '정비율 / 수평·수직 직선 이동 및 생성',
    description: '정사각형, 정원, 수평선/수직선을 그리거나 이동할 때 흔들림 없이 축을 고정합니다.',
    tip: 'Ctrl + Shift + 드래그는 중심점을 기준으로 정비율 확대/축소됩니다.',
    isEssential: true,
    tags: ['정비율', '정사각형', '수평 이동', '도형 그리기']
  },
  {
    id: 'ppt-05',
    category: 'ppt',
    subCategory: '슬라이드 쇼 & 발표',
    keys: ['Shift', 'F5'],
    title: '현재 슬라이드부터 쇼 시작',
    description: '1페이지 처음부터가 아니라, 내가 지금 편집 중인 현재 페이지부터 슬라이드 쇼를 바로 재생합니다.',
    tip: '처음부터 발표할 때는 그냥 F5, 특정 페이지만 빠르게 검토할 때는 Shift + F5를 누르세요.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['슬라이드 쇼', '발표', '프레젠테이션', '현재 슬라이드']
  },
  {
    id: 'ppt-06',
    category: 'ppt',
    subCategory: '슬라이드 쇼 & 발표',
    keys: ['B', '또는', 'W'],
    title: '발표 중 화면 암전(Black) / 백색(White)',
    description: '슬라이드 쇼 진행 중 청중의 시선을 발표자에게 집중시키기 위해 화면을 일시적으로 검게(B) 또는 하얗게(W) 가립니다.',
    tip: '아무 키나 다시 누르면 슬라이드가 즉시 원래 화면으로 돌아옵니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['화면 가리기', '암전', '발표 꿀팁', '시선 집중']
  },
  {
    id: 'ppt-07',
    category: 'ppt',
    subCategory: '슬라이드 쇼 & 발표',
    keys: ['Ctrl', 'P'],
    title: '쇼 중 펜(Pen) 모드로 전환',
    description: '발표 중에 마우스 커서를 형광펜/펜으로 변경하여 슬라이드 위에 자유롭게 판서나 밑줄을 그릴 수 있습니다.',
    tip: 'Ctrl + A는 다시 기본 화살표로 복귀, E를 누르면 화면에 그은 모든 잉크가 지워집니다.',
    tags: ['판서', '펜 도구', '밑줄', '슬라이드 쇼']
  },
  {
    id: 'ppt-08',
    category: 'ppt',
    subCategory: '글꼴 & 서식',
    keys: ['Ctrl', 'Shift', '> / <'],
    title: '선택 텍스트 글자 크기 1단계씩 키우기/줄이기',
    description: '폰트 크기 목록을 일일이 열지 않고 키보드로 텍스트 크기를 직관적으로 빠르게 조절합니다.',
    tip: 'Ctrl + [ 및 Ctrl + ] 키로도 1포인트씩 미세 조절이 가능합니다.',
    isEssential: true,
    tags: ['글자 크기', '폰트 크기', '텍스트 조절']
  },
  {
    id: 'ppt-09',
    category: 'ppt',
    subCategory: '슬라이드 관리',
    keys: ['Ctrl', 'M'],
    title: '새 슬라이드 삽입',
    description: '현재 슬라이드 바로 뒤에 새 빈 슬라이드를 추가합니다.',
    tags: ['새 슬라이드', '슬라이드 추가', '페이지 추가']
  },

  // ===================== 4. 워드 (Word) =====================
  {
    id: 'wd-01',
    category: 'word',
    subCategory: '서식 & 스타일',
    keys: ['Ctrl', 'Spacebar'],
    title: '글꼴 서식 초기화 (기본값 복원)',
    description: '인터넷이나 다른 문서에서 복사해 온 텍스트의 잡다한 글꼴, 크기, 색상을 워드의 기본 본문 스타일로 초기화합니다.',
    tip: '문단 서식까지 모두 초기화하려면 Ctrl + Q를 누르면 됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['서식 지우기', '글꼴 초기화', '기본 스타일', '복사 붙여넣기'],
    exampleScenario: '웹사이트에서 긁어온 텍스트가 엉뚱한 폰트와 크기로 붙었을 때 드래그하고 Ctrl+Space!'
  },
  {
    id: 'wd-02',
    category: 'word',
    subCategory: '단락 & 정렬',
    keys: ['Ctrl', 'E / L / R / J'],
    title: '단락 정렬 (가운데 / 왼쪽 / 오른쪽 / 양쪽)',
    description: '현재 문단을 가운데(E), 왼쪽(L), 오른쪽(R), 양쪽(J)으로 신속하게 맞춥니다.',
    tip: '가운데 정렬(E - Center)과 양쪽 정렬(J - Justify)은 보고서와 논문 작성 시 필수 단축키입니다.',
    isEssential: true,
    tags: ['정렬', '가운데 정렬', '양쪽 정렬', '단락 맞춤']
  },
  {
    id: 'wd-03',
    category: 'word',
    subCategory: '단락 & 줄간격',
    keys: ['Ctrl', '1 / 2 / 5'],
    title: '줄 간격 변경 (1배 / 2배 / 1.5배)',
    description: '선택된 문단의 줄 간격을 1줄(Ctrl+1), 2줄(Ctrl+2), 1.5줄(Ctrl+5)로 즉각 변경합니다.',
    tip: '표준 공문서나 보고서의 가독성 좋은 1.5배 줄간격은 Ctrl + 5로 1초 만에 맞출 수 있습니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['줄간격', '단락 간격', '가독성', '문서 서식']
  },
  {
    id: 'wd-04',
    category: 'word',
    subCategory: '페이지 관리',
    keys: ['Ctrl', 'Enter'],
    title: '페이지 나누기 (강제 쪽 넘김)',
    description: '엔터를 여러 번 쳐서 다음 장으로 넘기지 않고, 깔끔하게 다음 페이지 맨 첫 줄로 내용을 넘깁니다.',
    tip: '엔터 연타로 쪽을 넘기면 앞 내용이 수정될 때마다 다음 페이지 레이아웃이 밀리는 참사를 방지합니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['페이지 나누기', '쪽 나누기', '문서 레이아웃']
  },
  {
    id: 'wd-05',
    category: 'word',
    subCategory: '텍스트 편집',
    keys: ['Shift', 'F3'],
    title: '영문 대/소문자 일괄 변환',
    description: '선택한 영문 텍스트를 대문자(UPPER) → 소문자(lower) → 첫글자만 대문자(Title Case)로 순환 변환합니다.',
    tip: '영문 제목이나 약어를 잘못 입력했을 때 지우고 다시 쓸 필요 없이 변환할 수 있습니다.',
    isEssential: true,
    tags: ['대소문자', '영문 변환', '대문자', '소문자']
  },
  {
    id: 'wd-06',
    category: 'word',
    subCategory: '탐색 & 검토',
    keys: ['F7'],
    title: '맞춤법 및 문법 검사기 실행',
    description: '문서 전체의 맞춤법 오류, 띄어쓰기, 문맥 교정을 검토하는 창을 띄웁니다.',
    tags: ['맞춤법', '문법 검사', '교정', '검토']
  },
  {
    id: 'wd-07',
    category: 'word',
    subCategory: '텍스트 편집',
    keys: ['Ctrl', 'H'],
    title: '찾기 및 바꾸기 창 열기',
    description: '특정 단어나 서식을 문서 전체에서 찾아 다른 단어로 일괄 교체합니다.',
    tags: ['찾아 바꾸기', '일괄 수정', '단어 교체']
  },
  {
    id: 'wd-08',
    category: 'word',
    subCategory: '서식 & 스타일',
    keys: ['Ctrl', 'Shift', 'C / V'],
    title: '글자 및 문단 서식 복사 / 붙여넣기',
    description: '선택한 텍스트의 글꼴, 크기, 색상, 자간 등의 서식 스타일만 쏙 복사하여 다른 문단에 빠르게 바릅니다.',
    tip: 'Ctrl+Shift+C로 서식을 복사하고 원하는 문단을 드래그한 후 Ctrl+Shift+V를 누르면 됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['서식 복사', '스타일 복사', '디자인 통일', '워드 서식']
  },

  // ===================== 5. 한글 (HWP) =====================
  {
    id: 'hwp-01',
    category: 'hangul',
    subCategory: '서식 & 스타일',
    keys: ['Alt', 'C'],
    title: '모양 복사 (글자 & 문단 모양 복제)',
    description: '한글 문서 작업의 알파이자 오메가! 커서가 있는 곳의 글꼴, 크기, 문단 모양, 표 테두리 스타일을 복사하여 다른 곳에 그대로 적용합니다.',
    tip: '적용할 텍스트를 블록 지정하고 다시 Alt + C를 누르면 1초 만에 동일한 스타일로 바뀝니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['모양 복사', '한글 꿀팁', '문단 모양', '글자 모양', '스타일 복사'],
    exampleScenario: '제목 1의 글꼴/색상/여백 스타일을 문서 내 모든 소제목에 동일하게 일괄 적용할 때'
  },
  {
    id: 'hwp-02',
    category: 'hangul',
    subCategory: '표(Table) 편집',
    keys: ['F5'],
    title: '표 셀 블록 지정 (1회: 단일, 2회: 연속, 3회: 전체)',
    description: '표 안에서 F5를 누르는 횟수에 따라 셀 선택 상태가 달라집니다. (1회: 회색점 단일셀, 2회: 빨간점+화살표 범위선택, 3회: 표 전체선택)',
    tip: 'F5 1회 누른 후 방향키로 셀 이동 가능, F5 2회 후 방향키는 여러 셀 드래그 효과입니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['표', '셀 선택', '블록 지정', 'HWP 표']
  },
  {
    id: 'hwp-03',
    category: 'hangul',
    subCategory: '표(Table) 편집',
    keys: ['M'],
    title: '표 셀 합치기 (Merge)',
    description: '여러 셀을 블록(F5 2회 후 드래그)으로 선택한 상태에서 M을 누르면 하나의 셀로 깔끔하게 병합됩니다.',
    tip: 'Merge의 M! 마우스 우클릭보다 10배 빠릅니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['셀 합치기', '병합', '표 편집', 'Merge']
  },
  {
    id: 'hwp-04',
    category: 'hangul',
    subCategory: '표(Table) 편집',
    keys: ['S'],
    title: '표 셀 나누기 (Split)',
    description: '선택한 셀을 가로(줄) 또는 세로(칸)로 원하는 개수만큼 분할합니다.',
    tip: 'Split의 S! 줄/칸 수를 입력하는 창이 즉시 열립니다.',
    isEssential: true,
    tags: ['셀 나누기', '분할', '표 편집', 'Split']
  },
  {
    id: 'hwp-05',
    category: 'hangul',
    subCategory: '표(Table) 편집',
    keys: ['W', '또는', 'H'],
    title: '표 셀 너비(W) / 높이(H) 같게 정렬',
    description: '들쭉날쭉해진 여러 셀의 너비를 동일하게(Width의 W), 높이를 동일하게(Height의 H) 균등 분할합니다.',
    tip: '표 블록을 잡고 W 한번, H 한번 누르면 완벽히 균형 잡힌 표가 완성됩니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['셀 너비 같게', '셀 높이 같게', '표 균등 정렬', '너비 맞춤']
  },
  {
    id: 'hwp-06',
    category: 'hangul',
    subCategory: '표(Table) 편집',
    keys: ['Ctrl', '방향키 / Shift + 방향키'],
    title: '표 크기 및 셀 너비/높이 조절',
    description: 'F5 블록 지정 상태에서 Ctrl+방향키는 표 전체 크기를 바꾸며, Shift+방향키는 현재 선택된 셀만 단독으로 크기를 조절합니다.',
    tip: 'Alt + 방향키는 인접한 셀과 함께 자연스럽게 너비를 조절합니다.',
    isEssential: true,
    tags: ['표 크기 조절', '셀 너비', '셀 높이', '표 다듬기']
  },
  {
    id: 'hwp-07',
    category: 'hangul',
    subCategory: '자간 & 장평 & 글자',
    keys: ['Alt', 'Shift', 'J / K'],
    title: '장평/자간 좁게(J) / 넓게(K)',
    description: '글자 사이의 간격(자간 및 장평)을 1%씩 좁히거나(J) 넓힙니다(K).',
    tip: '한 줄 끝에서 글자 한두 개가 다음 줄로 애매하게 넘어갔을 때, 블록 잡고 Alt+Shift+J를 2~3번 누르면 딱 한 줄로 들어옵니다!',
    isEssential: true,
    defaultHighlight: true,
    tags: ['자간 조절', '장평 조절', '글자 간격', '한 줄 맞춤', '문서 편집'],
    exampleScenario: '문단 마지막 줄에 단어 하나만 외롭게 떨어졌을 때 자간/장평을 좁혀 깔끔하게 맞출 때'
  },
  {
    id: 'hwp-08',
    category: 'hangul',
    subCategory: '자간 & 장평 & 글자',
    keys: ['Ctrl', '[ / ]'],
    title: '글자 크기 키우기([) / 줄이기(])',
    description: '블록 지정된 텍스트의 크기를 1포인트씩 신속하게 확대([)하거나 축소(])합니다.',
    tip: '글자 크기를 마우스 툴바에서 선택하지 않고 타이핑 리듬을 유지하며 조절할 수 있습니다.',
    isEssential: true,
    tags: ['글자 크기', '폰트 크기', '확대', '축소']
  },
  {
    id: 'hwp-10',
    category: 'hangul',
    subCategory: '페이지 & 조판',
    keys: ['F7'],
    title: '편집 용지 설정 대화상자',
    description: '용지 종류(A4/A3), 여백(위, 아래, 좌, 우, 머리말, 꼬리말), 용지 방향(가로/세로)을 설정하는 창을 띄웁니다.',
    tip: '공문서나 보고서 작업 시작 전 가장 먼저 누르는 필수 단축키!',
    isEssential: true,
    defaultHighlight: true,
    tags: ['편집 용지', '용지 여백', 'A4 설정', '문서 레이아웃']
  },
  {
    id: 'hwp-11',
    category: 'hangul',
    subCategory: '페이지 & 조판',
    keys: ['Ctrl', 'N, T'],
    title: '표 만들기 대화상자 (Table)',
    description: '줄 수와 칸 수를 지정하여 새로운 표를 생성하는 창을 띄웁니다.',
    tip: 'Ctrl 키를 누른 상태에서 N을 누르고 손을 뗀 다음 바로 T를 누르는 연계 단축키입니다.',
    tags: ['표 만들기', '테이블 삽입', '새 표']
  },
  {
    id: 'hwp-12',
    category: 'hangul',
    subCategory: '개체 & 삽입',
    keys: ['Ctrl', 'N, I'],
    title: '그림 넣기 대화상자 (Image)',
    description: '문서 내에 이미지 및 사진 파일을 불러와 원하는 위치에 삽입합니다.',
    tip: '그림을 삽입한 후 P(개체 속성)를 눌러 [글자처럼 취급]을 체크하면 레이아웃이 흐트러지지 않습니다.',
    tags: ['그림 넣기', '이미지 삽입', '사진 추가', '개체 삽입']
  },
  {
    id: 'hwp-13',
    category: 'hangul',
    subCategory: '자간 & 장평 & 글자',
    keys: ['Alt', 'Shift', 'B / U / S'],
    title: '글자 굵게(B) / 밑줄(U) / 취소선(S)',
    description: '텍스트에 굵은 글씨(Bold), 밑줄(Underline), 취소선(Strike)을 빠르게 지정합니다.',
    tags: ['굵게', '밑줄', '취소선', '글자 스타일']
  },
  {
    id: 'hwp-14',
    category: 'hangul',
    subCategory: '기호 & 특수문자',
    keys: ['Ctrl', 'F10'],
    title: '문자표 (특수기호 목록)',
    description: '한글 전각 기호, 로마 숫자, 단위 기호, 원 문자(①, ㉠) 등을 선택할 수 있는 문자표를 엽니다.',
    tip: '문자표에서 최근 사용한 기호는 상단에 바로 뜨므로 재사용이 매우 편리합니다.',
    isEssential: true,
    tags: ['문자표', '특수문자']
  },

  // ===================== 6. 크롬 브라우저 (Chrome) =====================
  {
    id: 'chr-01',
    category: 'chrome',
    subCategory: '탭 관리',
    keys: ['Ctrl', 'T'],
    title: '새 탭 열기 (New Tab)',
    description: '새로운 웹 브라우징 탭을 즉시 생성하여 포커스를 이동합니다.',
    tip: '새 탭이 열리자마자 검색어나 URL을 바로 타이핑할 수 있어 마우스 클릭이 필요 없습니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['새 탭', '브라우징', '검색', '웹서핑'],
    macAlternative: 'Cmd + T',
    exampleScenario: '작업 중인 페이지를 유지한 채 새로운 자료를 추가로 검색하고 싶을 때'
  },
  {
    id: 'chr-02',
    category: 'chrome',
    subCategory: '탭 관리',
    keys: ['Ctrl', 'W'],
    title: '현재 탭 닫기 (Close Tab)',
    description: '현재 보고 있는 탭을 즉시 닫습니다. (Ctrl+F4와 동일한 동작)',
    tip: '마우스로 탭 상단의 작은 X 버튼을 맞추느라 고생할 필요 없이 왼손 단축키로 신속 종료할 수 있습니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['탭 닫기', '창 정리', '종료'],
    macAlternative: 'Cmd + W',
    exampleScenario: '자료 확인이 끝난 탭들을 신속하게 하나씩 정리하고 싶을 때'
  },
  {
    id: 'chr-03',
    category: 'chrome',
    subCategory: '탭 관리',
    keys: ['Ctrl', 'Shift', 'T'],
    title: '닫은 탭 다시 복구하기 (Reopen Closed Tab)',
    description: '실수로 닫은 웹 탭을 닫기 직전의 스크롤 위치 및 작성 기록과 함께 즉시 다시 엽니다.',
    tip: '크롬은 최근 닫았던 탭을 순서대로 최대 10개 이상 기억하므로 연타하면 계속 이전 탭들이 되살아납니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['탭 복구', '실수 복구', '히스토리', '되살리기'],
    macAlternative: 'Cmd + Shift + T',
    exampleScenario: '보고서 작성 중 실수로 중요한 참고 자료 탭을 닫아버렸을 때 당황하지 않고 즉시 복구!'
  },
  {
    id: 'chr-04',
    category: 'chrome',
    subCategory: '탭 전환 & 이동',
    keys: ['Ctrl', '1 ~ 8'],
    title: '1번째~8번째 탭으로 번호 이동',
    description: '좌측 첫 번째(Ctrl+1)부터 8번째(Ctrl+8) 탭까지 원하는 위치의 탭으로 0.1초 만에 직접 점프합니다.',
    tip: '사내 메신저를 1번, 메일을 2번, 캘린더를 3번에 고정해두고 숫자 키로 원터치 전환하면 생산성이 극대화됩니다.',
    isEssential: true,
    tags: ['탭 이동', '원터치 전환', '숫자 점프'],
    macAlternative: 'Cmd + 1 ~ 8',
    exampleScenario: '수십 개 탭 중 자주 확인하는 첫 번째 탭(포털/메일)으로 단번에 돌아가고 싶을 때'
  },
  {
    id: 'chr-05',
    category: 'chrome',
    subCategory: '탭 전환 & 이동',
    keys: ['Ctrl', '9'],
    title: '맨 마지막(오른쪽 끝) 탭으로 이동',
    description: '탭이 몇 개 열려 있든 상관없이 가장 오른쪽 끝에 위치한 마지막 탭으로 즉시 전환합니다.',
    tip: '가장 최근에 열어둔 최신 작업 탭으로 바로 이동할 때 가장 빠릅니다.',
    tags: ['마지막 탭', '끝으로 이동', '우측 탭'],
    macAlternative: 'Cmd + 9'
  },
  {
    id: 'chr-06',
    category: 'chrome',
    subCategory: '탭 전환 & 이동',
    keys: ['Ctrl', 'Tab'],
    title: '오른쪽 다음 탭으로 이동',
    description: '열려 있는 탭 목록을 왼쪽에서 오른쪽 방향으로 순차적으로 하나씩 전환합니다. (Ctrl+PgDn과 동일)',
    tip: 'Ctrl 키를 누른 상태에서 Tab 키를 톡톡 누르면 마치 Alt+Tab처럼 탭들을 차례로 둘러볼 수 있습니다.',
    isEssential: true,
    tags: ['다음 탭', '오른쪽 이동', '탭 순회'],
    macAlternative: 'Cmd + Option + →'
  },
  {
    id: 'chr-07',
    category: 'chrome',
    subCategory: '탭 전환 & 이동',
    keys: ['Ctrl', 'Shift', 'Tab'],
    title: '왼쪽 이전 탭으로 이동',
    description: '열려 있는 탭 목록을 오른쪽에서 왼쪽 역방향으로 순차 전환합니다. (Ctrl+PgUp과 동일)',
    tip: 'Ctrl+Tab으로 지나친 바로 이전 탭으로 되돌아가고 싶을 때 편리합니다.',
    tags: ['이전 탭', '왼쪽 이동', '역방향 순회'],
    macAlternative: 'Cmd + Option + ←'
  },
  {
    id: 'chr-08',
    category: 'chrome',
    subCategory: '창 & 시크릿 모드',
    keys: ['Ctrl', 'N'],
    title: '새 창 열기 (New Window)',
    description: '현재 창과 완전히 분리된 새로운 독립 브라우저 창을 엽니다.',
    tip: '모니터가 2개 이상일 때 새 창을 띄워 보조 모니터로 드래그 분리할 때 유용합니다.',
    tags: ['새 창', '윈도우 생성', '독립 창'],
    macAlternative: 'Cmd + N'
  },
  {
    id: 'chr-09',
    category: 'chrome',
    subCategory: '창 & 시크릿 모드',
    keys: ['Ctrl', 'Shift', 'N'],
    title: '시크릿 모드로 새 창 열기 (Incognito)',
    description: '방문 기록, 쿠키, 사이트 데이터가 컴퓨터에 남지 않는 안전한 프라이빗 창을 엽니다.',
    tip: '공용 PC에서 로그인하거나, 캐시 간섭 없는 순수 웹사이트 화면 테스트, 다중 계정 로그인 시 필수입니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['시크릿 모드', '개인정보 보호', '쿠키 미저장', '다중 계정'],
    macAlternative: 'Cmd + Shift + N',
    exampleScenario: '회사 공용 회의실 PC에서 개인 계정 로그인 후 흔적을 남기지 않고 싶을 때'
  },
  {
    id: 'chr-10',
    category: 'chrome',
    subCategory: '주소창 & 검색',
    keys: ['Ctrl', 'L'],
    title: '주소창으로 커서 이동 및 URL 전체 선택',
    description: '마우스 없이 주소창(Omnibox)으로 즉시 포커스를 이동하고 현재 URL을 전체 선택합니다. (F6 / Alt+D와 동일)',
    tip: 'Ctrl+L을 누르고 바로 Ctrl+C를 누르면 1초 만에 현재 페이지 링크를 클립보드에 복사할 수 있습니다.',
    isEssential: true,
    defaultHighlight: true,
    tags: ['주소창', 'URL 복사', '검색창 포커스', 'Omnibox'],
    macAlternative: 'Cmd + L',
    exampleScenario: '현재 보고 있는 웹페이지 URL을 슬랙이나 카카오톡 메신저로 1초 만에 복사해 보낼 때'
  },
  {
    id: 'chr-11',
    category: 'chrome',
    subCategory: '주소창 & 검색',
    keys: ['Ctrl', 'K'],
    title: '주소창에서 즉시 Google 검색 시작',
    description: '주소창에 물음표(?) 모드가 켜지며 기본 검색엔진 키워드 검색 모드로 즉시 진입합니다. (Ctrl+E와 동일)',
    tip: 'URL 형식이 아닌 단순 검색어를 입력할 때 오작동 없이 바로 포털 검색 결과를 띄워줍니다.',
    tags: ['키워드 검색', '구글 검색', '주소창 검색'],
    macAlternative: 'Cmd + K / Cmd + E'
  },
  {
    id: 'chr-12',
    category: 'chrome',
    subCategory: '페이지 탐색 & 새로고침',
    keys: ['Ctrl', 'Shift', 'R'],
    title: '캐시 무시 강력 새로고침 (Hard Reload)',
    description: '브라우저에 저장된 이전 웹 캐시(이미지, CSS, 스크립트)를 무시하고 서버의 최신 원본을 강제로 불러옵니다.',
    tip: '웹사이트 업데이트 내용이 화면에 반영되지 않거나 오류가 날 때 F5 대신 누르면 즉시 해결됩니다. (Ctrl+F5 동일)',
    isEssential: true,
    defaultHighlight: true,
    tags: ['강력 새로고침', '캐시 삭제', 'Hard Reload', '웹 개발'],
    macAlternative: 'Cmd + Shift + R',
    exampleScenario: '웹사이트나 사내 인트라넷이 수정 배포되었는데 화면이 이전 버전으로 멈춰 보일 때'
  },
  {
    id: 'chr-13',
    category: 'chrome',
    subCategory: '히스토리 & 다운로드',
    keys: ['Ctrl', 'H'],
    title: '인터넷 방문 기록(히스토리) 열기',
    description: '과거에 방문했던 모든 웹페이지의 날짜별 기록을 새 탭에서 열고 검색할 수 있습니다.',
    tip: '상단 검색창에 키워드를 치면 며칠 전 보았던 블로그나 기사 제목을 단번에 찾을 수 있습니다.',
    tags: ['방문 기록', '히스토리', '과거 페이지 검색'],
    macAlternative: 'Cmd + Y'
  },
  {
    id: 'chr-14',
    category: 'chrome',
    subCategory: '히스토리 & 다운로드',
    keys: ['Ctrl', 'J'],
    title: '다운로드 목록 페이지 열기',
    description: '최근에 다운로드한 파일 목록, 다운로드 진행 상황 및 파일 저장 위치를 확인하는 창을 엽니다.',
    tip: '방금 다운로드한 PDF나 설치 파일의 위치를 찾지 못할 때 누르면 바로 파일 열기/폴더 열기가 가능합니다.',
    isEssential: true,
    tags: ['다운로드', '파일 목록', '폴더 열기'],
    macAlternative: 'Cmd + Shift + J'
  },
  {
    id: 'chr-15',
    category: 'chrome',
    subCategory: '북마크 & 저장',
    keys: ['Ctrl', 'D'],
    title: '현재 웹페이지 북마크(즐겨찾기) 추가',
    description: '현재 보고 있는 페이지를 북마크 바나 지정 폴더에 원터치로 등록하는 팝업을 엽니다.',
    tip: '팝업이 뜨면 Enter 키를 누르면 기본 북마크 폴더에 즉시 저장됩니다. (모든 탭 일괄 북마크는 Ctrl+Shift+D)',
    isEssential: true,
    tags: ['북마크', '즐겨찾기', '페이지 저장'],
    macAlternative: 'Cmd + D'
  },
  {
    id: 'chr-16',
    category: 'chrome',
    subCategory: '화면 배율 & 보기',
    keys: ['Ctrl', '0'],
    title: '화면 확대/축소 배율 100% 리셋',
    description: 'Ctrl+마우스 휠이나 Ctrl+Plus/Minus로 확대/축소되었던 페이지 배율을 기본 정비율(100%)로 초기화합니다.',
    tip: '웹페이지 글자가 너무 커지거나 어색하게 작아졌을 때 원키로 표준 화면을 되찾을 수 있습니다.',
    tags: ['배율 리셋', '100% 화면', '화면 확대축소 초기화'],
    macAlternative: 'Cmd + 0'
  },
  {
    id: 'chr-17',
    category: 'chrome',
    subCategory: '페이지 탐색 & 조작',
    keys: ['Alt', '← / →'],
    title: '이전 페이지(뒤로) / 다음 페이지(앞으로)',
    description: '웹서핑 중 뒤로 가기(Alt+왼쪽 방향키) 또는 앞으로 가기(Alt+오른쪽 방향키)를 실행합니다.',
    tip: '마우스 뒤로가기 버튼이 없는 키보드 환경에서 마우스 손 이동 없이 고속 탐색이 가능합니다.',
    tags: ['뒤로가기', '앞으로가기', '페이지 이동'],
    macAlternative: 'Cmd + [ / Cmd + ]'
  },
  {
    id: 'chr-18',
    category: 'chrome',
    subCategory: '개발 & 소스 보기',
    keys: ['Ctrl', 'Shift', 'I'],
    title: '개발자 도구 (Chrome DevTools)',
    description: 'HTML/CSS 요소 검사, 콘솔(Console) 에러 확인, 네트워크 트래픽을 분석하는 개발자 콘솔을 엽니다. (F12 동일)',
    tip: '디자인 레이아웃 확인, 웹 폰트 점검, 스크립트 디버깅 시 웹 개발자와 퍼블리셔의 필수 도구입니다.',
    tags: ['개발자 도구', 'DevTools', 'F12', 'HTML 검사', '콘솔'],
    macAlternative: 'Cmd + Option + I'
  }
];

export const SCENARIO_PACKS: ScenarioPack[] = [
  {
    id: 'rookie-exit',
    title: '신입사원 칼퇴 보장 팩',
    subtitle: '업무 속도를 2배로 올려 퇴근 시간을 앞당기는 직장인 필수 단축키 코스',
    badge: '🚀 칼퇴 보장',
    iconName: 'Rocket',
    emoji: '🚀',
    accentColor: 'blue',
    targetAudience: '인턴, 신입사원, 기본 윈도우 작업 속도를 획기적으로 개선하고 싶은 직장인',
    estimatedTimeSaved: '매일 40분 이상',
    description: '자료 조사와 문서 작성 간 창 전환, 다중 클립보드 활용, 실수로 닫은 브라우저 탭 복구, 자리비움 잠금 등 신입사원의 멘탈과 손목을 지켜주는 핵심 키 모음입니다.',
    workflowSteps: [
      {
        step: 1,
        title: '듀얼 작업 뷰 구성',
        shortcutId: 'win-04',
        actionDescription: '왼쪽엔 참고 웹브라우저, 오른쪽엔 보고서 창을 Win+방향키로 5:5 완벽 분할'
      },
      {
        step: 2,
        title: '다중 텍스트 한 번에 복사',
        shortcutId: 'win-01',
        actionDescription: '자료 조사 시 매번 창을 오가지 않고 여러 텍스트를 연달아 복사한 뒤 Win+V로 골라 붙여넣기'
      },
      {
        step: 3,
        title: '초스피드 영역 캡처',
        shortcutId: 'win-02',
        actionDescription: '참고 이미지나 오류 화면을 Win+Shift+S로 드래그 캡처 후 Ctrl+V로 메신저/슬라이드에 전송'
      },
      {
        step: 4,
        title: '실수로 닫은 웹 탭 복구',
        shortcutId: 'chr-03',
        actionDescription: '조사 중 실수로 닫은 탭을 당황하지 않고 Ctrl+Shift+T로 1초 만에 즉시 복구'
      },
      {
        step: 5,
        title: '자리 비움 시 원클릭 잠금',
        shortcutId: 'win-08',
        actionDescription: '회의나 점심시간 자리에서 일어날 때 Win+L로 1초 만에 회사 보안 준수'
      }
    ],
    shortcutIds: ['win-04', 'win-01', 'win-02', 'chr-03', 'win-08', 'win-03', 'win-12', 'chr-01', 'chr-10'],
    keyTakeaways: [
      '마우스 클릭 횟수를 70% 이상 줄여 손목 피로도 대폭 경감',
      '창 분할과 다중 클립보드로 자료 조사 및 취합 시간 절반 단축',
      '자리비움 화면 잠금으로 직장 내 정보보안 에티켓 자동 완성'
    ]
  },
  {
    id: 'data-master',
    title: '데이터 분석 & 엑셀 마스터 팩',
    subtitle: '수만 행의 방대한 데이터도 1초 만에 가공하고 집계하는 실무 엑셀러 팩',
    badge: '📊 데이터 가공',
    iconName: 'Table',
    emoji: '📊',
    accentColor: 'emerald',
    targetAudience: '경영지원, 마케터, 회계/재무, 기획자 및 엑셀 대용량 데이터를 다루는 모든 실무자',
    estimatedTimeSaved: '매일 1시간 이상',
    description: 'VLOOKUP 필수 절대참조($), 자동 SUM 합계, 수천 행 맨 끝으로 점프 선택, 셀 내 줄바꿈, 피벗 테이블 생성 등 마우스 없이 키보드만으로 스프레드시트를 장악하는 코스입니다.',
    workflowSteps: [
      {
        step: 1,
        title: '대용량 데이터 범위 원터치 선택',
        shortcutId: 'xl-07',
        actionDescription: '수천 줄의 행을 마우스 드래그 대신 Ctrl+Shift+방향키로 0.1초 만에 블록 지정'
      },
      {
        step: 2,
        title: '수식 참조 범위 고정',
        shortcutId: 'xl-01',
        actionDescription: '수식 작성 시 F4를 눌러 $A$1 절대참조로 변환 및 동일 작업 반복 실행'
      },
      {
        step: 3,
        title: '행·열 합계 1초 계산',
        shortcutId: 'xl-05',
        actionDescription: '데이터 영역과 합계 셀을 잡고 Alt+= 누르면 SUM 수식이 자동으로 일괄 생성'
      },
      {
        step: 4,
        title: '셀 내 줄바꿈 및 서식 정리',
        shortcutId: 'xl-02',
        actionDescription: '셀 안에서 깔끔하게 설명 줄바꿈(Alt+Enter) 및 Ctrl+1로 표시 형식/테두리 완성'
      },
      {
        step: 5,
        title: '피벗 테이블 및 필터링',
        shortcutId: 'xl-13',
        actionDescription: 'Alt+N,V로 피벗 테이블을 즉시 삽입하고 Ctrl+Shift+L로 자동 필터 적용'
      }
    ],
    shortcutIds: ['xl-07', 'xl-01', 'xl-05', 'xl-02', 'xl-10', 'xl-13', 'xl-04', 'xl-06', 'xl-12'],
    keyTakeaways: [
      '스크롤 지옥 탈출: 10만 행 데이터도 Ctrl+방향키로 0.1초 만에 점프',
      'F4 절대참조와 Alt+= 자동 합계로 단순 반복 계산 수작업 제로화',
      'Ctrl+D 및 Ctrl+Enter로 대량 셀 동일값/수식 연속 채우기 마스터'
    ]
  },
  {
    id: 'report-expert',
    title: '보고서·기획서 10분 완성 팩',
    subtitle: '한글(HWP)과 워드(Word)의 서식·표·자간을 완벽히 다듬는 공문서 전문가 팩',
    badge: '📑 문서 완성',
    iconName: 'FileText',
    emoji: '📑',
    accentColor: 'indigo',
    targetAudience: '기획서, 품의서, 공문서, 제안서, 학술 논문 작성이 잦은 직장인 및 공공기관 실무자',
    estimatedTimeSaved: '문서당 30분 단축',
    description: '한글의 모양 복사(Alt+C)와 표 셀 편집, 자간 좁히기(Alt+Shift+N)부터 워드의 서식 초기화 및 1.5배 줄간격까지 완벽한 문서 레이아웃을 완성합니다.',
    workflowSteps: [
      {
        step: 1,
        title: '공문서 표준 용지 여백 설정',
        shortcutId: 'hwp-10',
        actionDescription: '문서 작성 전 F7을 눌러 A4 여백(위, 아래, 좌, 우)을 신속하게 세팅'
      },
      {
        step: 2,
        title: '제목/본문 스타일 일괄 복사',
        shortcutId: 'hwp-01',
        actionDescription: '원하는 소제목 서식을 Alt+C로 복사한 뒤 모든 문단에 1초 만에 바르기'
      },
      {
        step: 3,
        title: '표 셀 균등 정렬 & 병합',
        shortcutId: 'hwp-05',
        actionDescription: '표 블록 지정 후 M(합치기), W(너비 균등), H(높이 균등)로 5초 만에 깔끔한 표 완성'
      },
      {
        step: 4,
        title: '애매하게 넘친 글자 한 줄 맞춤',
        shortcutId: 'hwp-07',
        actionDescription: '문단 끝 한두 글자가 다음 줄로 넘어갔을 때 Alt+Shift+J로 자간/장평을 줄여 딱 한 줄로 정렬'
      },
      {
        step: 5,
        title: '워드 서식 초기화 & 줄간격',
        shortcutId: 'wd-01',
        actionDescription: '외부 텍스트 붙여넣기 후 Ctrl+Spacebar로 서식 초기화 및 Ctrl+5로 표준 1.5배 줄간격'
      }
    ],
    shortcutIds: ['hwp-01', 'hwp-02', 'hwp-03', 'hwp-05', 'hwp-07', 'hwp-10', 'wd-01', 'wd-03', 'wd-04', 'wd-08'],
    keyTakeaways: [
      '외부 복사 텍스트의 엉뚱한 폰트와 서식을 원클릭(Ctrl+Spacebar)으로 리셋',
      '한글 Alt+C(모양 복사)로 100페이지 문서도 일관된 제목 스타일 유지',
      '자간/장평 조절(Alt+Shift+J/K)로 다음 장으로 삐져나온 단어 한 줄 맞춤 해결'
    ]
  },
  {
    id: 'presentation-ace',
    title: '프레젠테이션 & 발표 마스터 팩',
    subtitle: '슬라이드 제작 속도를 높이고 무대 위 발표를 완벽하게 장악하는 PPT 팩',
    badge: '🎨 발표·제안서',
    iconName: 'Presentation',
    emoji: '🎨',
    accentColor: 'orange',
    targetAudience: '제안서 작성자, 발표자, 강사, 디자인 통일성을 갖춘 슬라이드를 빠르게 만들고 싶은 실무자',
    estimatedTimeSaved: '슬라이드당 15분 단축',
    description: '개체 등간격 스마트 복제(Ctrl+D), 서식 스포이트 복사(Ctrl+Shift+C/V), 현재 슬라이드 쇼(Shift+F5), 발표 중 화면 암전(B)과 펜 판서 모드를 총망라했습니다.',
    workflowSteps: [
      {
        step: 1,
        title: '카드/도형 등간격 스마트 복제',
        shortcutId: 'ppt-01',
        actionDescription: '도형을 선택하고 Ctrl+D로 복제 후 간격만 잡아두면 다음 Ctrl+D로 무한 균등 복제'
      },
      {
        step: 2,
        title: '도형·텍스트 디자인 스타일 통일',
        shortcutId: 'ppt-02',
        actionDescription: '완성된 박스의 서식을 Ctrl+Shift+C로 복사하고 다른 개체들에 Ctrl+Shift+V로 일괄 적용'
      },
      {
        step: 3,
        title: '개체 묶기 & 정비율 드래그',
        shortcutId: 'ppt-03',
        actionDescription: 'Shift+드래그로 비례 유지 후 Ctrl+G로 그룹화하여 레이아웃 흐트러짐 방지'
      },
      {
        step: 4,
        title: '현재 작업 슬라이드 즉시 재생',
        shortcutId: 'ppt-05',
        actionDescription: '처음 1페이지가 아닌 내가 작업 중인 슬라이드부터 Shift+F5로 즉시 발표 검토'
      },
      {
        step: 5,
        title: '발표 중 시선 집중 & 펜 판서',
        shortcutId: 'ppt-06',
        actionDescription: '발표 도중 청중의 시선을 끌기 위해 B(화면 암전)를 누르고 Ctrl+P로 펜 밑줄 판서'
      }
    ],
    shortcutIds: ['ppt-01', 'ppt-02', 'ppt-03', 'ppt-04', 'ppt-05', 'ppt-06', 'ppt-07', 'ppt-08'],
    keyTakeaways: [
      'Ctrl+D(등간격 복제)와 서식 복사로 슬라이드 템플릿 제작 시간 70% 절감',
      'Shift+F5와 화면 가리기(B/W)로 리허설 및 실제 발표 현장에서 프로페셔널한 제어',
      'Ctrl+P 펜 모드로 핵심 지표를 라이브로 강조'
    ]
  },
  {
    id: 'multitask-power',
    title: '멀티태스킹 & OS 신속 제어 팩',
    subtitle: '수많은 창과 앱을 자유자재로 넘나들며 시스템을 쾌적하게 유지하는 파워유저 팩',
    badge: '⚡ 작업 전환',
    iconName: 'Cpu',
    emoji: '⚡',
    accentColor: 'purple',
    targetAudience: '동시에 수십 개의 창을 띄워두고 작업하는 개발자, 기획자, 멀티태스커',
    estimatedTimeSaved: '매일 30분 이상',
    description: '작업 관리자 다이렉트 호출, 작업표시줄 번호별 원터치 전환, 가상 데스크톱 분리, 특수문자/이모지 팝업으로 작업 흐름이 끊기지 않는 쾌적한 환경을 구축합니다.',
    workflowSteps: [
      {
        step: 1,
        title: '작업표시줄 1번~9번 앱 원터치 실행',
        shortcutId: 'win-11',
        actionDescription: '자주 쓰는 크롬, 엑셀, 슬랙을 Win+1, Win+2, Win+3으로 0.1초 만에 전환'
      },
      {
        step: 2,
        title: '프로젝트별 가상 데스크톱 분리',
        shortcutId: 'win-06',
        actionDescription: 'Win+Tab으로 업무용 화면과 개인용/참고자료 화면을 분리하여 집중력 극대화'
      },
      {
        step: 3,
        title: '응답 없는 앱 1초 강제 종료',
        shortcutId: 'win-10',
        actionDescription: '프로그램 멈춤 시 Ctrl+Shift+Esc로 작업 관리자를 다이렉트로 열어 해결'
      },
      {
        step: 4,
        title: '어디서나 이모지 & 단위 기호 입력',
        shortcutId: 'win-09',
        actionDescription: 'Win+. 으로 보고서 및 메신저에 ℃, ±, ★, №, 😊 를 손쉽게 삽입'
      },
      {
        step: 5,
        title: '바탕화면 복귀 & 파일 탐색기',
        shortcutId: 'win-03',
        actionDescription: '창이 어지러울 때 Win+D로 바탕화면 즉시 정리 및 Win+E로 새 폴더 열기'
      }
    ],
    shortcutIds: ['win-11', 'win-06', 'win-10', 'win-09', 'win-03', 'win-07', 'win-05', 'win-13'],
    keyTakeaways: [
      'Alt+Tab 연타 대신 Win+숫자로 원하는 핵심 프로그램으로 다이렉트 이동',
      'Ctrl+Shift+Esc로 윈도우 파란 화면 지연 없이 작업 관리자 즉시 호출',
      '가상 데스크톱으로 멀티모니터 없이도 3개의 독립 작업 공간 구축'
    ]
  }
];
