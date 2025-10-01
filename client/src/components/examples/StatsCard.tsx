import StatsCard from '../StatsCard'
import { Users } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Total Users" value="1,234" icon={Users} trend="+12% from last month" />
      <StatsCard title="Total Stores" value="567" icon={Users} trend="+8% from last month" />
      <StatsCard title="Total Ratings" value="3,456" icon={Users} trend="+15% from last month" />
    </div>
  )
}
