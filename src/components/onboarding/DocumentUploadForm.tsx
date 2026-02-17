'use client';

import { useState } from 'react';
import MediaCapture from '@/components/shared/MediaCapture';
import { createClient } from '@/lib/supabase/client';

export default function DocumentUploadForm() {
    const [documents, setDocuments] = useState({
        cnhUrl: '',
        rgUrl: '',
        addressProofUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // In a real app, you'd get the current user ID
    // For demo, we'll assume a placeholder or handle it in the upload prefix logic inside the component if passed dynamic props
    const userId = 'user_demo_123';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Here you would save the document URLs to your database (e.g., profiles or stores table)
            // const supabase = createClient();
            // await supabase.from('profiles').update({ ...documents }).eq('id', userId);

            console.log('Saving documents:', documents);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitSuccess(true);
        } catch (error) {
            console.error('Error saving documents:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="p-6 text-center bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-800">Documentos Enviados!</h3>
                <p className="text-green-600 mt-2">Seus dados estão em análise.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 pt-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Envio de Documentos</h2>
                <p className="text-gray-500">
                    Para ativar sua conta, precisamos de fotos dos seus documentos.
                </p>
            </div>

            <MediaCapture
                label="Carteira de Habilitação (CNH)"
                bucket="documents"
                pathPrefix={`${userId}/cnh`}
                onUploadComplete={(url) => setDocuments(prev => ({ ...prev, cnhUrl: url }))}
            />

            <MediaCapture
                label="RG / Documento de Identidade"
                bucket="documents"
                pathPrefix={`${userId}/rg`}
                onUploadComplete={(url) => setDocuments(prev => ({ ...prev, rgUrl: url }))}
            />

            <MediaCapture
                label="Comprovante de Residência"
                bucket="documents"
                pathPrefix={`${userId}/address`}
                onUploadComplete={(url) => setDocuments(prev => ({ ...prev, addressProofUrl: url }))}
            />

            <button
                type="submit"
                disabled={submitting || !documents.cnhUrl || !documents.rgUrl}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {submitting ? 'Salvando...' : 'Enviar Documentos'}
            </button>
        </form>
    );
}
