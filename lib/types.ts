export type Lang = "th" | "en";

export interface Localized {
  th: string;
  en: string;
}

export interface DemoStep {
  /** command typed at the prompt (omit for pure output lines) */
  cmd?: string;
  /** program output shown after the command */
  out?: string;
  /** optional comment line (rendered dim) */
  comment?: string;
}

export interface Demo {
  title: Localized;
  prompt?: string;
  steps: DemoStep[];
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  /** short one-liner shown on the card */
  tagline: Localized;
  /** longer description on the detail page */
  description: Localized;
  /** why-it-matters / when to use, written by us (not just official blurb) */
  notes?: Localized;
  official?: string;
  repo?: string;
  install?: string[];
  usage?: { cmd: string; desc: Localized }[];
  cheatsheet?: string[];
  demo?: Demo;
  tags: string[];
  difficulty: 1 | 2 | 3;
  platforms?: string[];
  /** installed locally on this machine already */
  installed?: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: Localized;
  icon: string;
  blurb: Localized;
  color: string;
}
