"use client"

import type * as React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, X, RotateCw, Trash2 } from "lucide-react"
import { spacing } from "@/lib/design-tokens"

interface ProfileData {
  image?: string
  name: string
  role: string
  region: string
  language: string
}

interface ProfileEditPopoverProps {
  trigger: React.ReactNode
  onSave?: (data: ProfileData) => void
  initialData?: ProfileData
}

const REGION_LANGUAGES: Record<string, { value: string; label: string }[]> = {
  "north-america": [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
  ],
  "south-america": [
    { value: "es", label: "Spanish" },
    { value: "pt", label: "Portuguese" },
    { value: "en", label: "English" },
  ],
  europe: [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "it", label: "Italian" },
  ],
  asia: [
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "hi", label: "Hindi" },
    { value: "en", label: "English" },
  ],
  africa: [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "ar", label: "Arabic" },
    { value: "sw", label: "Swahili" },
  ],
  oceania: [
    { value: "en", label: "English" },
    { value: "mi", label: "Māori" },
    { value: "sm", label: "Samoan" },
  ],
}

export function ProfileEditPopover({ trigger, onSave, initialData }: ProfileEditPopoverProps) {
  const [open, setOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(initialData?.image || null)
  const [zoom, setZoom] = useState([1])
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)

  const [name, setName] = useState(initialData?.name || "")
  const [role, setRole] = useState(initialData?.role || "")
  const [region, setRegion] = useState(initialData?.region || "")
  const [language, setLanguage] = useState(initialData?.language || "")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
      setZoom([1])
      setCropPosition({ x: 0, y: 0 })
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!imageSrc) return
      setIsDragging(true)
      setDragStart({
        x: e.clientX - cropPosition.x,
        y: e.clientY - cropPosition.y,
      })
    },
    [imageSrc, cropPosition],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      setCropPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360)
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImageSrc(null)
    setImageFile(null)
    setZoom([1])
    setCropPosition({ x: 0, y: 0 })
    setRotation(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const getCroppedImage = useCallback((): string | null => {
    if (!imageSrc || !canvasRef.current) return null

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const img = new Image()
    img.src = imageSrc

    // Set canvas size to desired output (200x200 for high quality)
    const size = 200
    canvas.width = size
    canvas.height = size

    // Draw the cropped and scaled image
    const scale = zoom[0]
    const drawSize = size * scale

    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(img, -drawSize / 2 + cropPosition.x, -drawSize / 2 + cropPosition.y, drawSize, drawSize)
    ctx.restore()

    return canvas.toDataURL("image/png")
  }, [imageSrc, zoom, cropPosition, rotation])

  useEffect(() => {
    if (region) {
      const availableLanguages = REGION_LANGUAGES[region] || []
      if (!availableLanguages.find((lang) => lang.value === language)) {
        setLanguage(availableLanguages[0]?.value || "")
      }
    }
  }, [region, language])

  const handleSave = useCallback(() => {
    const croppedImage = getCroppedImage()
    const profileData: ProfileData = {
      image: croppedImage || imageSrc || undefined,
      name,
      role,
      region,
      language,
    }

    onSave?.(profileData)
    setOpen(false)
  }, [getCroppedImage, imageSrc, name, role, region, language, onSave])

  const handleCancel = useCallback(() => {
    setImageSrc(initialData?.image || null)
    setName(initialData?.name || "")
    setRole(initialData?.role || "")
    setRegion(initialData?.region || "")
    setLanguage(initialData?.language || "")
    setZoom([1])
    setCropPosition({ x: 0, y: 0 })
    setRotation(0)
    setOpen(false)
  }, [initialData])

  const availableLanguages = region ? REGION_LANGUAGES[region] || [] : []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[480px] max-h-[calc(100vh-80px)] p-0 flex flex-col"
        align="start"
        side="right"
        sideOffset={12}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="flex flex-col min-h-0" style={{ gap: spacing.md }}>
          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-border flex-shrink-0"
            style={{ padding: spacing.md }}
          >
            <h3 className="text-lg font-bold">Edit Profile</h3>
            <Button variant="ghost" size="icon" className="size-8" onClick={handleCancel}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Content */}
          <div
            className="flex flex-col overflow-y-auto flex-1 min-h-0"
            style={{ padding: `0 ${spacing.md}`, gap: spacing.md }}
          >
            {/* Profile Image Section */}
            <div className="flex flex-col" style={{ gap: spacing.sm }}>
              <Label className="text-sm font-medium">Profile Image</Label>

              <div className="flex items-start" style={{ gap: spacing.md }}>
                {/* Crop Area */}
                <div
                  ref={cropAreaRef}
                  className="relative overflow-hidden border-2 border-border rounded-lg bg-muted cursor-move select-none"
                  style={{ width: "200px", height: "200px" }}
                  onMouseDown={handleMouseDown}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc || "/placeholder.svg"}
                      alt="Profile preview"
                      className="absolute pointer-events-none"
                      style={{
                        width: `${200 * zoom[0]}px`,
                        height: `${200 * zoom[0]}px`,
                        left: `${cropPosition.x}px`,
                        top: `${cropPosition.y}px`,
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: "center",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      No image selected
                    </div>
                  )}
                </div>

                {/* Preview Circle */}
                <div className="flex flex-col items-center" style={{ gap: spacing.sm }}>
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <Avatar className="size-[72px] border-2 border-border">
                    {imageSrc ? (
                      <AvatarImage src={getCroppedImage() || imageSrc} alt="Preview" />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "??"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>

              {/* Zoom Slider */}
              {imageSrc && (
                <div className="flex items-center" style={{ gap: spacing.sm }}>
                  <Label className="text-xs text-muted-foreground min-w-[40px]">Zoom</Label>
                  <Slider value={zoom} onValueChange={setZoom} min={1} max={3} step={0.1} className="flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[40px] text-right">{zoom[0].toFixed(1)}x</span>
                </div>
              )}

              {/* Image Controls */}
              <div className="flex" style={{ gap: spacing.sm }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  {imageSrc ? "Change Image" : "Upload Image"}
                </Button>
                {imageSrc && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleRotate}>
                      <RotateCw className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRemoveImage}>
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Profile Information Section */}
            <div className="flex flex-col" style={{ gap: spacing.md }}>
              <Label className="text-sm font-medium">Profile Information</Label>

              <div className="flex flex-col" style={{ gap: spacing.sm }}>
                <Label htmlFor="name" className="text-sm">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </div>

              <div className="flex flex-col" style={{ gap: spacing.sm }}>
                <Label htmlFor="role" className="text-sm">
                  Role
                </Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter your role" />
              </div>

              <div className="flex flex-col" style={{ gap: spacing.sm }}>
                <Label htmlFor="region" className="text-sm">
                  Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id="region" className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="south-america">South America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="oceania">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selection Field */}
              <div className="flex flex-col" style={{ gap: spacing.sm }}>
                <Label htmlFor="language" className="text-sm">
                  Language <span className="text-destructive">*</span>
                </Label>
                <Select value={language} onValueChange={setLanguage} disabled={!region}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder={region ? "Select language" : "Select region first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {region && availableLanguages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Common languages in {region.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex justify-end border-t border-border flex-shrink-0"
            style={{ padding: spacing.md, gap: spacing.sm }}
          >
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !language}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </PopoverContent>
    </Popover>
  )
}
