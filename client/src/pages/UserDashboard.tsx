import { useState } from "react";
import { Store, LogOut, Settings, Search } from "lucide-react";
import StoreCard from "@/components/StoreCard";
import RatingDialog from "@/components/RatingDialog";
import PasswordUpdateDialog from "@/components/PasswordUpdateDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

//todo: remove mock functionality
const mockStores = [
  { id: '1', name: 'Downtown Electronics Store', address: '123 Tech Street, Downtown Area', averageRating: 4.5, userRating: 5 },
  { id: '2', name: 'Westside Fashion Boutique', address: '456 Fashion Avenue, West Side', averageRating: 3.8, userRating: undefined },
  { id: '3', name: 'Northside Grocery Market', address: '789 Market Road, Northside District', averageRating: 4.2, userRating: 4 },
  { id: '4', name: 'Eastside Coffee and Books', address: '321 Reading Lane, Eastside', averageRating: 4.7, userRating: undefined },
];

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<typeof mockStores[0] | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const filteredStores = mockStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRateStore = (storeId: string) => {
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setRatingDialogOpen(true);
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
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

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No stores found matching your search.</p>
          </div>
        )}
      </main>

      {selectedStore && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          storeName={selectedStore.name}
          currentRating={selectedStore.userRating}
          onSubmit={(rating) => {
            console.log('Rating submitted for store:', selectedStore.id, 'Rating:', rating);
            setRatingDialogOpen(false);
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
