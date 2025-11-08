'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, XCircle, Award, BrainCircuit, RotateCcw } from 'lucide-react';
import { getQuizQuestions } from '@/app/actions';
import type { QuizQuestion } from '@/ai/flows/generate-quiz-flow';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswerStatus('unanswered');
    try {
      const fetchedQuestions = await getQuizQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answerStatus !== 'unanswered') return;

    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswerStatus('unanswered');
    }
  };
  
  const isQuizFinished = currentQuestionIndex === questions.length - 1 && answerStatus !== 'unanswered';

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your quiz...</p>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
         <Card className="w-full max-w-lg text-center">
           <CardHeader>
             <CardTitle className="flex justify-center items-center gap-2">
               <XCircle className="w-8 h-8 text-destructive" />
               Failed to load quiz
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">
               There was an error generating the quiz. Please try again.
             </p>
           </CardContent>
           <CardFooter>
            <Button onClick={fetchQuestions} className="w-full">
              <RotateCcw className="mr-2" />
              Try Again
            </Button>
           </CardFooter>
         </Card>
      </main>
    )
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="flex flex-1 flex-col items-center gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="w-full max-w-2xl">
        {isQuizFinished ? (
          <Card className="text-center">
            <CardHeader>
              <Award className="mx-auto h-16 w-16 text-yellow-500" />
              <CardTitle className="text-3xl mt-4">Quiz Completed!</CardTitle>
              <CardDescription>
                You've completed the Eco-Knowledge Challenge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl">Your Final Score:</p>
              <p className="text-5xl font-bold text-primary">
                {score} / {questions.length}
              </p>
              <p className="text-muted-foreground">
                {score > 3 ? "Excellent work, Eco-Champion!" : "Good effort! Keep learning and growing."}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={fetchQuestions} className="w-full">
                <RotateCcw className="mr-2" />
                Play Again
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BrainCircuit className="text-primary"/>
                Eco-Knowledge Quiz
              </CardTitle>
              <div className="pt-2">
                <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
                <p className="text-sm text-muted-foreground mt-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg font-semibold">{currentQuestion.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswerIndex;
                  const isSelected = selectedAnswer === index;
                  let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                  if (answerStatus !== 'unanswered') {
                    if (isCorrect) buttonVariant = "default";
                    else if (isSelected && !isCorrect) buttonVariant = "destructive";
                    else buttonVariant = "secondary";
                  }

                  return (
                    <Button
                      key={index}
                      variant={buttonVariant}
                      className={cn(
                        "h-auto justify-start text-left whitespace-normal",
                        answerStatus !== 'unanswered' && "pointer-events-none"
                      )}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {answerStatus !== 'unanswered' && isCorrect && <CheckCircle className="h-5 w-5 text-primary-foreground" />}
                          {answerStatus !== 'unanswered' && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive-foreground" />}
                          {answerStatus === 'unanswered' && <div className="h-5 w-5 border border-primary rounded-full" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              {answerStatus !== 'unanswered' && (
                <Alert className={answerStatus === 'correct' ? 'border-green-500' : 'border-red-500'}>
                  <AlertTitle className="flex items-center gap-2">
                    {answerStatus === 'correct' ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                    {answerStatus === 'correct' ? 'Correct!' : 'Not quite!'}
                  </AlertTitle>
                  <AlertDescription>
                    {currentQuestion.explanation}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextQuestion} disabled={answerStatus === 'unanswered'} className="w-full">
                {isQuizFinished ? 'Finish' : 'Next Question'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
