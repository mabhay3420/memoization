"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OpenAI } from "openai";
import { useState } from "react";
import { QuestionCardGroup } from "@/components/QuestionCardGroup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");

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
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const generatedText = response.choices[0].message.content?.trim() ?? "";
      let questionAnswers = generatedText.split("???").map((qa) => {
        const [question, answer] = qa.split("###");
        if (!question || !answer) return null;
        return { question: question.trim(), answer: answer.trim() };
      });

      questionAnswers = questionAnswers.filter((qa) => qa !== null);
      setQuestions(questionAnswers as QuestionAnswer[]);
      setEditedContent(text);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      setError(
        "An error occurred while generating questions. Please try again."
      );
    }

    setLoading(false);
  };

  type StepCardProps = {
    step: string;
    description: string;
  };
  const StepCard = ({ step, description }: StepCardProps) => (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">{step}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">
          Memoization
        </h1>
        <div className="flex space-x-4 mb-8">
          <StepCard
            step="1. Paste Content"
            description="Paste your content to get started."
          />
          <StepCard
            step="2. Review Questions"
            description="Review the generated questions."
          />
          <StepCard
            step="3. Read Summary"
            description="Read the summary of your content."
          />
        </div>
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            disabled={isDialogOpen}
          >
            {isDialogOpen ? "Paste Content" : "Edit Content"}
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Paste your content here..."
                value={isDialogOpen ? text : editedContent}
                onChange={(e) => setText(e.target.value)}
                className="resize-none h-48"
              />
              <Button onClick={generateQuestions} disabled={loading}>
                {loading ? "Generating..." : "Generate Questions"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {loading ? (
          <p className="text-center">Generating questions...</p>
        ) : (
          questions.length > 0 && (
            <div className="flex flex-col">
              <QuestionCardGroup questions={questions} />
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Summary</h3>
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((qa, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b"
                    >
                      <AccordionTrigger className="w-full text-left py-2">
                        {qa.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-left py-2">
                        {qa.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
