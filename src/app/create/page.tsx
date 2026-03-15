"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Upload, Plus, X, Image as ImageIcon, Loader2, Camera } from "lucide-react";

interface Product {
  name: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
}

export default function CreateTheme() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Wedding");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    { name: "", description: "", imageFile: null, imagePreview: null }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addProduct = () => setProducts([...products, { name: "", description: "", imageFile: null, imagePreview: null }]);
  
  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    (newProducts[index] as any)[field] = value;
    setProducts(newProducts);
  };

  const handleProductImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newProducts = [...products];
      newProducts[index].imageFile = file;
      newProducts[index].imagePreview = URL.createObjectURL(file);
      setProducts(newProducts);
    }
  };

  const removeProductImage = (index: number) => {
    const newProducts = [...products];
    newProducts[index].imageFile = null;
    newProducts[index].imagePreview = null;
    setProducts(newProducts);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to create a theme.");
      return;
    }
    
    // 0. Intelligent Fallback Logic
    const getPlaceholder = (category: string) => {
      const placeholders: Record<string, string> = {
        Wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
        Birthday: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?q=80&w=800",
        Corporate: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800",
        Engagement: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800",
        Other: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800"
      };
      return placeholders[category] || placeholders.Other;
    };

    // --- START REAL PHOTO UPLOAD FIX (BASE64 FALLBACK) ---
    const initialPlaceholder = getPlaceholder(type);
    setLoading(true);
    setError("");

    // Helper: Compress and convert to Base64 if needed
    const processImage = async (file: File, fallbackUrl: string): Promise<string> => {
      // 1. Attempt Real Supabase Storage Upload first
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('themes')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('themes')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (storageErr) {
        console.warn("Storage restricted. Switching to Optimized Base64 Fallback.");
        
        // 2. Client-side Resize/Compress to fit in Database
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 600; // Good balance for theme previews
              const MAX_HEIGHT = 600;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              // Compress to 0.6 quality to stay around 50-100KB
              resolve(canvas.toDataURL("image/jpeg", 0.6));
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      }
    };

    try {
      // 1. Process Main Theme Image
      const finalThemeUrl = imageFile 
        ? await processImage(imageFile, initialPlaceholder)
        : initialPlaceholder;

      // 2. Process All Product Images in Parallel
      const validProducts = products.filter(p => p.name.trim() !== "");
      const productsWithUrls = await Promise.all(
        validProducts.map(async (product, idx) => {
          const productFallback = `https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&sig=${idx}`;
          const productUrl = product.imageFile
            ? await processImage(product.imageFile, productFallback)
            : productFallback;

          return {
            name: product.name,
            description: product.description,
            image: productUrl,
          };
        })
      );

      // 3. Save to Supabase DB
      const themeData = {
        title,
        event_type: type,
        estimated_budget: Number(budget),
        description,
        image_url: finalThemeUrl,
        creator_id: user.id,
      };
    // --- END REAL PHOTO UPLOAD FIX ---

      try {
        const { data: insertedTheme, error: insertError } = await supabase
          .from('themes')
          .insert(themeData)
          .select()
          .single();

        if (insertError) throw insertError;

        // Insert products if any
        if (productsWithUrls.length > 0) {
          const productsData = productsWithUrls.map(p => ({
            theme_id: insertedTheme.id,
            product_name: p.name,
            description: p.description,
            image_url: p.image
          }));

          const { error: productsError } = await supabase
            .from('products')
            .insert(productsData);

          if (productsError) {
            console.error("Failed to insert products:", productsError);
          }
        }

        router.push("/dashboard");
      } catch (dbErr: any) {
        console.error("Database failed:", dbErr);
        setError(`Failed to save theme to database: ${dbErr.message || "Unknown error"}`);
        setLoading(false);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create a Theme</h1>
          <p className="text-muted-foreground mt-2">Share your decoration ideas and inspire others to recreate your event.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-8 animate-fade-in">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Basic Details */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Basic Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Theme Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Minimalist Rustic Wedding"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Estimated Budget ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 border border-border bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-muted/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Describe the vibe, colors, and overall aesthetic..."
                />
              </div>
            </div>
          </div>

          {/* Theme Image */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Theme Image</h2>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-2xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors relative overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                    <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground/60" />
                    <p className="mb-2 text-sm font-medium"><span className="text-primary font-bold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Products Used */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Products Used</h2>
              <button 
                type="button" 
                onClick={addProduct}
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            
            <div className="space-y-5">
              {products.map((product, index) => (
                <div key={index} className="p-4 border border-border rounded-xl bg-muted/10 relative group">
                  <div className="flex gap-4">
                    {/* Product Image Upload */}
                    <div className="flex-shrink-0">
                      <label className="block cursor-pointer">
                        <div className={`w-24 h-24 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${product.imagePreview ? "border-primary/30" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}>
                          {product.imagePreview ? (
                            <img src={product.imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Camera className="w-5 h-5 mb-1 opacity-50" />
                              <span className="text-[10px] font-medium">Add Photo</span>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleProductImageChange(index, e)} 
                        />
                      </label>
                      {product.imagePreview && (
                        <button 
                          type="button"
                          onClick={() => removeProductImage(index)}
                          className="mt-1 text-[10px] font-medium text-red-500 hover:text-red-600 w-full text-center"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Product Text Fields */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Product Name</label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleProductChange(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          placeholder="e.g. Floral Arch Backdrop"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Short Description</label>
                        <input
                          type="text"
                          value={product.description}
                          onChange={(e) => handleProductChange(index, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-border bg-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          placeholder="Where did you get it? What material?"
                        />
                      </div>
                    </div>

                    {/* Remove Product Button */}
                    {products.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeProduct(index)}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 self-start"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Optimizing & Uploading...</>
              ) : (
                <><Upload className="w-5 h-5" /> Publish Theme</>
              )}
            </button>
            {loading && (
              <p className="text-[10px] text-muted-foreground animate-pulse">
                Processing your real photos. This may take up to 30 seconds...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
