import { Heart } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex-1 bg-surface py-24">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
          <Heart className="h-8 w-8 text-primary fill-primary/20" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-6">About Eventify</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Eventify was created to bring event planners, decorators, and DIY hosts together.
          Discover the perfect aesthetic for your next gathering, shop the exact look, and share your own masterpieces.
        </p>
        <Link
          href="/explore"
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all inline-block"
        >
          Start Exploring
        </Link>
      </div>
    </div>
  );
}
