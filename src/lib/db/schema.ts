import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('user_id').primaryKey(),
	email: varchar('user_email').notNull().unique(),
	password: varchar('user_password').notNull()
});

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ one, many }) => ({
	profile: one(profile, {
		fields: [users.id],
		references: [profile.userId]
	}),
	dailySchedule: one(dailySchedule, {
		fields: [users.id],
		references: [dailySchedule.userId]
	}),
	goals: many(goals),
	mealPreferences: many(mealPreferences),
	medicalHistory: many(medicalHistory)
}));

//Sedentary, lightly active, moderately active, very active
export const activityEnum = pgEnum('profile_activity_level', [
	'sedentary',
	'lightly_active',
	'moderately_active',
	'very_active'
]);

export const sexEnum = pgEnum('sex', ['male', 'female']);

export const profile = pgTable('profile', {
	id: serial('profile_id').primaryKey(),
	firstName: varchar('profile_first_name').notNull(),
	secondName: varchar('profile_second_name').notNull(),
	age: integer('profile_age').notNull().default(0),
	height: integer('profile_height').notNull().default(0),
	weight: integer('profile_weight').notNull().default(0),
	sex: sexEnum('sex'),
	activityLevel: activityEnum('profile_activity_level'),
	bmi: varchar('profile_bmi'),
	userId: integer('profile_user_id')
		.references(() => users.id)
		.notNull()
		.unique()
});

export const goals = pgTable('user_goal', {
	id: serial('goal_id').primaryKey(),
	title: varchar('goal_title'),
	userId: integer('goal_user_id')
		.references(() => users.id)
		.notNull()
});

export const goalRelations = relations(goals, ({ one }) => ({
	users: one(users, {
		fields: [goals.userId],
		references: [users.id]
	})
}));

export const portionEnum = pgEnum('portionEnum', ['moderate', 'small', 'large']);

export const mealPreferences = pgTable('preference', {
	id: serial('preference_id').primaryKey(),
	numberOfMeals: integer('preference_total_meals'),
	portionSizes: portionEnum('portionEnum'),
	userId: integer('preference_user_id')
		.references(() => users.id)
		.notNull()
});

export const mealPreferencesRelations = relations(mealPreferences, ({ one }) => ({
	users: one(users, {
		fields: [mealPreferences.userId],
		references: [users.id]
	})
}));

export const medicalHistory = pgTable('history', {
	id: serial('history_id').primaryKey(),
	name: varchar('history_name').notNull(),
	userId: integer('history_user_id')
		.references(() => users.id)
		.notNull()
});

export const medicalHistoryRelations = relations(medicalHistory, ({ one }) => ({
	users: one(users, {
		fields: [medicalHistory.userId],
		references: [users.id]
	})
}));

export const dailySchedule = pgTable('schedule', {
	id: serial('schedule_id').primaryKey(),
	wakeUp: timestamp('schedule_wake_up').notNull().defaultNow(),
	bedTime: timestamp('schedule_bed_time').notNull().defaultNow(),
	userId: integer('schedule_user_id')
		.references(() => users.id)
		.notNull()
		.unique()
});

export const notifications = pgTable('notification', {
	id: serial('notification_id').primaryKey(),
	receiveReminders: boolean('notification_receive_reminders').notNull().default(false),
	userId: integer('history_user_id')
		.references(() => users.id)
		.notNull()
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	users: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	})
}));
