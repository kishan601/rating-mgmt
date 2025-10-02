import { useState, useEffect } from "react";
import { Store, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import PasswordUpdateDialog from "@/components/PasswordUpdateDialog";
import StarRating from "@/components/StarRating";
import ThemeToggle from "@/components/ThemeToggle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function StoreDashboard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentStore(JSON.parse(user));
    }
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      localStorage.removeItem("currentUser");
      setLocation("/");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    },
  });

  const { data: ratings = [], isLoading: ratingsLoading } = useQuery<any[]>({
    queryKey: [`/api/stores/${currentStore?.id}/ratings`],
    enabled: !!currentStore?.id,
  });

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiRequest("PUT", "/api/update-password", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPasswordOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
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
              <h1 className="text-xl font-semibold">Store Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentStore?.name || "Loading..."}</p>
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logoutMutation.mutate()}
              data-testid="button-logout"
            >
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
                {ratings.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Customer Ratings</h2>
          {ratingsLoading ? (
            <div className="text-center py-8">Loading ratings...</div>
          ) : (
            <DataTable
              data={ratings}
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
                { 
                  key: 'createdAt', 
                  label: 'Date', 
                  sortable: true,
                  render: (row) => new Date(row.createdAt).toLocaleDateString()
                },
              ]}
              searchable
              searchPlaceholder="Search by customer name or email..."
            />
          )}
        </div>
      </main>

      <PasswordUpdateDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSubmit={(data) => updatePasswordMutation.mutate(data)}
      />
    </div>
  );
}
