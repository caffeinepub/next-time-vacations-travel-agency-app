import { useState } from 'react';
import { useGetReviewsByCruiseId, useSubmitReview, useDeleteReview, useUpdateReview } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ReviewSectionProps {
  cruiseId: string;
}

export function ReviewSection({ cruiseId }: ReviewSectionProps) {
  const { identity } = useInternetIdentity();
  const { data: reviews, isLoading } = useGetReviewsByCruiseId(cruiseId);
  const submitReview = useSubmitReview();
  const deleteReview = useDeleteReview();
  const updateReview = useUpdateReview();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const userPrincipal = identity?.getPrincipal().toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingReviewId) {
        await updateReview.mutateAsync({
          reviewId: editingReviewId,
          rating: BigInt(rating),
          title: title.trim(),
          comment: comment.trim(),
        });
        toast.success('Review updated successfully');
      } else {
        await submitReview.mutateAsync({
          cruiseId,
          rating: BigInt(rating),
          title: title.trim(),
          comment: comment.trim(),
        });
        toast.success('Review submitted successfully');
      }

      setTitle('');
      setComment('');
      setRating(5);
      setShowForm(false);
      setEditingReviewId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview.mutateAsync(reviewId);
      toast.success('Review deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleEdit = (review: any) => {
    setEditingReviewId(review.id);
    setRating(Number(review.rating));
    setTitle(review.title);
    setComment(review.comment);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setTitle('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Write a Review</span>
              {showForm && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="w-full">
                {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  {renderStars(rating, true)}
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this cruise..."
                    rows={4}
                    maxLength={500}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={submitReview.isPending || updateReview.isPending}
                    className="flex-1"
                  >
                    {submitReview.isPending || updateReview.isPending
                      ? 'Submitting...'
                      : editingReviewId
                      ? 'Update Review'
                      : 'Submit Review'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Customer Reviews ({reviews?.length || 0})
        </h3>

        {isLoading ? (
          <p className="text-muted-foreground">Loading reviews...</p>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwnReview = userPrincipal === review.userId.toString();
              return (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {review.userId.toString().slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {renderStars(Number(review.rating))}
                          </div>
                          <h4 className="font-semibold">{review.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      {isOwnReview && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(review)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                            disabled={deleteReview.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this cruise!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
