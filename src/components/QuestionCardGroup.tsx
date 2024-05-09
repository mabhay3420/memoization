// QuestionCardGroup.tsx
"use client";

import React, { useMemo, useState } from "react";

import { QuestionCard } from "./QuestionCard";

import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [responses, setResponses] = useState<(boolean | null)[]>(
    Array(questions.length).fill(null)
  );

  const showSuccess = useMemo(() => {
    return currentQuestionIndex === questions.length;
  }, [currentQuestionIndex, questions]);

  const handleRememberedResponse = (remembered: boolean) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = remembered;
    setResponses(updatedResponses);
    setRemembered(remembered);

    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setRemembered(null);
    }, 100);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setRemembered(responses[currentQuestionIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    if (currentQuestionIndex === questions.length - 1) {
      setRemembered(responses[currentQuestionIndex + 1]);
    }
  };

  const handleMarkComplete = () => {
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent>
        {!showSuccess ? (
          <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            remembered={responses[currentQuestionIndex]}
            onRememberedResponse={handleRememberedResponse}
          />
        ) : (
          <div className="text-center m-4">
            <h2 className="text-4xl font-bold mb-4">🎉 Success!</h2>
            <p className="text-xl">You have completed all the questions.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col justify-between items-center">
        <div className="flex justify-center w-full mb-4">
          <div className="flex">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mr-4"
            >
              Previous
            </Button>
            {showSuccess ? (
              <Button
                onClick={handleMarkComplete}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Mark Completed
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={showSuccess}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Next
              </Button>
            )}
          </div>
        </div>
        {!showSuccess && (
          <div className="flex items-center mb-2 w-full">
            <h4 className="text-2xl font-bold mr-2">
              {currentQuestionIndex + 1}/{questions.length}
            </h4>
            <Progress value={progress} className="flex-grow" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
