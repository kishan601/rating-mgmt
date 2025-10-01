import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { MapPin } from "lucide-react";

type StoreCardProps = {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  userRating?: number;
  onRate: (storeId: string) => void;
};

export default function StoreCard({
  id,
  name,
  address,
  averageRating,
  userRating,
  onRate,
}: StoreCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-store-${id}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg" data-testid="text-store-name">
          {name}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span data-testid="text-store-address">{address}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall Rating</p>
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} readonly size="sm" />
              <span className="text-sm font-medium" data-testid="text-average-rating">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
          {userRating !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Your Rating</p>
              <Badge variant="secondary" data-testid="badge-user-rating">
                {userRating} stars
              </Badge>
            </div>
          )}
        </div>
        <Button
          onClick={() => onRate(id)}
          variant={userRating ? "outline" : "default"}
          className="w-full"
          size="sm"
          data-testid="button-rate-store"
        >
          {userRating ? "Update Rating" : "Rate Store"}
        </Button>
      </CardContent>
    </Card>
  );
}
