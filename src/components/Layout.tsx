import { PremiumNavigation } from './PremiumNavigation';
import { PremiumBackground } from './PremiumBackground';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative">
      <PremiumBackground />
      <PremiumNavigation />
      <main className="relative pt-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
