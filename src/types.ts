export type CategoryId = 'all' | 'windows' | 'excel' | 'ppt' | 'word' | 'hangul' | 'chrome';

export type HighlighterColor = 'yellow' | 'green' | 'pink' | 'blue' | 'orange';

export interface ShortcutItem {
  id: string;
  category: 'windows' | 'excel' | 'ppt' | 'word' | 'hangul' | 'chrome';
  subCategory: string;
  keys: string[];
  title: string;
  description: string;
  tip?: string;
  isEssential?: boolean;
  defaultHighlight?: boolean;
  tags: string[];
  macAlternative?: string;
  exampleScenario?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface UserHighlightMap {
  [shortcutId: string]: HighlighterColor;
}

export type ViewMode = 'catalog' | 'scenario' | 'flashcard' | 'quiz' | 'typing' | 'keyboard' | 'cheatsheet';

export interface ScenarioPack {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  emoji: string;
  accentColor: 'blue' | 'emerald' | 'indigo' | 'orange' | 'purple' | 'amber';
  targetAudience: string;
  estimatedTimeSaved: string;
  description: string;
  workflowSteps: {
    step: number;
    title: string;
    shortcutId: string;
    actionDescription: string;
  }[];
  shortcutIds: string[];
  keyTakeaways: string[];
}
