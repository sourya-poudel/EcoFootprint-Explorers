import { PageFooter } from '@/components/layout/page-footer';

export function PageHeader() {
  return (
    <header className="py-8 bg-card border-b">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl lg:text-6xl">
          EcoFootprint Explorers
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
          Calculate and understand your personal carbon emissions
        </p>
        <div className="mt-8 flex justify-center items-center gap-4 sm:gap-8">
          {/* Logos removed as requested */}
        </div>
      </div>
    </header>
  );
}
