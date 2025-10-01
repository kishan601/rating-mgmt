import { useState } from "react";
import { Store, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import PasswordUpdateDialog from "@/components/PasswordUpdateDialog";
import StarRating from "@/components/StarRating";
import ThemeToggle from "@/components/ThemeToggle";

//todo: remove mock functionality
const mockRatings = [
  { id: '1', userName: 'John Alexander Smith Johnson', userEmail: 'john@example.com', rating: 5, date: '2024-01-15' },
  { id: '2', userName: 'Jane Marie Anderson Williams', userEmail: 'jane@example.com', rating: 4, date: '2024-01-14' },
  { id: '3', userName: 'Bob Christopher Wilson Brown', userEmail: 'bob@example.com', rating: 5, date: '2024-01-13' },
];

export default function StoreDashboard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const averageRating = 4.5;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Store Dashboard</h1>
              <p className="text-sm text-muted-foreground">Downtown Electronics Store</p>
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Store Rating Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Rating</p>
              <div className="flex items-center gap-3">
                <StarRating rating={averageRating} readonly size="lg" />
                <span className="text-4xl font-bold" data-testid="text-average-rating">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex-1 pl-8 border-l">
              <p className="text-sm text-muted-foreground mb-2">Total Ratings</p>
              <p className="text-3xl font-bold" data-testid="text-total-ratings">
                {mockRatings.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Customer Ratings</h2>
          <DataTable
            data={mockRatings}
            columns={[
              { key: 'userName', label: 'Customer Name', sortable: true },
              { key: 'userEmail', label: 'Email', sortable: true },
              {
                key: 'rating',
                label: 'Rating',
                sortable: true,
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <StarRating rating={row.rating} readonly size="sm" />
                    <span className="text-sm font-medium">{row.rating}</span>
                  </div>
                ),
              },
              { key: 'date', label: 'Date', sortable: true },
            ]}
            searchable
            searchPlaceholder="Search by customer name or email..."
          />
        </div>
      </main>

      <PasswordUpdateDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSubmit={(data) => console.log('Password updated:', data)}
      />
    </div>
  );
}
