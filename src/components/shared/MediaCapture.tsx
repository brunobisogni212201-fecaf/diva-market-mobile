'use client';

import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadMedia } from '@/lib/supabase/storage';
import Image from 'next/image';

interface MediaCaptureProps {
    label: string;
    bucket: string;
    pathPrefix: string;
    onUploadComplete: (url: string) => void;
    className?: string;
    initialValue?: string;
}

export default function MediaCapture({
    label,
    bucket,
    pathPrefix,
    onUploadComplete,
    className = '',
    initialValue
}: MediaCaptureProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialValue || null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setError(null);
        setIsUploading(true);

        try {
            const result = await uploadMedia(file, bucket, pathPrefix);
            onUploadComplete(result.url);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Falha no envio da imagem.');
            setPreviewUrl(null); // Reset on failure
        } finally {
            setIsUploading(false);
            // Clean up object URL to avoid memory leaks (optional, keeping it for now if needed for fallback)
            // URL.revokeObjectURL(objectUrl); 
        }
    };

    const clearImage = () => {
        setPreviewUrl(null);
        onUploadComplete(''); // Notify parent of clearance
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerCamera = () => {
        if (fileInputRef.current) {
            // We can't force "camera only" easily via JS trigger alone without attributes, 
            // but the input itself has capture="environment". 
            // Some browsers will show the choice.
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="relative border-2 border-dashed border-pink-300 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors overflow-hidden">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*" // Accepts all image types
                    capture="environment" // Hints mobile browsers to use the rear camera
                    className="hidden"
                    onChange={handleFileChange}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <Loader2 className="h-10 w-10 text-pink-500 animate-spin mb-2" />
                        <p className="text-sm text-pink-600 font-medium">Enviando...</p>
                    </div>
                ) : previewUrl ? (
                    <div className="relative w-full h-48 bg-gray-100">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                        <button
                            onClick={clearImage}
                            type="button"
                            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                            <p className="text-white text-xs text-center font-medium">Toque no X para remover</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 p-4 text-center cursor-pointer" onClick={triggerCamera}>
                        <div className="flex space-x-4 mb-3">
                            <div className="p-3 bg-white rounded-full shadow-sm border border-pink-100">
                                <Camera className="h-6 w-6 text-pink-500" />
                            </div>
                            <div className="p-3 bg-white rounded-full shadow-sm border border-pink-100">
                                <UploadCloud className="h-6 w-6 text-pink-500" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            Toque para capturar ou escolher
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Tire uma foto ou carregue da galeria
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
