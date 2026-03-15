"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, Heart, Check, BadgeCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// App-provided sample themes for inspiration (not user-generated)
const APP_THEMES = [
  { id: "1", title: "Rustic Autumn Wedding", type: "Wedding", budget: 4500, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800", fromApp: true },
  { id: "2", title: "Neon Cyberpunk Birthday", type: "Birthday", budget: 1200, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800", fromApp: true },
  { id: "3", title: "Minimalist Corporate Gala", type: "Corporate", budget: 8000, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800", fromApp: true },
  { id: "4", title: "Boho Beach Engagement", type: "Engagement", budget: 2000, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800", fromApp: true },
  { id: "5", title: "Enchanted Forest Prom", type: "Other", budget: 5000, image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800", fromApp: true },
  { id: "6", title: "Vintage Tea Party Bridal Shower", type: "Wedding", budget: 800, image: "https://images.unsplash.com/photo-1522673607200-164d1f6fc811?q=80&w=800", fromApp: true },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeType, setActiveType] = useState("All");
  const [userThemes, setUserThemes] = useState<any[]>([]);
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Smart Budget Builder State
  const [budgetType, setBudgetType] = useState("Wedding");
  const [targetBudget, setTargetBudget] = useState(5000);
  const [showBudgetResults, setShowBudgetResults] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryTerm = searchQuery.trim();
        
        // 1. Fetch Themes
        let themeQuery = supabase
          .from('themes')
          .select(`*, users (username)`);
        
        if (queryTerm) {
           themeQuery = themeQuery.ilike('title', `%${queryTerm}%`);
        }
        
        if (activeType !== "All") {
           themeQuery = themeQuery.eq('event_type', activeType);
        }

        if (sortOption === "newest") {
           themeQuery = themeQuery.order('created_at', { ascending: false });
        } else if (sortOption === "budget_low") {
           themeQuery = themeQuery.order('estimated_budget', { ascending: true });
        } else if (sortOption === "budget_high") {
           themeQuery = themeQuery.order('estimated_budget', { ascending: false });
        }

        const { data: themeData, error: themeError } = await themeQuery;
        if (themeError) throw themeError;

        if (themeData) {
          const themes = themeData.map(doc => ({
            id: doc.id,
            title: doc.title,
            type: doc.event_type,
            budget: doc.estimated_budget,
            image: doc.image_url,
            creatorName: doc.users?.username || "Unknown Creator",
            fromApp: false,
            ...doc
          }));
          setUserThemes(themes);
        } else {
          setUserThemes([]);
        }

        // 2. Fetch Users
        if (queryTerm) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select(`*`)
            .ilike('username', `%${queryTerm}%`);
            
          if (userError) throw userError;
          setFoundUsers(userData || []);
        } else {
          setFoundUsers([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 400); // debounce search
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeType, sortOption]);

  // Combine DB themes and App themes (fallback)
  // We keep app themes only if they pass frontend checks
  const filteredAppThemes = APP_THEMES.filter(theme => {
    const matchesSearch = theme.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === "All" || theme.type === activeType;
    return matchesSearch && matchesType;
  });

  const filteredThemes = [...userThemes, ...filteredAppThemes];

  const budgetRecommendations = filteredThemes.filter(theme =>
    theme.type === budgetType && theme.budget <= targetBudget
  );

  return (
    <div className="flex-1 bg-background pb-24">

      {/* Search Header */}
      <div className="bg-surface border-b border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground text-center mb-8">Discover Inspiration</h1>

          <div className="max-w-2xl mx-auto relative animate-scale-in">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 border border-border bg-white rounded-full shadow-lg shadow-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
              placeholder="Search for &apos;floral wedding&apos;, &apos;neon birthday&apos;..."
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {["All", "Wedding", "Birthday", "Corporate", "Engagement", "Other"].map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeType === type ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Main Feed */}
        <div className="lg:col-span-8 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : "Explore"}
            </h2>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-surface border border-border text-foreground text-sm font-medium rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest First</option>
                <option value="budget_low">Budget: Low to High</option>
                <option value="budget_high">Budget: High to Low</option>
              </select>
              <ArrowUpDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* User Results */}
          {searchQuery && foundUsers.length > 0 && (
            <div className="mb-10 animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">Users</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {foundUsers.map((u) => (
                  <Link href={`/profile/${u.id}`} key={u.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.username || u.email}`} alt={u.username} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{u.username || "Anonymous"}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">View Profile & Themes</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Theme Results */}
          {searchQuery && (
            <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">Themes</h3>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
            {filteredThemes.length > 0 ? filteredThemes.map((theme, i) => {
              const displayImage = theme.imageUrl || theme.image;
              return (
                <Link href={`/theme/${theme.id}`} key={theme.id} className="group flex flex-col rounded-2xl overflow-hidden bg-surface border border-border shadow-sm hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={displayImage} alt={theme.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                    {/* From App Badge */}
                    {theme.fromApp && (
                      <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md">
                        <BadgeCheck className="w-3.5 h-3.5" /> From App
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider">{theme.type}</div>
                      <div className="text-xs font-bold text-muted-foreground">${theme.budget} est.</div>
                    </div>
                    <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">{theme.title}</h3>
                    {!theme.fromApp && (
                      <p className="text-xs text-muted-foreground mt-1">by {theme.creatorName || "Community Member"}</p>
                    )}
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full border-2 border-dashed border-border rounded-2xl py-20 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <Search className="w-10 h-10 mb-3 opacity-30" />
                <h3 className="text-lg font-bold text-foreground mb-1">No themes found</h3>
                <p>Try adjusting your search or filters to find what you&apos;re looking for.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">

          {/* WOW FEATURE 1: SMART BUDGET THEME BUILDER */}
          <div className="bg-gradient-to-br from-indigo-50 to-primary/5 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-bold text-primary mb-4 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 fill-primary" /> Smart Builder
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Budget Theme Builder</h3>
              <p className="text-sm text-muted-foreground mb-6">Tell us your event type and budget, and we&apos;ll curate the perfect themes.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Event Type</label>
                  <select
                    value={budgetType}
                    onChange={(e) => setBudgetType(e.target.value)}
                    className="w-full bg-white border border-border px-4 py-2.5 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Engagement">Engagement</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Budget</label>
                    <span className="font-bold text-primary">${targetBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="20000"
                    step="100"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowBudgetResults(true)}
                className="w-full py-3 bg-foreground text-background rounded-full font-bold shadow-md hover:bg-foreground/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> Find Matching Themes
              </button>

              {/* Budget Results Area */}
              {showBudgetResults && (
                <div className="mt-6 pt-6 border-t border-indigo-100/50 animate-fade-in">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Best Matches
                  </h4>
                  {budgetRecommendations.length > 0 ? (
                    <div className="space-y-3">
                      {budgetRecommendations.slice(0, 3).map(theme => (
                        <Link href={`/theme/${theme.id}`} key={theme.id} className="flex gap-3 bg-white p-2 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                          <img src={theme.image} alt={theme.title} className="w-16 h-16 rounded-lg object-cover bg-muted" />
                          <div className="flex-1 py-1">
                            <div className="text-xs font-bold text-primary">${theme.budget} est</div>
                            <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{theme.title}</h5>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm bg-white p-4 rounded-xl text-center text-muted-foreground border border-border">
                      No themes found under ${targetBudget}. Try increasing your budget!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Community Section - Real creators will populate here */}
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm mb-4">
                The leaderboard will appear here as real creators join and share their themes.
              </p>
              <Link href="/register" className="text-sm font-bold text-primary hover:underline">
                Be the first to join →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
