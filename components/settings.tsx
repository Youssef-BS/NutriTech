"use client"

import { X } from "lucide-react"
import { useState } from "react"

export default function Settings({
  theme,
  onThemeChange,
  accentColor,
  onAccentColorChange,
  onClose,
}: {
  theme?: any
  onThemeChange?: (t: string) => void
  accentColor?: string
  onAccentColorChange?: (c: string) => void
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<any>({
    themeMode: "system",
    accentColor: accentColor || "blue",
    language: "auto",
    spokenLanguage: "auto",
    voiceEnabled: true,
    messageAlerts: true,
    updateAlerts: true,
    notificationSounds: true,
    responseStyle: "balanced",
    tone: "neutral",
    assistantName: "GPT-5",
    conversationMode: "text",
    webAccess: true,
    codeExecution: true,
    historyEnabled: true,
    contentFilter: "medium",
    voicePrivacy: false,
    httpsOnly: true,
    subscription: "free",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
    if (key === "accentColor" && onAccentColorChange) {
      onAccentColorChange(value)
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "customization", label: "Customization", icon: "🎨" },
    { id: "apps", label: "Apps & Connectors", icon: "⚡" },
    { id: "data", label: "Data Management", icon: "💾" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "account", label: "Account", icon: "👤" },
  ]

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Modal Content */}
        <div
          className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Tabs Sidebar */}
            <div className="w-48 border-r border-border overflow-y-auto bg-secondary/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-transparent text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* GENERAL TAB */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                    <div className="space-y-2">
                      {[
                        { value: "system", label: "System", desc: "Follow system settings" },
                        { value: "light", label: "Light", desc: "Bright interface" },
                        { value: "dark", label: "Dark", desc: "Dark interface" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={option.value}
                            checked={settings.themeMode === option.value}
                            onChange={(e) => {
                              handleSettingChange("themeMode", e.target.value)
                              if (e.target.value !== "system") {
                                onThemeChange && onThemeChange(e.target.value)
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-foreground">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Accent Color</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { value: "blue", color: "bg-blue-500" },
                        { value: "green", color: "bg-green-500" },
                        { value: "purple", color: "bg-purple-500" },
                        { value: "red", color: "bg-red-500" },
                        { value: "yellow", color: "bg-yellow-500" },
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleSettingChange("accentColor", color.value)}
                          className={`w-12 h-12 rounded-lg ${color.color} transition-transform ${
                            settings.accentColor === color.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Spoken Language</label>
                    <select
                      value={settings.spokenLanguage}
                      onChange={(e) => handleSettingChange("spokenLanguage", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Voice Reading</p>
                      <p className="text-xs text-muted-foreground">Enable voice responses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.voiceEnabled}
                      onChange={(e) => handleSettingChange("voiceEnabled", e.target.checked)}
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              )}

              {/* ... other tabs retained as-is ... */}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
