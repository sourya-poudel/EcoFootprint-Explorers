"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Leaf, Share2, RefreshCw } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CalculationResult } from "@/app/actions";
import { AVERAGE_FOOTPRINT_PER_WEEK } from "@/lib/constants";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Confetti } from "./confetti";
import { useToast } from "@/hooks/use-toast";

interface CalculatorResultsProps {
  result: CalculationResult;
  onReset: () => void;
}

const chartConfig = {
  transport: { label: "Transport", color: "hsl(var(--chart-1))" },
  electricity: { label: "Electricity", color: "hsl(var(--chart-2))" },
  food: { label: "Food", color: "hsl(var(--chart-3))" },
  waste: { label: "Waste", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export function CalculatorResults({ result, onReset }: CalculatorResultsProps) {
  const { totalEmissions, categoryEmissions, tips } = result;
  const { toast } = useToast();
  const isBelowAverage = totalEmissions < AVERAGE_FOOTPRINT_PER_WEEK;
  
  const chartData = [{
    name: "Emissions",
    ...categoryEmissions
  }];

  const getResultMessage = () => {
    if (totalEmissions < 10) return "🌍 Great job, Eco Hero! You’re a true planet saver!";
    if (isBelowAverage) return "👍 Well done! Your carbon footprint is below average. Keep it up!";
    return "⚠️ Your carbon footprint is a bit high. Let's see how we can improve!";
  };
  
  const shareResult = async () => {
    const shareText = `I just calculated my carbon footprint with EcoFootprint Explorers! It's ${totalEmissions} kg CO₂ per week. Let's save the planet together!`;
    const shareData = {
      title: 'My Carbon Footprint',
      text: shareText,
      url: window.location.href,
    };
    try {
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Result Copied!",
          description: "Your carbon footprint result has been copied to the clipboard.",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Clipboard access was denied. This may be due to browser permissions or a non-secure connection (HTTP).",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Share Failed",
          description: "Could not share or copy your result. Please try again.",
        });
      }
    }
  };

  return (
    <div className="space-y-8 relative">
      {isBelowAverage && <Confetti />}
      <Card className="text-center">
        <CardHeader>
          <CardDescription>Your Weekly Carbon Footprint</CardDescription>
          <CardTitle className="text-5xl font-bold text-primary">
            {totalEmissions} kg CO₂e
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">{getResultMessage()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emission Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
              />
              <XAxis type="number" hide />
              <Tooltip cursor={{fill: "hsl(var(--muted))"}} content={<ChartTooltipContent />} />
              <Bar dataKey="transport" stackId="a" fill="var(--color-transport)" radius={[4, 4, 4, 4]} />
              <Bar dataKey="electricity" stackId="a" fill="var(--color-electricity)" radius={[4, 4, 4, 4]} />
              <Bar dataKey="food" stackId="a" fill="var(--color-food)" radius={[4, 4, 4, 4]} />
              <Bar dataKey="waste" stackId="a" fill="var(--color-waste)" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf /> Personalized Green Tips
          </CardTitle>
          <CardDescription>Here are some AI-powered suggestions just for you:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onReset} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Calculate Again
        </Button>
        <Button onClick={shareResult} className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share My Result
        </Button>
      </div>
    </div>
  );
}
