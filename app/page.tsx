'use client';

import React, { useState, useEffect, useRef } from 'react';
import VennDiagram from './components/VennDiagram';
import { GameData, GameProgress, Answer } from './types';

const TitleLogo = () => {
  const [leftOpacity, setLeftOpacity] = useState(0);
  const [rightOpacity, setRightOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => setLeftOpacity(1), 1);
    setTimeout(() => setRightOpacity(1), 600);
  }, []);

  return (
    <svg viewBox="0 0 500 200" className="w-full max-w-lg mx-auto">
      <defs>
        <mask id="circleMask1">
          <rect width="500" height="200" fill="white" />
          <circle cx="320" cy="100" r="80" fill="black" />
        </mask>
        <mask id="circleMask2">
          <rect width="500" height="200" fill="white" />
          <circle cx="180" cy="100" r="80" fill="black" />
        </mask>
      </defs>

      <g opacity={leftOpacity} style={{ transition: 'opacity 0.5s ease-in' }}>
        <circle
          cx="180"
          cy="100"
          r="80"
          fill="#333333"
          mask="url(#circleMask1)"
        />
        <circle
          cx="180"
          cy="100"
          r="80"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x="176"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="32"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          VENN
        </text>
      </g>

      <g opacity={rightOpacity} style={{ transition: 'opacity 0.5s ease-in' }}>
        <circle
          cx="320"
          cy="100"
          r="80"
          fill="#333333"
          mask="url(#circleMask2)"
        />
        <circle
          cx="320"
          cy="100"
          r="80"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x="325"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="32"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          TRIVIA
        </text>
      </g>
    </svg>
  );
};
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const saveProgress = (
  gameDate: string,
  currentIndex: number,
  currentScore: number,
  answers: Answer[],
  isComplete = false,
  isAnswered = false
): void => {
  const progress: GameProgress = {
    gameDate,
    currentQuestionIndex: currentIndex,
    score: currentScore,
    answers,
    isComplete,
    isAnswered,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem('gameProgress', JSON.stringify(progress));
};

const loadProgress = (): GameProgress | null => {
  const saved = localStorage.getItem('gameProgress');
  if (!saved) return null;

  try {
    const progress = JSON.parse(saved) as GameProgress;
    const savedDate = new Date(progress.lastUpdated);
    const now = new Date();

    if (savedDate.toDateString() !== now.toDateString()) {
      localStorage.removeItem('gameProgress');
      return null;
    }

    return progress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

const resetProgress = (): void => {
  localStorage.removeItem('gameProgress');
  localStorage.removeItem('titleScreenLastShown');
  window.location.reload();
};
export type GameProps = {
  initialGameData?: GameData;
};

export default function Home({ initialGameData }: GameProps) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<React.ReactNode>('');
  const [showingMultipleChoice, setShowingMultipleChoice] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [gameDate, setGameDate] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTitleScreen, setShowTitleScreen] = useState(true);

  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const helpText = `**Welcome to Venn Trivia.**\n
Each day features new **trivia** questions and ends with a special Venn diagram puzzle.\n
Lorem ipsum dolor sit amet, \n
consectetur adipiscing elit. \n
[link:https://twitter.com/yourtwitterhandle|Follow us on Twitter]

Pellentesque sit amet convallis ipsum. Donec faucibus, tellus eu tincidunt ultrices, est nibh rutrum massa, a vulputate dui libero a dolor. Maecenas eget purus sagittis, accumsan tellus vitae, ultricies sapien. Proin maximus lorem mauris, a feugiat augue rhoncus sed. Fusce sapien odio, varius id dignissim et, suscipit eget enim. Aliquam erat volutpat. Praesent nec erat rutrum eros rhoncus ultrices. Ut ut odio lectus. Maecenas dui nisi, maximus vel elit eget, varius vehicula neque. Integer feugiat sem tortor, non ornare ligula auctor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam gravida consequat ipsum, quis blandit velit ultrices maximus. Ut hendrerit risus sem, et tincidunt risus fringilla quis. In gravida purus tortor, quis pretium sapien pretium quis.
[link:https://twitter.com/yourtwitterhandle|Follow us on Twitter]\n
[link:https://github.com/yourgithub|View on GitHub]`;
useEffect(() => {
  const lastShown = localStorage.getItem('titleScreenLastShown');
  const today = new Date().toDateString();
  if (lastShown === today) {
    setShowTitleScreen(false);
  }
}, []);

const handleStartGame = () => {
  localStorage.setItem('titleScreenLastShown', new Date().toDateString());
  setShowTitleScreen(false);
};

useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key === '?') {
      resetProgress();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isAnswered && !showingMultipleChoice) {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (e.key.length === 1 && document.activeElement !== input) {
        input?.focus();
        if (!/Mobi|Android/i.test(navigator.userAgent)) {
          setAnswer(e.key);
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isAnswered, showingMultipleChoice]);

useEffect(() => {
  if (isAnswered && feedback && nextButtonRef.current) {
    nextButtonRef.current.focus();
  }
}, [isAnswered, feedback]);

useEffect(() => {
  const loadGameAndProgress = async () => {
    const progress = loadProgress();

    if (progress && progress.isComplete) {
      setGameComplete(true);
      setScore(progress.score);
      setAnswers(progress.answers);
      setGameDate(progress.gameDate);
    }

    if (initialGameData) {
      setGameData(initialGameData);
      return;
    }

    const allGames = JSON.parse(localStorage.getItem('triviaGames') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const dates = Object.keys(allGames).sort();

    const mostRecentDate = dates.reduce((closest, date) => {
      if (date <= today && date > closest) return date;
      return closest;
    }, '0000-00-00');

    if (mostRecentDate !== '0000-00-00') {
      const currentGameData = allGames[mostRecentDate];
      setGameData(currentGameData);
      setGameDate(mostRecentDate);

      if (progress && progress.gameDate === mostRecentDate && !progress.isComplete) {
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setScore(progress.score);
        setAnswers(progress.answers);
        setIsAnswered(progress.isAnswered);

        if (progress.isAnswered && progress.answers.length > 0) {
          const lastAnswer = progress.answers[progress.answers.length - 1];
          const currentQuestion = currentGameData.questions[progress.currentQuestionIndex];

          setFeedback(
            <div className="text-center">
              <span className="text-xl font-bold">
                {lastAnswer.isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
              <br />
              {lastAnswer.isCorrect
                ? `You earned ${lastAnswer.points} points.`
                : `The answer was "${currentQuestion.correctAnswer}".`}
            </div>
          );
        }
      }
    }
  };

  loadGameAndProgress();
}, [gameData]);
if (!gameData) {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto text-center">Loading...</div>
    </div>
  );
}

const currentQuestion = gameData.questions[currentQuestionIndex];
const isVennQuestion = currentQuestionIndex === 3;

const handleAnswerChecking = (userAnswer: string, isMultipleChoice = false) => {
  let isCorrect = false;
  let points = 0;

  if (isMultipleChoice) {
    isCorrect = parseInt(userAnswer) === currentQuestion.correctMultipleChoiceIndex;
    points = isCorrect ? 500 : 0;
  } else {
    const userAnswerNorm = userAnswer.toLowerCase().trim();
    const correctAnswerNorm = currentQuestion.correctAnswer.toLowerCase().trim();
    const altAnswers = (currentQuestion.alternateAnswers || '')
      .split('\n')
      .map((ans) => ans.toLowerCase().trim())
      .filter((ans) => ans !== '');

    isCorrect =
      userAnswerNorm === correctAnswerNorm ||
      altAnswers.some(
        (alt) =>
          userAnswerNorm === alt ||
          (userAnswerNorm.length > 3 &&
            alt.length > 3 &&
            levenshteinDistance(userAnswerNorm, alt) <= 1)
      ) ||
      (userAnswerNorm.length > 3 &&
        correctAnswerNorm.length > 3 &&
        levenshteinDistance(userAnswerNorm, correctAnswerNorm) <= 1);

    points = isCorrect ? (isVennQuestion ? 2000 : 1000) : 0;
  }

  const newAnswers = [
    ...answers,
    {
      questionIndex: currentQuestionIndex,
      userAnswer: userAnswer,
      isCorrect,
      points,
      usedMultipleChoice: isMultipleChoice,
    },
  ];

  const newScore = score + points;

  if (isCorrect) {
    setScore(newScore);
    setFeedback(
      <div className="text-center">
        <span className="text-xl font-bold">Correct!</span>
        <br />
        You earned {points} points.
      </div>
    );
  } else {
    setFeedback(
      <div className="text-center">
        <span className="text-xl font-bold">Incorrect!</span>
        <br />
        The answer was "{currentQuestion.correctAnswer}".
      </div>
    );
  }

  setAnswers(newAnswers);
  setIsAnswered(true);
  saveProgress(
    gameDate!,
    currentQuestionIndex,
    newScore,
    newAnswers,
    false,
    true
  );
};

const checkAnswer = () => handleAnswerChecking(answer, false);

const handleNext = () => {
  const nextIndex = currentQuestionIndex + 1;
  if (nextIndex >= gameData.questions.length) {
    setGameComplete(true);
    saveProgress(gameDate!, currentQuestionIndex, score, answers, true, false);
  } else {
    setCurrentQuestionIndex(nextIndex);
    setAnswer('');
    setIsAnswered(false);
    setShowingMultipleChoice(false);
    setFeedback('');
    saveProgress(gameDate!, nextIndex, score, answers, false, false);
  }
};

const HelpButton = () => (
  <div className="absolute top-4 right-4">
    <button
      onClick={() => setShowHelp((prev) => !prev)}
      className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-200 hover:bg-gray-800"
    >
      ?
    </button>
  </div>
);
if (gameComplete) {
  const formatDate = (date: string | null) => {
    if (gameData && gameData.date) {
      const [year, month, day] = gameData.date
        .split('T')[0]
        .split('-');
      return `${month}/${day}/${year.slice(2)}`;
    }

    if (!date) return '';
    const [year, month, day] = date.split('T')[0].split('-');
    return `${month}/${day}/${year.slice(2)}`;
  };

  const getResultEmojis = () => {
    return answers.map((answer) => (answer.isCorrect ? '⚪' : '⭘')).join('');
  };

  const getCorrectCount = () => {
    return answers.filter((answer) => answer.isCorrect).length;
  };

  const handleShare = () => {
    const websiteUrl = 'VennTrivia.com';
    const dateToUse = gameData ? gameData.date : gameDate;

    const shareText = `Venn Trivia:\n${formatDate(
      dateToUse
    )}\n${getResultEmojis()}\nI got ${getCorrectCount()}/4 correct\nScore: ${score.toLocaleString()} points\nPlay now at ${websiteUrl}`;

    navigator.clipboard.writeText(shareText).then(() => {
      const feedbackElement = document.getElementById('share-feedback');
      if (feedbackElement) {
        feedbackElement.style.opacity = '1';
        setTimeout(() => {
          feedbackElement.style.opacity = '0';
        }, 2000);
      }
    });
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400&display=swap');
        
        .share-feedback {
          transition: opacity 0.3s ease;
          opacity: 0;
        }
      `}</style>
      <div
        className="min-h-screen bg-black py-8 px-4 relative"
        style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 200 }}
      >
        <HelpButton />

        <div className="w-full max-w-2xl mx-auto bg-black border border-gray-800 rounded-lg">
          <div className="p-6 space-y-6">
            <h2 className="text-2xl text-center text-gray-300">
              Game Complete!
            </h2>
            <div className="text-2xl text-center text-gray-200">
              Final Score: {score.toLocaleString()} points
            </div>
            <div className="text-center text-gray-200">
              <div className="mb-4">{getResultEmojis()}</div>
              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share Results</span>
              </button>
              <div
                id="share-feedback"
                className="share-feedback mt-4 text-gray-400"
              >
                Copied results to clipboard!
              </div>
              <div className="mt-8 text-base text-gray-300">
                <strong>Next game: Next Monday.</strong> <br />
                <br />A{' '}
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 underline"
                >
                  Someone
                </a>{' '}
                production.
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full mx-4 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="prose prose-invert">
              {helpText.split('\n').map((line, i) => {
                if (line.includes('[link:')) {
                  const [url, text] =
                    line.match(/\[link:(.*?)\|(.*?)\]/)?.slice(1) || [];
                  return url && text ? (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-200 hover:text-white underline"
                    >
                      {text}
                    </a>
                  ) : null;
                }
                if (line === '') {
                  return <br key={i} />;
                }
                return (
                  <p
                    key={i}
                    className="text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      ),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
return (
  <>
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400&display=swap');
    `}</style>
    <main
      className="min-h-screen bg-black text-white p-4 relative"
      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 200 }}
    >
      {showTitleScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex items-start justify-center pt-20 z-50">
          <div className="bg-black p-8 rounded-lg max-w-2xl w-full mx-4 border border-gray-800">
            <div className="space-y-8">
              <TitleLogo />
              <div className="text-center space-y-4">
                <div className="text-xl font-bold text-gray-200">
                  {gameData
                    ? gameData.date
                        .split('T')[0]
                        .split('-')
                        .slice(1)
                        .join('/') +
                      '/' +
                      gameData.date
                        .split('T')[0]
                        .split('-')[0]
                        .slice(2)
                    : gameDate
                    ? gameDate.split('T')[0].split('-').slice(1).join('/') +
                      '/' +
                      gameDate.split('T')[0].split('-')[0].slice(2)
                    : 'Loading...'}
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>Lorem ipsum the first</p>
                  <p>Lorem ipsum 2</p>
                  <p>Lorem ipsum 3</p>
                </div>
                <button
                  onClick={handleStartGame}
                  className="mt-6 px-12 py-3 bg-white/20 hover:bg-white/30 rounded-full text-xl text-white transition-colors"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <HelpButton />

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full mx-4 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <div className="prose prose-invert">
              {helpText.split('\n').map((line, i) => {
                if (line.includes('[link:')) {
                  const [url, text] =
                    line.match(/\[link:(.*?)\|(.*?)\]/)?.slice(1) || [];
                  return url && text ? (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-200 hover:text-white underline"
                    >
                      {text}
                    </a>
                  ) : null;
                }
                if (line === '') {
                  return <br key={i} />;
                }
                return (
                  <p
                    key={i}
                    className="text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      ),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg mb-4 text-gray-400">
          Question {currentQuestionIndex + 1} of {gameData.questions.length}
        </h1>
        <div className="text-lg mb-4">{currentQuestion.text}</div>

        {isVennQuestion && (
          <div className="mb-6">
            <VennDiagram
              circle1Text={currentQuestion.circle1Text}
              circle2Text={currentQuestion.circle2Text}
              circle3Text={currentQuestion.circle3Text}
              centerText={isAnswered ? currentQuestion.correctAnswer : '???'}
            />
          </div>
        )}

        {!isAnswered ? (
          <div className="space-y-4">
            {!showingMultipleChoice ? (
              <>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && answer.trim()) {
                      e.preventDefault();
                      checkAnswer();
                    }
                  }}
                  placeholder="Type your answer..."
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                />
                <button
                  onClick={checkAnswer}
                  className="w-full p-2 bg-white/20 hover:bg-white/30 text-white rounded"
                  disabled={!answer.trim()}
                >
                  Submit Answer
                </button>
                {!isVennQuestion && (
                  <button
                    onClick={() => setShowingMultipleChoice(true)}
                    className="w-full p-2 bg-white/20 hover:bg-white/30 text-white rounded"
                  >
                    Multiple Choice (Half Points)
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {currentQuestion.multipleChoice?.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerChecking(idx.toString(), true)}
                    className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}

            {feedback && <div className="p-4 rounded-lg">{feedback}</div>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg">{feedback}</div>
            {currentQuestion.explanation && (
              <div className="p-4 text-gray-200 italic">
                <div>
                  {currentQuestion.explanation
                    .replace(/\[link:.*?\]/, '')
                    .replace(/\[note\].*/, '')}
                </div>
                {currentQuestion.explanation.includes('[note]') && (
                  <div className="text-sm text-gray-300 mt-2">
                    {currentQuestion.explanation
                      .split('[note]')[1]
                      .replace(/\[link:.*?\]/, '')}
                  </div>
                )}
                {currentQuestion.explanation.match(/\[link:(.*?)\|(.*?)\]/) && (
                  <a
                    href={currentQuestion.explanation.match(/\[link:(.*?)\|(.*?)\]/)?.[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-gray-300 hover:text-gray-100 underline mt-2"
                  >
                    {currentQuestion.explanation.match(/\[link:(.*?)\|(.*?)\]/)?.[2]}
                  </a>
                )}
              </div>
            )}
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              className="w-full p-2 bg-white/20 hover:bg-white/30 text-white rounded"
              autoFocus
            >
              {currentQuestionIndex < gameData.questions.length - 1
                ? 'Next Question'
                : 'See Final Results'}
            </button>
          </div>
        )}

        <div className="text-lg text-center mt-6 border-t border-gray-800 pt-4 text-gray-200">
          Score: {score.toLocaleString()} points
        </div>
      </div>
    </main>
  </>
);
}