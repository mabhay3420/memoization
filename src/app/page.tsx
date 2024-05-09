// page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OpenAI } from "openai";
import { useState } from "react";
import { QuestionCardGroup } from "@/components/QuestionCardGroup";

type QuestionAnswer = {
  question: string;
  answer: string;
};

export default function Home() {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in creating `anki` cards which are short questions meant to help memorise the content presented.\n\nYou output question followed by an answer separated by `###`.\nEach question answer pair is separated by `???`\n\ne.g.\n```\nQuestion 1 ###\nAnswer 1\n???\nQuestion 2###\nAnswer 2\n???\n```\n\nKeep following in mind:\n1. The purpose of exercise is to retain important information, so don't create questions just for the sake of it.\n2. Keep both the questions and answer concise and conceptual. Answers and questions don't need to be complete sentence, direct answers work.\n3. Try to make questions which are self contained i.e. they do not reference anything like `previous paragraph`, `provided` code.\n4. Where needed repeat the example or text block in discussion rather than referring to it.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log("response", response);
      const generatedText = response.choices[0].message.content?.trim() ?? "";
      let questionAnswers = generatedText.split("???").map((qa) => {
        const [question, answer] = qa.split("###");
        if (!question || !answer) return null;
        return { question: question.trim(), answer: answer.trim() };
      });

      questionAnswers = questionAnswers.filter((qa) => qa !== null);
      setQuestions(questionAnswers as QuestionAnswer[]);
    } catch (error) {
      console.error("Error generating questions:", error);
      setError(
        "An error occurred while generating questions. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Center the content vertically with padding */}
      <div className="max-w-2xl mx-auto">
        {/* Limit the width and center horizontally */}
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">
          {/* Increase the font size, add bold weight, and center the heading */}
          Memoization
        </h1>
        <div className="mb-8">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Copy and paste something you want to memorize"
            className="w-full rounded-lg border-slate-300 focus:ring-blue-500"
          />
          {/* Add rounded corners and a focus ring */}
        </div>
        <div className="flex justify-center mb-8">
          {/* Center the button horizontally */}
          <Button
            onClick={generateQuestions}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {/* Add background color, hover effect, text color, and rounded corners */}
            {loading ? "Generating..." : "Generate Questions"}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {/* Center the error message */}
        {loading ? (
          <p className="text-center">Generating questions...</p>
        ) : (
          questions.length > 0 && <QuestionCardGroup questions={questions} />
        )}
        {/* Center the loading message */}
      </div>
    </div>
  );
}
