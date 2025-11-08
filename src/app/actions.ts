"use server";
import { z } from "zod";
import {
  generatePersonalizedTips,
  PersonalizedTipsInput,
} from "@/ai/flows/personalized-carbon-reduction-tips";
import { generateQuiz, QuizQuestion } from "@/ai/flows/generate-quiz-flow";
import { carbonCalculatorSchema } from "@/lib/schema";
import { EMISSION_FACTORS } from "@/lib/constants";

export type CalculationResult = {
  totalEmissions: number;
  categoryEmissions: {
    transport: number;
    electricity: number;
    food: number;
    waste: number;
  };
  tips: string[];
};

export async function calculateAndGetTips(
  formData: z.infer<typeof carbonCalculatorSchema>
): Promise<CalculationResult> {
  const validatedData = carbonCalculatorSchema.parse(formData);

  // Transport emissions
  const transportFactor =
    EMISSION_FACTORS.transport[validatedData.transport.travelToSchool];
  const transportEmissions =
    validatedData.transport.distanceToSchool *
    validatedData.transport.daysPerWeek *
    2 * // round trip
    transportFactor;

  // Electricity emissions
  let electricityEmissions =
    validatedData.electricityAndHome.lightBulbsDaily *
    EMISSION_FACTORS.electricityAndHome.bulb;
  if (!validatedData.electricityAndHome.energySavingBulbs) {
    electricityEmissions /= EMISSION_FACTORS.electricityAndHome.energySavingFactor;
  }
  if (validatedData.electricityAndHome.lightsFansWhenNotNeeded) {
    electricityEmissions *= EMISSION_FACTORS.electricityAndHome.inefficiencyPenalty;
  }

  // Food emissions
  let foodEmissions =
    validatedData.food.meatConsumption * EMISSION_FACTORS.food.meatMeal;
  if (validatedData.food.localSeasonalFood) {
    foodEmissions *= EMISSION_FACTORS.food.localFoodBonus;
  }

  // Waste emissions
  let wasteEmissions =
    validatedData.wasteAndRecycling.plasticBottlesPerWeek *
    EMISSION_FACTORS.wasteAndRecycling.plasticBottle;
  if (validatedData.wasteAndRecycling.wasteSegregation) {
    wasteEmissions *= EMISSION_FACTORS.wasteAndRecycling.recyclingBonus;
  }

  const categoryEmissions = {
    transport: parseFloat(transportEmissions.toFixed(2)),
    electricity: parseFloat(electricityEmissions.toFixed(2)),
    food: parseFloat(foodEmissions.toFixed(2)),
    waste: parseFloat(wasteEmissions.toFixed(2)),
  };

  const totalEmissions = parseFloat(
    (
      transportEmissions +
      electricityEmissions +
      foodEmissions +
      wasteEmissions
    ).toFixed(2)
  );

  // Prepare input for AI and generate tips
  const aiInput: PersonalizedTipsInput = validatedData;
  const aiResult = await generatePersonalizedTips(aiInput);

  return {
    totalEmissions,
    categoryEmissions,
    tips: aiResult.tips,
  };
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const quiz = await generateQuiz();
    return quiz.questions;
  } catch(e) {
    console.error(e);
    return [];
  }
}
