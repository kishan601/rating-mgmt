import DataTable from '../DataTable'
import { Badge } from '@/components/ui/badge'

const mockUsers = [
  { id: '1', name: 'John Alexander Smith Johnson', email: 'john@example.com', address: '123 Main St', role: 'admin' },
  { id: '2', name: 'Jane Marie Anderson Williams', email: 'jane@example.com', address: '456 Oak Ave', role: 'user' },
  { id: '3', name: 'Bob Christopher Wilson Brown', email: 'bob@example.com', address: '789 Pine Rd', role: 'store' },
]

export default function DataTableExample() {
  return (
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
      ]}
      searchable
      searchPlaceholder="Search users..."
      onView={(row) => console.log('View:', row)}
      onEdit={(row) => console.log('Edit:', row)}
      onDelete={(row) => console.log('Delete:', row)}
    />
  )
}
