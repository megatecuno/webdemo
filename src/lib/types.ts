

import type { LucideIcon } from "lucide-react";

export type UserRole = 'guest' | 'user' | 'admin' | 'superadmin';

export interface UserPermissions {
  canManagePublications: boolean;
  canManageBanners: boolean;
  canManageCategories: boolean;
  canManageChats: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  password?: string;
  permissions: UserPermissions;
}

export type ProductCondition = "new" | "used" | "refurbished";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  operator?: string;
  condition?: ProductCondition;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
    sender: 'user' | 'admin';
    type: 'text' | 'image' | 'file';
    content: string;
    timestamp: string;
    fileName?: string;
}

export interface Chat {
    id: string;
    userName: string;
    userAvatar: string;
    messages: ChatMessage[];
    unreadCount: number;
}
