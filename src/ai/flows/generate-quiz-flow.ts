'use server';

/**
 * @fileOverview Generates a multiple-choice quiz about environmental topics.
 *
 * - generateQuiz - A function that generates a list of quiz questions.
 * - QuizQuestion - The type for a single quiz question.
 * - QuizOutput - The return type containing an array of questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of four possible answers.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation of the correct answer.'),
});

const QuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of 5 quiz questions.'),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizOutput = z.infer<typeof QuizOutputSchema>;

export async function generateQuiz(): Promise<QuizOutput> {
  return generateQuizFlow();
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  output: { schema: QuizOutputSchema },
  prompt: `Generate a 5-question multiple-choice quiz about climate change, carbon footprint, and environmental conservation.
The questions should be suitable for high school students.
For each question, provide the question text, 4 options, the index of the correct answer, and a short explanation for the correct answer.
Ensure the questions cover a range of topics within the environmental theme.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    outputSchema: QuizOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
