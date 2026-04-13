import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStorage } from "@/hooks/use-storage";
import { Upload, Image as ImageIcon, X, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInserted: (imageUrl: string, altText: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  isOpen,
  onClose,
  onImageInserted,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedExistingImage, setSelectedExistingImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { uploadImage, isUploading, listImages, isLoading, deleteImage, isDeleting } = useStorage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setAltText(file.name.split('.')[0]); // Default alt text from filename

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const imageUrl = await uploadImage(selectedFile, "blog-images");
      onImageInserted(imageUrl, altText || "Image");
      handleClose();
      toast.success("Image uploaded and inserted successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setAltText("");
    setSelectedExistingImage(null);
    setSearchQuery("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onClose();
  };

  const loadExistingImages = async () => {
    try {
      const images = await listImages("blog-images");
      setExistingImages(images);
    } catch (error) {
      console.error("Failed to load existing images:", error);
      toast.error("Failed to load existing images");
    }
  };

  const handleExistingImageSelect = (imageUrl: string) => {
    setSelectedExistingImage(imageUrl);
    // Extract filename from URL for default alt text
    const filename = imageUrl.split("/").pop()?.split(".")[0] || "Image";
    setAltText(filename);
  };

  const handleInsertExistingImage = () => {
    if (!selectedExistingImage) return;
    onImageInserted(selectedExistingImage, altText || "Image");
    handleClose();
    toast.success("Image inserted successfully!");
  };

  const handleDeleteExistingImage = async (imageUrl: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(imageUrl);
        await loadExistingImages(); // Refresh the list
        toast.success("Image deleted successfully!");
      } catch (error) {
        console.error("Failed to delete image:", error);
        toast.error("Failed to delete image");
      }
    }
  };

  const filteredImages = existingImages.filter(image => {
    const filename = image.split("/").pop()?.toLowerCase() || "";
    return filename.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    if (isOpen && activeTab === "existing") {
      loadExistingImages();
    }
  }, [isOpen, activeTab]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setAltText(file.name.split('.')[0]); // Default alt text from filename

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Insert Image
          </DialogTitle>
          <DialogDescription>
            Upload a new image or select from existing images
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="existing">Existing Images</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('image-file-input')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to select or drag and drop an image
                </p>
                <p className="text-xs text-muted-foreground/75">
                  Supports JPEG, PNG, WebP, GIF (max 5MB)
                </p>
                <input
                  id="image-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => {
                      setSelectedFile(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="alt-text-upload">Image Description (Alt Text)</Label>
                  <Input
                    id="alt-text-upload"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Insert Image"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadExistingImages}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  Loading images...
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  {searchQuery ? "No images found matching your search" : "No images found"}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {filteredImages.map((imageUrl, index) => {
                    const filename = imageUrl.split("/").pop()?.split(".")[0] || `Image ${index + 1}`;
                    const isSelected = selectedExistingImage === imageUrl;
                    
                    return (
                      <div
                        key={imageUrl}
                        className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          isSelected ? "border-primary" : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => handleExistingImageSelect(imageUrl)}
                      >
                        <div className="aspect-square">
                          <img
                            src={imageUrl}
                            alt={filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExistingImage(imageUrl);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                          <p className="text-xs truncate">{filename}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedExistingImage && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label htmlFor="alt-text-existing">Image Description (Alt Text)</Label>
                  <Input
                    id="alt-text-existing"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image..."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleInsertExistingImage}
                disabled={!selectedExistingImage}
              >
                Insert Selected Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;