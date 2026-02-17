export type UserRole = 'admin' | 'vendedora' | 'entregadora' | 'usuaria';

export const ROLES = {
    ADMIN: 'admin',
    VENDEDORA: 'vendedora',
    ENTREGADORA: 'entregadora',
    USUARIA: 'usuaria',
} as const;

// Define URL paths for each role's dashboard
export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.VENDEDORA]: '/vendedora',
    [ROLES.ENTREGADORA]: '/entregadora',
    [ROLES.USUARIA]: '/cliente',
};

// Define permissions for each role
export const PERMISSIONS = {
    // Admin Permissions
    MANAGE_USERS: 'manage_users',
    MANAGE_SYSTEM: 'manage_system',
    VIEW_ALL_STATS: 'view_all_stats',

    // Vendedora Permissions
    MANAGE_PRODUCTS: 'manage_products',
    VIEW_SALES: 'view_sales',
    MANAGE_SHOP: 'manage_shop',

    // Entregadora Permissions
    VIEW_DELIVERIES: 'view_deliveries',
    UPDATE_DELIVERY_STATUS: 'update_delivery_status',

    // Usuaria Permissions
    PLACE_ORDER: 'place_order',
    VIEW_OWN_ORDERS: 'view_own_orders',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    [ROLES.ADMIN]: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.MANAGE_SYSTEM,
        PERMISSIONS.VIEW_ALL_STATS,
        PERMISSIONS.MANAGE_PRODUCTS, // Admin can also manage products
        PERMISSIONS.VIEW_SALES,
        PERMISSIONS.VIEW_DELIVERIES,
    ],
    [ROLES.VENDEDORA]: [
        PERMISSIONS.MANAGE_PRODUCTS,
        PERMISSIONS.VIEW_SALES,
        PERMISSIONS.MANAGE_SHOP,
    ],
    [ROLES.ENTREGADORA]: [
        PERMISSIONS.VIEW_DELIVERIES,
        PERMISSIONS.UPDATE_DELIVERY_STATUS,
    ],
    [ROLES.USUARIA]: [
        PERMISSIONS.PLACE_ORDER,
        PERMISSIONS.VIEW_OWN_ORDERS,
    ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission) : false;
}

export function getDashboardPath(role: UserRole): string {
    return ROLE_DASHBOARD_PATHS[role] || '/';
}
