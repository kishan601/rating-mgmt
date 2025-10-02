import { useState, useEffect, useMemo } from "react";
import { Store, LogOut, Settings, Search } from "lucide-react";
import StoreCard from "@/components/StoreCard";
import RatingDialog from "@/components/RatingDialog";
import PasswordUpdateDialog from "@/components/PasswordUpdateDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type StoreWithRating = {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  createdAt: string;
};

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreWithRating | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const { data: stores = [], isLoading } = useQuery<StoreWithRating[]>({
    queryKey: [`/api/stores-with-ratings`],
  });

  const { data: userRatings = [] } = useQuery<any[]>({
    queryKey: [`/api/users/${currentUser?.id}/ratings`],
    enabled: !!currentUser?.id,
  });

  const filteredStores = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  const storesWithUserRatings = useMemo(() => {
    return filteredStores.map(store => {
      const userRating = userRatings.find(r => r.storeId === store.id);
      return {
        ...store,
        userRating: userRating?.rating,
      };
    });
  }, [filteredStores, userRatings]);

  const handleRateStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setRatingDialogOpen(true);
    }
  };

  const submitRatingMutation = useMutation({
    mutationFn: async ({ storeId, rating }: { storeId: string; rating: number }) => {
      const res = await apiRequest("POST", "/api/ratings", {
        userId: currentUser?.id,
        storeId,
        rating,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUser?.id}/ratings`] });
      queryClient.invalidateQueries({ queryKey: [`/api/stores-with-ratings`] });
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
      setRatingDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Store Directory</h1>
              <p className="text-sm text-muted-foreground">Find and rate stores</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPasswordOpen(true)}
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-stores"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading stores...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storesWithUserRatings.map((store) => (
                <StoreCard
                  key={store.id}
                  id={store.id}
                  name={store.name}
                  address={store.address}
                  averageRating={store.averageRating}
                  userRating={store.userRating}
                  onRate={handleRateStore}
                />
              ))}
            </div>

            {storesWithUserRatings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No stores found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      {selectedStore && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          storeName={selectedStore.name}
          currentRating={storesWithUserRatings.find(s => s.id === selectedStore.id)?.userRating}
          onSubmit={(rating) => {
            submitRatingMutation.mutate({ storeId: selectedStore.id, rating });
          }}
        />
      )}

      <PasswordUpdateDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSubmit={(data) => console.log('Password updated:', data)}
      />
    </div>
  );
}
