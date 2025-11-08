'use server';

/**
 * @fileOverview Generates personalized carbon reduction tips based on user input.
 * 
 * - generatePersonalizedTips - A function that generates personalized tips for reducing carbon footprint.
 * - PersonalizedTipsInput - The input type for the generatePersonalizedTips function.
 * - PersonalizedTipsOutput - The return type for the generatePersonalizedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTipsInputSchema = z.object({
  transport: z.object({
    travelToSchool: z.enum(['Walk', 'Bicycle', 'Bus', 'Car', 'Motorcycle', 'Other']).describe('Usual mode of transport to school.'),
    distanceToSchool: z.number().describe('One-way distance to school in km.'),
    daysPerWeek: z.number().describe('Number of days traveling to school per week.'),
  }).describe('Information about transportation habits.'),
  electricityAndHome: z.object({
    lightBulbsDaily: z.number().describe('Number of light bulbs used daily at home.'),
    lightsFansWhenNotNeeded: z.boolean().describe('Whether lights/fans are left on when not needed.'),
    energySavingBulbs: z.boolean().describe('Whether energy-saving bulbs are used.'),
  }).describe('Information about electricity and home energy usage.'),
  food: z.object({
    meatConsumption: z.number().describe('How often meat is eaten in a week.'),
    localSeasonalFood: z.boolean().describe('Preference for local/seasonal food.'),
  }).describe('Information about food consumption habits.'),
  wasteAndRecycling: z.object({
    wasteSegregation: z.boolean().describe('Whether waste is segregated.'),
    plasticBottlesPerWeek: z.number().describe('Number of plastic bottles used per week.'),
  }).describe('Information about waste and recycling habits.'),
  awareness:
    z.boolean()
      .describe('Whether the user has planted a tree or participated in an environmental event recently.'),
}).describe('User inputs for calculating carbon footprint and getting personalized tips.');
export type PersonalizedTipsInput = z.infer<typeof PersonalizedTipsInputSchema>;

const PersonalizedTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('Personalized tips for reducing carbon footprint.'),
}).describe('Personalized tips generated based on user inputs.');
export type PersonalizedTipsOutput = z.infer<typeof PersonalizedTipsOutputSchema>;

export async function generatePersonalizedTips(
  input: PersonalizedTipsInput
): Promise<PersonalizedTipsOutput> {
  return personalizedTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTipsPrompt',
  input: { schema: PersonalizedTipsInputSchema },
  output: { schema: PersonalizedTipsOutputSchema },
  prompt: `Based on the following information, provide personalized tips for reducing carbon footprint.  These tips are designed as a tool that suggests methods that could be more suitable to the individual\'s circumstances than what the raw calculation indicates.

Transport:
- Travel to school: {{{transport.travelToSchool}}}
- Distance to school: {{{transport.distanceToSchool}}} km
- Days per week: {{{transport.daysPerWeek}}}

Electricity & Home:
- Light bulbs daily: {{{electricityAndHome.lightBulbsDaily}}}
- Lights/fans when not needed: {{#if electricityAndHome.lightsFansWhenNotNeeded}}Yes{{else}}No{{/if}}
- Energy-saving bulbs: {{#if electricityAndHome.energySavingBulbs}}Yes{{else}}No{{/if}}

Food:
- Meat consumption: {{{food.meatConsumption}}} times per week
- Local/seasonal food: {{#if food.localSeasonalFood}}Yes{{else}}No{{/if}}

Waste & Recycling:
- Waste segregation: {{#if wasteAndRecycling.wasteSegregation}}Yes{{else}}No{{/if}}
- Plastic bottles per week: {{{wasteAndRecycling.plasticBottlesPerWeek}}}

Awareness:
- Planted a tree/environmental event: {{#if awareness}}Yes{{else}}No{{/if}}

Give the tips in markdown format.
Keep the tips concise.
Give 3 tips.`, // Added a description of the prompt's purpose.
});

const personalizedTipsFlow = ai.defineFlow(
  {
    name: 'personalizedTipsFlow',
    inputSchema: PersonalizedTipsInputSchema,
    outputSchema: PersonalizedTipsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
