/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = string;

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'gap-fill' | 'true-false' | 'matching';
  questionText: string;
  options?: string[]; // for multiple-choice or selectable items
  correctAnswer: any; // string, boolean, or array for matching
  points: number;
  explanation: string;
  visualCode?: string; // Optional indicator for specialized diagrams
  pairs?: { left: string; right: string }[]; // Specific for matching
}

export type LessonCategory = string;

export interface LessonNode {
  id: number;
  title: string;
  description: string;
  category: LessonCategory;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface UserProfile {
  name: string;
  role: Role;
  goal: 'easy' | 'normal' | 'hard';
  streak: number;
  xp: number;
  hearts: number;
  completedLessons: number[]; // Array of completed lesson IDs
  lastActiveDate?: string;
  certificateClaimed: boolean;
  scoreCard: {
    correct: number;
    wrong: number;
  };
}

export interface LeaderboardUser {
  name: string;
  role: Role;
  xp: number;
  isSelf?: boolean;
  avatarSeed: number;
  streak: number;
}
