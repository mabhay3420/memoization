// QuestionCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { AnimatedResult } from "./AnimatedResult";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: string;
  answer: string;
  remembered: boolean | null;
  onRememberedResponse: (remembered: boolean) => void;
}

export function QuestionCard({
  question,
  answer,
  remembered,
  onRememberedResponse,
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const [isAnimating, setIsAnimating] = useState(remembered !== null);

  const handleTapToReveal = () => {
    setShowAnswer(true);
  };

  const handleRememberedResponse = (remembered: boolean) => {
    setIsAnimating(true);
    setShowAnswer(false);
    onRememberedResponse(remembered);
  };

  const previouslyAttempted = useMemo(() => {
    return remembered !== null;
  }, [remembered]);

  return (
    <Card className="bg-white shadow-md rounded-lg p-6 m-4">
      <CardHeader>
        <h3 className="text-xl font-semibold mb-2">{question}</h3>
      </CardHeader>
      <CardContent className="mt-4">
        {showAnswer && (
          <p className="text-lg font-medium text-slate-800">{answer}</p>
        )}
      </CardContent>
      <CardFooter className="mt-6 flex justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {!showAnswer && (
            <div className="flex items-center justify-center">
              <Button
                onClick={handleTapToReveal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Tap to Reveal
              </Button>
            </div>
          )}
          {previouslyAttempted && (
            <div className="flex items-center justify-center">
              {isAnimating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedResult
                    type={remembered ? "remembered" : "forgot"}
                    isNewResponse={false}
                    onAnimationComplete={() => {}}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
        {showAnswer && !previouslyAttempted && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => handleRememberedResponse(false)}
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded-lg"
            >
              <CrossCircledIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" />
              No
            </Button>
            <Button
              onClick={() => handleRememberedResponse(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <CheckCircledIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" />
              Yes
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
