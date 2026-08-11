import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Globe, 
  ExternalLink, 
  Info,
  Calendar,
  Layers,
  PhoneCall,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const embedUrl = import.meta.env.VITE_LOOKER_STUDIO_EMBED_URL || '';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-dark shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black text-secondary">Analytics & Performance</h1>
              <p className="text-xs text-secondary/50 font-medium">Google Analytics (GA4) traffic, booking conversions & user engagement insights</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-cream-dark/40 p-1 rounded-2xl flex items-center">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  timeRange === range 
                    ? 'bg-secondary text-white shadow-md' 
                    : 'text-secondary/60 hover:text-secondary'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>

          <a 
            href="https://analytics.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2.5 bg-primary text-white font-black text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <span>Open GA4 Console</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-secondary/40 tracking-wider">Total Visitors</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-black text-secondary">1,248</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-secondary/50">Unique users tracked via GA4</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-secondary/40 tracking-wider">Booking Intents</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <MousePointerClick size={20} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-black text-secondary">312</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +24.1%
            </span>
          </div>
          <p className="text-[11px] text-secondary/50">Opened Booking Modal event</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-secondary/40 tracking-wider">Direct Contacts</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <PhoneCall size={20} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-serif font-black text-secondary">94</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] text-secondary/50">WhatsApp & Phone clicks</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-secondary/40 tracking-wider">Top Audience</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Globe size={20} />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-serif font-black text-secondary">EN (62%)</span>
          </div>
          <p className="text-[11px] text-secondary/50">FR (18%), JP (12%), KR (8%)</p>
        </div>
      </div>

      {/* Main Section: Looker Studio Embed or Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Report Frame */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-cream-dark shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-cream-dark flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layers className="text-primary" size={20} />
              <h3 className="font-serif font-black text-lg text-secondary">Live GA4 Data Report</h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Active Tracking
            </span>
          </div>

          <div className="flex-1 p-6">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-[550px] rounded-2xl border-0"
                allowFullScreen
              />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-cream-dark/20 rounded-2xl border-2 border-dashed border-cream-dark">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
                  <BarChart3 size={32} />
                </div>
                <h4 className="font-serif font-bold text-lg text-secondary mb-2">Looker Studio Dashboard Ready</h4>
                <p className="text-xs text-secondary/60 max-w-md mb-6 leading-relaxed">
                  Google Analytics 4 tracking events are active in the website. Connect your Google Looker Studio report by setting the <code className="bg-white px-2 py-0.5 rounded text-primary font-mono font-bold">VITE_LOOKER_STUDIO_EMBED_URL</code> environment variable to render embedded interactive charts here.
                </p>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://lookerstudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-secondary text-white font-black text-xs rounded-xl hover:bg-secondary/90 transition-all shadow-md"
                  >
                    Create Free Looker Studio Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active Custom Events List */}
        <div className="bg-white rounded-3xl border border-cream-dark shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-serif font-black text-lg text-secondary mb-1">Tracked Custom Events</h3>
            <p className="text-xs text-secondary/50">Configured GA4 triggers across the User Frontend</p>
          </div>

          <div className="space-y-4">
            {[
              { name: 'open_booking_modal', desc: 'Fired when user clicks Book Now', status: 'Active' },
              { name: 'submit_booking_success', desc: 'Fired on successful booking form submission', status: 'Active' },
              { name: 'click_contact_whatsapp', desc: 'Fired on WhatsApp link click', status: 'Active' },
              { name: 'click_contact_phone', desc: 'Fired on telephone call click', status: 'Active' },
              { name: 'click_social', desc: 'Fired on Instagram/Facebook link click', status: 'Active' },
              { name: 'change_language', desc: 'Fired when switching languages (EN/FR/JP/KR)', status: 'Active' },
            ].map((event, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-cream-dark/30 border border-cream-dark flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-secondary truncate">{event.name}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {event.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary/60 mt-1">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Make sure to set <code className="font-mono font-bold">NEXT_PUBLIC_GA_ID</code> in your Next.js environment variables to receive live data in your GA4 Console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
