
import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. ENUMS
export const userRoleEnum = pgEnum('user_role', ['admin', 'vendedora', 'entregadora', 'usuaria']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'delivering', 'completed', 'cancelled']);

// 2. TABLES

/**
 * Profiles Table
 * Extends Auth Users with app-specific data.
 */
export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().notNull().defaultRandom(), // Should reference auth.users.id in production logic
    email: text('email'),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    role: userRoleEnum('role').default('usuaria').notNull(),
    phone: text('phone'),
    cpf: text('cpf'),
    cnpj: text('cnpj'), // Only for sellers/stores
    walletId: text('wallet_id'), // For payouts
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Stores Table
 * Represents a Seller's shop.
 */
export const stores = pgTable('stores', {
    id: uuid('id').primaryKey().defaultRandom(),
    vendedoraId: uuid('vendedora_id').references(() => profiles.id).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Products Table
 * Linked to a Store.
 */
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('store_id').references(() => stores.id).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    priceCents: integer('price_cents').notNull(),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Orders Table
 * Transaction between Buyer and Store.
 */
export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    buyerId: uuid('buyer_id').references(() => profiles.id).notNull(),
    storeId: uuid('store_id').references(() => stores.id).notNull(),
    status: orderStatusEnum('status').default('pending').notNull(),
    totalAmountCents: integer('total_amount_cents').notNull(),
    deliveryFeeCents: integer('delivery_fee_cents').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Payment Splits Table
 * Tracks who gets what from an order (Marketplace vs Seller vs Driver).
 */
export const paymentSplits = pgTable('payment_splits', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    recipientId: uuid('recipient_id').references(() => profiles.id).notNull(),
    amountCents: integer('amount_cents').notNull(),
    roleType: text('role_type').notNull(), // 'platform', 'seller', 'driver'
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Consent Logs Table
 * Tracks user acceptance of legal terms (LGPD).
 */
export const consentLogs = pgTable('consent_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id').references(() => profiles.id).notNull(),
    consentType: text('consent_type').notNull(), // 'termos_privacidade_combinados'
    version: text('version').notNull(), // '1.0'
    ipAddress: text('ip_address'),
    acceptedAt: timestamp('accepted_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

/**
 * Data Deletion Requests Table (Right to be Forgotten)
 * Tracks user requests for data deletion/anonymization.
 */
export const deletionRequests = pgTable('deletion_requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id'), // Optional, if user is logged in
    email: text('email').notNull(),
    reason: text('reason'),
    status: text('status').default('pending_review').notNull(), // 'pending_review', 'processed', 'rejected'
    ipAddress: text('ip_address'),
    requestedAt: timestamp('requested_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 3. RELATIONSHIPS

export const profilesRelations = relations(profiles, ({ many, one }) => ({
    stores: many(stores),
    orders: many(orders, { relationName: 'buyer_orders' }),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
    owner: one(profiles, {
        fields: [stores.vendedoraId],
        references: [profiles.id],
    }),
    products: many(products),
    orders: many(orders),
}));

export const productsRelations = relations(products, ({ one }) => ({
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    buyer: one(profiles, {
        fields: [orders.buyerId],
        references: [profiles.id],
        relationName: 'buyer_orders'
    }),
    store: one(stores, {
        fields: [orders.storeId],
        references: [stores.id],
    }),
    splits: many(paymentSplits),
}));

export const paymentSplitsRelations = relations(paymentSplits, ({ one }) => ({
    order: one(orders, {
        fields: [paymentSplits.orderId],
        references: [orders.id],
    }),
    recipient: one(profiles, {
        fields: [paymentSplits.recipientId],
        references: [profiles.id],
    }),
}));
