

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { User, UserRole, Product, CartItem, Category, UserPermissions } from '@/lib/types';
import { categories as initialCategories, products as initialProducts, users as initialUsers } from '@/lib/data';

// Dynamically import Tone.js only on the client side
type ToneModule = typeof import('tone');
type MusicTrack = 'elfa' | 'tambores' | 'orquestal';

const defaultBanners = [
    "https://placehold.co/1200x400.png",
    "https://placehold.co/1200x400.png",
    "https://placehold.co/1200x400.png"
];

interface AppContextType {
  user: User;
  users: User[];
  login: (credential: string, password?: string) => void;
  logout: () => void;
  updateUser: (userId: string, data: Partial<Omit<User, 'id'>>) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  deleteUser: (userId: string) => void;
  uiSoundsEnabled: boolean;
  toggleUiSounds: () => void;
  playUiSound: (sound: 'click' | 'hover') => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  currentTrack: MusicTrack;
  setCurrentTrack: (track: MusicTrack) => void;
  musicPlaying: boolean;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  categories: Category[];
  addCategory: (name: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'operator'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  isClient: boolean;
  topBanners: (string | null)[];
  footerBanners: (string | null)[];
  updateTopBanner: (index: number, image: string | null) => void;
  updateFooterBanner: (index: number, image: string | null) => void;
  permissions: UserPermissions;
}

const guestUser: User = { 
  id: 'guest', 
  name: 'Guest', 
  email: '', 
  role: 'guest',
  permissions: {
    canManagePublications: false,
    canManageBanners: false,
    canManageCategories: false,
    canManageChats: false,
  }
};


const AppContext = createContext<AppContextType | undefined>(undefined);

const musicTracks = {
  elfa: '/sounds/elf-loop.mp3',
  tambores: '/sounds/drums-loop.mp3',
  orquestal: '/sounds/orchestral-loop.mp3',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User>(guestUser);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [topBanners, setTopBanners] = useState<(string | null)[]>([]);
  const [footerBanners, setFooterBanners] = useState<(string | null)[]>([]);

  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>('elfa');
  
  const ToneRef = useRef<ToneModule | null>(null);
  const audioInitialized = useRef(false);
  const playersRef = useRef<any>(null);
  const clickSynthRef = useRef<any>(null);
  const hoverSynthRef = useRef<any>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import('tone').then(module => (ToneRef.current = module));

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if(parsedUser.id !== 'guest') setUser(parsedUser);
      }
      
      const storedUsers = localStorage.getItem('users');
      if(storedUsers) setUsers(JSON.parse(storedUsers));
      else setUsers(initialUsers);
      
