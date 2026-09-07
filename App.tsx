import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Languages,
  Layers,
  ChevronDown,
  Eye,
  EyeOff,
  VolumeX,
  GraduationCap,
  Trophy,
  Gamepad2,
  Utensils,
  Heart,
  History,
  Calendar,
  Zap,
  Handshake,
  MessageCircle
} from 'lucide-react';
import { ALL_QUESTIONS, CATEGORIES } from './questions.ts';
import { Question, OptionItem } from './types.ts';
import { playSpanishSpeech } from './sound.ts';

// Map icon name to Lucide icon component
const CategoryIconMap: Record<string, React.ElementType> = {
  Handshake,
  MessageCircle,
  GraduationCap,
  Trophy,
  Gamepad2,
  Utensils,
  Heart,
  History,
  Calendar,
  Zap
};

export default function App() {
  // Category selection (0 = All 100 questions, 1-10 = specific category)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Active question set based on category
  const questions = useMemo(() => {
    if (selectedCategoryId === 0) {
      return ALL_QUESTIONS;
    }
    return ALL_QUESTIONS.filter(q => q.categoryNumber === selectedCategoryId);
  }, [selectedCategoryId]);

  // Current question index in current filtered set
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Answers record: questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Question translation visibility: questionId -> boolean
  const [revealedQuestionTranslations, setRevealedQuestionTranslations] = useState<Record<number, boolean>>({});

  // Options translation visibility: `questionId-optionId` -> boolean
  const [revealedOptionTranslations, setRevealedOptionTranslations] = useState<Record<string, boolean>>({});

  // Global toggle: Always show all translations
  const [alwaysShowTranslations, setAlwaysShowTranslations] = useState<boolean>(false);

  // Audio feedback state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Quick navigation modal/drawer open
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  // Quiz completion status
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Current question object
  const currentQuestion: Question = questions[currentIndex] || questions[0];

  // Stats calculation
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans) {
        if (ans === q.correctOptionId) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    const totalAnswered = correct + wrong;
    const percentage = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
    const score = correct * 10;
    return { correct, wrong, totalAnswered, total: questions.length, percentage, score };
  }, [answers, questions]);

  // Handle category change
  const handleCategorySelect = (catId: number) => {
    setSelectedCategoryId(catId);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Sound pronunciation
  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (soundEnabled) {
      playSpanishSpeech(text);
    }
  };

  // Toggle translation for question
  const toggleQuestionTranslation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRevealedQuestionTranslations(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Toggle translation for specific option
  const toggleOptionTranslation = (optId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const key = `${currentQuestion.id}-${optId}`;
    setRevealedOptionTranslations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Option selection
  const handleSelectOption = (option: OptionItem) => {
    const isAlreadyAnswered = answers[currentQuestion.id] !== undefined;
    if (isAlreadyAnswered) return;

    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option.id
    }));

    // Auto-reveal translations for clarity upon answering
    setRevealedQuestionTranslations(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
    setRevealedOptionTranslations(prev => ({
      ...prev,
      [`${currentQuestion.id}-${option.id}`]: true,
      [`${currentQuestion.id}-${currentQuestion.correctOptionId}`]: true
    }));

    // Speak the selected option in Spanish
    if (soundEnabled) {
      playSpanishSpeech(option.es);
    }
  };

  // Next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  // Previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Retry current question
  const handleRetryCurrent = () => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Reset all progress in current view
  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setRevealedQuestionTranslations({});
    setRevealedOptionTranslations({});
  };

  // Status for current question
  const currentAnswer = answers[currentQuestion.id];
  const hasAnsweredCurrent = currentAnswer !== undefined;
  const isCurrentCorrect = currentAnswer === currentQuestion.correctOptionId;

  // Translation visibility logic
  const isQuestionTransRevealed = alwaysShowTranslations || !!revealedQuestionTranslations[currentQuestion.id];

  // Get current category metadata
  const currentCategoryInfo = CATEGORIES.find(c => c.number === currentQuestion.categoryNumber);
  const CurrentCatIcon = currentCategoryInfo ? (CategoryIconMap[currentCategoryInfo.iconName] || BookOpen) : BookOpen;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Geometric Balance Top Nav */}
      <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30 shadow-2xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs">
            S
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-1.5 leading-tight">
              <span>Spanish</span>
              <span className="text-indigo-600 font-bold">Mastery</span>
              <span className="text-xs text-slate-400 font-normal hidden md:inline ml-1">
                (Հայերեն ➔ Español)
              </span>
            </h1>
          </div>
        </div>

        {/* Center / Right status counters */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden sm:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">
            <div id="scoreDisplay" className="flex items-center gap-1.5 font-bold text-slate-700">
              <span>Score:</span>
              <span className="text-indigo-600 font-extrabold">{stats.score}</span>
            </div>
            <div id="progressCounter" className="font-semibold text-slate-600">
              Question: {currentIndex + 1}/{questions.length}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {/* Always show translation switch */}
            <button
              id="toggle-always-translations-btn"
              onClick={() => setAlwaysShowTranslations(!alwaysShowTranslations)}
              title={alwaysShowTranslations ? "Թաքցնել թարգմանությունը" : "Միշտ ցուցադրել թարգմանությունը"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                alwaysShowTranslations
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden lg:inline">
                {alwaysShowTranslations ? "Թարգմանություն" : "Թարգմանություն"}
              </span>
            </button>

            {/* Sound toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Անջատել ձայնը" : "Միացնել իսպաներեն արտասանությունը"}
              className={`p-2 rounded-lg text-xs transition-colors border ${
                soundEnabled
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Questions map / drawer toggle */}
            <button
              id="open-question-map-btn"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 uppercase tracking-wider transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentIndex + 1}/{questions.length}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isNavOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Progress Bar with Geometric Crisp Line */}
      <div className="h-2 w-full bg-slate-100 relative">
        <motion.div
          id="progressBar"
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Category Selection Horizontal Strip */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-xs px-4 sm:px-8 py-2.5 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            id="cat-btn-all"
            onClick={() => handleCategorySelect(0)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedCategoryId === 0
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Բոլորը (100)
          </button>
          {CATEGORIES.map(cat => (
            <button
              id={`cat-btn-${cat.id}`}
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                selectedCategoryId === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.number}. {cat.titleHy}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 max-w-5xl w-full mx-auto">
        {!isCompleted ? (
          <div className="w-full flex flex-col items-center">
            {/* Top Sub-Bar with Category Metadata & Score on Mobile */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                  <CurrentCatIcon className="w-3.5 h-3.5 text-indigo-600" />
                  {currentCategoryInfo?.number}. {currentCategoryInfo?.titleHy}
                </span>
                <span>• Հարց #{currentQuestion.id}</span>
              </div>

              <div className="flex items-center gap-3 sm:hidden">
                <span className="text-emerald-600 font-bold">✓ {stats.correct}</span>
                <span className="text-rose-500 font-bold">✕ {stats.wrong}</span>
              </div>
            </div>

            {/* Geometric Question Card */}
            <div
              id="questionCard"
              onClick={toggleQuestionTranslation}
              className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10 flex flex-col items-center text-center cursor-pointer transition-all hover:border-slate-300 relative group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="w-8" />
                <div className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-1.5">
                  {isQuestionTransRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ԹԱՐԳՄԱՆՈՒԹՅՈՒՆԸ ԲԱՑՎԱԾ Է (ՍԵՂՄԵՔ ՓԱԿԵԼՈՒ ՀԱՄԱՐ)</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>CLICK TEXT TO TRANSLATE • ՍԵՂՄԵՔ ԹԱՐԳՄԱՆԵԼՈՒ ՀԱՄԱՐ</span>
                    </>
                  )}
                </div>
                <button
                  id="speak-question-btn"
                  onClick={(e) => handleSpeak(currentQuestion.questionEs, e)}
                  title="Լսել իսպաներեն արտասանությունը"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Spanish Question Text */}
              <h2
                id="spanishQuestion"
                className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 leading-snug tracking-tight"
              >
                {currentQuestion.questionEs}
              </h2>

              {/* Armenian Question Translation */}
              <div className="min-h-8 flex items-center justify-center">
                <p
                  id="armenianQuestion"
                  className={`text-lg sm:text-xl text-indigo-600 font-medium transition-opacity duration-300 leading-relaxed ${
                    isQuestionTransRevealed ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                  }`}
                >
                  🇦🇲 {currentQuestion.questionHy}
                </p>
              </div>
            </div>

            {/* Geometric Balanced 2x2 Grid Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mt-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentAnswer === option.id;
                const isCorrect = option.id === currentQuestion.correctOptionId;
                const optTransKey = `${currentQuestion.id}-${option.id}`;
                const isTransRevealed = alwaysShowTranslations || !!revealedOptionTranslations[optTransKey];

                let cardClasses = 'bg-white border-2 border-slate-200 hover:border-indigo-500';
                let letterClasses = 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600';

                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    cardClasses = 'border-2 border-emerald-500 bg-emerald-50/70 shadow-xs';
                    letterClasses = 'bg-emerald-600 text-white font-bold';
                  } else if (isSelected) {
                    cardClasses = 'border-2 border-rose-400 bg-rose-50/70 shadow-xs';
                    letterClasses = 'bg-rose-500 text-white font-bold';
                  } else {
                    cardClasses = 'border-2 border-slate-200 bg-white/70 opacity-60';
                  }
                }

                return (
                  <button
                    key={option.id}
                    id={`btn${index}`}
                    onClick={() => handleSelectOption(option)}
                    className={`group relative p-5 sm:p-6 rounded-xl text-left transition-all flex flex-col justify-between ${
                      hasAnsweredCurrent ? 'cursor-default' : 'cursor-pointer'
                    } ${cardClasses}`}
                  >
                    {/* Top Row: Option ID + Translation Tag */}
                    <div className="flex items-start justify-between w-full mb-2">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${letterClasses}`}
                      >
                        {option.id}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          id={`speak-option-${option.id}-btn`}
                          onClick={(e) => handleSpeak(option.es, e)}
                          title="Լսել"
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`translateIcon${index}`}
                          onClick={(e) => toggleOptionTranslation(option.id, e)}
                          className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 hover:text-indigo-700 transition-colors ml-1"
                        >
                          {isTransRevealed ? '🇦🇲 ՀԱՅ' : 'REVEAL AR'}
                        </button>
                      </div>
                    </div>

                    {/* Spanish Option Text */}
                    <p
                      id={`spanish${index}`}
                      className="font-bold text-slate-800 text-base sm:text-lg mb-1 leading-snug group-hover:text-slate-900"
                    >
                      {option.es}
                    </p>

                    {/* Armenian Translation Text */}
                    <p
                      id={`armenian${index}`}
                      className={`text-sm text-indigo-600 font-medium transition-opacity duration-200 min-h-5 mt-1 ${
                        isTransRevealed ? 'opacity-100' : 'opacity-0 select-none'
                      }`}
                    >
                      {option.hy}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Geometric Completion Summary */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">
              CONGRATULATIONS!
            </h2>
            <p className="text-slate-500 text-base mb-8 font-medium">
              ¡Felicidades! Դուք հաջողությամբ ավարտեցիք ընտրված հարցաշարը։
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">{stats.score}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Final Score</div>
              </div>
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.correct}</div>
                <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-1">Correct</div>
              </div>
              <div className="p-5 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-2xl sm:text-3xl font-black text-rose-600">{stats.wrong}</div>
                <div className="text-xs text-rose-700 font-bold uppercase tracking-wider mt-1">Incorrect</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="restart-quiz-btn"
                onClick={handleResetQuiz}
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-slate-800 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTART GAME</span>
              </button>
              <button
                id="select-other-category-btn"
                onClick={() => {
                  setSelectedCategoryId(0);
                  handleResetQuiz();
                }}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-bold transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>ALL 100 QUESTIONS</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Geometric Footer Action Bar */}
      <footer className="h-24 bg-white border-t border-slate-200 flex items-center justify-between px-6 sm:px-12 shrink-0">
        {/* Left: Feedback text */}
        <div className="flex-1 pr-4">
          {!hasAnsweredCurrent ? (
            <div id="feedback" className="text-base sm:text-lg font-bold italic text-slate-400">
              Choose the correct response to continue!
            </div>
          ) : isCurrentCorrect ? (
            <div id="feedback" className="text-base sm:text-lg font-bold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Excellent! Translation unlocked. (¡Excelente!)</span>
            </div>
          ) : (
            <div id="feedback" className="text-base sm:text-lg font-bold text-rose-500 flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>Incorrect, but keep going! Ճիշտ տարբերակն է &quot;{currentQuestion.correctOptionId}&quot;։</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            id="prev-question-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="hidden md:flex items-center gap-1.5 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          {hasAnsweredCurrent && !isCurrentCorrect && (
            <button
              id="retry-question-btn"
              onClick={handleRetryCurrent}
              className="px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border-2 border-slate-200 hover:border-indigo-500 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETRY</span>
            </button>
          )}

          <button
            id="nextBtn"
            onClick={handleNext}
            disabled={!hasAnsweredCurrent && currentIndex === questions.length - 1}
            className={`px-8 sm:px-10 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all shadow-sm flex items-center gap-2 ${
              hasAnsweredCurrent
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            <span>{currentIndex < questions.length - 1 ? 'NEXT QUESTION' : 'SEE RESULTS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Questions Map Modal (Geometric) */}
      <AnimatePresence>
        {isNavOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider">
                    Question Map ({questions.length} questions)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any number to jump directly to that question
                  </p>
                </div>
                <button
                  id="close-drawer-btn"
                  onClick={() => setIsNavOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Grid */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {questions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isCurrent = idx === currentIndex;
                    let btnClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50';

                    if (ans !== undefined) {
                      if (ans === q.correctOptionId) {
                        btnClass = 'bg-emerald-500 text-white font-bold border-emerald-600';
                      } else {
                        btnClass = 'bg-rose-500 text-white font-bold border-rose-600';
                      }
                    }

                    if (isCurrent) {
                      btnClass += ' ring-2 ring-indigo-600 ring-offset-2';
                    }

                    return (
                      <button
                        id={`jump-to-q-${q.id}`}
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setIsNavOpen(false);
                          setIsCompleted(false);
                        }}
                        className={`h-11 rounded-lg text-xs flex flex-col items-center justify-center border-2 transition-all ${btnClass}`}
                      >
                        <span className="font-bold">#{q.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-around text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500" /> Correct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" /> Incorrect (Continued)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-200" /> Unanswered
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
