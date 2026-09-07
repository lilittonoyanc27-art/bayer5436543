export interface OptionItem {
  id: string; // 'A' | 'B' | 'C' | 'D'
  hy: string;
  es: string;
}

export interface Question {
  id: number;
  categoryNumber: number;
  categoryTitleHy: string;
  categoryTitleEs: string;
  categoryTitleRu: string;
  questionHy: string;
  questionEs: string;
  options: OptionItem[];
  correctOptionId: string; // 'A'
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedOptionId: string | null;
  isAnswered: boolean;
  score: number;
  wrongCount: number;
  showQuestionArmenian: boolean;
  revealedOptionArmenian: Record<string, boolean>; // optionId -> boolean
  selectedCategory: number | null; // null for all 100
  history: {
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
}
