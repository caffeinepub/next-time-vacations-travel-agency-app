import React, { useState } from 'react';
import { useGetAllCruiseLineLogos, useAddCruiseLineLogo, useUpdateCruiseLineLogo, useDeleteCruiseLineLogo } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function CruiseLineLogosManagement() {
  const { data: logos, isLoading } = useGetAllCruiseLineLogos();
  const addLogo = useAddCruiseLineLogo();
  const updateLogo = useUpdateCruiseLineLogo();
  const deleteLogo = useDeleteCruiseLineLogo();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{ name: string; imageUrl: string } | null>(null);

  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddLogo = async () => {
    if (!newLogoName.trim()) {
      toast.error('Please enter a cruise line name');
      return;
    }
    if (!newLogoFile) {
      toast.error('Please select an image file');
      return;
    }

    setIsProcessing(true);
    try {
      const imageUrl = await convertFileToDataUrl(newLogoFile);
      await addLogo.mutateAsync({ name: newLogoName.trim(), imageUrl });
      toast.success('Cruise line logo added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add cruise line logo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateLogo = async () => {
    if (!selectedLogo) return;
    
    if (!newLogoName.trim()) {
      toast.error('Please enter a cruise line name');
      return;
    }

    setIsProcessing(true);
    try {
      let imageUrl = selectedLogo.imageUrl;
      
      if (newLogoFile) {
        imageUrl = await convertFileToDataUrl(newLogoFile);
      }

      await updateLogo.mutateAsync({ name: newLogoName.trim(), imageUrl });
      toast.success('Cruise line logo updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cruise line logo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!selectedLogo) return;

    try {
      await deleteLogo.mutateAsync(selectedLogo.name);
      toast.success('Cruise line logo deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedLogo(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete cruise line logo');
    }
  };

  const resetForm = () => {
    setNewLogoName('');
    setNewLogoFile(null);
    setNewLogoPreview(null);
    setSelectedLogo(null);
  };

  const openEditDialog = (logo: { name: string; imageUrl: string }) => {
    setSelectedLogo(logo);
    setNewLogoName(logo.name);
    setNewLogoPreview(logo.imageUrl);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (logo: { name: string; imageUrl: string }) => {
    setSelectedLogo(logo);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cruise Line Logos</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Logo
        </Button>
      </div>

      {logos && logos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logos.map((logo) => (
            <Card key={logo.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{logo.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={logo.imageUrl}
                    alt={`${logo.name} logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(logo)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => openDeleteDialog(logo)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No cruise line logos yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Logo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Logo Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cruise Line Logo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="logoName">Cruise Line Name</Label>
              <Input
                id="logoName"
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
                placeholder="e.g., Royal Caribbean"
              />
            </div>
            <div>
              <Label htmlFor="logoFile">Logo Image</Label>
              <Input
                id="logoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max size: 5MB. Supported formats: PNG, JPG, SVG
              </p>
            </div>
            {newLogoPreview && (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={newLogoPreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddLogo} disabled={addLogo.isPending || isProcessing}>
              {addLogo.isPending || isProcessing ? 'Adding...' : 'Add Logo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Logo Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cruise Line Logo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editLogoName">Cruise Line Name</Label>
              <Input
                id="editLogoName"
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
                placeholder="e.g., Royal Caribbean"
              />
            </div>
            <div>
              <Label htmlFor="editLogoFile">Replace Logo Image (Optional)</Label>
              <Input
                id="editLogoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to keep current image
              </p>
            </div>
            {newLogoPreview && (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={newLogoPreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLogo} disabled={updateLogo.isPending || isProcessing}>
              {updateLogo.isPending || isProcessing ? 'Updating...' : 'Update Logo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cruise Line Logo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the logo for "{selectedLogo?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedLogo(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLogo} disabled={deleteLogo.isPending}>
              {deleteLogo.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
