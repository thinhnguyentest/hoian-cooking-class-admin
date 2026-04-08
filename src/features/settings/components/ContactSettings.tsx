import React, { useState, useEffect } from 'react';
import { Save, MapPin, Clock, PhoneCall, Mail, ExternalLink, RefreshCw, Instagram, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { settingService } from '../services/setting-service';

interface LocationInfo {
  title: string;
  address: string;
  description: string;
}

interface ScheduleInfo {
  title: string;
  morning: string;
  afternoon: string;
}

interface InquiryInfo {
  title: string;
  phone: string;
  whatsapp_url: string;
  zalo_url: string;
}

interface FooterContactInfo {
  address: string;
  phone: string;
  email: string;
}

interface BrandInfo {
  title: string;
  description: string;
  instagram_url: string;
  facebook_url: string;
}

const ContactSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({ title: '', address: '', description: '' });
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo>({ title: '', morning: '', afternoon: '' });
  const [inquiryInfo, setInquiryInfo] = useState<InquiryInfo>({ title: '', phone: '', whatsapp_url: '', zalo_url: '' });
  const [footerContact, setFooterContact] = useState<FooterContactInfo>({ address: '', phone: '', email: '' });
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({ title: '', description: '', instagram_url: '', facebook_url: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [loc, sch, inq, foot, brand] = await Promise.all([
        settingService.getSetting('INFO_LOCATION'),
        settingService.getSetting('INFO_SCHEDULE'),
        settingService.getSetting('INFO_INQUIRY'),
        settingService.getSetting('FOOTER_CONTACT'),
        settingService.getSetting('FOOTER_BRAND'),
      ]);

      setLocationInfo(JSON.parse(loc.settingValue));
      setScheduleInfo(JSON.parse(sch.settingValue));
      setInquiryInfo(JSON.parse(inq.settingValue));
      setFooterContact(JSON.parse(foot.settingValue));
      setBrandInfo(JSON.parse(brand.settingValue));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, data: any) => {
    setSaving(key);
    try {
      await settingService.updateSetting(key, JSON.stringify(data));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      toast.error(`Failed to save changes for ${key}`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-black text-secondary tracking-tight">Global System Settings</h1>
          <p className="text-secondary/60 text-sm mt-1">Manage global website configurations, brand info, and footer details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section: Brand & Social */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 text-secondary">
              <Instagram size={24} className="text-primary" />
              <h2 className="text-xl font-serif font-bold">Brand & Social</h2>
            </div>
            <button 
              onClick={() => handleSave('FOOTER_BRAND', brandInfo)}
              disabled={saving === 'FOOTER_BRAND'}
              className="flex items-center space-x-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {saving === 'FOOTER_BRAND' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Save size={14} />}
              <span>{saving === 'FOOTER_BRAND' ? 'Saving' : 'Save'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Brand Title</label>
              <input 
                value={brandInfo.title}
                onChange={(e) => setBrandInfo({...brandInfo, title: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Description</label>
              <textarea 
                rows={4}
                value={brandInfo.description}
                onChange={(e) => setBrandInfo({...brandInfo, description: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Instagram URL</label>
                <div className="relative">
                  <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input 
                    value={brandInfo.instagram_url}
                    onChange={(e) => setBrandInfo({...brandInfo, instagram_url: e.target.value})}
                    className="w-full bg-[#F9F7F2] border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-secondary outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Facebook URL</label>
                <div className="relative">
                  <Facebook size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input 
                    value={brandInfo.facebook_url}
                    onChange={(e) => setBrandInfo({...brandInfo, facebook_url: e.target.value})}
                    className="w-full bg-[#F9F7F2] border-none rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-secondary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section: Main Footer Contact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2rem] border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 text-secondary">
              <ExternalLink size={24} className="text-primary" />
              <h2 className="text-xl font-serif font-bold">Main Footer Contact</h2>
            </div>
            <button 
              onClick={() => handleSave('FOOTER_CONTACT', footerContact)}
              disabled={saving === 'FOOTER_CONTACT'}
              className="flex items-center space-x-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
               {saving === 'FOOTER_CONTACT' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Save size={14} />}
               <span>{saving === 'FOOTER_CONTACT' ? 'Saving' : 'Save'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Footer Address</label>
              <input 
                value={footerContact.address}
                onChange={(e) => setFooterContact({...footerContact, address: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Footer Phone</label>
              <input 
                value={footerContact.phone}
                onChange={(e) => setFooterContact({...footerContact, phone: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Footer Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
                <input 
                  value={footerContact.email}
                  onChange={(e) => setFooterContact({...footerContact, email: e.target.value})}
                  className="w-full bg-[#F9F7F2] border-none rounded-xl pl-12 pr-5 py-3.5 text-sm font-bold text-secondary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section: Location Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 text-secondary">
              <MapPin size={24} className="text-primary" />
              <h2 className="text-xl font-serif font-bold">Our Sanctuary</h2>
            </div>
            <button 
              onClick={() => handleSave('INFO_LOCATION', locationInfo)}
              disabled={saving === 'INFO_LOCATION'}
              className="flex items-center space-x-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {saving === 'INFO_LOCATION' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Save size={14} />}
              <span>{saving === 'INFO_LOCATION' ? 'Saving' : 'Save'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Section Title</label>
              <input 
                value={locationInfo.title}
                onChange={(e) => setLocationInfo({...locationInfo, title: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Address / Location</label>
              <input 
                value={locationInfo.address}
                onChange={(e) => setLocationInfo({...locationInfo, address: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Short Description</label>
              <textarea 
                rows={3}
                value={locationInfo.description}
                onChange={(e) => setLocationInfo({...locationInfo, description: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Section: Daily Rhythms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2rem] border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 text-secondary">
              <Clock size={24} className="text-primary" />
              <h2 className="text-xl font-serif font-bold">Daily Rhythms</h2>
            </div>
            <button 
              onClick={() => handleSave('INFO_SCHEDULE', scheduleInfo)}
              disabled={saving === 'INFO_SCHEDULE'}
              className="flex items-center space-x-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
               {saving === 'INFO_SCHEDULE' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Save size={14} />}
               <span>{saving === 'INFO_SCHEDULE' ? 'Saving' : 'Save'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Section Title</label>
              <input 
                value={scheduleInfo.title}
                onChange={(e) => setScheduleInfo({...scheduleInfo, title: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Morning Session</label>
              <input 
                value={scheduleInfo.morning}
                onChange={(e) => setScheduleInfo({...scheduleInfo, morning: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Afternoon Session</label>
              <input 
                value={scheduleInfo.afternoon}
                onChange={(e) => setScheduleInfo({...scheduleInfo, afternoon: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Section: Inquiries */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2rem] border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 text-secondary">
              <PhoneCall size={24} className="text-primary" />
              <h2 className="text-xl font-serif font-bold">Inquiries & Instant Messaging</h2>
            </div>
            <button 
              onClick={() => handleSave('INFO_INQUIRY', inquiryInfo)}
              disabled={saving === 'INFO_INQUIRY'}
              className="flex items-center space-x-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            >
               {saving === 'INFO_INQUIRY' ? <RefreshCw className="animate-spin w-3 h-3" /> : <Save size={14} />}
               <span>{saving === 'INFO_INQUIRY' ? 'Saving' : 'Save'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Section Title</label>
              <input 
                value={inquiryInfo.title}
                onChange={(e) => setInquiryInfo({...inquiryInfo, title: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Primary Phone</label>
              <input 
                value={inquiryInfo.phone}
                onChange={(e) => setInquiryInfo({...inquiryInfo, phone: e.target.value})}
                className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-sm font-bold text-secondary outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">WhatsApp URL</label>
                <input 
                  value={inquiryInfo.whatsapp_url}
                  onChange={(e) => setInquiryInfo({...inquiryInfo, whatsapp_url: e.target.value})}
                  className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-[10px] font-bold text-secondary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Zalo URL</label>
                <input 
                  value={inquiryInfo.zalo_url}
                  onChange={(e) => setInquiryInfo({...inquiryInfo, zalo_url: e.target.value})}
                  className="w-full bg-[#F9F7F2] border-none rounded-xl px-5 py-3.5 text-[10px] font-bold text-secondary outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSettings;
