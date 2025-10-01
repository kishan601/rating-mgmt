import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <div className="flex items-center gap-1" data-testid="star-rating">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readonly && onRatingChange?.(starValue)}
            disabled={readonly}
            className={cn(
              "transition-colors",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            data-testid={`star-${starValue}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? "fill-chart-3 text-chart-3" : "fill-none text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
