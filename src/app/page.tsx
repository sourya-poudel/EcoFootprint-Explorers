import { CarbonCalculator } from '@/components/carbon-calculator';
import { PageFooter } from '@/components/layout/page-footer';
import { PageHeader } from '@/components/layout/page-header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <CarbonCalculator />
      </main>
      <PageFooter />
    </div>
  );
}