      const storedCart = localStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));

      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      else setCategories(initialCategories);

      const storedProducts = localStorage.getItem('products');
      if (storedProducts) setProducts(JSON.parse(storedProducts));
      else setProducts(initialProducts);

      const storedTopBanners = localStorage.getItem('topBanners');
      if (storedTopBanners) setTopBanners(JSON.parse(storedTopBanners));
      else setTopBanners(defaultBanners);

      const storedFooterBanners = localStorage.getItem('footerBanners');
      if (storedFooterBanners) setFooterBanners(JSON.parse(storedFooterBanners));
      else setFooterBanners(defaultBanners);
      
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      // If parsing fails, reset to initial state
      localStorage.clear();
      setUser(guestUser);
      setUsers(initialUsers);
      setCart([]);
      setFavorites([]);
      setCategories(initialCategories);
      setProducts(initialProducts);
      setTopBanners(defaultBanners);
      setFooterBanners(defaultBanners);
    }
  }, []);

  useEffect(() => { if (isClient) localStorage.setItem('user', JSON.stringify(user)); }, [user, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('users', JSON.stringify(users)); }, [users, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('cart', JSON.stringify(cart)); }, [cart, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('categories', JSON.stringify(categories)); }, [categories, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('products', JSON.stringify(products)); }, [products, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('topBanners', JSON.stringify(topBanners)); }, [topBanners, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('footerBanners', JSON.stringify(footerBanners)); }, [footerBanners, isClient]);


  const initAudio = useCallback(async () => {
    const Tone = ToneRef.current;
    if (!Tone || audioInitialized.current) return;
    try {
      await Tone.start();
      console.log('Audio context started');

      playersRef.current = new Tone.Players(musicTracks).toDestination();
      clickSynthRef.current = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
      hoverSynthRef.current = new Tone.MembraneSynth({
          pitchDecay: 0.01,
          octaves: 2,
          oscillator: { type: "sine" },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1, attackCurve: "exponential" }
      }).toDestination();
      
      audioInitialized.current = true;
    } catch (e) {
      console.error("Could not start audio context", e);
    }
  }, []);


  useEffect(() => {
    const Tone = ToneRef.current;
    const players = playersRef.current;
    if (!Tone || !players || !audioInitialized.current || !musicEnabled) {
      if(players) players.stopAll();
      return;
    };

    const player = players.player(currentTrack);
    player.loop = true;

    const manageMusic = async () => {
        if (Tone.Transport.state !== 'started') {
          await Tone.Transport.start();
        }
        player.start();
        setMusicPlaying(true);
    };

    manageMusic();

    return () => {
        player.stop();
        if (playersRef.current && Object.values(playersRef.current.players).every((p: any) => p.state !== 'started')) {
            if (Tone.Transport.state === 'started') {
                Tone.Transport.stop();
            }
            setMusicPlaying(false);
        }
    };
}, [musicEnabled, currentTrack, isClient]);
  
  const login = (credential: string, password?: string) => {
    const lowerCredential = credential.toLowerCase();
    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === lowerCredential ||
        u.name.toLowerCase() === lowerCredential)
    );

    if (foundUser && (!password || foundUser.password === password)) {
      setUser(foundUser);
    } else {
      throw new Error("Credenciales inválidas.");
    }
  };

  const logout = () => {
    setUser(guestUser);
    setCart([]);
  };

  const updateUser = (userId: string, data: Partial<Omit<User, 'id'>>) => {
    setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, ...data } : u)
    );
    if (user.id === userId) {
        setUser(prevUser => ({...prevUser, ...data}));
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
        id: (users.length + 1).toString(),
        role: 'admin',
        ...userData,
        permissions: { // Default permissions for new operators
            canManagePublications: false,
            canManageBanners: false,
            canManageCategories: false,
            canManageChats: false,
        }
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
  }

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  }

  const toggleUiSounds = async () => {
    await initAudio();
    setUiSoundsEnabled(prev => !prev);
  };

  const playUiSound = useCallback((sound: 'click' | 'hover') => {
    if (uiSoundsEnabled && audioInitialized.current) {
      if (sound === 'click' && clickSynthRef.current) {
        clickSynthRef.current.triggerAttackRelease('C5', '8n');
      } else if (sound === 'hover' && hoverSynthRef.current) {
        hoverSynthRef.current.triggerAttackRelease("C2", "8n");
      }
    }
  }, [uiSoundsEnabled]);
  
  const handleSetCurrentTrack = (track: MusicTrack) => {
    if (playersRef.current) {
      playersRef.current.stopAll();
    }
    setCurrentTrack(track);
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice ?? item.price;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const handleSetMusicEnabled = async (enabled: boolean) => {
      if (enabled && !audioInitialized.current) {
          await initAudio();
      }
      setMusicEnabled(enabled);
  };
  
  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      if (isFavorite(product.id)) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name,
    };
    setCategories(prev => [...prev, newCategory]);
  };
  
  const addProduct = (productData: Omit<Product, 'id' | 'operator'>) => {
    setProducts(prev => {
        const newProduct: Product = {
            ...productData,
            id: Date.now().toString(),
            operator: user.name,
        }
        return [newProduct, ...prev];
    })
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }

  const updateTopBanner = (index: number, image: string | null) => {
    setTopBanners(prev => {
        const newBanners = [...prev];
        newBanners[index] = image;
        return newBanners;
    });
  }

  const updateFooterBanner = (index: number, image: string | null) => {
    setFooterBanners(prev => {
        const newBanners = [...prev];
        newBanners[index] = image;
        return newBanners;
    });
  }

  const value: AppContextType = {
    user: isClient ? user : guestUser,
    users,
    login,
    logout,
    updateUser,
    addUser,
    deleteUser,
    uiSoundsEnabled,
    toggleUiSounds,
    playUiSound,
    musicEnabled,
    setMusicEnabled: handleSetMusicEnabled,
    currentTrack,
    setCurrentTrack: handleSetCurrentTrack,
    musicPlaying,
    cart: isClient ? cart : [],
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    favorites: isClient ? favorites : [],
    isFavorite,
    toggleFavorite,
    categories,
    addCategory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    isClient,
    topBanners,
    footerBanners,
    updateTopBanner,
    updateFooterBanner,
    permissions: user?.permissions || guestUser.permissions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
