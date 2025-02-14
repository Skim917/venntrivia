// types.ts
export interface Question {
    text: string;
    correctAnswer: string;
    alternateAnswers: string;
    multipleChoice?: string[];
    correctMultipleChoiceIndex?: number;
    explanation: string;
    circle1Text?: string;
    circle2Text?: string;
    circle3Text?: string;
  }
  
  export interface GameData {
    date: string;
    questions: Question[];
  }
  
  export interface GameProgress {
    gameDate: string;
    currentQuestionIndex: number;
    score: number;
    answers: Answer[];
    isComplete: boolean;
    isAnswered: boolean;
    lastUpdated: string;
  }
  
  export interface Answer {
    questionIndex: number;
    userAnswer: string;
    isCorrect: boolean;
    points: number;
    usedMultipleChoice: boolean;
  }