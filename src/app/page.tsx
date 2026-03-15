"use client";

import { useState } from 'react';
import { EventType, ThemeType, eventTypes } from '@/data/eventData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, PartyPopper } from 'lucide-react';
import EventSelector from '@/components/EventSelector';
import BudgetSelector from '@/components/BudgetSelector';
import ThemeSelector from '@/components/ThemeSelector';
import DecorationPicker from '@/components/DecorationPicker';
import ProductShowcase from '@/components/ProductShowcase';
import BookingConfirmation from '@/components/BookingConfirmation';

type Step = 'landing' | 'event' | 'budget' | 'theme' | 'decoration' | 'products' | 'booking';

const stepOrder: Step[] = ['landing', 'event', 'budget', 'theme', 'decoration', 'products', 'booking'];

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeType | null>(null);
  const [decoration, setDecoration] = useState<string | null>(null);

  const currentIndex = stepOrder.indexOf(step);
  const progress = step === 'landing' ? 0 : step === 'booking' ? 100 : (currentIndex / (stepOrder.length - 1)) * 100;

  const goBack = () => {
    const prev = stepOrder[currentIndex - 1];
    if (prev) setStep(prev);
  };

  const reset = () => {
    setStep('landing');
    setEventType(null);
    setBudget(null);
    setTheme(null);
    setDecoration(null);
  };

  const eventLabel = eventType ? eventTypes.find(e => e.id === eventType)?.label || '' : '';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center w-full">
      {/* Wizard Header - Inside the flex layout but distinct from Global Navbar */}
      <div className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <PartyPopper className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Smart Event Organizer
            </span>
          </div>
          {step !== 'landing' && step !== 'booking' && (
            <Button variant="ghost" size="sm" onClick={goBack} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
        </div>
        {step !== 'landing' && (
          <div className="container mx-auto px-4 pb-2 max-w-5xl">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-8 w-full max-w-5xl flex-1">
        {step === 'landing' && (
          <div className="flex flex-col items-center justify-center pt-10 pb-20 text-center space-y-8 animate-in fade-in duration-700 w-full">
            <div className="space-y-4">
              <span className="text-7xl block animate-bounce">🎊</span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Plan Your Perfect Event
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                From birthdays to weddings — get decoration ideas, item lists,
                cost estimates, and shopping links in minutes.
              </p>
            </div>
            <Button size="lg" className="text-lg px-10 py-6 gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-all" onClick={() => setStep('event')}>
              <PartyPopper className="h-5 w-5" />
              Start Planning
            </Button>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground pt-8 max-w-3xl">
              <span className="bg-muted px-4 py-2 rounded-full">🎂 Birthdays</span>
              <span className="bg-muted px-4 py-2 rounded-full">💍 Engagements</span>
              <span className="bg-muted px-4 py-2 rounded-full">💑 Anniversaries</span>
              <span className="bg-muted px-4 py-2 rounded-full">🎉 Retirements</span>
              <span className="bg-muted px-4 py-2 rounded-full">👶 Baby Showers</span>
              <span className="bg-muted px-4 py-2 rounded-full">🏠 Housewarming</span>
              <span className="bg-muted px-4 py-2 rounded-full">🏢 Corporate</span>
              <span className="bg-muted px-4 py-2 rounded-full">🪔 Festivals</span>
            </div>
          </div>
        )}


        {step === 'event' && (
          <EventSelector onSelect={(e) => { setEventType(e); setStep('budget'); }} />
        )}

        {step === 'budget' && (
          <BudgetSelector onSelect={(b) => { setBudget(b); setStep('theme'); }} />
        )}

        {step === 'theme' && eventType && (
          <ThemeSelector eventType={eventType} onSelect={(t) => { setTheme(t); setStep('decoration'); }} />
        )}

        {step === 'decoration' && theme && (
          <DecorationPicker theme={theme} budget={budget!} onSelect={(d) => { setDecoration(d); setStep('products'); }} />
        )}

        {step === 'products' && theme && budget && (
          <ProductShowcase theme={theme} budget={budget} eventLabel={eventLabel} onReset={() => setStep('booking')} />
        )}

        {step === 'booking' && eventType && theme && budget && (
          <BookingConfirmation
            userDetails={null}
            eventType={eventType}
            theme={theme}
            budget={budget}
            decoration={decoration || ''}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}
