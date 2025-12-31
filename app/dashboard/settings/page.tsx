"use client"

import { useEffect } from "react"
import { useHeaderStore } from "@/hooks/use-header-store"
import { useThemeStore } from "@/hooks/use-theme-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

const ART_OPTIONS = [
  { id: 'none', src: '', label: 'None' },
  { id: 'art-1', src: '/line-arts/art-1.png', label: 'Art 1' },
  { id: 'art-2', src: '/line-arts/art-2.png', label: 'Art 2' },
  { id: 'art-3', src: '/line-arts/art-3.png', label: 'Art 3' },
  { id: 'art-4', src: '/line-arts/art-4.png', label: 'Art 4' },
  { id: 'art-5', src: '/line-arts/art-5.png', label: 'Art 5' },
  { id: 'art-6', src: '/line-arts/art-6.png', label: 'Art 6' },
]

export default function SettingsPage() {
  const { setTitle, setTabs } = useHeaderStore()
  const { currentLineArt, setLineArt } = useThemeStore()

  useEffect(() => {
    setTitle("Settings")
    setTabs([])
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-full bg-[#0B1120] h-full">
      {/* General Settings (Dummy) */}
      <Card className="bg-[#1e293b] border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">General Settings</CardTitle>
          <CardDescription className="text-slate-400">Manage your basic account preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Date Format</Label>
              <Select defaultValue="dd/mm/yyyy">
                <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-200">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Time Zone</Label>
              <Select defaultValue="ist">
                <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-200">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                  <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                  <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-0.5">
              <Label className="text-slate-200">Email Notifications</Label>
              <p className="text-sm text-slate-400">Receive emails about new Challans.</p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Panel / Theme Settings */}
      <Card className="bg-[#1e293b] border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Panel Customization</CardTitle>
          <CardDescription className="text-slate-400">Choose the sidebar artistic element.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Label className="text-slate-200">Sidebar Line Art</Label>
            <div className="flex flex-wrap gap-4">
              {ART_OPTIONS.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setLineArt(art.src)}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${currentLineArt === art.src
                    ? 'border-brand-highlight ring-2 ring-brand-highlight/20'
                    : 'border-slate-600 hover:border-slate-500'
                    }`}
                >
                  {art.src ? (
                    <img
                      src={art.src}
                      alt={art.label}
                      className="w-full h-full object-cover p-2 bg-slate-900"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-sm font-medium">
                      None
                    </div>
                  )}

                  {currentLineArt === art.src && (
                    <div className="absolute inset-0 bg-brand-highlight/10 flex items-center justify-center">
                      <div className="bg-brand-highlight rounded-full p-1 shadow-sm">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
