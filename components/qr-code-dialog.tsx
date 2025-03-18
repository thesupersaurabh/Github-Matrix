"use client"

import { X, ZoomIn, Copy } from "lucide-react"
import Image from "next/image"

interface QRCodeDialogProps {
  isOpen: boolean
  onClose: () => void
  type: string
  qrCode: string
  id: string
}

export default function QRCodeDialog({ isOpen, onClose, type, qrCode, id }: QRCodeDialogProps) {
  if (!isOpen) return null;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`Copied: ${text}`)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-black/95 border-2 border-green-500/50 rounded-lg p-6 max-w-sm w-full shadow-[0_0_30px_rgba(0,255,0,0.3)]" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-green-500/70 hover:text-green-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-5">
          <h3 className="text-green-400 font-mono text-lg mb-1">{type === 'upi' ? 'UPI_PAYMENT' : 'BTC_CRYPTO_WALLET'}</h3>
          <div className="text-green-500/60 text-xs font-mono">SCAN_TO_SUPPORT_DEVELOPMENT</div>
        </div>
        
        <div className="bg-white p-2 rounded-md mx-auto mb-4 max-w-[200px]">
          <div className="w-full aspect-square flex items-center justify-center text-sm rounded-sm overflow-hidden">
            <Image 
              src={qrCode} 
              alt={type === 'upi' ? "UPI QR Code" : "BTC QR Code"}
              width={200}
              height={200}
            />
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 bg-green-900/30 border border-green-500/30 rounded-md px-3 py-2 font-mono text-green-400 text-sm">
            <span className="truncate max-w-[180px]">{id}</span>
            <button 
              onClick={() => copyToClipboard(id)}
              className="text-green-400 hover:text-green-300"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="text-green-500/70 text-xs mt-3 font-mono">
            THANK_YOU_FOR_SUPPORTING_THIS_PROJECT
          </p>
        </div>
      </div>
    </div>
  );
} 