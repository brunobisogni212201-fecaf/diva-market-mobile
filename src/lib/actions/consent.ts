'use server';

import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/lib/auth/rbac';
import { headers } from 'next/headers';

export interface ConsentData {
    userId: string;
    role: UserRole;
    version: string;
    marketing?: boolean;
    dataProcessing?: boolean;
    locationTracking?: boolean;
}

export async function recordConsent(data: ConsentData) {
    const supabase = createClient();
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    try {
        const { error } = await supabase.from('consent_logs').insert({
            user_id: data.userId,
            role: data.role,
            consent_version: data.version,
            ip_address: ip,
            user_agent: userAgent,
            marketing_consent: data.marketing || false,
            data_processing_consent: data.dataProcessing || false,
            location_tracking_consent: data.locationTracking || false,
        });

        if (error) {
            console.error('Error recording consent:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Unexpected error recording consent:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}
