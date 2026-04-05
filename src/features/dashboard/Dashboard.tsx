import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MOCK_STATS = [
  { label: 'Total Bookings', value: '1,234', change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total Revenue', value: '$45,678', change: '+23%', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10' },
  { label: "Today's Bookings", value: '18', change: '+5', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
]

const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Feb', revenue: 14500 },
  { name: 'Mar', revenue: 18000 },
  { name: 'Apr', revenue: 22000 },
  { name: 'May', revenue: 28000 },
  { name: 'Jun', revenue: 36000 },
]

const Dashboard = () => {
  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-serif font-bold text-secondary">Welcome back, Admin! 👋</h1>
        <p className="text-primary/80 font-medium">Here's what's happening today at Hoi An Cooking Class.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MOCK_STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-7 rounded-3xl border border-cream flex items-center justify-between group hover:border-primary/30 transition-all duration-300 shadow-sm"
          >
            <div className="space-y-3">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-serif font-bold text-secondary">{stat.value}</span>
                <span className={cn(stat.color, "text-xs font-bold px-2 py-0.5 rounded-full", stat.bg)}>{stat.change}</span>
              </div>
            </div>
            <div className={stat.bg + " p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300"}>
              <stat.icon className={stat.color} size={32} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-3xl border border-cream shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
             <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-secondary">Revenue Overview</h3>
                <p className="text-xs text-primary/60">Monthly tracking performance</p>
             </div>
             <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                <TrendingUp size={14} />
                <span>+24.5% vs Last Year</span>
             </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8D5B3A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8D5B3A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5E9DA" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5D4037', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5D4037', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #F5E9DA', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#FFF'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8D5B3A" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-white p-8 rounded-3xl border border-cream shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-serif font-bold text-secondary">Recent Activity</h3>
             <button className="text-xs font-bold text-primary hover:underline flex items-center group">
               View All <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </button>
          </div>

          <div className="flex-1 space-y-6">
             {[
               { icon: CheckCircle2, title: 'Booking Confirmed', user: 'Nguyen Van A', time: '2 mins ago', color: 'text-green-500', bg: 'bg-green-50' },
               { icon: Clock, title: 'Payment Pending', user: 'Tran Thi B', time: '15 mins ago', color: 'text-orange-500', bg: 'bg-orange-50' },
               { icon: Sparkles, title: 'Review Received', user: 'John Doe', time: '1 hour ago', color: 'text-yellow-500', bg: 'bg-yellow-50' },
               { icon: Clock, title: 'Booking Request', user: 'Smith Family', time: '3 hours ago', color: 'text-blue-500', bg: 'bg-blue-50' },
             ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                   <div className={cn(activity.bg, activity.color, "p-2.5 rounded-xl group-hover:scale-110 transition-transform")}>
                      <activity.icon size={18} />
                   </div>
                   <div className="flex-1 space-y-0.5 border-b border-cream pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-secondary">{activity.title}</span>
                         <span className="text-[10px] font-medium text-secondary/40">{activity.time}</span>
                      </div>
                      <p className="text-xs text-secondary/50 font-medium">By {activity.user}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="mt-8 pt-8 border-t border-cream">
             <div className="bg-secondary p-5 rounded-2xl text-white relative overflow-hidden group cursor-pointer">
                <Sparkles className="absolute -right-4 -top-4 w-20 h-20 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Coming Soon</p>
                <p className="text-sm font-serif font-bold">Review Module Analytics</p>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full w-2/3 bg-primary" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
