import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Carregamento Robusto do Env
const envPath = resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Erro: Credenciais do Supabase não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function seedAdmin() {
    const email = 'bruno@oceanoazul.dev.br';
    const password = 'Amor131313@';
    const fullName = 'Bruno Bisogni'; // Nome completo para o perfil

    console.log(`🚀 Iniciando setup do Super Admin: ${email}...`);

    // 1. Criar ou Atualizar Usuário no Auth
    // Usamos admin.createUser com os metadados corretos para a Trigger do SQL funcionar
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'admin' }
    });

    let userId;

    if (createError) {
        if (createError.message.includes('already registered')) {
            console.log('ℹ️ Usuário já existe no Auth. Buscando ID...');
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            const existingUser = users.find(u => u.email === email);
            userId = existingUser?.id;
        } else {
            console.error('❌ Erro ao criar usuário:', createError.message);
            return;
        }
    } else {
        userId = userData.user?.id;
        console.log(`✅ Usuário criado com sucesso! ID: ${userId}`);
    }

    if (!userId) return;

    // 2. Garantir que a Role seja 'admin' na tabela Profiles
    // Como a Trigger pode já ter criado o perfil, usamos UPSERT para garantir o cargo
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            full_name: fullName,
            role: 'admin',
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (profileError) {
        console.error('❌ Erro ao definir permissões de admin:', profileError.message);
    } else {
        console.log('👑 PERMISSÃO CONCEDIDA: Bruno agora é o Administrador Geral.');
    }

    console.log('---');
    console.log('Próximo passo: Acesse localhost:3000/login e use suas credenciais.');
}

seedAdmin();