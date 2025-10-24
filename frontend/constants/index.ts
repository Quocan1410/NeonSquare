// Application constants

export const APP_CONFIG = {
    name: 'NeonSquare',
    description: 'Modern Next.js application with TypeScript',
    version: '1.0.0',
    author: 'Your Name',
} as const;

export const API_ENDPOINTS = {
    base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
    },
    users: {
        list: '/users',
        profile: '/users/profile',
        update: '/users/update',
    },
} as const;

export const ROUTES = {
    home: '/',
    about: '/about',
    contact: '/contact',
    login: '/auth/login',
    register: '/auth/register',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
} as const;

export const VALIDATION_RULES = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+84|84|0)[1-9][0-9]{8,9}$/,
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
    },
} as const;

export const UI_CONSTANTS = {
    sidebarWidth: 256,
    headerHeight: 64,
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    },
} as const;
