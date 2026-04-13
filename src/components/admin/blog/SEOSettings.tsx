import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormValues } from "@/hooks/use-blog-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Globe, Target, Tag } from "lucide-react";

interface SEOSettingsProps {
  form: UseFormReturn<BlogFormValues>;
}

const SEOSettings: React.FC<SEOSettingsProps> = ({ form }) => {
  const { register, watch, formState: { errors } } = form;
  
  const metaTitle = watch("meta_title") || "";
  const metaDescription = watch("meta_description") || "";
  const title = watch("title") || "";
  
  const metaTitleLength = metaTitle.length || title.length;
  const metaDescriptionLength = metaDescription.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="meta_title" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Meta Title
            <span className={`text-sm ml-auto ${metaTitleLength > 60 ? 'text-destructive' : metaTitleLength > 50 ? 'text-warning' : 'text-muted-foreground'}`}>
              {metaTitleLength}/60
            </span>
          </Label>
          <Input
            id="meta_title"
            placeholder="Leave empty to use blog title"
            {...register("meta_title")}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Optimal length: 50-60 characters. Leave empty to use the blog title.
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta_description" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Meta Description
            <span className={`text-sm ml-auto ${metaDescriptionLength > 160 ? 'text-destructive' : metaDescriptionLength > 150 ? 'text-warning' : 'text-muted-foreground'}`}>
              {metaDescriptionLength}/160
            </span>
          </Label>
          <Textarea
            id="meta_description"
            placeholder="Enter a compelling description for search engines..."
            {...register("meta_description")}
            className="w-full resize-none"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Optimal length: 140-160 characters. This appears in search results.
          </p>
        </div>

        {/* Focus Keyword */}
        <div className="space-y-2">
          <Label htmlFor="focus_keyword" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Focus Keyword
          </Label>
          <Input
            id="focus_keyword"
            placeholder="e.g., travel tips, seoul restaurants"
            {...register("focus_keyword")}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Main keyword you want this article to rank for.
          </p>
        </div>

        {/* Meta Keywords */}
        <div className="space-y-2">
          <Label htmlFor="meta_keywords" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            SEO Keywords
          </Label>
          <Input
            id="meta_keywords"
            placeholder="keyword1, keyword2, keyword3"
            {...register("meta_keywords")}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated keywords related to your content.
          </p>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonical_url" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Canonical URL
          </Label>
          <Input
            id="canonical_url"
            placeholder="https://yoursite.com/blog/article-slug"
            {...register("canonical_url")}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Optional: Specify the canonical URL to avoid duplicate content issues.
          </p>
        </div>

        {/* Search Preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Engine Preview
          </h4>
          <div className="space-y-1">
            <div className="text-lg text-primary font-medium truncate">
              {metaTitle || title || "Your Blog Title"}
            </div>
            <div className="text-xs text-green-600">
              yoursite.com/blog/article-name
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {metaDescription || "Your meta description will appear here..."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOSettings;