"use client"

import { useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, UploadCloud } from "lucide-react"
import { toast } from "sonner"

/**
 * Inspection photos / signed estimates. Files are held locally for now;
 * the upload endpoint ships with the Go backend.
 */
export function DocumentsCard() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<string[]>([])

  const onFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const names = [...list].map((file) => file.name)
    setFiles((prev) => [...prev, ...names])
    toast.info(
      names.length === 1
        ? `${names[0]} attached locally`
        : `${names.length} files attached locally`,
      { description: "Files sync once the storage backend is connected." }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            onFiles(event.dataTransfer.files)
          }}
          className="border-primary/40 text-muted-foreground hover:border-primary hover:text-foreground flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors"
        >
          <span className="bg-primary/12 text-primary flex size-10 items-center justify-center rounded-full">
            <UploadCloud className="size-5" />
          </span>
          <span className="text-sm font-medium">
            Drop inspection photos or signed estimates
          </span>
          <span className="text-xs">PDF, JPG, PNG · max 25 MB</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => onFiles(event.target.files)}
        />
        {files.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {files.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="text-muted-foreground flex items-center gap-2 text-xs"
              >
                <FileText className="size-3.5 shrink-0" />
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
