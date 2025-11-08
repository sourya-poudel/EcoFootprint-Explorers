'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sprout, PartyPopper, Undo2 } from 'lucide-react';
import { Confetti } from '@/components/confetti';

type Pledge = {
  name: string;
  treeCount: number;
};

export default function PledgePage() {
  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [name, setName] = useState('');
  const [treeCount, setTreeCount] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedPledge = localStorage.getItem('ecoPledge');
      if (savedPledge) {
        setPledge(JSON.parse(savedPledge));
      }
    } catch (error) {
      console.error('Failed to parse pledge from localStorage', error);
      setPledge(null);
    }
  }, []);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && treeCount > 0) {
      const newPledge = { name, treeCount };
      setPledge(newPledge);
      localStorage.setItem('ecoPledge', JSON.stringify(newPledge));
    }
  };

  const resetPledge = () => {
    setPledge(null);
    setName('');
    setTreeCount(1);
    localStorage.removeItem('ecoPledge');
  };
  
  if (!isClient) {
    return (
       <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pledge a Tree</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm">
        {pledge ? (
          <Card className="w-full max-w-md text-center relative overflow-hidden">
            <Confetti />
            <CardHeader>
              <PartyPopper className="mx-auto h-16 w-16 text-primary" />
              <CardTitle className="text-3xl mt-4">Thank You, {pledge.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-muted-foreground">
                You have pledged to plant
              </p>
              <p className="text-5xl font-bold text-primary my-2">
                {pledge.treeCount} {pledge.treeCount > 1 ? 'trees' : 'tree'}
              </p>
              <p className="text-muted-foreground">
                Your commitment makes a world of difference.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={resetPledge} className="w-full">
                <Undo2 className="mr-2" />
                Make a New Pledge
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <form onSubmit={handlePledgeSubmit}>
              <CardHeader className="text-center">
                <Sprout className="mx-auto h-12 w-12 text-primary" />
                <CardTitle>Take the Green Pledge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tree-count">Number of Trees to Plant</Label>
                    <span className="font-bold text-primary text-lg">{treeCount}</span>
                  </div>
                  <Slider
                    id="tree-count"
                    min={1}
                    max={50}
                    step={1}
                    value={[treeCount]}
                    onValueChange={(value) => setTreeCount(value[0])}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!name.trim()}>
                  Pledge Now
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </main>
  );
}