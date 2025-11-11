export type UserRole = 'company_admin' | 'manager' | 'employee';

export type User = {
    id: string;
    name: string;
    email: string;
    firstname: string;
    lastname: string;
    is_active: boolean;
    role: UserRole;
};

export interface CreateUserInput {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber?: string;
    password: string;
    password_confirm: string;
    role?: string;
    is_active?: boolean;
    teamId?: string;
}

export interface UpdateUserInput {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    is_active?: boolean;
    teamId?: string;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
}

export interface NotificationSettings {
    emailNotifications: boolean;
    clockReminders: boolean;
    teamUpdates: boolean;
    weeklyReports: boolean;
    systemAlerts: boolean;
}