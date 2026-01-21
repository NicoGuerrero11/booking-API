import { pgTable, serial, text, integer, boolean, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    is_admin: boolean('is_admin').notNull().default(false),
});

export const typeRoom = pgEnum('type_room', ['Normal', 'VIP', 'Presidential']);

export const rooms = pgTable('rooms', {
    id: serial('id').primaryKey(),
    name: text('name').unique().notNull(),
    type: typeRoom('type').notNull().default('Normal'),
    price_per_night: numeric('price_per_night', { precision: 10, scale: 2 }).notNull(),
    is_available: boolean('is_available').notNull().default(true),
});


export const bookingStatus = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'CANCELLED']);

export const bookings = pgTable('bookings', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    room_id: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
    start_date: timestamp('start_date', { withTimezone: false }).notNull(),
    end_date: timestamp('end_date', { withTimezone: false }).notNull(),
    status: bookingStatus('status').notNull().default('PENDING'),
    created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
});