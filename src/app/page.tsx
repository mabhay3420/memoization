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

  const exampleQuantum =
    "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to perform calculations more efficiently than classical computers. It relies on quantum bits (qubits) that can exist in a superposition of states, enabling parallel computations. Quantum computers have the potential to solve certain problems exponentially faster than classical computers, such as factoring large numbers, simulating quantum systems, and optimizing complex systems. However, building a practical, large-scale quantum computer remains a significant challenge due to the fragility of qubits and the need for error correction. Potential applications of quantum computing include cryptography, drug discovery, financial modeling, and artificial intelligence.";

  const exampleMacroeconomics =
    "Macroeconomics is the study of the behavior and decision-making of an entire economy as a whole. It focuses on economy-wide phenomena, such as inflation, unemployment, economic growth, and the effects of government policies on the overall economy. Key macroeconomic concepts include gross domestic product (GDP), inflation rates, interest rates, and aggregate demand and supply. Macroeconomists analyze factors that influence economic growth, employment levels, price stability, and international trade. They also develop models and theories to explain economic fluctuations and propose policies to achieve economic goals, such as full employment, stable prices, and sustainable growth.";

  const exampleGenetics =
    "Genetics is the study of genes, heredity, and the variation of inherited traits in living organisms. It involves the study of DNA (deoxyribonucleic acid), the molecule that carries genetic information, and the mechanisms by which genes are transmitted from one generation to the next. Genetics encompasses topics such as gene structure, gene expression, genetic variation, gene mapping, genetic engineering, and the inheritance patterns of traits. It plays a crucial role in understanding genetic disorders, evolutionary processes, and the development of organisms. Genetics also has applications in fields like medicine, agriculture, and biotechnology, where it is used for disease diagnosis, crop improvement, and the production of pharmaceuticals and other products.";

  const exampleRiemannHypothesis =
    "The Riemann Hypothesis is a famous unsolved problem in pure mathematics that has implications for numerous fields, including number theory, cryptography, and quantum physics. It was proposed by the German mathematician Bernhard Riemann in 1859 and concerns the distribution of prime numbers among the integers. Specifically, the hypothesis states that the non-trivial zeros of the Riemann zeta function all lie on the critical line with real part 1/2. Despite its simple formulation, the Riemann Hypothesis has remained one of the most important open questions in mathematics for over 150 years, with numerous mathematicians attempting to prove or disprove it. If proven, it would have significant implications for our understanding of the distribution of prime numbers and could lead to advancements in various areas of mathematics and related fields.";

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
            {editedContent === "" ? "Paste Content" : "Edit Content"}
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md mx-auto p-6">
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Paste your content here or select an example..."
                value={isDialogOpen ? text : editedContent}
                onChange={(e) => setText(e.target.value)}
                className="resize-none h-48"
              />
              <div className="flex flex-wrap justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setText(exampleQuantum)}
                  className="mb-2"
                >
                  Quantum Computing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setText(exampleMacroeconomics)}
                  className="mb-2"
                >
                  Macroeconomics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setText(exampleGenetics)}
                  className="mb-2"
                >
                  Genetics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setText(exampleRiemannHypothesis)}
                  className="mb-2"
                >
                  Riemann Hypothesis
                </Button>
              </div>
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
