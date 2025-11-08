// Emission factors in kg CO₂e
export const EMISSION_FACTORS = {
  transport: {
    // per km, one-way
    Walk: 0,
    Bicycle: 0,
    Bus: 0.04,
    Car: 0.18,
    Motorcycle: 0.09,
    Other: 0.1, // Average of motorized options
  },
  electricityAndHome: {
    // per bulb per week, assuming 5 hours/day use and 0.5 kg CO2/kWh grid factor
    bulb: 1.05, // (60W * 5h * 7d) * 0.5 kg/kWh / 1000
    energySavingFactor: 1 / 6, // LED vs Incandescent
    inefficiencyPenalty: 1.1, // 10% increase for leaving lights on
  },
  food: {
    // per meal
    meatMeal: 2.5,
    localFoodBonus: 0.9, // 10% reduction for local/seasonal
  },
  wasteAndRecycling: {
    // per bottle
    plasticBottle: 0.03,
    recyclingBonus: 0.9, // 10% reduction for segregation
  },
};

// Fictional average for a student in this context, in kg CO2e per week
export const AVERAGE_FOOTPRINT_PER_WEEK = 25;
