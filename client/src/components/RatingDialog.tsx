import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";

type RatingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  currentRating?: number;
  onSubmit: (rating: number) => void;
};

export default function RatingDialog({
  open,
  onOpenChange,
  storeName,
  currentRating,
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(currentRating || 0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentRating ? "Update" : "Submit"} Rating for {storeName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Select your rating</p>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="text-lg font-medium" data-testid="text-selected-rating">
                {rating} out of 5 stars
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-rating"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1"
              data-testid="button-submit-rating"
            >
              {currentRating ? "Update" : "Submit"} Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
