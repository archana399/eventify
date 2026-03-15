"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Award } from "lucide-react";

interface ConfettiMilestoneProps {
  milestone: string; // e.g., "10 Followers", "100 Followers", "500 Likes"
  show: boolean;
  onClose: () => void;
}

export function ConfettiMilestone({ milestone, show, onClose }: ConfettiMilestoneProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      const timeout = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in pointer-events-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Milestone Reached!</h3>
        <p className="text-muted-foreground mb-6">
          Congratulations on reaching <strong className="text-foreground">{milestone}</strong> on Eventify!
        </p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="px-6 py-2 bg-muted text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
