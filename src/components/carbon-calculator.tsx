"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Car,
  Bike,
  Bus,
  Footprints,
  Circle,
  HelpCircle,
  Lightbulb,
  Zap,
  Utensils,
  Trash2,
  Sprout,
  Loader2,
} from "lucide-react";

import { carbonCalculatorSchema, CarbonCalculatorForm } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateAndGetTips, CalculationResult } from "@/app/actions";
import { CalculatorResults } from "./calculator-results";
import { useToast } from "@/hooks/use-toast";
import type { PastResult } from "@/app/results/page";

const transportOptions = [
  { value: "Walk", label: "Walk", icon: Footprints },
  { value: "Bicycle", label: "Bicycle", icon: Bike },
  { value: "Bus", label: "Bus", icon: Bus },
  { value: "Car", label: "Car", icon: Car },
  { value: "Motorcycle", label: "Motorcycle", icon: Circle },
  { value: "Other", label: "Other", icon: HelpCircle },
] as const;

export function CarbonCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CarbonCalculatorForm>({
    resolver: zodResolver(carbonCalculatorSchema),
    defaultValues: {
      transport: {
        distanceToSchool: 0,
        daysPerWeek: 5,
      },
      electricityAndHome: {
        lightBulbsDaily: 5,
        lightsFansWhenNotNeeded: false,
        energySavingBulbs: false,
      },
      food: {
        meatConsumption: 3,
        localSeasonalFood: false,
      },
      wasteAndRecycling: {
        wasteSegregation: false,
        plasticBottlesPerWeek: 5,
      },
      awareness: false,
    },
  });

  async function onSubmit(data: CarbonCalculatorForm) {
    setIsLoading(true);
    setResult(null);
    try {
      const calculationResult = await calculateAndGetTips(data);
      setResult(calculationResult);

      // Save result to local storage
      const pastResults: PastResult[] = JSON.parse(localStorage.getItem('ecoFootprintResults') || '[]');
      const newResult: PastResult = {
        ...calculationResult,
        id: new Date().toISOString(),
        date: new Date().toISOString(),
      };
      pastResults.unshift(newResult);
      localStorage.setItem('ecoFootprintResults', JSON.stringify(pastResults.slice(0, 10))); // Limit to 10 results
      
      window.scrollTo(0, 0);

    } catch (error) {
      console.error("Calculation failed:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (result) {
    return (
      <CalculatorResults
        result={result}
        onReset={() => {
          setResult(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car /> Transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="transport.travelToSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How do you usually travel to school?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mode of transport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transportOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" /> {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transport.distanceToSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-way distance to school (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transport.daysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days you travel to school per week</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap /> Electricity & Home
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="electricityAndHome.lightBulbsDaily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many light bulbs are used daily?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="electricityAndHome.lightsFansWhenNotNeeded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Leave lights/fans on unnecessarily?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="electricityAndHome.energySavingBulbs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Use energy-saving bulbs (LEDs)?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils /> Food
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="food.meatConsumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many times do you eat meat in a week?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="food.localSeasonalFood"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Prefer local and seasonal food?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 /> Waste & Recycling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="wasteAndRecycling.plasticBottlesPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many plastic bottles do you use per week?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wasteAndRecycling.wasteSegregation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Segregate waste (wet/dry)?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout /> Awareness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="awareness"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Planted a tree or joined an eco-event recently?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>


        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            "Calculate My Footprint"
          )}
        </Button>
      </form>
    </Form>
  );
}
