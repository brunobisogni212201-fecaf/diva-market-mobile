
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Edit, Package, Search } from 'lucide-react';
import MediaCapture from '@/components/shared/MediaCapture';
import { createProduct, deleteProduct } from './actions';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
}

export default function ProductsPage() {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadUrl, setUploadUrl] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);

    // Fetch products
    useEffect(() => {
        async function loadProducts() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setProducts(data);
            setIsLoading(false);
        }
        loadProducts();
    }, [supabase]);

    async function handleSubmit(formData: FormData) {
        setLoadingAction(true);
        // Append image URL if uploaded
        if (uploadUrl) {
            formData.append('imageUrl', uploadUrl);
        }

        const result = await createProduct(formData);

        if (result.error) {
            alert(result.error);
        } else {
            setIsModalOpen(false);
            setUploadUrl('');
            // Optimistic update or refetch? Refetch is safer for ID.
            // For simple implementation, let's force a reload or re-fetch.
            // Since we used revalidatePath in server action, client router cache needs refresh?
            // Manually re-fetching for immediate feedback without full page reload feels smoother here for SPA feel.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('products')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (data) setProducts(data);
            }
        }
        setLoadingAction(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        // Optimistic delete
        setProducts(prev => prev.filter(p => p.id !== id));

        const result = await deleteProduct(id);
        if (result.error) {
            alert(result.error);
            // Revert if error (would need previous state, skipping mostly)
        }
    }

    return (
        <div className="p-6 pb-24 md:pb-6 min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meus Produtos</h1>
                    <p className="text-gray-500">Gerencie o catálogo da sua loja</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-pink-200"
                >
                    <Plus className="w-5 h-5" />
                    Novo Produto
                </button>
            </div>

            {/* Empty State / Loading */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>)}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="p-4 bg-pink-50 rounded-full mb-4">
                        <Package className="w-8 h-8 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Nenhum produto cadastrado</h3>
                    <p className="text-gray-500 text-sm mt-1">Comece adicionando seu primeiro item!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-square w-full bg-gray-100">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Package className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                    {/* Edit - Placeholder action */}
                                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
                            <h2 className="text-lg font-bold text-gray-900">Novo Produto</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full">
                                <span className="text-gray-500 text-xl">&times;</span>
                            </button>
                        </div>

                        <form action={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto</label>
                                <MediaCapture
                                    label=" "
                                    bucket="products"
                                    pathPrefix="uploads"
                                    onUploadComplete={setUploadUrl}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                <input name="name" required className="w-full rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" placeholder="Ex: Bolo de Pote" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                    <input name="price" required className="w-full rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" placeholder="0,00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                    <select name="category" required className="w-full rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500 bg-white">
                                        <option value="">Selecione</option>
                                        <option value="Doces">Doces</option>
                                        <option value="Salgados">Salgados</option>
                                        <option value="Artesanato">Artesanato</option>
                                        <option value="Moda">Moda</option>
                                        <option value="Beleza">Beleza</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea name="description" rows={3} className="w-full rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500" placeholder="Ingredientes, detalhes..." />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingAction}
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loadingAction ? 'Salvando...' : 'Adicionar Produto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
