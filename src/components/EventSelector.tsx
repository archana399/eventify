import { eventTypes, EventType } from '@/data/eventData';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  onSelect: (event: EventType) => void;
}

const EventSelector = ({ onSelect }: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">What are you celebrating?</h2>
        <p className="text-muted-foreground">Choose your event type to get started</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {eventTypes.map((event) => (
          <Card
            key={event.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.03] hover:border-primary/50 group"
            onClick={() => onSelect(event.id)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <span className="text-5xl block group-hover:scale-110 transition-transform">{event.emoji}</span>
              <h3 className="text-lg font-semibold">{event.label}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventSelector;
