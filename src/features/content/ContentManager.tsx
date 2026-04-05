import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit3, Trash2, Check, X, 
  BookOpen, Type, Layout, FileText, 
  ChevronRight, Filter, PlusCircle, Trash,
  Utensils, Loader2, Save, Minus,
  AlertCircle, Sparkles, MessageSquare,
  Image as ImageIcon, Upload, CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { pageService, Page, PageContent, Menu, ImageAsset } from './services/page-service'
import { mediaService, ImageResponse } from '../media/services/media-service'
import { cn } from '@/layouts/AdminLayout'

const ContentManager = () => {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'subject' | 'content' | 'menu' | 'media'>('subject')
  const [pageImages, setPageImages] = useState<ImageResponse[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [mediaUploadForm, setMediaUploadForm] = useState({
    sourceType: 'CONTENT' as ImageAsset['sourceType'],
    altText: ''
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await pageService.getAll()
      setPages(response.data)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (page: Page) => {
    try {
      const fullPage = await pageService.getById(page.id)
      setEditingPage(fullPage)
      setPageImages([]) // Reset images when opening new page
      setActiveTab('subject')
    } catch (error) {
      console.error('Failed to fetch page detail:', error)
    }
  }

  useEffect(() => {
    if (editingPage && activeTab === 'media') {
      fetchPageImages()
    }
  }, [editingPage?.id, activeTab])

  const fetchPageImages = async () => {
    if (!editingPage) return
    try {
      setLoadingMedia(true)
      const images = await mediaService.getByPageId(editingPage.id)
      setPageImages(images)
    } catch (error) {
      console.error('Failed to fetch page images:', error)
    } finally {
      setLoadingMedia(false)
    }
  }

  const handleMediaUpload = async (file: File) => {
    if (!editingPage) return
    try {
      setIsUploadingMedia(true)
      const uploadResult = await mediaService.upload(file)
      const newImage = await mediaService.linkToPage(editingPage.id, {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        sourceType: mediaUploadForm.sourceType,
        altText: mediaUploadForm.altText
      })
      setPageImages(prev => [newImage, ...prev])
      toast.success('Image uploaded and added to page')
      setMediaUploadForm({ ...mediaUploadForm, altText: '' })
    } catch (error) {
      console.error('Media upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploadingMedia(false)
    }
  }

  const handleMediaDelete = async (imageId: number) => {
    if (!window.confirm('Delete this image from this page?')) return
    try {
      await mediaService.delete(imageId)
      setPageImages(prev => prev.filter(img => img.id !== imageId))
      toast.success('Image removed')
    } catch (error) {
      console.error('Delete image failed:', error)
      toast.error('Failed to remove image')
    }
  }

  const handleSave = async () => {
    if (!editingPage) return
    try {
      setIsSaving(true)
      await pageService.update(editingPage.id, editingPage)
      
      setPages(prev => prev.map(p => p.id === editingPage.id ? editingPage : p))
      
      setTimeout(() => {
        setIsSaving(false)
        setEditingPage(null)
        toast.success(`'${editingPage.title}' synchronized successfully.`, {
          description: "All changes are now live on the heritage portal.",
          duration: 4000
        })
      }, 600)
    } catch (error) {
      console.error('Failed to update page:', error)
      toast.error("Synchronization Failed", {
        description: "Could not establish connection with the heritage database."
      })
      setIsSaving(false)
    }
  }

  // Enhanced Helpers for Dynamic Content Sections
  const getSectionsByType = (type: string) => {
    return (editingPage?.contents || []).filter(c => c.sectionType === type)
  }

  const updateSectionItem = (type: string, index: number, field: 'title' | 'content', value: string) => {
    if (!editingPage) return
    const newContents = [...(editingPage.contents || [])]
    const filteredIndices = newContents
      .map((c, i) => c.sectionType === type ? i : -1)
      .filter(i => i !== -1)
    
    const targetIndex = filteredIndices[index]
    if (targetIndex !== undefined) {
      newContents[targetIndex] = { ...newContents[targetIndex], [field]: value }
      setEditingPage({ ...editingPage, contents: newContents })
    }
  }

  const addSectionItem = (type: PageContent['sectionType'], title = '') => {
    if (!editingPage) return
    const newContents = [...(editingPage.contents || [])]
    newContents.push({
      sectionType: type,
      title: title || (type.charAt(0) + type.slice(1).toLowerCase()),
      content: '',
      sortOrder: (editingPage.contents?.length || 0) + 1
    })
    setEditingPage({ ...editingPage, contents: newContents })
  }

  const removeSectionItem = (type: string, index: number) => {
    if (!editingPage) return
    const newContents = [...(editingPage.contents || [])]
    const filteredIndices = newContents
      .map((c, i) => c.sectionType === type ? i : -1)
      .filter(i => i !== -1)
    
    const targetIndex = filteredIndices[index]
    if (targetIndex !== undefined) {
      newContents.splice(targetIndex, 1)
      setEditingPage({ ...editingPage, contents: newContents })
    }
  }

  const addMenuItem = () => {
    if (!editingPage) return
    const newItem: Menu = {
      name: '',
      description: '',
      sortOrder: (editingPage.menus?.length || 0) + 1
    }
    setEditingPage({
      ...editingPage,
      menus: [...(editingPage.menus || []), newItem]
    })
  }

  const removeMenuItem = (index: number) => {
    if (!editingPage) return
    const newMenus = [...editingPage.menus]
    newMenus.splice(index, 1)
    setEditingPage({ ...editingPage, menus: newMenus })
  }

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search pages by title..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-cream-dark rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all text-sm shadow-lg shadow-primary/20">
              <Plus size={18} />
              <span>New Entry</span>
           </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-[2rem] border border-cream-dark shadow-xl shadow-cream-dark/20 overflow-hidden">
        {loading ? (
          <div className="p-32 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
               <Loader2 className="animate-spin text-primary" size={48} />
               <Sparkles className="absolute -top-2 -right-2 text-accent animate-pulse" size={20} />
            </div>
            <p className="text-secondary font-serif italic text-lg">Synchronizing data...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-dark/10 text-secondary border-b border-cream-dark">
                <th className="px-10 py-6 font-serif font-black uppercase tracking-widest text-xs opacity-50">Page Identity</th>
                <th className="px-6 py-6 font-serif font-black uppercase tracking-widest text-xs opacity-50">Category</th>
                <th className="px-6 py-6 font-serif font-black uppercase tracking-widest text-xs opacity-50 text-center">Status</th>
                <th className="px-10 py-6 font-serif font-black uppercase tracking-widest text-xs opacity-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/50">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-cream/40 transition-all group cursor-pointer">
                  <td className="px-12 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-white border-2 border-cream-dark rounded-[1.5rem] flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-secondary text-2xl group-hover:text-primary transition-colors duration-300 tracking-tight">{page.title}</h4>
                        <div className="flex items-center text-[10px] text-primary/40 font-black mt-2 uppercase tracking-[0.2em]">
                          <span className="text-secondary/50 font-black bg-cream-dark/30 px-2 py-0.5 rounded-lg">{page.slug === '/' ? 'INDEX (ROOT)' : page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="px-5 py-2 bg-cream-dark/50 text-secondary/70 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-cream-dark shadow-sm">
                       {page.pageTypeName}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-teal/5 text-teal text-[10px] font-black uppercase tracking-widest border border-teal/10 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-teal animate-pulse shadow-[0_0_8px_rgba(26,60,64,0.5)]" />
                      <span>Live Site</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex items-center justify-end space-x-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(page)}
                        className="p-3.5 bg-white border-2 border-cream-dark text-primary rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button className="p-3.5 bg-white border-2 border-cream-dark text-secondary/20 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-300 shadow-sm">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Drawer */}
      <AnimatePresence>
        {editingPage && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setEditingPage(null)}
              className="fixed inset-0 bg-secondary/30 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 40, stiffness: 400 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-cream shadow-2xl z-[70] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="h-28 bg-white border-b border-cream-dark flex items-center justify-between px-12 shrink-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-secondary to-primary text-white rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-primary/30">
                     <Layout size={32} />
                  </div>
                  <div>
                     <h3 className="font-serif font-black text-3xl text-secondary tracking-tight">Content Editor</h3>
                     <div className="flex items-center space-x-4 mt-1.5">
                        <span className="text-[10px] text-teal font-black bg-teal/5 px-3 py-1 rounded-lg uppercase tracking-widest border border-teal/10">Active Path: {editingPage.slug}</span>
                     </div>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingPage(null)}
                  className="p-4 hover:bg-red-50 text-secondary/20 hover:text-red-500 rounded-full transition-all group cursor-pointer"
                  disabled={isSaving}
                >
                  <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex px-10 bg-white border-b border-cream-dark space-x-12">
                 {[
                   { id: 'subject', label: 'PAGE SUBJECT', icon: Type },
                   { id: 'content', label: 'PAGE CONTENT', icon: FileText },
                   { id: 'menu', label: 'PRODUCT MENU', icon: Utensils },
                   { id: 'media', label: 'MEDIA ASSETS', icon: ImageIcon },
                 ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center space-x-3 py-6 border-b-4 transition-all text-[11px] font-black tracking-[0.2em]",
                        activeTab === tab.id 
                          ? "border-primary text-primary" 
                          : "border-transparent text-secondary/20 hover:text-secondary/50"
                      )}
                    >
                      <tab.icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                 ))}
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-12 space-y-12 pb-32 custom-scrollbar bg-cream/30">
                {activeTab === 'subject' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-cream-dark shadow-sm space-y-10">
                       <div className="flex items-center justify-between border-b border-cream pb-6">
                          <div className="flex items-center space-x-4">
                             <div className="p-3 bg-primary/5 text-primary rounded-xl"><Type size={22} /></div>
                             <h4 className="font-serif font-black text-2xl text-secondary">Identity & SEO</h4>
                          </div>
                          <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">Metadata Layer</span>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-primary/60 uppercase tracking-[0.3em] ml-1">Hero Display Title</label>
                             <input 
                               type="text" 
                               className="w-full bg-cream/20 border-2 border-cream-dark/50 rounded-2xl px-6 py-5 text-lg focus:ring-0 focus:border-primary outline-none transition-all font-black text-secondary shadow-inner placeholder:text-secondary/10"
                               value={editingPage.title}
                               onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                             />
                          </div>
                          
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-primary/60 uppercase tracking-[0.3em] ml-1">Meta Description (SEO Intro)</label>
                             <textarea 
                               rows={5}
                               className="w-full bg-cream/20 border-2 border-cream-dark/50 rounded-3xl px-6 py-6 text-sm focus:ring-0 focus:border-primary outline-none transition-all font-medium text-secondary/80 leading-relaxed resize-none shadow-inner"
                               value={editingPage.description || ''}
                               onChange={(e) => setEditingPage({...editingPage, description: e.target.value})}
                               placeholder="Write a clear, enticing summary for this experience..."
                             />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'content' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                    {/* Introduction Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Sparkles size={22} /></div>
                          <h4 className="font-serif font-black text-2xl text-secondary">Introduction</h4>
                        </div>
                      </div>
                      {getSectionsByType('INTRODUCTION').map((section, idx) => (
                        <div key={`intro-${idx}`} className="bg-white p-10 rounded-[2.5rem] border border-cream-dark shadow-sm">
                           <textarea 
                              rows={4}
                              className="w-full bg-blue-50/10 border-2 border-blue-50/50 rounded-3xl px-6 py-6 text-sm text-secondary font-medium leading-relaxed outline-none focus:border-blue-100 transition-all resize-none shadow-inner"
                              placeholder="The opening hook for the page..."
                              value={section.content}
                              onChange={(e) => updateSectionItem('INTRODUCTION', idx, 'content', e.target.value)}
                           />
                        </div>
                      ))}
                      {getSectionsByType('INTRODUCTION').length === 0 && (
                        <button onClick={() => addSectionItem('INTRODUCTION')} className="w-full py-4 border-2 border-dashed border-cream-dark rounded-2xl text-secondary/40 font-black text-[10px] tracking-widest hover:border-blue-200 hover:text-blue-400 transition-all">
                          + ADD INTRODUCTION
                        </button>
                      )}
                    </div>

                    {/* Experiences Section */}
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BookOpen size={22} /></div>
                             <div>
                                <h4 className="font-serif font-black text-2xl text-secondary">Narrative & Experiences</h4>
                                <p className="text-[10px] font-black text-secondary/20 uppercase tracking-widest mt-1">Multiple content blocks for a rich story</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => addSectionItem('EXPERIENCE')}
                            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest flex items-center space-x-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/10"
                          >
                            <Plus size={14} />
                            <span>ADD BLOCK</span>
                          </button>
                       </div>
                       
                       <div className="space-y-6">
                          {getSectionsByType('EXPERIENCE').map((section, idx) => (
                             <div key={`exp-${idx}`} className="bg-white p-10 rounded-[2.5rem] border border-cream-dark shadow-sm relative group">
                                <button 
                                  onClick={() => removeSectionItem('EXPERIENCE', idx)}
                                  className="absolute -right-3 -top-3 bg-red-500 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
                                >
                                   <Trash size={14} />
                                </button>
                                <div className="space-y-6">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-purple-600/40 uppercase tracking-[0.2em] ml-1">Block Title</label>
                                      <input 
                                         type="text"
                                         className="w-full bg-purple-50/10 border-b-2 border-purple-50 focus:border-purple-200 outline-none py-3 text-lg font-black text-secondary transition-all"
                                         value={section.title}
                                         placeholder="e.g. Local Connection"
                                         onChange={(e) => updateSectionItem('EXPERIENCE', idx, 'title', e.target.value)}
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-purple-600/40 uppercase tracking-[0.2em] ml-1">Content Narrative</label>
                                      <textarea 
                                         rows={5}
                                         className="w-full bg-purple-50/10 border-2 border-purple-50/50 rounded-3xl px-6 py-6 text-sm text-secondary/80 font-medium leading-relaxed outline-none focus:border-purple-200 transition-all resize-none shadow-inner"
                                         value={section.content}
                                         placeholder="Describe this part of the journey..."
                                         onChange={(e) => updateSectionItem('EXPERIENCE', idx, 'content', e.target.value)}
                                      />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Service Details (Includes, Excludes, Not Suitable) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {[
                         { type: 'INCLUDES', label: 'INCLUSIONS', color: 'emerald', icon: Check },
                         { type: 'EXCLUDES', label: 'EXCLUSIONS', color: 'red', icon: X },
                         { type: 'NOT_SUITABLE', label: 'NOT SUITABLE', color: 'amber', icon: AlertCircle }
                       ].map((group) => (
                          <div key={group.type} className="space-y-6">
                             <div className="flex items-center justify-between">
                                <h5 className={`text-[11px] font-black text-${group.color}-600/50 uppercase tracking-[0.2em] flex items-center space-x-2`}>
                                   <group.icon size={14} />
                                   <span>{group.label}</span>
                                </h5>
                                <button onClick={() => addSectionItem(group.type as any)} className={`p-1.5 bg-${group.color}-50 text-${group.color}-600 rounded-lg hover:bg-${group.color}-600 hover:text-white transition-all`}>
                                   <Plus size={14} />
                                </button>
                             </div>
                             <div className="space-y-3">
                                {getSectionsByType(group.type).map((item, idx) => (
                                   <div key={`${group.type}-${idx}`} className="flex items-center space-x-3 group/item">
                                      <input 
                                        type="text"
                                        className={`flex-1 bg-white border border-cream-dark rounded-xl px-4 py-3 text-xs font-bold text-secondary outline-none focus:border-${group.color}-200 transition-all shadow-sm`}
                                        value={item.content}
                                        onChange={(e) => updateSectionItem(group.type, idx, 'content', e.target.value)}
                                      />
                                       <button 
                                         onClick={() => removeSectionItem(group.type, idx)} 
                                         className="group-hover/item:opacity-100 opacity-0 bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-90"
                                         title="Remove item"
                                       >
                                          <Minus size={14} strokeWidth={3} />
                                       </button>
                                   </div>
                                ))}
                                {getSectionsByType(group.type).length === 0 && (
                                   <div className="py-8 text-center border-2 border-dashed border-cream-dark rounded-2xl opacity-20">
                                      <p className="text-[10px] font-black">EMPTY</p>
                                   </div>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Highlights (Refined) */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Filter size={22} /></div>
                              <h4 className="font-serif font-black text-2xl text-secondary">Key Highlights</h4>
                           </div>
                           <button 
                             onClick={() => addSectionItem('HIGHLIGHTS')}
                             className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest flex items-center space-x-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/10"
                           >
                             <Plus size={14} />
                             <span>ADD HIGHLIGHT</span>
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {getSectionsByType('HIGHLIGHTS').map((item, idx) => (
                              <div key={`high-${idx}`} className="flex items-center space-x-3 group/item bg-white p-4 rounded-2xl border border-cream-dark shadow-sm hover:border-amber-100 transition-all">
                                 <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black">{idx + 1}</span>
                                 </div>
                                 <input 
                                   type="text"
                                   className="flex-1 bg-transparent border-none px-2 py-2 text-xs font-bold text-secondary outline-none placeholder:text-secondary/20"
                                   value={item.content}
                                   placeholder="Enter a highlight detail..."
                                   onChange={(e) => updateSectionItem('HIGHLIGHTS', idx, 'content', e.target.value)}
                                 />
                                 <button 
                                   onClick={() => removeSectionItem('HIGHLIGHTS', idx)} 
                                   className="group-hover/item:opacity-100 opacity-0 bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-90"
                                   title="Remove highlight"
                                 >
                                    <Minus size={14} strokeWidth={3} />
                                 </button>
                              </div>
                           ))}
                        </div>
                        {getSectionsByType('HIGHLIGHTS').length === 0 && (
                          <div className="py-12 text-center border-2 border-dashed border-cream-dark rounded-[2.5rem] bg-white/50 opacity-40">
                             <p className="text-[10px] font-black tracking-widest">NO HIGHLIGHTS RECORDED</p>
                          </div>
                        )}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'menu' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Utensils size={22} /></div>
                          <div>
                             <h4 className="font-serif font-black text-2xl text-secondary">Product Palette</h4>
                             <p className="text-[11px] font-bold text-secondary/30 uppercase tracking-widest mt-1">Dishes, Activities or Workshop Steps</p>
                          </div>
                       </div>
                       <button 
                        onClick={addMenuItem}
                        className="bg-secondary text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest flex items-center space-x-2.5 hover:bg-primary transition-all shadow-lg shadow-secondary/10 active:scale-95"
                       >
                         <Plus size={16} />
                         <span>ADD ENTRY</span>
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       {(editingPage.menus || []).map((menu, idx) => (
                          <div key={idx} className="bg-white border-2 border-cream-dark p-8 rounded-[2.5rem] relative group/item shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                             <button 
                               onClick={() => removeMenuItem(idx)}
                               className="absolute -right-3 -top-3 bg-red-500 text-white p-2.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
                             >
                                <Trash size={14} />
                             </button>
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em] ml-1">Title / Name</label>
                                   <input 
                                      type="text"
                                      className="w-full bg-cream/10 border-b-2 border-cream focus:border-emerald-400 outline-none py-3 text-lg font-black text-secondary transition-all"
                                      value={menu.name}
                                      onChange={(e) => {
                                         const newMenus = [...editingPage.menus]
                                         newMenus[idx].name = e.target.value
                                         setEditingPage({ ...editingPage, menus: newMenus })
                                      }}
                                   />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em] ml-1">Secondary Details</label>
                                   <textarea 
                                      rows={2}
                                      className="w-full bg-emerald-50/20 border-none rounded-2xl text-xs text-secondary/60 font-bold py-4 px-4 outline-none focus:ring-2 focus:ring-emerald-50 transition-all resize-none"
                                      value={menu.description || ''}
                                      placeholder="Briefly describe..."
                                      onChange={(e) => {
                                         const newMenus = [...editingPage.menus]
                                         newMenus[idx].description = e.target.value
                                         setEditingPage({ ...editingPage, menus: newMenus })
                                      }}
                                   />
                                </div>
                             </div>
                          </div>
                       ))}
                       {editingPage.menus.length === 0 && (
                          <div className="col-span-2 p-16 text-center border-2 border-dashed border-cream-dark rounded-[3rem] bg-white/50 opacity-40">
                             <div className="w-16 h-16 border-2 border-cream-dark rounded-full flex items-center justify-center mx-auto mb-4 italic font-serif">?</div>
                             <p className="font-serif font-black text-secondary text-lg">No Items Cataloged</p>
                          </div>
                       )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'media' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gold/5 text-gold rounded-xl"><ImageIcon size={22} /></div>
                          <div>
                             <h4 className="font-serif font-black text-2xl text-secondary">Media Assets</h4>
                             <p className="text-[11px] font-bold text-secondary/30 uppercase tracking-widest mt-1">Images linked to this specific experience</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white border-2 border-cream-dark p-8 rounded-[2.5rem] shadow-sm space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Placement Type</label>
                           <select 
                            value={mediaUploadForm.sourceType}
                            onChange={(e) => setMediaUploadForm({...mediaUploadForm, sourceType: e.target.value as any})}
                            className="w-full bg-cream/10 border-b-2 border-cream focus:border-gold outline-none py-3 text-sm font-black text-secondary transition-all"
                           >
                              <option value="HERO">HERO SECTION</option>
                              <option value="CAROUSEL">CAROUSEL</option>
                              <option value="CONTENT">CONTENT BLOCK</option>
                              <option value="MEDIA">GALLERY / MEDIA</option>
                              <option value="OTHER">OTHER</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Alt Text (Accessibility)</label>
                           <input 
                              type="text"
                              value={mediaUploadForm.altText}
                              onChange={(e) => setMediaUploadForm({...mediaUploadForm, altText: e.target.value})}
                              placeholder="e.g. Fresh ingredients on wooden table"
                              className="w-full bg-cream/10 border-b-2 border-cream focus:border-gold outline-none py-3 text-sm font-black text-secondary transition-all"
                           />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                         <div className="flex-1">
                            <input 
                              type="file" 
                              id="quick-upload"
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                            />
                            <label 
                              htmlFor="quick-upload"
                              className={cn(
                                "flex items-center justify-center space-x-3 w-full py-4 border-2 border-dashed border-cream-dark rounded-2xl cursor-pointer hover:bg-gold/5 hover:border-gold transition-all group",
                                isUploadingMedia && "opacity-50 pointer-events-none"
                              )}
                            >
                              {isUploadingMedia ? (
                                <Loader2 className="animate-spin text-gold" size={20} />
                              ) : (
                                <Upload size={20} className="text-secondary/20 group-hover:text-gold transition-colors" />
                              )}
                              <span className="text-[11px] font-black text-secondary/50 group-hover:text-gold uppercase tracking-widest">
                                {isUploadingMedia ? 'UPLOADING...' : 'UPLOAD NEW ASSET TO THIS PAGE'}
                              </span>
                            </label>
                         </div>
                      </div>
                    </div>

                    {loadingMedia ? (
                      <div className="py-20 flex flex-col items-center justify-center">
                         <Loader2 className="animate-spin text-gold" size={32} />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {pageImages.map((img) => (
                          <div key={img.id} className="group relative bg-white border-2 border-cream-dark rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                             <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={img.url} alt={img.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                   <button 
                                    onClick={() => handleMediaDelete(img.id)}
                                    className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-xl"
                                   >
                                      <Trash size={18} />
                                   </button>
                                </div>
                                <div className="absolute top-3 left-3">
                                   <span className="text-[8px] font-black bg-gold text-white px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg">{img.sourceType}</span>
                                </div>
                             </div>
                             <div className="p-4">
                                <p className="text-[10px] font-black text-secondary truncate uppercase tracking-tight">{img.altText || 'Untitled Asset'}</p>
                             </div>
                          </div>
                        ))}
                        {pageImages.length === 0 && !loadingMedia && (
                          <div className="col-span-full py-20 text-center border-2 border-dashed border-cream-dark rounded-[3rem] opacity-30">
                             <ImageIcon className="mx-auto mb-3" size={32} />
                             <p className="text-xs font-black uppercase tracking-widest">No images linked yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="h-28 bg-white border-t border-cream-dark flex items-center justify-end px-12 space-x-5 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                 <button 
                   onClick={() => !isSaving && setEditingPage(null)}
                   className="px-10 py-4 font-black text-[12px] tracking-[0.2em] text-secondary/30 hover:text-secondary hover:bg-cream/50 rounded-2xl transition-all"
                   disabled={isSaving}
                 >
                   DISCARD
                 </button>
                 <button 
                   onClick={handleSave}
                   className="px-14 py-4 bg-secondary text-white font-black text-[12px] tracking-[0.3em] rounded-2xl flex items-center space-x-3 hover:bg-primary hover:-translate-y-1 active:translate-y-0 transition-all shadow-2xl shadow-secondary/30 disabled:opacity-50"
                   disabled={isSaving}
                 >
                   {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                   <span>{isSaving ? "SYNCING..." : "PUBLISH LIVE"}</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContentManager
