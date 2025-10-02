import { useState } from "react";
import { Users, Store, Star, Plus, Settings, LogOut } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import AddUserDialog from "@/components/AddUserDialog";
import AddStoreDialog from "@/components/AddStoreDialog";
import PasswordUpdateDialog from "@/components/PasswordUpdateDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import StarRating from "@/components/StarRating";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { User, Store as StoreType } from "@shared/schema";

type UserWithoutPassword = Omit<User, 'password'>;
type StoreWithoutPassword = Omit<StoreType, 'password'>;
type Stats = {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
};

export default function AdminDashboard() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  const { data: users = [], isLoading: usersLoading } = useQuery<UserWithoutPassword[]>({
    queryKey: ["/api/users"],
  });

  const { data: stores = [], isLoading: storesLoading } = useQuery<StoreWithoutPassword[]>({
    queryKey: ["/api/stores"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/users", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "User added successfully",
      });
      setAddUserOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    },
  });

  const addStoreMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/stores", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Store added successfully",
      });
      setAddStoreOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add store",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/users/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/stores/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Store deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete store",
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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">System Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" data-testid="button-settings">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Users" 
            value={statsLoading ? "..." : stats?.totalUsers?.toString() || "0"} 
            icon={Users} 
          />
          <StatsCard 
            title="Total Stores" 
            value={statsLoading ? "..." : stats?.totalStores?.toString() || "0"} 
            icon={Store} 
          />
          <StatsCard 
            title="Total Ratings" 
            value={statsLoading ? "..." : stats?.totalRatings?.toString() || "0"} 
            icon={Star} 
          />
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
              <TabsTrigger value="stores" data-testid="tab-stores">Stores</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={() => setAddUserOpen(true)} data-testid="button-add-user">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button onClick={() => setAddStoreOpen(true)} data-testid="button-add-store">
                <Plus className="h-4 w-4 mr-2" />
                Add Store
              </Button>
              <Button variant="outline" onClick={() => setPasswordOpen(true)} data-testid="button-update-password">
                Update Password
              </Button>
            </div>
          </div>

          <TabsContent value="users" className="space-y-4">
            {usersLoading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <DataTable
                data={users}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  { key: 'address', label: 'Address', sortable: true },
                  {
                    key: 'role',
                    label: 'Role',
                    sortable: true,
                    render: (row) => (
                      <Badge variant={row.role === 'admin' ? 'default' : 'secondary'}>
                        {row.role}
                      </Badge>
                    ),
                  },
                ]}
                searchable
                searchPlaceholder="Search by name, email, address, or role..."
                onView={(row) => console.log('View user:', row)}
                onEdit={(row) => console.log('Edit user:', row)}
                onDelete={(row) => {
                  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                    deleteUserMutation.mutate(row.id);
                  }
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            {storesLoading ? (
              <div className="text-center py-8">Loading stores...</div>
            ) : (
              <DataTable
                data={stores}
                columns={[
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  { key: 'address', label: 'Address', sortable: true },
                ]}
                searchable
                searchPlaceholder="Search by name, email, or address..."
                onView={(row) => console.log('View store:', row)}
                onEdit={(row) => console.log('Edit store:', row)}
                onDelete={(row) => {
                  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                    deleteStoreMutation.mutate(row.id);
                  }
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={(data) => addUserMutation.mutate(data)}
      />

      <AddStoreDialog
        open={addStoreOpen}
        onOpenChange={setAddStoreOpen}
        onSubmit={(data) => addStoreMutation.mutate(data)}
      />

      <PasswordUpdateDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSubmit={(data) => console.log('Password updated:', data)}
      />
    </div>
  );
}
