import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PiratePageLayout from "@/components/layout/PiratePageLayout"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, CheckCircle2, ShoppingBag, X } from "lucide-react"

const MERCH_IMG = "/merch.png"
const SIZE_CHART_IMG = "/sizechart.jpeg"
const QR_IMG = "/qr.png"

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]

export default function Merch() {
  const [showForm, setShowForm] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    mobileNumber: "",
    size: "",
    transactionId: "",
  })
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rollNumber: "",
      mobileNumber: "",
      size: "",
      transactionId: "",
    })
    setScreenshot(null)
    setPreviewUrl(null)
    setSubmitted(false)
    setTransactionError(null)
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    if (showForm || showSizeChart) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      document.documentElement.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = originalStyle
      document.documentElement.style.overflow = "unset"
    }
  }, [showForm, showSizeChart])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === "transactionId") setTransactionError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" })
        return
      }
      setScreenshot(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Explicit validation for better user feedback
    if (!formData.name.trim()) return toast({ title: "Name missing", description: "Please enter your full name.", variant: "destructive" })
    if (!formData.email.trim()) return toast({ title: "Email missing", description: "Please enter your email.", variant: "destructive" })
    if (!formData.rollNumber.trim()) return toast({ title: "Roll Number missing", description: "Please enter your roll number.", variant: "destructive" })
    if (!formData.mobileNumber.trim()) return toast({ title: "Mobile number missing", description: "Please enter your contact number.", variant: "destructive" })
    if (formData.mobileNumber.length !== 10) return toast({ title: "Invalid Mobile", description: "Mobile number must be 10 digits.", variant: "destructive" })
    if (!formData.transactionId.trim()) return toast({ title: "Transaction ID missing", description: "Please enter your payment Transaction ID.", variant: "destructive" })
    if (!formData.size) return toast({ title: "Size required", description: "Please select a size.", variant: "destructive" })
    if (!screenshot) return toast({ title: "Screenshot required", description: "Please upload payment screenshot.", variant: "destructive" })

    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      data.append("screenshot", screenshot)

      const API_URL = import.meta.env.VITE_API_URL || ""
      const response = await fetch(`${API_URL}/api/merch/order`, { method: "POST", body: data })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || "Failed to submit order")

      setSubmitted(true)
      toast({ title: "Order Submitted!", description: "Your legend awaits.", className: "bg-green-900 border-green-500 text-white" })
      
    } catch (error: any) {
      const isDuplicate = error.message.toLowerCase().includes("transaction id") || error.message.toLowerCase().includes("already been submitted")
      if (isDuplicate) {
        setTransactionError("This ID is already exist")
      }
      toast({ 
        title: isDuplicate ? "Payment Already Logged" : "Submission failed", 
        description: error.message, 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PiratePageLayout title="Official Merch">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Main Landing View */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur opacity-25"></div>
               <img src={MERCH_IMG} alt="Merch" className="relative w-full rounded-2xl border border-white/10 shadow-2xl" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="font-pirata text-6xl text-[#d4af37] leading-tight">Vaudeville 2026<br/>Limited Edition</h2>
            <div className="space-y-2">
              <p className="font-cinzel text-3xl text-white font-bold">₹ 350/- Only</p>
              <p className="text-[#d4af37] font-cinzel text-sm animate-pulse">For first 100 early birds only</p>
            </div>
            
            <p className="font-cinzel text-gray-400 text-lg leading-relaxed">
              Premium quality fabric with futuristic aesthetics. Join the crew and wear your legend. 
              Available exclusively for Vaudeville 2026.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-3 px-10 py-5 bg-[#d4af37] text-black font-cinzel font-bold text-2xl rounded-xl hover:bg-[#b8962e] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] group"
              >
                <ShoppingBag className="group-hover:rotate-12 transition-transform" /> BUY NOW
              </button>
              
              <button
                onClick={() => setShowSizeChart(true)}
                className="flex items-center gap-3 px-8 py-5 border-2 border-[#d4af37] text-[#d4af37] font-cinzel font-bold text-xl rounded-xl hover:bg-[#d4af37]/10 transition-all font-cinzel"
              >
                VIEW SIZE CHART
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setShowSizeChart(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-2xl w-full border-2 border-[#d4af37] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-zinc-900 px-6 py-4 border-b border-[#d4af37]/30">
                <span className="font-pirata text-[#d4af37] text-3xl tracking-wider">Size Chart</span>
                <button onClick={() => setShowSizeChart(false)} className="text-[#d4af37] hover:text-white transition">
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[80vh]">
                <img src={SIZE_CHART_IMG} alt="Size Chart" className="w-full h-auto object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/98 backdrop-blur-xl p-4 md:p-8 overflow-y-scroll"
            onClick={() => { setShowForm(false); resetForm(); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="relative max-w-2xl w-full bg-zinc-950 border border-[#d4af37]/30 rounded-3xl shadow-2xl overflow-hidden mt-10 mb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => { setShowForm(false); resetForm(); }}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition z-20 bg-black/50 rounded-full p-1 border border-white/10"
              >
                <X size={28} />
              </button>

              <div className="w-full p-6 md:p-12">
                {submitted ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 text-green-500 mb-4">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="font-pirata text-5xl text-[#d4af37]">Legend Acknowledged!</h3>
                    <p className="font-cinzel text-zinc-400 text-lg">Your order information has been successfully sent. We will verify your payment and contact you soon.</p>
                    <button 
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="px-8 py-3 bg-[#d4af37] text-black font-cinzel font-bold rounded-lg mt-8 hover:bg-[#b8962e] transition cursor-pointer"
                    >
                      RETURN TO DOCK
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-10">
                      <h3 className="font-pirata text-4xl text-[#d4af37] mb-8">Payment & Crew Details</h3>
                      <div className="inline-block rounded-3xl border-4 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)] overflow-hidden">
                        <img src={QR_IMG} alt="QR Code" className="w-64 h-64 md:w-96 md:h-96 object-contain" />
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 pb-4 px-1">
                      {/* Size Selection Radio Buttons */}
                      <div className="space-y-4">
                        <label className="block font-cinzel text-sm text-[#d4af37] uppercase tracking-widest text-center">Select Your Size</label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {SIZES.map(size => (
                            <label key={size} className="cursor-pointer group">
                              <input 
                                type="radio" name="size" value={size} checked={formData.size === size}
                                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                                className="peer hidden"
                              />
                              <div className="h-12 flex items-center justify-center border border-white/10 rounded-lg text-zinc-500 peer-checked:bg-[#d4af37] peer-checked:text-black peer-checked:border-[#d4af37] hover:border-[#d4af37]/50 transition-all font-bold">
                                {size}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Full Name</label>
                          <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Jack Sparrow" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Email ID</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="captain@blackpearl.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Roll Number</label>
                          <input required name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} placeholder="24BCE206" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Contact Number</label>
                          <input required name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} maxLength={10} placeholder="10 Digit Number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Transaction ID</label>
                        <input required name="transactionId" value={formData.transactionId} onChange={handleInputChange} placeholder="Unique UPI Reference No." className={`w-full bg-white/5 border ${transactionError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]`} />
                        {transactionError && <p className="text-red-500 text-xs font-cinzel mt-1 ml-1">{transactionError}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-cinzel text-zinc-500 uppercase tracking-widest">Payment Screenshot</label>
                        <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition text-center cursor-pointer">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                          {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-40 mx-auto rounded-lg" />
                          ) : (
                            <div className="space-y-2">
                              <Upload className="mx-auto text-zinc-500" />
                              <p className="text-zinc-500 text-sm font-cinzel">Click to upload confirmation screenshot</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#d4af37] text-black font-cinzel font-bold text-xl py-5 rounded-xl transition hover:bg-[#b8962e] disabled:bg-zinc-700 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <>CONFIRM ORDER <CheckCircle2 /></>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PiratePageLayout>
  )
}