import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Grid, 
  List, 
  Trash2, 
  Layout,
  Tag,
  Loader2,
  X,
  CheckCircle2,
  Eye
} from 'lucide-react'
import { mediaService, ImageResponse } from './services/media-service'
import { pageService } from '../content/services/page-service'
import { toast } from 'sonner'

const SOURCE_TYPES = [
  { id: 'HERO', label: 'Hero Section' },
  { id: 'CAROUSEL', label: 'Carousel' },
  { id: 'CONTENT', label: 'Content Section' },
  { id: 'MEDIA', label: 'Media Section' },
  { id: 'OTHER', label: 'Other' },
]

const MediaManager = () => {
  const [images, setImages] = useState<ImageResponse[]>([])
  const [pages, setPages] = useState<{id: string | number, label: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    pageId: '',
    sourceType: 'MEDIA',
    altText: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [fetchedImages, pageResponse] = await Promise.all([
        mediaService.getAll(),
        pageService.getAll()
      ])
      
      setImages(fetchedImages)
      
      const pageList = pageResponse.data.map(p => ({ id: p.id, label: p.pageTypeName }))
      setPages(pageList)
    } catch (error) {
      console.error('Failed to fetch media data:', error)
      toast.error('Failed to fetch media assets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this asset? This will also remove it from Cloudinary.')) return
    
    try {
      await mediaService.delete(id)
      setImages(prev => prev.filter(img => img.id !== id))
      toast.success('Asset deleted successfully')
    } catch (error) {
       console.error('Failed to delete image:', error)
       toast.error('Failed to delete asset')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.file || !uploadForm.pageId) {
      toast.error('Please select a file and a target page')
      return
    }

    try {
      setUploading(true)
      
      // Step 1: Upload to Cloudinary
      const uploadResult = await mediaService.upload(uploadForm.file)
      
      // Step 2: Link to Page
      const newImage = await mediaService.linkToPage(Number(uploadForm.pageId), {
        url: uploadResult.url,
        publicId: uploadResult.public_id,
        sourceType: uploadForm.sourceType,
        altText: uploadForm.altText
      })

      setImages(prev => [newImage, ...prev])
      setIsUploadOpen(false)
      setUploadForm({ file: null, pageId: '', sourceType: 'MEDIA', altText: '' })
      toast.success('Asset uploaded and linked successfully!')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please check your connection or file size.')
    } finally {
      setUploading(false)
    }
  }

  const filteredImages = images.filter(img => {
    const matchesPage = selectedPage === 'all' || img.pageId.toString() === selectedPage.toString()
    const matchesType = selectedType === 'all' || img.sourceType === selectedType
    const matchesSearch = img.altText?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          img.url.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPage && matchesType && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Media Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-serif font-bold text-[#5D4037]">Media Library</h2>
          <p className="text-sm text-[#BC6C25]/60 font-medium tracking-wide">Manage and organize your assets directly from the database.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white/50 backdrop-blur-sm border border-cream-dark rounded-2xl p-1.5 shadow-sm">
             <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-[#BC6C25] hover:bg-cream-dark/50'}`}
             >
               <Grid size={18} />
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === 'list' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-[#BC6C25] hover:bg-cream-dark/50'}`}
             >
               <List size={18} />
             </button>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-2.5 px-6 py-3.5 bg-gold text-white font-black rounded-2xl hover:scale-105 transition-all text-sm shadow-xl shadow-gold/20 group cursor-pointer"
          >
             <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
             <span className="tracking-widest uppercase text-xs">Upload Assets</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-cream-dark shadow-xl shadow-secondary/[0.02] flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-4 flex-1 min-w-[240px]">
           <div className="p-3 bg-white border border-cream-dark rounded-2xl text-secondary shadow-sm">
              <Layout size={20} />
           </div>
           <div className="flex-1">
              <label className="text-[11px] font-black text-secondary/50 uppercase tracking-[0.2em] mb-2 block">Filter by Page</label>
              <select 
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-base font-black text-secondary cursor-pointer p-0"
              >
                <option value="all">All Pages</option>
                {pages.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
           </div>
        </div>

        <div className="w-px h-12 bg-cream-dark hidden md:block" />

        <div className="flex items-center space-x-5 flex-1 min-w-[240px]">
           <div className="p-4 bg-white border border-cream-dark rounded-2xl text-secondary shadow-sm">
              <Tag size={22} />
           </div>
           <div className="flex-1">
              <label className="text-[11px] font-black text-secondary/50 uppercase tracking-[0.2em] mb-2 block">Asset Category</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-base font-black text-secondary cursor-pointer p-0"
              >
                <option value="all">All Types</option>
                {SOURCE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
           </div>
        </div>

        <div className="w-px h-10 bg-cream-dark hidden md:block" />

        <div className="relative group min-w-[280px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 bg-white border border-cream-dark rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* Loading State or Media Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-[#D4A017]" size={40} />
           <p className="font-serif italic text-lg text-[#5D4037]">Fetching your visual assets...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative bg-white rounded-[2rem] border border-cream-dark/60 shadow-lg shadow-secondary/[0.02] overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer hover-lift"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={img.url} 
                      alt={img.altText} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 space-x-2">
                       <button 
                        onClick={() => window.open(img.url, '_blank')}
                        className="p-2 bg-white text-[#5D4037] rounded-full hover:bg-[#D4A017] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                       >
                          <Eye size={18} />
                       </button>
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-[#D4A017] text-white px-1.5 py-0.5 rounded-md shadow-lg">{img.sourceType}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h5 className="text-secondary font-black text-sm leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-primary transition-colors duration-300">
                      {img.altText || 'Untitled Asset'}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-secondary/5 text-secondary text-[8px] font-black rounded-lg uppercase tracking-widest">
                        {img.sourceType}
                      </span>
                      <span className="px-2 py-1 bg-cream-dark/30 text-secondary/60 text-[8px] font-black rounded-lg border border-cream-dark uppercase tracking-widest">
                        {pages.find(p => p.id.toString() === img.pageId.toString())?.label || 'Direct Upload'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={40} />
              </div>
              <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl text-[#5D4037]">No assets found</h4>
                  <p className="text-sm text-gray-400">Try adjusting your filters or upload a new asset.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setIsUploadOpen(false)}
              className="fixed inset-0 bg-secondary/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center">
                       <Upload size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-black text-secondary">Upload Visual Asset</h3>
                        <p className="text-xs text-secondary/40 font-black uppercase tracking-widest mt-1">Heritage Media Layer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsUploadOpen(false)}
                    className="p-3 hover:bg-red-50 text-secondary/20 hover:text-red-500 rounded-full transition-all"
                    disabled={uploading}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">
                  {/* File Input */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer group
                      ${uploadForm.file ? 'border-primary bg-primary/5' : 'border-cream-dark hover:border-primary hover:bg-cream/30'}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                    />
                    <div className="space-y-4">
                      {uploadForm.file ? (
                        <>
                          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
                             <CheckCircle2 size={32} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-secondary">{uploadForm.file.name}</p>
                             <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Ready for preservation</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-cream-dark/50 text-secondary/30 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                             <ImageIcon size={32} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-secondary">Click to browse or drag & drop</p>
                             <p className="text-[10px] text-secondary/30 font-black uppercase tracking-widest mt-1">JPG, PNG, WEBP (Max 10MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Target Page</label>
                        <select 
                          required
                          value={uploadForm.pageId}
                          onChange={(e) => setUploadForm({...uploadForm, pageId: e.target.value})}
                          className="w-full bg-cream/20 border-2 border-cream-dark/50 rounded-2xl px-5 py-4 text-sm font-black text-secondary focus:border-primary outline-none transition-all"
                        >
                          <option value="" disabled>Select a page...</option>
                          {pages.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Asset Category</label>
                        <select 
                          value={uploadForm.sourceType}
                          onChange={(e) => setUploadForm({...uploadForm, sourceType: e.target.value})}
                          className="w-full bg-cream/20 border-2 border-cream-dark/50 rounded-2xl px-5 py-4 text-sm font-black text-secondary focus:border-primary outline-none transition-all"
                        >
                          {SOURCE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest ml-1">Alt Text / Description</label>
                      <input 
                        type="text" 
                        placeholder="Describe the image for accessibility..."
                        className="w-full bg-cream/20 border-2 border-cream-dark/50 rounded-2xl px-5 py-4 text-sm font-bold text-secondary focus:border-primary outline-none transition-all"
                        value={uploadForm.altText}
                        onChange={(e) => setUploadForm({...uploadForm, altText: e.target.value})}
                      />
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsUploadOpen(false)}
                      className="flex-1 py-4 font-black text-[11px] tracking-widest text-secondary/30 hover:text-secondary hover:bg-cream/50 rounded-2xl transition-all"
                      disabled={uploading}
                    >
                      CANCEL
                    </button>
                    <button 
                      type="submit"
                      disabled={uploading}
                      className="flex-[2] py-4 bg-secondary text-white font-black text-[11px] tracking-[0.2em] rounded-2xl flex items-center justify-center space-x-3 hover:bg-primary shadow-xl shadow-secondary/20 disabled:opacity-50 transition-all"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>PRESERVING ASSET...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>INITIALIZE UPLOAD</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaManager
