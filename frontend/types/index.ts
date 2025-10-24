// Common types used across the application

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'moderator';
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Component prop types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
}

// Navigation types
export interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
    children?: NavItem[];
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}
