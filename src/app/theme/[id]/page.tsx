"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Heart, Share2, Bookmark, ArrowLeft, Tag, DollarSign, CalendarCheck, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// App-provided sample themes (tagged as "From App")
const APP_THEMES: Record<string, any> = {
  "1": {
    id: "1", title: "Rustic Autumn Wedding", type: "Wedding", budget: 4500, fromApp: true,
    description: "A beautiful, warm autumn-themed wedding setup focused on rustic wood elements, warm string lights, and deep orange floral arrangements. Perfect for an outdoor evening event.",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: [
      { name: "Wooden Arch Backdrop", description: "Reclaimed wood arch, 8ft tall, easily assembled.", image: "https://images.unsplash.com/photo-1542152349-14a0f44358f2?q=80&w=400" },
      { name: "Warm String Lights", description: "100ft LED warm outdoor lights, waterproof.", image: "https://images.unsplash.com/photo-1505369711681-432d03706c9a?q=80&w=400" },
      { name: "Autumn Floral Mix", description: "Deep orange roses, dried pampas grass, and eucalyptus.", image: "https://images.unsplash.com/photo-1507693175865-c8c36531eb3b?q=80&w=400" },
    ]
  },
  "2": {
    id: "2", title: "Neon Cyberpunk Birthday", type: "Birthday", budget: 1200, fromApp: true,
    description: "An electrifying neon-themed birthday setup with LED strips, blacklights, and futuristic glowing decorations.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: [
      { name: "LED Neon Strip Lights", description: "Multicolor RGB strips, 50ft, app-controlled.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400" },
    ]
  },
  "3": {
    id: "3", title: "Minimalist Corporate Gala", type: "Corporate", budget: 8000, fromApp: true,
    description: "Clean, sophisticated corporate event design with neutral tones and elegant floral arrangements.",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: [
      { name: "Modern White Centerpieces", description: "Minimal white ceramic vases with eucalyptus.", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400" },
    ]
  },
  "4": {
    id: "4", title: "Boho Beach Engagement", type: "Engagement", budget: 2000, fromApp: true,
    description: "A dreamy boho-chic engagement party on the beach with driftwood, macrame, and soft florals.",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: [
      { name: "Macrame Backdrop", description: "Hand-woven macrame arch, 6ft wide.", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400" },
    ]
  },
  "5": {
    id: "5", title: "Enchanted Forest Prom", type: "Other", budget: 5000, fromApp: true,
    description: "A magical forest-themed prom with fairy lights, greenery, and enchanting decor.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: []
  },
  "6": {
    id: "6", title: "Vintage Tea Party Bridal Shower", type: "Wedding", budget: 800, fromApp: true,
    description: "A charming vintage-inspired bridal shower with tea sets, lace, and pastel flowers.",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1f6fc811?q=80&w=1200",
    creatorName: "Eventify Team", creatorId: "app",
    products: []
  },
};

export default function ThemePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [theme, setTheme] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [viewChecklist, setViewChecklist] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const themeId = resolvedParams.id;
    
    // Check if it's an app-provided theme
    if (APP_THEMES[themeId]) {
      setTheme(APP_THEMES[themeId]);
      setLikes(0);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from Supabase (user-created theme)
    supabase.from('themes').select(`
      *,
      users (username),
      products (*)
    `).eq('id', themeId).single().then(({ data }) => {
      if (data) {
        setTheme({
          id: data.id,
          title: data.title,
          type: data.event_type,
          budget: data.estimated_budget,
          description: data.description,
          imageUrl: data.image_url,
          creatorName: data.users?.username || "Unknown Creator",
          creator_id: data.creator_id,
          products: data.products?.map((p: any) => ({
             name: p.product_name,
             description: p.description,
             image: p.image_url
          })) || []
        });

        // Fetch likes count
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('theme_id', themeId)
          .then(({ count }) => {
            setLikes(count || 0);
          });
          
        // Fetch comments
        supabase.from('comments').select('*, users(username)').eq('theme_id', themeId).order('created_at', { ascending: false })
          .then(({ data: commentsData }) => {
            if (commentsData) setComments(commentsData);
          });
          
        if (user) {
           supabase.from('likes').select('id').match({ theme_id: themeId, user_id: user.id }).single()
             .then(({ data: likeData }) => {
               if (likeData) setIsLiked(true);
             });
             
           if (data.creator_id && data.creator_id !== user.id) {
             supabase.from('followers').select('id').match({ follower_id: user.id, following_id: data.creator_id }).single()
               .then(({ data: followData }) => {
                 if (followData) setIsFollowing(true);
               });
           }
        }
      } else {
        setTheme(null);
      }
      setLoading(false);
    });
  }, [resolvedParams.id, user]);

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const themeId = theme.id;
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
      await supabase.from('likes').delete().match({ theme_id: themeId, user_id: user.id });
    } else {
      setIsLiked(true);
      setLikes(likes + 1);
      await supabase.from('likes').insert({ theme_id: themeId, user_id: user.id });
    }
  };

  const handleSave = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleFollow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (theme.creator_id === user.id) return;

    if (isFollowing) {
      setIsFollowing(false);
      await supabase.from('followers').delete().match({ follower_id: user.id, following_id: theme.creator_id });
    } else {
      setIsFollowing(true);
      await supabase.from('followers').insert({ follower_id: user.id, following_id: theme.creator_id });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    const commentData = {
      theme_id: theme.id,
      user_id: user.id,
      comment_text: newComment.trim(),
    };

    const { data } = await supabase.from('comments').insert(commentData).select('*, users(username)').single();
    
    if (data) {
      setComments([data, ...comments]);
      setNewComment("");
    }
    setSubmittingComment(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
    </div>;
  }

  if (!theme) {
    return <div className="flex-1 flex flex-col items-center justify-center min-h-screen text-muted-foreground gap-4">
      <h2 className="text-xl font-bold text-foreground">Theme not found</h2>
      <Link href="/explore" className="text-primary hover:underline">Back to Explore</Link>
    </div>;
  }

  return (
    <div className="flex-1 bg-surface pb-24">
      {/* Top Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl h-14 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            {!theme.fromApp && (
              <button onClick={handleLike} className={`p-2 rounded-full transition-colors flex items-center gap-2 ${isLiked ? "bg-red-50 text-red-500" : "bg-muted hover:bg-muted/80 text-foreground"}`}>
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-bold">{likes}</span>
              </button>
            )}
            <button onClick={handleSave} className={`p-2 rounded-full transition-colors ${isSaved ? "bg-primary/10 text-primary" : "bg-muted hover:bg-muted/80 text-foreground"}`}>
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in">
            <div className="rounded-3xl overflow-hidden bg-muted aspect-[4/3] max-h-[600px] border border-border shadow-sm">
              <img src={theme.imageUrl} alt={theme.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-3 mb-4">
                {theme.fromApp && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="w-3 h-3" /> From App
                  </span>
                )}
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> {theme.type}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" /> Est. ${theme.budget}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                {theme.title}
              </h1>

              <div className="prose prose-lg text-muted-foreground max-w-none mb-8">
                <p>{theme.description}</p>
              </div>

              {/* Comments Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-6">Comments ({comments.length})</h3>
                
                <form onSubmit={handleComment} className="mb-8 flex gap-3">
                   <input
                     type="text"
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="Add a comment..."
                     className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted/30 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                   />
                   <button 
                     type="submit" 
                     disabled={submittingComment || !newComment.trim()}
                     className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                   >
                     Post
                   </button>
                </form>

                <div className="space-y-6">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-4 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 overflow-hidden border border-border">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.users?.username || 'user'}`} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground text-sm">{comment.users?.username || 'User'}</span>
                          <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{comment.comment_text}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                     <p className="text-muted-foreground text-sm py-8 text-center border-2 border-dashed border-border rounded-xl">
                       No comments yet. Be the first to share your thoughts!
                     </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Creator & Products */}
          <div className="lg:col-span-4 space-y-6">
            {/* Creator Card */}
            <div className="p-6 bg-white border border-border rounded-3xl shadow-sm animate-scale-in">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                {theme.fromApp ? "Curated By" : "Designed By"}
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <Link href={theme.fromApp ? "#" : `/profile/${theme.creator_id}`} className="w-14 h-14 rounded-full overflow-hidden bg-muted border-2 border-border flex-shrink-0 hover:opacity-80 transition-opacity">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${theme.creatorName}`} alt={theme.creatorName} className="w-full h-full object-cover" />
                </Link>
                <div>
                  <Link href={theme.fromApp ? "#" : `/profile/${theme.creator_id}`}>
                    <h4 className="font-bold text-lg text-foreground flex items-center gap-2 hover:text-primary transition-colors">
                      {theme.creatorName}
                      {theme.fromApp && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {theme.fromApp ? "Official Eventify Content" : "Community Creator"}
                  </p>
                </div>
              </div>
              {!theme.fromApp && user?.id !== theme.creator_id && (
                <button 
                  onClick={handleFollow}
                  className={`w-full py-2.5 font-semibold rounded-full transition-colors ${
                    isFollowing 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow Creator"}
                </button>
              )}
            </div>

            {/* WOW FEATURE 2: RECREATE THIS THEME */}
            {theme.products && theme.products.length > 0 && (
              <>
                <div className="p-6 bg-gradient-to-br from-primary/10 to-orange-400/10 border border-primary/20 rounded-3xl shadow-sm animate-scale-in" style={{ animationDelay: "100ms" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <CalendarCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Love this look?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    Get the exact checklist of items you need to recreate this theme for your own event!
                  </p>
                  <button 
                    onClick={() => setViewChecklist(!viewChecklist)}
                    className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
                  >
                    {viewChecklist ? "Hide Checklist" : "Recreate This Theme"}
                  </button>
                </div>

                {/* Products List */}
                <div className="p-6 bg-white border border-border rounded-3xl shadow-sm animate-scale-in" style={{ animationDelay: "200ms" }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg text-foreground">
                      {viewChecklist ? "Your Shopping Checklist" : "Products Used"}
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">{theme.products.length} Items</span>
                  </div>
                  
                  <div className="space-y-4">
                    {theme.products.map((product: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start group">
                        {viewChecklist ? (
                          <div className="mt-1 flex-shrink-0">
                            <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20" />
                          </div>
                        ) : (
                          product.image && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                          )
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {viewChecklist && (
                    <button className="w-full mt-6 py-2.5 bg-foreground text-background font-semibold rounded-full transition-colors flex items-center justify-center gap-2">
                      <Bookmark className="w-4 h-4" /> Save Checklist
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
