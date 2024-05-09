// QuestionCard.tsx
"use client";

import React, { useState } from "react";
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

  const handleTapToReveal = () => {
    setShowAnswer(true);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Question</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent>{showAnswer && <p>{answer}</p>}</CardContent>
      <CardFooter className="flex justify-between">
        {!showAnswer && (
          <Button onClick={handleTapToReveal}>Tap to Reveal</Button>
        )}
        {showAnswer && remembered === null && (
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => onRememberedResponse(false)}
            >
              <CrossCircledIcon className="h-4 w-4 mr-2" />
              No
            </Button>
            <Button onClick={() => onRememberedResponse(true)}>
              <CheckCircledIcon className="h-4 w-4 mr-2" />
              Yes
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}