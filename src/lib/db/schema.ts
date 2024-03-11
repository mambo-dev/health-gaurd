import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	time,
	varchar
} from 'drizzle-orm/pg-core';

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
	'active',
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
	activityLevel: activityEnum('profile_activity_level').notNull(),
	bmi: varchar('profile_bmi'),
	userId: integer('profile_user_id')
		.references(() => users.id)
		.notNull()
		.unique()
});

export type Profile = typeof profile.$inferSelect;

export const goals = pgTable('user_goal', {
	id: serial('goal_id').primaryKey(),
	title: varchar('goal_title').notNull(),
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
		.unique()
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
	wakeUp: time('schedule_wake_up').notNull().defaultNow(),
	bedTime: time('schedule_bed_time').notNull().defaultNow(),
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
		.unique()
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	users: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	})
}));

export const chat = pgTable('chat', {
	id: serial('chat_id').primaryKey(),
	displayId: varchar('chat_display_id').unique().notNull(),
	userId: integer('chat_user_id')
		.references(() => users.id)
		.notNull()
});

export type ChatT = typeof chat.$inferSelect;

export const chatRelations = relations(chat, ({ many }) => ({
	messages: many(messages)
}));

export const messages = pgTable('message', {
	id: serial('message_id').primaryKey(),
	prompt: text('message_prompt').notNull(),
	response: text('message_response').notNull(),
	chatId: integer('message_chat_id').notNull()
});

export type MessageT = typeof messages.$inferSelect;

export const messagesRelations = relations(messages, ({ one }) => ({
	chat: one(chat, {
		fields: [messages.chatId],
		references: [chat.id]
	})
}));

export const promptManagement = pgTable('prompt_mgmt', {
	id: serial('prompt_management_id').primaryKey(),
	dayOfprompt: date('prompt_management_day').notNull().defaultNow(),
	numberOfPrompts: integer('prompt_management_no').notNull()
});

export type PromptT = typeof promptManagement.$inferSelect;
