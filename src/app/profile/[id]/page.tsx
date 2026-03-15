"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Grid, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [userThemes, setUserThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const profileId = resolvedParams.id;
    if (!profileId) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const { data: userData } = await supabase.from('users').select('*').eq('id', profileId).single();
        if (userData) {
          // Fetch followers/following count
          const { count: followersCount } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('following_id', profileId);
          const { count: followingCount } = await supabase.from('followers').select('*', { count: 'exact', head: true }).eq('follower_id', profileId);
          
          setProfile({
            ...userData,
            followers: followersCount || 0,
            following: followingCount || 0
          });

          // Check if current logged in user follows this profile
          if (user && user.id !== profileId) {
            const { data: followData } = await supabase.from('followers').select('id').match({ follower_id: user.id, following_id: profileId }).single();
            if (followData) setIsFollowing(true);
          }
        }

        // Fetch themes
        const { data: themeData } = await supabase
          .from('themes')
          .select('*')
          .eq('creator_id', profileId)
          .order('created_at', { ascending: false });
          
        if (themeData) {
          setUserThemes(themeData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [resolvedParams.id, user]);

  const handleFollow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const profileId = resolvedParams.id;
    if (user.id === profileId) return;

    if (isFollowing) {
      setIsFollowing(false);
      setProfile((prev: any) => prev ? { ...prev, followers: prev.followers - 1 } : null);
      await supabase.from('followers').delete().match({ follower_id: user.id, following_id: profileId });
    } else {
      setIsFollowing(true);
      setProfile((prev: any) => prev ? { ...prev, followers: prev.followers + 1 } : null);
      await supabase.from('followers').insert({ follower_id: user.id, following_id: profileId });
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>;
  }

  if (!profile) {
    return <div className="flex-1 flex flex-col items-center justify-center min-h-screen text-muted-foreground gap-4">
      <h2 className="text-xl font-bold text-foreground">User not found</h2>
      <Link href="/explore" className="text-primary hover:underline">Back to Explore</Link>
    </div>;
  }

  return (
    <div className="flex-1 bg-surface pb-20">
      {/* Top Header */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Header Profile Section */}
      <div className="bg-white border-b border-border pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 border-4 border-white shadow-lg">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.username || profile.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {profile.username || profile.email?.split("@")[0] || "Anonymous"}
              </h1>
              <p className="text-muted-foreground mb-6">User Profile</p>

              <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userThemes.length}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Themes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{profile.followers || 0}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{profile.following || 0}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Following</div>
                </div>
              </div>

              {user?.id !== profile.id && (
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={handleFollow}
                    className={`px-8 py-2.5 rounded-full font-semibold transition-colors shadow-sm ${
                      isFollowing 
                        ? "bg-muted text-foreground hover:bg-muted/80" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow User"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-8">
        <div className="flex items-center gap-2 mb-6">
           <Grid className="w-5 h-5 text-foreground" />
           <h2 className="text-2xl font-bold text-foreground">Themes by {profile.username}</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
          {userThemes.length > 0 ? userThemes.map((theme) => (
            <Link href={`/theme/${theme.id}`} key={theme.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted cursor-pointer shadow-sm hover:shadow-md transition-all">
              <img src={theme.image_url} alt={theme.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform">
                <h3 className="font-bold text-lg mb-1">{theme.title}</h3>
              </div>
            </Link>
          )) : (
            <div className="col-span-full border-2 border-dashed border-border rounded-2xl py-20 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <Grid className="w-10 h-10 mb-3 opacity-30" />
              <h3 className="text-lg font-bold text-foreground mb-1">No themes posted</h3>
              <p>This user hasn't posted any themes yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
