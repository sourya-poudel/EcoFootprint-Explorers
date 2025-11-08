"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { CalculationResult } from "@/app/actions";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

export type PastResult = CalculationResult & {
  id: string;
  date: string;
};

const chartConfig = {
  transport: { label: "Transport", color: "hsl(var(--chart-1))" },
  electricity: { label: "Electricity", color: "hsl(var(--chart-2))" },
  food: { label: "Food", color: "hsl(var(--chart-3))" },
  waste: { label: "Waste", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;


export default function ResultsPage() {
  const [results, setResults] = useState<PastResult[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedResults: PastResult[] = JSON.parse(
        localStorage.getItem("ecoFootprintResults") || "[]"
      );
      setResults(savedResults);
    } catch (error) {
      console.error("Failed to parse results from localStorage", error);
      setResults([]);
    }
  }, []);

  const clearResults = () => {
    localStorage.removeItem("ecoFootprintResults");
    setResults([]);
  };

  const getTrend = () => {
    if (results.length < 2) return null;
    const latest = results[0].totalEmissions;
    const previous = results[1].totalEmissions;
    if (latest < previous) return "down";
    if (latest > previous) return "up";
    return "stable";
  }

  const trend = getTrend();

  if (!isClient) {
    return (
       <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">My Past Results</h1>
        {results.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearResults}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No results yet!
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the calculator to see your carbon footprint history.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {trend && (
             <Alert>
             <div className="flex items-center gap-2">
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                {trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
               <AlertTitle>
                 Your footprint is trending {trend}!
               </AlertTitle>
             </div>
             <AlertDescription>
               {trend === 'down' && 'Great job! Your emissions are decreasing.'}
               {trend === 'up' && 'Your emissions have increased. Let\'s try to lower them.'}
               {trend === 'stable' && 'Your emissions have remained stable.'}
             </AlertDescription>
           </Alert>
          )}
          <Accordion type="single" collapsible className="w-full" defaultValue={results[0].id}>
            {results.map((result) => (
              <AccordionItem value={result.id} key={result.id}>
                <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                        <span>{format(new Date(result.date), "MMMM d, yyyy 'at' h:mm a")}</span>
                        <span className="font-bold text-primary">{result.totalEmissions} kg CO₂e</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle>Emission Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ChartContainer config={chartConfig} className="min-h-[20px] w-full">
                        <BarChart
                          accessibilityLayer
                          data={[{ name: "Emissions", ...result.categoryEmissions }]}
                          layout="vertical"
                          margin={{ left: -20, top: 0, right: 0, bottom: 0 }}
                        >
                          <CartesianGrid horizontal={false} />
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                          <XAxis type="number" hide />
                          <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent hideLabel />} />
                          <Bar dataKey="transport" stackId="a" fill="var(--color-transport)" radius={[4, 4, 4, 4]} />
                          <Bar dataKey="electricity" stackId="a" fill="var(--color-electricity)" radius={[4, 4, 4, 4]} />
                          <Bar dataKey="food" stackId="a" fill="var(--color-food)" radius={[4, 4, 4, 4]} />
                          <Bar dataKey="waste" stackId="a" fill="var(--color-waste)" radius={[4, 4, 4, 4]} />
                        </BarChart>
                      </ChartContainer>
                       <Separator />
                       <div className="space-y-2 pt-2">
                        <h4 className="font-semibold">Personalized Green Tips:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {result.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                            ))}
                        </ul>
                       </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </main>
  );
}
