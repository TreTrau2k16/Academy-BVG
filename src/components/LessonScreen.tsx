/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, CheckCircle2, AlertCircle, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { QuizQuestion, LessonNode } from '../types';

interface LessonScreenProps {
  lesson: LessonNode;
  onLessonFinish: (scoreEarned: number) => void;
  onClose: () => void;
}

export default function LessonScreen({
  lesson,
  onLessonFinish,
  onClose
}: LessonScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Interaction states
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // For MCQ & True/False
  const [gapFills, setGapFills] = useState<string[]>([]); // For Gap Fill
  const [matchingSelections, setMatchingSelections] = useState<{ [key: string]: string }>({}); // For Matching: {LeftKey: RightValue}
  const [tempSelectedLeft, setTempSelectedLeft] = useState<string | null>(null);
  
  // Status states
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [shakeTrigger, setShakeTrigger] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number>(0);

  const question = lesson.questions[currentQuestionIndex];

  // Standard Shuffle Utility
  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // Keep track of right-side mismatched order for the Matching Template
  const [shuffledRights, setShuffledRights] = useState<string[]>([]);

  useEffect(() => {
    // Reset answers on question change
    setSelectedOption(null);
    setGapFills([]);
    setMatchingSelections({});
    setTempSelectedLeft(null);
    setIsSubmitted(false);
    setIsCorrect(false);

    if (question && question.type === 'matching' && question.pairs) {
      setShuffledRights(shuffleArray(question.pairs.map(p => p.right)));
    }
  }, [currentQuestionIndex, question]);

  if (!question) {
    return null;
  }

  // Verification Logic on Submit
  const handleCheckAnswer = () => {
    let correct = false;

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      correct = selectedOption === question.correctAnswer;
    } 
    else if (question.type === 'gap-fill') {
      // Comparison of array string values
      const correctAnswers: string[] = question.correctAnswer;
      correct = gapFills.length === correctAnswers.length && 
                gapFills.every((val, idx) => val === correctAnswers[idx]);
    } 
    else if (question.type === 'matching') {
      const correctMapping: { [key: string]: string } = question.correctAnswer;
      const totalPairsCount = Object.keys(correctMapping).length;
      const matchedCount = Object.keys(matchingSelections).filter(
        (key) => matchingSelections[key] === correctMapping[key]
      ).length;
      correct = matchedCount === totalPairsCount;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setXpEarned(prev => prev + question.points);
    } else {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 600);
    }
  };

  // Navigating or completing lesson
  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed last question! Trigger completion back to parent
      onLessonFinish(xpEarned);
    }
  };

  // Interactive callbacks
  const handleGapWordClick = (word: string) => {
    if (isSubmitted) return;
    if (gapFills.includes(word)) {
      // Remove
      setGapFills(prev => prev.filter(w => w !== word));
    } else {
      // Add
      if (gapFills.length < (question.correctAnswer as string[]).length) {
        setGapFills(prev => [...prev, word]);
      }
    }
  };

  const handleMatchingLeftClick = (leftText: string) => {
    if (isSubmitted) return;
    setTempSelectedLeft(leftText);
  };

  const handleMatchingRightClick = (rightText: string) => {
    if (isSubmitted || !tempSelectedLeft) return;
    
    setMatchingSelections(prev => ({
      ...prev,
      [tempSelectedLeft]: rightText
    }));
    setTempSelectedLeft(null);
  };

  const isSelectionEmpty = () => {
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      return selectedOption === null;
    }
    if (question.type === 'gap-fill') {
      return gapFills.length < (question.correctAnswer as string[]).length;
    }
    if (question.type === 'matching') {
      // Every left pair should be associated with something
      const pairsNeeded = question.pairs?.length || 0;
      return Object.keys(matchingSelections).length < pairsNeeded;
    }
    return true;
  };

  const percentProgress = Math.round((currentQuestionIndex / lesson.questions.length) * 100);

  return (
    <div id="lesson-screen-layout" className="fixed inset-0 bg-white z-50 flex flex-col font-sans select-none overflow-y-auto">
      
      {/* 1. TOP HEADER CORE STATUS */}
      <header className="max-w-4xl mx-auto px-6 w-full h-18 flex items-center justify-between shrink-0 border-b border-slate-100 gap-6">
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-800 transition-colors p-2 cursor-pointer active:scale-95"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Linear Progress Bar */}
        <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden relative border border-slate-200/50">
          <motion.div 
            className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${percentProgress}%` }}
            transition={{ duration: 0.4 }}
          />
          {/* Subtle reflection on bar */}
          <div className="absolute top-0.5 left-0 right-0 h-1 bg-white/20 rounded-full" />
        </div>

        {/* XP earned in this lesson */}
        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
          <Sparkles className="w-5 h-5 fill-current animate-pulse text-amber-500" />
          <span className="font-black text-sm">+{xpEarned} XP</span>
        </div>
      </header>

      {/* 2. CHÍNH: KHÔNG GIAN BÀI HỌC VÀ CÂU ĐỐ TRỰC QUAN */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-8 w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`w-full flex flex-col ${shakeTrigger ? 'animate-shake' : ''}`}
          >
            
            {/* MASCOT SPEECH BUBBLE ADAPTED TO DUOLINGO VIBES */}
            <div className="flex items-start gap-4 mb-6">
              {/* Cute Crane Mascot Vector */}
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white font-extrabold relative">
                <svg className="w-10 h-10" viewBox="0 0 100 100">
                  <path d="M 25,45 Q 50,15 75,45" stroke="#f59e0b" strokeWidth="6" fill="#eab308" />
                  <circle cx="45" cy="54" r="3.5" fill="#ffffff" />
                  <circle cx="45" cy="54" r="1.5" fill="#0f172a" />
                  <polygon points="56,54 75,59 56,64" fill="#f97316" />
                </svg>
                {/* Visual Speaking Anchor Indicator */}
                <span className="absolute bottom-[-4px] right-2 bg-orange-600 w-3 h-3 rotate-45" />
              </div>
              <div className="bg-orange-50 border border-orange-100 p-3.5 rounded-2xl rounded-tl-none">
                <p className="text-xs font-bold text-orange-850 leading-relaxed uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  HẠC VIỆT HƯỚNG DẪN:
                </p>
                <p className="text-xs text-orange-950 font-semibold leading-relaxed">
                  {question.type === 'multiple-choice' && 'Đọc kĩ câu hỏi kỹ thuật bên dưới và chọn ra 1 điểm chốt cốt lõi nhất nhé!'}
                  {question.type === 'true-false' && 'Nhận định dưới đây là Đúng hay Sai so với quy định an toàn Bách Việt? Hãy bấm chọn.'}
                  {question.type === 'gap-fill' && 'Ghép các khối từ kho báu thuật ngữ xây dựng ở dưới để lấp vết nứt bêtông nhé!'}
                  {question.type === 'matching' && 'Bấm chọn thuật ngữ bên Trái trước, rồi bấm nghĩa của nó bên Phải để làm thành đôi uyên ương!'}
                </p>
              </div>
            </div>

            {/* Display Question Text */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-8">
              {question.questionText}
            </h2>

            {/* A. TEMPLATE: MULTIPLE CHOICE */}
            {question.type === 'multiple-choice' && question.options && (
              <div className="grid grid-cols-1 gap-3.5 w-full">
                {question.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSel = selectedOption === option;
                  return (
                    <button
                      key={option}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(option)}
                      className={`p-4.5 rounded-2xl border-2 text-left text-sm sm:text-base cursor-pointer font-bold transition-all flex items-center gap-4 ${
                        isSubmitted
                          ? option === question.correctAnswer
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : isSel
                              ? 'bg-rose-50 border-rose-500 text-rose-800'
                              : 'bg-white border-slate-200 opacity-60'
                          : isSel 
                            ? 'bg-orange-50 border-orange-600 text-orange-950 shadow-md ring-2 ring-orange-500/10 scale-[1.01]' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all ${
                        isSel ? 'bg-orange-600 border-orange-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* B. TEMPLATE: TRUE / FALSE */}
            {question.type === 'true-false' && question.options && (
              <div className="grid grid-cols-2 gap-4 w-full">
                {question.options.map((option) => {
                  const isSel = selectedOption === option;
                  const isCorrectAnswer = option === question.correctAnswer;
                  return (
                    <button
                      key={option}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(option)}
                      className={`aspect-[4/3] rounded-3xl border-2 cursor-pointer font-extrabold text-xl sm:text-2xl transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                        isSubmitted
                          ? isCorrectAnswer
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800Scale'
                            : isSel
                              ? 'bg-rose-50 border-rose-500 text-rose-800Scale'
                              : 'bg-white border-slate-200 opacity-55'
                          : isSel
                            ? 'bg-orange-50 border-orange-600 text-orange-950 ring-4 ring-orange-500/10'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {option === "Đúng" ? (
                        <div className="text-3xl">✅</div>
                      ) : (
                        <div className="text-3xl">❌</div>
                      )}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* C. TEMPLATE: GAP FILL */}
            {question.type === 'gap-fill' && question.options && (
              <div className="w-full flex flex-col items-center gap-8 py-4">
                
                {/* Gap slots visualization */}
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 w-full flex flex-wrap gap-2.5 justify-center items-center min-h-[90px]">
                  {Array.from({ length: (question.correctAnswer as string[]).length }).map((_, slotIdx) => {
                    const filledWord = gapFills[slotIdx];
                    return (
                      <div 
                        key={slotIdx}
                        className={`h-11 px-4 rounded-xl border-2 flex items-center justify-center font-bold text-sm min-w-[130px] transition-all ${
                          filledWord 
                            ? 'bg-orange-600 border-orange-700 text-white shadow-sm' 
                            : 'bg-slate-200/50 border-slate-300 border-dashed text-slate-400'
                        }`}
                      >
                        {filledWord || `[ Khoảng trống ${slotIdx + 1} ]`}
                      </div>
                    );
                  })}
                </div>

                {/* Word chips library */}
                <div className="flex flex-wrap gap-3.5 justify-center mt-4">
                  {question.options.map((word) => {
                    const isUsed = gapFills.includes(word);
                    return (
                      <button
                        key={word}
                        disabled={isSubmitted}
                        onClick={() => handleGapWordClick(word)}
                        className={`px-5 py-3 rounded-xl border-2 font-bold text-sm cursor-pointer shadow-[0_3px_0_#e2e8f0] transition-all active:translate-y-0.5 active:shadow-none ${
                          isUsed 
                            ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-50 shadow-none pointer-events-none' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* D. TEMPLATE: TERMINOLOGY MATCHING */}
            {question.type === 'matching' && question.pairs && (
              <div className="w-full grid grid-cols-2 gap-4">
                
                {/* Left list (fixed keys) */}
                <div className="flex flex-col gap-3">
                  <p className="text-center text-[10px] uppercase font-black text-slate-400 tracking-wider">Bộ Phận / Thuật ngữ</p>
                  {question.pairs.map((pair) => {
                    const isMatched = isSubmitted || matchingSelections[pair.left] !== undefined;
                    const isCurrentlySelected = tempSelectedLeft === pair.left;
                    return (
                      <button
                        key={pair.left}
                        disabled={isSubmitted}
                        onClick={() => handleMatchingLeftClick(pair.left)}
                        className={`p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all ${
                          isCurrentlySelected 
                            ? 'bg-orange-50 border-orange-600 text-orange-850 scale-[1.01]' 
                            : isMatched 
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-90' 
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {pair.left}
                        {isMatched && <span className="float-right text-emerald-600">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Right list (shuffled matching value targets) */}
                <div className="flex flex-col gap-3">
                  <p className="text-center text-[10px] uppercase font-black text-slate-400 tracking-wider">Trách nhiệm / Giải Nghĩa</p>
                  {shuffledRights.map((rightText) => {
                    const matchedLeftKey = Object.keys(matchingSelections).find(
                      (key) => matchingSelections[key] === rightText
                    );
                    const isMatched = isSubmitted || matchedLeftKey !== undefined;
                    return (
                      <button
                        key={rightText}
                        disabled={isSubmitted || isMatched}
                        onClick={() => handleMatchingRightClick(rightText)}
                        className={`p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all ${
                          isMatched 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-90' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {rightText}
                      </button>
                    );
                  })}
                </div>

                {/* Match Summary Indicator */}
                <div className="col-span-2 pt-2 text-center text-xs font-bold text-slate-400">
                  {Object.keys(matchingSelections).length > 0 && (
                    <span>
                      Đã ghép cặp ({Object.keys(matchingSelections).length} / {question.pairs.length})
                    </span>
                  )}
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. DƯỚI: DUOLINGO ACTION CHECK FOOTER SECTION */}
      <footer className={`shrink-0 border-t py-6 px-6 transition-colors duration-200 ${
        isSubmitted 
          ? isCorrect 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-rose-50 border-rose-200' 
          : 'bg-white border-slate-100'
      }`}>
        <div className="max-w-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* FEEDBACK MASSAGE INNER STATE */}
          <div className="flex items-start gap-3 w-full md:w-auto">
            {isSubmitted ? (
              isCorrect ? (
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-900 text-base">Rất Tuyệt Vời! 💯</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-1 font-semibold max-w-sm">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <AlertCircle className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-rose-950 text-base">Chưa Chính Xác!</h4>
                    <p className="text-xs text-rose-800 leading-relaxed mt-1 font-bold">
                      Đáp án đúng là: <strong className="underline">
                        {Array.isArray(question.correctAnswer) 
                          ? question.correctAnswer.join(" + ") 
                          : typeof question.correctAnswer === 'object'
                            ? 'Các cặp đã liên hệ chuẩn lý'
                            : question.correctAnswer
                        }
                      </strong>
                    </p>
                    <p className="text-[11px] text-rose-700 mt-1.5 max-w-sm font-medium">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-bold">Đồng ý chọn một câu trả lời rồi ấn "Kiểm Tra"</span>
              </div>
            )}
          </div>

          {/* DUOLINGO STATUS BUTTON SUBMIT */}
          <div className="w-full md:w-auto shrink-0 flex justify-end">
            {!isSubmitted ? (
              <button
                disabled={isSelectionEmpty()}
                onClick={handleCheckAnswer}
                className={`w-full md:w-auto px-10 py-4 font-extrabold text-base uppercase rounded-2xl cursor-pointer tracking-wider text-center transition-all ${
                  isSelectionEmpty()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_4px_0_#ea580c] hover:-translate-y-[1px] active:translate-y-1 active:shadow-none'
                }`}
              >
                KIỂM TRA
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`w-full md:w-auto px-10 py-4 font-extrabold text-base uppercase rounded-2xl cursor-pointer tracking-wider text-center transition-all text-white ${
                  isCorrect
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_0_#047857]'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-[0_4px_0_#be123c]'
                }`}
              >
                {currentQuestionIndex < lesson.questions.length - 1 ? 'TIẾP TỤC' : 'TỔNG KẾT BÀI HỌC'}
              </button>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
