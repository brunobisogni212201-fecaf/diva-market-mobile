
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Você precisa estar logada para criar produtos.' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceRaw = formData.get('price') as string;
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || !priceRaw || !category) {
        return { error: 'Nome, preço e categoria são obrigatórios.' };
    }

    // Convert price to cents (assuming input is "10,50" or "10.50")
    // Simple sanitization: remove currency symbols, swap comma to dot
    const cleanPrice = priceRaw.replace('R$', '').trim().replace(',', '.');
    const priceInCents = Math.round(parseFloat(cleanPrice) * 100);

    if (isNaN(priceInCents)) {
        return { error: 'Preço inválido.' };
    }

    const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name,
        description,
        price: priceInCents,
        category,
        image_url: imageUrl,
    });

    if (error) {
        console.error('Error creating product:', error);
        return { error: 'Erro ao salvar produto.' };
    }

    revalidatePath('/dashboard/products');
    return { success: true };
}

export async function deleteProduct(productId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .match({ id: productId, user_id: user.id });

    if (error) {
        console.error('Error deleting product:', error);
        return { error: 'Erro ao excluir produto.' };
    }

    revalidatePath('/dashboard/products');
    return { success: true };
}
