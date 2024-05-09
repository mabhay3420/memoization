// QuestionCardGroup.tsx
"use client";

import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Progress } from "@/components/ui/progress";

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface QuestionCardGroupProps {
  questions: QuestionAnswer[];
}

export function QuestionCardGroup({ questions }: QuestionCardGroupProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remembered, setRemembered] = useState<boolean | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRememberedResponse = (remembered: boolean) => {
    setRemembered(remembered);
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        setShowSuccess(true);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setRemembered(null);
      }
    }, 500);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
      {!showSuccess ? (
        <>
          <Progress value={progress} className="w-full mb-4" />
          <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            remembered={remembered}
            onRememberedResponse={handleRememberedResponse}
          />
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Success!</h2>
          <p>You have completed all the questions.</p>
        </div>
      )}
    </div>
  );
}