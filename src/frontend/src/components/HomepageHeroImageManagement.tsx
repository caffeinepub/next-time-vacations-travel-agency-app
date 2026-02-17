import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Image as ImageIcon, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { useGetHomepageHeroImage, useUpdateHomepageHeroImage, useResetHomepageHeroImage } from '../hooks/useQueries';
import { toast } from 'sonner';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function HomepageHeroImageManagement() {
  const { data: currentHeroImage, isLoading } = useGetHomepageHeroImage();
  const updateHeroImage = useUpdateHomepageHeroImage();
  const resetHeroImage = useResetHomepageHeroImage();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check if it's an image
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP).';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.error(error);
      return;
    }

    // Clear any previous errors
    setValidationError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!previewUrl) {
      toast.error('Please select an image first.');
      return;
    }

    try {
      await updateHeroImage.mutateAsync(previewUrl);
      toast.success('Homepage hero image updated successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error updating hero image:', error);
      toast.error(error.message || 'Failed to update hero image. Please try again.');
    }
  };

  const handleReset = async () => {
    try {
      await resetHeroImage.mutateAsync();
      toast.success('Homepage hero image reset to default.');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error resetting hero image:', error);
      toast.error(error.message || 'Failed to reset hero image. Please try again.');
    }
  };

  const handleClearPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Homepage Hero Image
        </CardTitle>
        <CardDescription>
          Upload a custom hero image for the homepage. Maximum file size: {MAX_FILE_SIZE_MB}MB. Supported formats: JPEG, PNG, WebP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Hero Image */}
        {currentHeroImage && !previewUrl && (
          <div className="space-y-2">
            <Label>Current Hero Image</Label>
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={currentHeroImage}
                alt="Current homepage hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="hero-image-upload">Upload New Image</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="hero-image-upload"
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              onChange={handleFileSelect}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended dimensions: 1600x900px or larger for best quality
          </p>
        </div>

        {/* Validation Error */}
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        {previewUrl && !validationError && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearPreview}
              >
                Clear
              </Button>
            </div>
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-ocean-500 bg-muted">
              <img
                src={previewUrl}
                alt="Preview of new hero image"
                className="w-full h-full object-cover"
              />
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-600" />
                <span>
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={!previewUrl || !!validationError || updateHeroImage.isPending}
            className="flex-1"
          >
            {updateHeroImage.isPending ? 'Saving...' : 'Save Hero Image'}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!currentHeroImage || resetHeroImage.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {resetHeroImage.isPending ? 'Resetting...' : 'Reset to Default'}
          </Button>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The hero image will be displayed on the homepage. After saving, the new image will appear immediately without requiring a page refresh.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
