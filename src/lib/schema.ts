import { z } from "zod";

export const carbonCalculatorSchema = z.object({
  transport: z.object({
    travelToSchool: z.enum(['Walk', 'Bicycle', 'Bus', 'Car', 'Motorcycle', 'Other'], { required_error: "Please select a mode of transport."}),
    distanceToSchool: z.coerce.number().min(0, "Distance cannot be negative."),
    daysPerWeek: z.coerce.number().min(0, "Days must be at least 0.").max(7, "Days cannot be more than 7."),
  }),
  electricityAndHome: z.object({
    lightBulbsDaily: z.coerce.number().min(0, "Number of bulbs cannot be negative."),
    lightsFansWhenNotNeeded: z.boolean().default(false),
    energySavingBulbs: z.boolean().default(false),
  }),
  food: z.object({
    meatConsumption: z.coerce.number().min(0, "Meat consumption cannot be negative."),
    localSeasonalFood: z.boolean().default(false),
  }),
  wasteAndRecycling: z.object({
    wasteSegregation: z.boolean().default(false),
    plasticBottlesPerWeek: z.coerce.number().min(0, "Number of bottles cannot be negative."),
  }),
  awareness: z.boolean().default(false),
});

export type CarbonCalculatorForm = z.infer<typeof carbonCalculatorSchema>;
