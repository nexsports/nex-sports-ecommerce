"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageItem {
  id?: string;
  url: string;
  alt?: string;
  position: number;
}

interface ProductImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  onUpload?: (file: File) => Promise<string>; // returns URL
}

export function ProductImageUploader({ images, onChange, onUpload }: ProductImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    setUploading(true);
    try {
      const url = await onUpload(file);
      const newImages = [...images, { url, alt: "", position: images.length }];
      onChange(newImages);
    } catch {
      toast.error("Falha no upload da imagem");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(idx: number) {
    const next = images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, position: i }));
    onChange(next);
  }

  function updateAlt(idx: number, alt: string) {
    const next = [...images];
    next[idx] = { ...next[idx], alt };
    onChange(next);
  }

  function updatePosition(idx: number, pos: number) {
    const next = [...images];
    next[idx] = { ...next[idx], position: pos };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-border bg-secondary/30">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
            </div>
            <div className="p-2 space-y-1">
              <Input
                placeholder="Alt text"
                value={img.alt ?? ""}
                onChange={(e) => updateAlt(i, e.target.value)}
                className="h-7 text-xs bg-background border-border"
              />
              <div className="flex items-center gap-1">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={img.position}
                  onChange={(e) => updatePosition(i, parseInt(e.target.value) || 0)}
                  className="h-7 w-16 text-xs bg-background border-border"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Enviando..." : "Adicionar imagem"}
        </Button>
      </div>
    </div>
  );
}
