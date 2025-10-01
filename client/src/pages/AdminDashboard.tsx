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

//todo: remove mock functionality
const mockUsers = [
  { id: '1', name: 'John Alexander Smith Johnson', email: 'john@example.com', address: '123 Main Street, Downtown Area', role: 'admin' },
  { id: '2', name: 'Jane Marie Anderson Williams', email: 'jane@example.com', address: '456 Oak Avenue, Westside', role: 'user' },
  { id: '3', name: 'Bob Christopher Wilson Brown', email: 'bob@example.com', address: '789 Pine Road, Northside', role: 'store', rating: 4.5 },
];

const mockStores = [
  { id: '1', name: 'Downtown Electronics Store', email: 'electronics@example.com', address: '123 Tech Street, Downtown', rating: 4.5 },
  { id: '2', name: 'Westside Fashion Boutique', email: 'fashion@example.com', address: '456 Fashion Avenue, West Side', rating: 3.8 },
];

export default function AdminDashboard() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

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
            <Button variant="ghost" size="icon" data-testid="button-logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Users" value="1,234" icon={Users} trend="+12% from last month" />
          <StatsCard title="Total Stores" value="567" icon={Store} trend="+8% from last month" />
          <StatsCard title="Total Ratings" value="3,456" icon={Star} trend="+15% from last month" />
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
            <DataTable
              data={mockUsers}
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
                {
                  key: 'rating',
                  label: 'Rating',
                  render: (row) => row.role === 'store' && row.rating ? (
                    <div className="flex items-center gap-2">
                      <StarRating rating={row.rating} readonly size="sm" />
                      <span className="text-sm">{row.rating}</span>
                    </div>
                  ) : '-',
                },
              ]}
              searchable
              searchPlaceholder="Search by name, email, address, or role..."
              onView={(row) => console.log('View user:', row)}
              onEdit={(row) => console.log('Edit user:', row)}
              onDelete={(row) => console.log('Delete user:', row)}
            />
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <DataTable
              data={mockStores}
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                { key: 'address', label: 'Address', sortable: true },
                {
                  key: 'rating',
                  label: 'Rating',
                  sortable: true,
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <StarRating rating={row.rating} readonly size="sm" />
                      <span className="text-sm">{row.rating.toFixed(1)}</span>
                    </div>
                  ),
                },
              ]}
              searchable
              searchPlaceholder="Search by name, email, or address..."
              onView={(row) => console.log('View store:', row)}
              onEdit={(row) => console.log('Edit store:', row)}
              onDelete={(row) => console.log('Delete store:', row)}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={(data) => {
          console.log('User added:', data);
          setAddUserOpen(false);
        }}
      />

      <AddStoreDialog
        open={addStoreOpen}
        onOpenChange={setAddStoreOpen}
        onSubmit={(data) => {
          console.log('Store added:', data);
          setAddStoreOpen(false);
        }}
      />

      <PasswordUpdateDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSubmit={(data) => console.log('Password updated:', data)}
      />
    </div>
  );
}
