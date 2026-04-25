"use client"

import { Coffee, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DonationSection() {
  return (
    <div className="px-4 sm:px-6 py-6 bg-gradient-to-b from-transparent to-green-900/10 border-t border-green-500/20">
      <h3 className="text-green-400 font-mono text-sm mb-5 tracking-wider flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-green-500/40"></span>
        <span>SUPPORT_DEVELOPMENT</span>
        <span className="h-px w-8 bg-green-500/40"></span>
      </h3>
      
      <div className="text-center mb-6 max-w-lg mx-auto">
        <p className="text-green-400/80 text-sm font-mono leading-relaxed">
          This project is 100% free, open-source, and runs entirely in your browser. 
          If you found it useful for hacking your contribution graph, consider supporting my work to keep the Matrix running and fuel future updates!
        </p>
      </div>

      <div className="flex justify-center max-w-sm mx-auto">
        <a 
          href="https://ko-fi.com/thesupersaurabh"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black/80 border border-green-500/30 rounded-md p-4 flex flex-col items-center hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(0,255,0,0.15)] transition-all group w-full cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
            <span className="text-green-300 font-medium group-hover:text-green-200 transition-colors inline-flex items-center">
              BUY_ME_A_COFFEE
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
          <p className="text-green-500/60 text-xs text-center font-mono">
            Every coffee helps maintain the servers ☕
          </p>
        </a>
      </div>
    </div>
  )
} 