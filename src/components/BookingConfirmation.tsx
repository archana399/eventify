import { useState } from 'react';
import { UserDetails } from './UserDetailsForm';
import { EventType, ThemeType, eventTypes, allThemes, formatCurrency, getScaledItems } from '@/data/eventData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PartyPopper, User, Calendar, MapPin, Phone, Palette, Sparkles } from 'lucide-react';

interface Props {
  userDetails: UserDetails | null;
  eventType: EventType;
  theme: ThemeType;
  budget: number;
  decoration: string;
  onReset: () => void;
}

const BookingConfirmation = ({ userDetails, eventType, theme, budget, decoration, onReset }: Props) => {
  const [confirmed, setConfirmed] = useState(false);
  const event = eventTypes.find(e => e.id === eventType)!;
  const themeInfo = allThemes[theme];
  const items = getScaledItems(theme, budget);
  const totalCost = items.reduce((sum, i) => sum + i.scaledCost, 0);

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="h-14 w-14 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold">Booking Confirmed! 🎉</h2>
          <p className="text-muted-foreground text-lg">
            {userDetails ? (
              <>Thank you, <span className="font-semibold text-foreground">{userDetails.name}</span>!</>
            ) : (
              <>Your event plan is ready!</>
            )}
          </p>
          <p className="text-muted-foreground">
            Your {event.label} plan has been confirmed. We'll send details to your phone.
          </p>
        </div>

        <Card className="text-left">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-lg mb-4">📋 Booking Summary</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold">SEO-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              {userDetails && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{userDetails.name}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Event</span>
                <span>{event.emoji} {event.label}</span>
              </div>
              {userDetails?.eventDate && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date(userDetails.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Theme</span>
                <span>{themeInfo.emoji} {themeInfo.label}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-bold text-primary text-base">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onReset} size="lg" className="gap-2">
          <PartyPopper className="h-5 w-5" /> Plan Another Event
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <span className="text-5xl block">✅</span>
        <h2 className="text-3xl font-bold">Confirm Your Booking</h2>
        <p className="text-muted-foreground">Review your event details below</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            {userDetails && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{userDetails.name}</p>
                </div>
              </div>
            )}
            {userDetails && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{userDetails.phone}</p>
                </div>
              </div>
            )}
            {userDetails?.eventDate && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Event Date</p>
                  <p className="font-medium">{new Date(userDetails.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            )}
            {userDetails?.venue && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="font-medium">{userDetails.venue}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Event</p>
                <p className="font-medium">{event.emoji} {event.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Theme</p>
                <p className="font-medium">{themeInfo.emoji} {themeInfo.label}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-semibold">Total Decoration Cost</span>
              <span className="font-bold text-primary text-lg">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button onClick={() => setConfirmed(true)} size="lg" className="w-full gap-2">
              <CheckCircle className="h-5 w-5" /> Confirm Booking
            </Button>
            <Button onClick={onReset} variant="outline" size="lg" className="w-full">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
