import ContributionGraph from "@/components/contribution-graph"
import ConfigurationForm from "@/components/configuration-form"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Terminal, AlertTriangle, ExternalLink } from "lucide-react"
import TerminalText from "@/components/terminal-text"
import Link from "next/link"
import Image from "next/image"
import DonationSection from "@/components/donation-section"
import TabSelector from "@/components/tab-selector"
import NoSSR from "@/lib/no-ssr-wrapper"

export default function Home() {
  return (
    <NoSSR>
      <main className="min-h-screen p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Cyberpunk themed header */}
          <header className="text-center space-y-4 relative">
            <div className="absolute -top-4 -left-4 w-full h-1 bg-green-500/20"></div>
            <div className="absolute -top-4 -left-4 h-full w-1 bg-green-500/20"></div>
            <div className="absolute -top-4 -right-4 h-full w-1 bg-green-500/20"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-1 bg-green-500/20"></div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <Github className="h-8 w-8 text-green-500" />
              <Terminal className="h-6 w-6 text-green-500" />
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold font-mono text-green-500 tracking-wider text-glow">
              <TerminalText 
                text="GITHUB_MATRIX" 
                speed={40} 
                className="inline-block"
              />
              <span className="text-green-300 ml-1">v1.2</span>
            </h1>
            
            <TerminalText
              text="[>] CUSTOMIZE YOUR GITHUB CONTRIBUTION PATTERN AND DEPLOY COMMITS [<]"
              className="text-green-500/70 font-mono max-w-xl mx-auto"
              speed={15}
              startDelay={2000}
            />
            
            <div className="flex justify-center gap-4 pt-2 text-xs text-green-500/60 font-mono">
              <TerminalText 
                text="// CYBERPUNK.MODE=TRUE" 
                speed={10}
                startDelay={3500}
                className="inline-block"
              />
              <span>//</span>
              <TerminalText 
                text="// SYSTEM.READY" 
                speed={10}
                startDelay={4000}
                className="inline-block"
              />
            </div>
          </header>

          {/* Disclaimer Message */}
          <div className="border border-yellow-500/30 bg-black/60 p-4 rounded-md shadow-[0_0_10px_rgba(255,255,0,0.1)] text-yellow-400/90 font-mono text-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="font-bold text-yellow-400 mb-1">RECRUITER_ALERT.SYS</h3>
                <p>This tool demonstrates why GitHub contribution graphs are a flawed metric for developer assessment. Hiring based on GitHub activity discriminates against those with limited free time and ignores quality in favor of quantity.</p>
                <p className="mt-2">Use this for educational purposes only. We do not encourage misrepresentation of actual coding activity.</p>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="border border-green-500/30 bg-black/60 p-5 rounded-md shadow-[0_0_15px_rgba(0,255,0,0.1)] font-mono">
            <h2 className="text-green-400 font-bold text-xl mb-4 flex items-center">
              <Terminal className="mr-2 h-5 w-5" />
              USAGE_INSTRUCTIONS
            </h2>
            
            <ol className="space-y-3 text-green-300/80 list-decimal pl-5">
              <li>
                <span className="text-green-400">CREATE_REPOSITORY:</span> Create a private repository on GitHub where commits will be generated
              </li>
              <li>
                <span className="text-green-400">SET_PROFILE_VISIBILITY:</span> Ensure your GitHub activity is set to public in your profile settings
              </li>
              <li>
                <span className="text-green-400">GENERATE_ACCESS_TOKEN:</span> Create a Personal Access Token with repo scope from{" "}
                <Link 
                  href="https://github.com/settings/personal-access-tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline inline-flex items-center"
                >
                  GitHub Developer Settings
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </li>
              <li>
                <span className="text-green-400">SELECT_YEAR:</span> You can generate backdated commits for any year supported by GitHub&apos;s contribution graph (2008-2025). The tool creates commits with precise timestamps matching your selected year, allowing you to fill your contribution history for any period.
              </li>
              <li>
                <span className="text-green-400">CONFIGURE_PATTERN:</span> Design your contribution pattern in the MATRIX_PATTERNS tab by clicking directly on the boxes in the grid. Each click increases intensity. You can also apply predefined patterns and adjust their intensity using the slider.
              </li>
              <li>
                <span className="text-green-400">EXECUTE_COMMITS:</span> Fill in the CONFIG form and generate your commits with precise timestamps matching your selected dates
              </li>
            </ol>
            
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-md p-3">
              <h3 className="text-green-400 font-bold mb-2 flex items-center text-sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                TIMELINE_MANIPULATION
              </h3>
              <p className="text-green-300/80 text-sm">
                This tool supports creating commits with backdated timestamps, allowing you to fill your GitHub contribution graph for any date in the past. GitHub records contribution activity based on commit timestamps, not when they were actually pushed.
              </p>
            </div>
          </div>

          <ContributionGraph />

          <TabSelector />
          
          <footer className="mt-20">
            <div className="relative bg-black/80 border-2 border-green-500/40 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,255,0,0.15)]">
              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[linear-gradient(to_right,transparent_24px,#00ff0010_25px,#00ff0010_26px,transparent_27px),linear-gradient(to_bottom,transparent_24px,#00ff0010_25px,#00ff0010_26px,transparent_27px)] bg-[size:30px_30px]"></div>
              </div>
              
              {/* Glowing top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/70 to-transparent"></div>
              
              {/* Developer info */}
              <div className="px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6 relative">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 p-[2px] shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                    <div className="h-full w-full bg-black rounded-[5px] flex items-center justify-center overflow-hidden">
                      <Image 
                        src="https://avatars.githubusercontent.com/u/45630418?v=4" 
                        alt="Saurabh Kumar Thakur"
                        width={48}
                        height={48}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-green-400 font-mono text-xs tracking-widest uppercase mb-0.5">
                      <span className="bg-green-500/10 px-2 py-0.5 rounded-sm">Developed by</span>
                    </div>
                    <Link 
                      href="https://thesaurabh.tech" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-300 hover:text-green-200 transition-colors inline-flex items-center font-bold tracking-wider text-lg"
                    >
                      SAURABH_
                      <ExternalLink className="h-3 w-3 ml-1.5" />
                    </Link>
                  </div>
                </div>
                
                {/* Separator */}
                <div className="h-px w-20 md:h-14 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-green-500/30 to-transparent"></div>
                
                {/* System info */}
                <div className="px-4 py-2 bg-black/50 rounded-md border border-green-500/20 grid grid-cols-2 gap-4 min-w-[280px] text-center">
                  <div className="flex flex-col">
                    <span className="text-green-500/40 text-[10px] mb-1">VERSION</span>
                    <span className="text-green-300">v1.2.1</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-green-500/40 text-[10px] mb-1">STATUS</span>
                    <span className="text-green-300">ONLINE</span>
                  </div>
                </div>
              </div>
              
              {/* Donation section */}
              <DonationSection />
              
              {/* Copyright */}
              <div className="text-center text-xs text-green-500/60 font-mono border-t border-green-500/20 py-4 px-6">
                <p>© {new Date().getFullYear()} // GITHUB_MATRIX // ALL_RIGHTS_RESERVED</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </NoSSR>
  )
}


