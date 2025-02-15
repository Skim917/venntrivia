'use client';

import React, { useState } from 'react';
import Game from '../page';

interface Question {
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

interface GameState {
  date: string;
  questions: Question[];
}

function Admin() {
  const [gameDate, setGameDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameState>({
    date: gameDate,
    questions: [
      {
        text: '',
        correctAnswer: '',
        alternateAnswers: '',
        multipleChoice: ['', '', '', ''],
        correctMultipleChoiceIndex: 0,
        explanation: '',
      },
      {
        text: '',
        correctAnswer: '',
        alternateAnswers: '',
        multipleChoice: ['', '', '', ''],
        correctMultipleChoiceIndex: 0,
        explanation: '',
      },
      {
        text: '',
        correctAnswer: '',
        alternateAnswers: '',
        multipleChoice: ['', '', '', ''],
        correctMultipleChoiceIndex: 0,
        explanation: '',
      },
      {
        text: '',
        correctAnswer: '',
        alternateAnswers: '',
        circle1Text: '',
        circle2Text: '',
        circle3Text: '',
        explanation: '',
      },
    ],
  });

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setCurrentGame((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value,
      };
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  const handleSave = () => {
    try {
      const savedGames = JSON.parse(
        localStorage.getItem('triviaGames') || '{}'
      );
      savedGames[gameDate] = currentGame;
      localStorage.setItem('triviaGames', JSON.stringify(savedGames));
      alert('Game saved successfully for ' + gameDate);
    } catch (error) {
      alert('Error saving game: ' + error.message);
    }
  };

  const loadGame = (date: string) => {
    const savedGames = JSON.parse(localStorage.getItem('triviaGames') || '{}');
    if (savedGames[date]) {
      setCurrentGame(savedGames[date]);
    } else {
      setCurrentGame({
        date: date,
        questions: currentGame.questions.map((q) => ({
          ...q,
          text: '',
          correctAnswer: '',
          alternateAnswers: '',
          explanation: '',
        })),
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const savedGames = JSON.parse(
          localStorage.getItem('triviaGames') || '{}'
        );
        delete savedGames[gameDate];
        localStorage.setItem('triviaGames', JSON.stringify(savedGames));
        alert('Game deleted successfully');
        loadGame(''); // Reset form
      } catch (error) {
        alert('Error deleting game: ' + error.message);
      }
    }
  };
  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-black p-4">
        <button
          onClick={() => setIsPreviewMode(false)}
          className="mb-4 bg-white/20 hover:bg-white/30 p-2 rounded"
        >
          Back to Editor
        </button>
        <Game gameData={currentGame} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white p-4"
      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 200 }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Daily Trivia Admin</h1>
          <button
            onClick={() => {
              localStorage.removeItem('gameProgress');
              localStorage.removeItem('titleScreenLastShown');
              setIsPreviewMode(!isPreviewMode);
            }}
            className="bg-white/20 hover:bg-white/30 p-2 rounded"
          >
            Preview Game
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <select
                value={gameDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setGameDate(newDate);
                  if (newDate === '') {
                    // Reset everything if "Create New Game" is selected
                    setCurrentGame({
                      date: newDate,
                      questions: [
                        {
                          text: '',
                          correctAnswer: '',
                          alternateAnswers: '',
                          multipleChoice: ['', '', '', ''],
                          correctMultipleChoiceIndex: 0,
                          explanation: '',
                        },
                        {
                          text: '',
                          correctAnswer: '',
                          alternateAnswers: '',
                          multipleChoice: ['', '', '', ''],
                          correctMultipleChoiceIndex: 0,
                          explanation: '',
                        },
                        {
                          text: '',
                          correctAnswer: '',
                          alternateAnswers: '',
                          multipleChoice: ['', '', '', ''],
                          correctMultipleChoiceIndex: 0,
                          explanation: '',
                        },
                        {
                          text: '',
                          correctAnswer: '',
                          alternateAnswers: '',
                          circle1Text: '',
                          circle2Text: '',
                          circle3Text: '',
                          explanation: '',
                        },
                      ],
                    });
                  } else {
                    loadGame(newDate);
                  }
                }}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
              >
                <option value="">Create New Game</option>
                {Object.keys(
                  JSON.parse(localStorage.getItem('triviaGames') || '{}')
                )
                  .sort()
                  .map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Set Game Date</label>
              <input
                type="date"
                value={gameDate}
                onChange={(e) => {
                  setGameDate(e.target.value);
                  loadGame(e.target.value);
                }}
                className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="p-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded"
                disabled={!gameDate}
              >
                Delete Game
              </button>
            </div>
          </div>

          {currentGame.questions.map((question, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg p-4 space-y-4"
            >
              <h2 className="text-xl">
                Question {index + 1}{' '}
                {index === 3 ? '(Venn Diagram - 2000 points)' : '(1000 points)'}
              </h2>

              <div>
                <label className="block text-sm mb-1">Question Text</label>
                <textarea
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(index, 'text', e.target.value)
                  }
                  placeholder="Enter your question..."
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded min-h-[100px]"
                />
              </div>

              {index === 3 ? (
                <>
                  <div>
                    <label className="block text-sm mb-1">
                      Left Circle Text (use \n for line breaks)
                    </label>
                    <input
                      value={question.circle1Text}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'circle1Text',
                          e.target.value
                        )
                      }
                      placeholder="Text for left circle, use \n for new line..."
                      className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Right Circle Text (use \n for line breaks)
                    </label>
                    <input
                      value={question.circle2Text}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'circle2Text',
                          e.target.value
                        )
                      }
                      placeholder="Text for right circle, use \n for new line..."
                      className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Bottom Circle Text (use \n for line breaks)
                    </label>
                    <input
                      value={question.circle3Text}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'circle3Text',
                          e.target.value
                        )
                      }
                      placeholder="Text for bottom circle, use \n for new line..."
                      className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Correct Answer</label>
                    <input
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'correctAnswer',
                          e.target.value
                        )
                      }
                      placeholder="The correct answer..."
                      className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Alternative Acceptable Answers (one per line)
                    </label>
                    <textarea
                      value={question.alternateAnswers}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          'alternateAnswers',
                          e.target.value
                        )
                      }
                      placeholder="Enter alternative answers, one per line..."
                      className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded min-h-[100px]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">
                        Correct Answer
                      </label>
                      <input
                        value={question.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            'correctAnswer',
                            e.target.value
                          )
                        }
                        placeholder="The correct answer..."
                        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Alternative Acceptable Answers (one per line)
                      </label>
                      <textarea
                        value={question.alternateAnswers}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            'alternateAnswers',
                            e.target.value
                          )
                        }
                        placeholder="Enter alternative answers, one per line..."
                        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">
                        Multiple Choice Options (500 points)
                      </label>
                      {question.multipleChoice?.map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className="flex items-center space-x-2 mt-2"
                        >
                          <input
                            type="radio"
                            name={`correct-answer-${index}`}
                            checked={
                              question.correctMultipleChoiceIndex ===
                              choiceIndex
                            }
                            onChange={() =>
                              handleQuestionChange(
                                index,
                                'correctMultipleChoiceIndex',
                                choiceIndex
                              )
                            }
                            className="text-blue-600"
                          />
                          <input
                            value={choice}
                            onChange={(e) => {
                              const newChoices = [...question.multipleChoice!];
                              newChoices[choiceIndex] = e.target.value;
                              handleQuestionChange(
                                index,
                                'multipleChoice',
                                newChoices
                              );
                            }}
                            placeholder={`Option ${choiceIndex + 1}...`}
                            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm mb-1">
                  Explanation (shown after answering). For sources, use:
                  [link:https://www.cnn.com|CNN.com]
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    handleQuestionChange(index, 'explanation', e.target.value)
                  }
                  placeholder="Enter explanation text... "
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded min-h-[100px]"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            className="w-full bg-white/20 hover:bg-white/30 p-2 rounded h-12"
          >
            Save Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;