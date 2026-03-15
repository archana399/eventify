import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, User, Calendar, MapPin, Phone } from 'lucide-react';

export interface UserDetails {
  name: string;
  phone: string;
  eventDate: string;
  venue: string;
}

interface Props {
  onSubmit: (details: UserDetails) => void;
}

const UserDetailsForm = ({ onSubmit }: Props) => {
  const [details, setDetails] = useState<UserDetails>({
    name: '',
    phone: '',
    eventDate: '',
    venue: '',
  });

  const isValid = details.name.trim() && details.phone.trim() && details.eventDate;

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <span className="text-5xl block">📝</span>
        <h2 className="text-3xl font-bold">Tell Us About You</h2>
        <p className="text-muted-foreground">We'll personalize your event plan</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Your Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={details.name}
              onChange={e => setDetails(d => ({ ...d, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={details.phone}
              onChange={e => setDetails(d => ({ ...d, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Event Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={details.eventDate}
              onChange={e => setDetails(d => ({ ...d, eventDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Venue (optional)
            </Label>
            <Input
              id="venue"
              placeholder="Event location"
              value={details.venue}
              onChange={e => setDetails(d => ({ ...d, venue: e.target.value }))}
            />
          </div>

          <Button
            onClick={() => isValid && onSubmit(details)}
            disabled={!isValid}
            size="lg"
            className="w-full gap-2"
          >
            Continue <ArrowRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsForm;
