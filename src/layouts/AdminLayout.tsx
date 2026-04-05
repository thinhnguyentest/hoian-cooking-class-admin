import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Toaster } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'content', label: 'CMS Content', icon: FileText, path: '/content' },
  { id: 'media', label: 'Media Manager', icon: ImageIcon, path: '/media' },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare, path: '/reviews' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-[#F9F7F2]">
      <Toaster richColors position="top-right" expand={true} />

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          "bg-white text-secondary flex flex-col z-30 transition-all duration-300 relative border-r border-cream-dark",
          !isSidebarOpen && "items-center"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-10 bg-primary p-1.5 rounded-full border-2 border-white text-white hover:scale-110 transition-transform shadow-lg"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>

        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 h-24">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border border-primary/20">
            <Sparkles className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-serif text-lg font-bold tracking-wide text-secondary">HOI AN TOURS</span>
              <span className="text-[10px] text-secondary/40 uppercase tracking-widest">Admin Control</span>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-3 mt-10 overflow-y-auto custom-scrollbar">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center space-x-4 px-5 py-4.5 rounded-[1.5rem] transition-all duration-300 group relative cursor-pointer",
                  isActive 
                    ? "bg-secondary text-white shadow-2xl shadow-secondary/40 scale-[1.02]" 
                    : "text-secondary/40 hover:bg-cream-dark/40 hover:text-secondary hover:translate-x-1"
                )}
              >
                <item.icon size={22} className={cn(isActive ? "text-gold" : "group-hover:text-primary transition-colors")} />
                {isSidebarOpen && (
                  <span className={cn(
                    "font-black text-[15px] flex-1 tracking-tight",
                    isActive ? "text-white" : "text-secondary/60"
                  )}>{item.label}</span>
                )}
                {isSidebarOpen && isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_rgba(212,160,23,0.9)]"
                  />
                )}
                {!isSidebarOpen && (
                   <div className="absolute left-20 px-4 py-2.5 bg-secondary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-15px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
                     {item.label}
                   </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-5 border-t border-cream-dark space-y-5">
           <div className={cn(
             "p-4 rounded-[1.5rem] bg-cream-dark/30 hover:bg-cream-dark/50 transition-all cursor-pointer group flex items-center space-x-3", 
             !isSidebarOpen && "justify-center"
           )}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-secondary to-primary/80 flex items-center justify-center text-xs font-black text-white shadow-lg group-hover:scale-110 transition-transform">AD</div>
              {isSidebarOpen && (
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-black truncate leading-none text-secondary tracking-tight">Admin Hoi An</span>
                    <span className="text-[9px] font-bold text-secondary/30 truncate mt-1.5 uppercase tracking-widest">super.admin@hoian.com</span>
                 </div>
              )}
           </div>
           
           <button className={cn(
             "w-full flex items-center space-x-3 px-4 py-3 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer group",
             !isSidebarOpen && "justify-center"
           )}>
             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
             {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Logout System</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-cream-dark flex items-center justify-between px-10 z-10">
           <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-serif font-black text-secondary tracking-tight">
                {MENU_ITEMS.find(i => i.path === location.pathname)?.label || 'Administration'}
              </h2>
           </div>
           
           <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2.5 px-4 py-2 bg-teal/5 text-teal rounded-full border border-teal/10 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Secured</span>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-secondary font-black text-xs uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="text-[9px] text-secondary/40 font-bold uppercase tracking-[0.1em] mt-0.5 px-2 py-0.5 bg-cream-dark/40 rounded-md inline-block">Universal Coordinate Time</div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
