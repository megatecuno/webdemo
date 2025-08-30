import type { Product, Category, User } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Electrónica' },
  { id: '2', name: 'Ropa' },
  { id: '3', name: 'Hogar' },
  { id: '4', name: 'Librería' },
  { id: '5', name: 'Deportes' },
  { id: '6', name: 'Arte' },
  { id: '7', name: 'Antigüedades' },
  { id: '8', name: 'Vehículos' },
  { id: '9', name: 'Donaciones' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Smartphone X-Pro',
    description: 'El último modelo con cámara de 108MP y pantalla AMOLED.',
    price: 999.99,
    discountPrice: 899.99,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: 'Electrónica',
    operator: 'Ana García',
  },
  {
    id: '2',
    name: 'Laptop UltraSlim',
    description: 'Potencia y portabilidad en un diseño elegante.',
    price: 1299.0,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: 'Electrónica',
    operator: 'Carlos Ruiz',
  },
  {
    id: '3',
    name: 'Auriculares SoundWave',
    description: 'Cancelación de ruido activa y hasta 40 horas de batería.',
    price: 199.5,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: 'Electrónica',
    operator: 'Ana García',
  },
  {
    id: '4',
    name: 'Camiseta de Algodón Orgánico',
    description: 'Suave, cómoda y amigable con el medio ambiente.',
    price: 29.99,
    images: ['https://placehold.co/600x600.png'],
    category: 'Ropa',
    operator: 'Laura Méndez',
  },
  { id: '5', name: 'Silla Ergonómica de Oficina', description: 'Cuida tu espalda durante las largas jornadas de trabajo.', price: 350.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Hogar', operator: 'Carlos Ruiz' },
  { id: '6', name: 'Colección Completa de "Crónicas de un Mago"', description: 'Sumérgete en un mundo de fantasía épica.', price: 85.0, discountPrice: 75.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Librería', operator: 'Sistema' },
  { id: '7', name: 'Bicicleta de Montaña "Raptor"', description: 'Conquista cualquier terreno con su doble suspensión.', price: 750.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Deportes', operator: 'Ana García' },
  { id: '8', name: 'Pintura Abstracta "Cosmos"', description: 'Una obra de arte única para tu sala de estar.', price: 500.0, images: ['https://placehold.co/600x600.png'], category: 'Arte', operator: 'Sistema' },
  { id: '9', name: 'Gramófono de 1920', description: 'Una pieza de historia que aún funciona perfectamente.', price: 1200.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Antigüedades', operator: 'Carlos Ruiz' },
  { id: '10', name: 'Coche Clásico "El Dorado"', description: 'Un modelo icónico de los años 50, restaurado.', price: 50000.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Vehículos', operator: 'Sistema' },
  { id: '11', name: 'Teclado Mecánico RGB', description: 'Switches personalizables para una experiencia de escritura superior.', price: 150.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Electrónica', operator: 'Ana García' },
  { id: '12', name: 'Smartwatch FitLife 2', description: 'Monitorea tu salud y actividad física con estilo.', price: 250.0, discountPrice: 220.0, images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], category: 'Electrónica', operator: 'Carlos Ruiz' }
];

export const users: User[] = [
    {
      id: 'superadmin-01',
      name: 'Root',
      email: 'root@megatec.com',
      password: 'admin',
      role: 'superadmin',
      avatar: 'https://avatar.vercel.sh/root.png',
      permissions: {
        canManagePublications: true,
        canManageBanners: true,
        canManageCategories: true,
        canManageChats: true,
      }
    },
    {
      id: 'admin-01',
      name: 'Ana García',
      email: 'ana.garcia@megatec.com',
      password: 'admin',
      role: 'admin',
      avatar: 'https://avatar.vercel.sh/ana.png',
      permissions: {
        canManagePublications: true,
        canManageBanners: false,
        canManageCategories: true,
        canManageChats: true,
      }
    },
    {
      id: 'admin-02',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@megatec.com',
      password: 'admin',
      role: 'admin',
      avatar: 'https://avatar.vercel.sh/carlos.png',
       permissions: {
        canManagePublications: true,
        canManageBanners: true,
        canManageCategories: false,
        canManageChats: false,
      }
    },
     {
      id: 'admin-03',
      name: 'Laura Méndez',
      email: 'laura.mendez@megatec.com',
      password: 'admin',
      role: 'admin',
      avatar: 'https://avatar.vercel.sh/laura.png',
       permissions: {
        canManagePublications: true,
        canManageBanners: false,
        canManageCategories: false,
        canManageChats: true,
      }
    },
    {
      id: 'user-01',
      name: 'Juan Perez',
      email: 'juan.perez@email.com',
      password: 'user',
      role: 'user',
      avatar: 'https://avatar.vercel.sh/juan.png',
    }
];
