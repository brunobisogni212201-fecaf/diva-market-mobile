'use client';

import { useState, useRef } from 'react';
import { Camera, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
// import { httpsCallable } from 'firebase/functions'; // REMOVED
// import { functions } from '@/lib/firebase'; // REMOVED

interface DocumentData {
  valid: boolean;
  extracted: {
    nome: string;
    cpf: string;
  };
}

export default function DocumentScanner({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (data: DocumentData) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix if needed
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem é muito grande. Selecione uma imagem de até 5MB.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedImage(`data:image/jpeg;base64,${base64}`);
      setError(null);
      setResult(null);
    } catch (error) {
      setError('Erro ao processar a imagem. Tente novamente.');
      console.error('Error processing image:', error);
    }
  };

  const analyzeDocument = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // MOCK for migration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success for demo/testing
      const data: DocumentData = {
        valid: true,
        extracted: {
          nome: 'Usuário de Teste',
          cpf: '000.000.000-00'
        }
      };

      setResult(data);

      if (data.valid) {
        setTimeout(() => {
          onSuccess(data);
        }, 2000);
      }
    } catch (error) {
      console.error('Error analyzing document:', error);
      setError('Falha ao analisar o documento. Verifique a imagem e tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Validação de Identidade
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tire uma foto do seu documento
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedImage ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={40} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tire uma foto do seu documento
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Certifique-se de que o documento esteja nítido e bem iluminado
              </p>

              <button
                onClick={triggerFileInput}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                <Camera size={20} className="inline mr-2" />
                Tirar Foto
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative w-full h-64">
                <Image
                  src={selectedImage}
                  alt="Document preview"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl"
                />
                <button
                  onClick={resetScanner}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Result */}
              {result && result.valid && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check size={16} className="text-green-600" />
                    <h4 className="font-semibold text-green-900">Documento Válido!</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Nome:</span> {result.extracted.nome}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">CPF:</span> {result.extracted.cpf}
                    </p>
                  </div>
                </div>
              )}

              {/* Invalid Result */}
              {result && !result.valid && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className="text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Documento Inválido</h4>
                  </div>
                  <p className="text-sm text-yellow-800 mt-1">
                    A foto não está nítida ou não é um documento válido. Tente novamente.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!result && (
                  <>
                    <button
                      onClick={resetScanner}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Tirar Outra
                    </button>
                    <button
                      onClick={analyzeDocument}
                      disabled={isAnalyzing}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={16} className="inline animate-spin mr-2" />
                          Analisando...
                        </>
                      ) : (
                        'Validar Documento'
                      )}
                    </button>
                  </>
                )}

                {result && !result.valid && (
                  <button
                    onClick={resetScanner}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
