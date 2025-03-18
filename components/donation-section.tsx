"use client"

import { useState } from "react"
import { CreditCard, Bitcoin, ZoomIn, Copy } from "lucide-react"
import QRCodeDialog from "./qr-code-dialog"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DonationSection() {
  const [showUpiQR, setShowUpiQR] = useState(false)
  const [showCryptoQR, setShowCryptoQR] = useState(false)
  
  const btcAddress = "bc1qw2yw0pa9lldnn0mfzqwhcy9hfpnx3paqwp58us"
  const upiId = "thesaurabh@upi"

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
    <div className="px-4 sm:px-6 py-6 bg-gradient-to-b from-transparent to-green-900/10 border-t border-green-500/20">
      <h3 className="text-green-400 font-mono text-sm mb-5 tracking-wider flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-green-500/40"></span>
        <span>SUPPORT_DEVELOPMENT</span>
        <span className="h-px w-8 bg-green-500/40"></span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        <div 
          onClick={() => setShowUpiQR(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowUpiQR(true)
            }
          }}
          className="bg-black/80 border border-green-500/30 rounded-md p-4 flex flex-col items-center hover:border-green-500/50 transition-colors group w-full cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-green-400" />
            <span className="text-green-300 font-medium">UPI_PAYMENT</span>
          </div>
          <div className="relative w-24 h-24 bg-white p-1 rounded-md mb-2 group-hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all">
            <div className="w-full h-full flex items-center justify-center rounded-sm overflow-hidden">
              <Image 
                src="/upi qr.png" 
                alt="UPI QR Code" 
                width={90} 
                height={90}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity text-white font-mono">
                <ZoomIn className="h-6 w-6 text-green-300" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400/80 text-xs bg-green-500/10 px-2 py-1 rounded-md">
            <span>{upiId}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(upiId)
              }}
              className="text-green-400 hover:text-green-300"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div 
          onClick={() => setShowCryptoQR(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowCryptoQR(true)
            }
          }}
          className="bg-black/80 border border-green-500/30 rounded-md p-4 flex flex-col items-center hover:border-green-500/50 transition-colors group w-full cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bitcoin className="h-4 w-4 text-green-400" />
            <span className="text-green-300 font-medium">BTC_CRYPTO_WALLET</span>
          </div>
          <div className="relative w-24 h-24 bg-white p-1 rounded-md mb-2 group-hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all">
            <div className="w-full h-full flex items-center justify-center rounded-sm overflow-hidden">
              <Image 
                src="/btc qr.jpeg" 
                alt="BTC QR Code" 
                width={90} 
                height={90}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity text-white font-mono">
                <ZoomIn className="h-6 w-6 text-green-300" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-400/80 text-xs bg-green-500/10 px-2 py-1 rounded-md">
            <span className="truncate max-w-[180px]">{btcAddress}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(btcAddress)
              }}
              className="text-green-400 hover:text-green-300"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Dialogs */}
      <Tooltip>
        <TooltipTrigger asChild>
          <QRCodeDialog 
            isOpen={showUpiQR} 
            onClose={() => setShowUpiQR(false)} 
            type="upi" 
            qrCode="/upi qr.png" 
            id={upiId}
          />
        </TooltipTrigger>
        <TooltipContent>
          {/* content */}
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <QRCodeDialog 
            isOpen={showCryptoQR} 
            onClose={() => setShowCryptoQR(false)} 
            type="crypto" 
            qrCode="/btc qr.jpeg" 
            id={btcAddress}
          />
        </TooltipTrigger>
        <TooltipContent>
          {/* content */}
        </TooltipContent>
      </Tooltip>
    </div>
  )
} 