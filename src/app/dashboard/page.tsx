"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Grid, Heart, Bell, LogOut, Star, TrendingUp, PlusCircle } from "lucide-react";
import { ConfettiMilestone } from "@/components/ConfettiMilestone";
import Link from "next/link";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("themes");
  const [profile, setProfile] = useState<any>(null);
  const [userThemes, setUserThemes] = useState<any[]>([]);
  const [savedThemes, setSavedThemes] = useState<any[]>([]);

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Fetch real profile data from Supabase
      supabase.from('users').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);

            // Fetch real followers and following count
            supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', user.id)
              .then(({ count }) => {
                const followersCount = count || 0;
                setProfile((prev: any) => prev ? { ...prev, followers: followersCount } : data);

                // Milestone checks
                if (followersCount >= 10 && !data.milestone10Followers) {
                  setMilestoneMessage("10 Followers");
                  setShowConfetti(true);
                } else if (followersCount >= 100 && !data.milestone100Followers) {
                  setMilestoneMessage("100 Followers");
                  setShowConfetti(true);
                }
              });

            supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', user.id)
              .then(({ count }) => {
                setProfile((prev: any) => prev ? { ...prev, following: count || 0 } : data);
              });
          } else {
            // Profile not yet written — show zeroes
            setProfile({
              username: user.email?.split("@")[0] || "Creator",
              email: user.email,
              followers: 0,
              following: 0,
              themesCount: 0,
              totalLikes: 0,
            });
          }
        });

      // Fetch real themes by this user
      supabase
        .from('themes')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) {
            setUserThemes(data.map(d => ({
              id: d.id,
              title: d.title,
              imageUrl: d.image_url,
              ...d
            })));
          } else {
            setUserThemes([]);
          }
        });

      // Fetch saved themes
      supabase.from('likes').select('themes(*)').eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setSavedThemes(data.map((d: any) => ({
              id: d.themes.id,
              title: d.themes.title,
              imageUrl: d.themes.image_url,
              ...d.themes
            })));
          } else {
            setSavedThemes([]);
          }
        });
    }
  }, [user]);

  if (loading || !user) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex-1 bg-surface pb-20">
      <ConfettiMilestone
        show={showConfetti}
        milestone={milestoneMessage}
        onClose={() => setShowConfetti(false)}
      />

      {/* Header Profile Section */}
      <div className="bg-white border-b border-border pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 border-4 border-white shadow-lg">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {profile?.username || user.email?.split("@")[0] || "Creator"}
              </h1>
              <p className="text-muted-foreground mb-6">{user.email}</p>

              <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userThemes.length}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Themes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{profile?.followers || 0}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{profile?.following || 0}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Following</div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <Link href="/create" className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Upload Theme
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-muted text-foreground flex items-center gap-2 font-medium hover:bg-muted/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-8">
        <div className="flex items-center gap-8 border-b border-border overflow-x-auto pb-[1px]">
          <TabButton active={activeTab === "themes"} onClick={() => setActiveTab("themes")} icon={<Grid className="w-4 h-4" />} label="My Themes" />
          <TabButton active={activeTab === "saved"} onClick={() => setActiveTab("saved")} icon={<Heart className="w-4 h-4" />} label="Saved" />
          <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell className="w-4 h-4" />} label="Notifications" />
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "themes" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
              {userThemes.length > 0 ? userThemes.map((theme) => (
                <Link href={`/theme/${theme.id}`} key={theme.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted cursor-pointer shadow-sm hover:shadow-md transition-all">
                  <img src={theme.imageUrl} alt={theme.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform">
                    <h3 className="font-bold text-lg mb-1">{theme.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Heart className="w-4 h-4 fill-white" />
                      {theme.likes || 0}
                    </div>
                  </div>
                </Link>
              )) : null}

              <Link href="/create" className="rounded-2xl border-2 border-dashed border-border aspect-[4/5] flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all cursor-pointer">
                <PlusCircle className="w-8 h-8 mb-2 opacity-50" />
                <span className="font-medium">Create New Theme</span>
              </Link>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="animate-fade-in">
              {savedThemes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {savedThemes.map((theme) => (
                    <div key={theme.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted cursor-pointer shadow-sm hover:shadow-md transition-all">
                      <img src={theme.imageUrl} alt={theme.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Heart className="w-10 h-10 mb-3 opacity-30" />
                  <h3 className="text-lg font-bold text-foreground mb-1">No saved themes yet</h3>
                  <p>Explore and save themes you love to find them here.</p>
                  <Link href="/explore" className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                    Explore Themes
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <h3 className="text-lg font-bold text-foreground mb-1">No notifications yet</h3>
                <p>When someone likes your theme or follows you, you&apos;ll see it here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap outline-none ${active
          ? "border-primary text-foreground font-bold"
          : "border-transparent text-muted-foreground hover:text-foreground font-medium"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
