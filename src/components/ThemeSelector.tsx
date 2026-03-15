import { EventType, ThemeType, getThemesForEvent } from '@/data/eventData';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface Props {
  eventType: EventType;
  onSelect: (theme: ThemeType) => void;
}

const ThemeSelector = ({ eventType, onSelect }: Props) => {
  const availableThemes = getThemesForEvent(eventType);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Pick a Theme</h2>
        <p className="text-muted-foreground">Select a decoration theme for your event</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {availableThemes.map((theme) => (
          <Card
            key={theme.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 overflow-hidden group"
            onClick={() => onSelect(theme.id)}
          >
            <AspectRatio ratio={4 / 3}>
              <img
                src={theme.image}
                alt={theme.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </AspectRatio>
            <CardContent className="p-4 text-center space-y-1">
              <h3 className="text-lg font-semibold">
                <span className="mr-2">{theme.emoji}</span>{theme.label}
              </h3>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
