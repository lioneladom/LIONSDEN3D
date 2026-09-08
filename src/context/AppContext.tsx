import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Currency,
  InventoryItem,
  Material,
  ModelConfiguration,
  Order,
  OrderStatus,
  PricingConfig,
  PrinterFleetItem,
  Product,
  STLModel,
  User,
} from '../types';
import {
  DEFAULT_INVENTORY,
  DEFAULT_MATERIALS,
  DEFAULT_ORDERS,
  DEFAULT_PRICING_CONFIG,
  DEFAULT_PRINTER_FLEET,
  DEFAULT_PRODUCTS,
} from '../data/mockData';
import { useUser, useClerk, useOrganization } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import { PricingEngineService } from '../services/pricing/pricingEngine';

export type PageTransitionType = 'push-down' | 'pull-out';

interface AppContextType {
  // Navigation
  activePage: string;
  pageTransition: PageTransitionType;
  setActivePage: (page: string, transition?: PageTransitionType) => void;
  setPageTransition: (transition: PageTransitionType) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Currency & Formats
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountGHS: number) => string;

  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: 'CUSTOMER' | 'ADMIN') => void;
  login: (email: string, role?: 'CUSTOMER' | 'ADMIN') => boolean;
  logout: () => void;

  // Database States
  materials: Material[];
  updateMaterial: (material: Material) => void;
  addMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;

  pricingConfig: PricingConfig;
  updatePricingConfig: (config: PricingConfig) => void;

  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  inventory: InventoryItem[];
  restockFilament: (inventoryId: string, gramsToAdd: number) => void;
  updateInventoryItem: (item: InventoryItem) => void;

  printers: PrinterFleetItem[];
  updatePrinter: (printer: PrinterFleetItem) => void;

  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, customMessage?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // User Model Vault
  userModels: STLModel[];
  saveUserModel: (model: STLModel) => void;
  deleteUserModel: (modelId: string) => void;

  // Active Configurator State
  activeModel: STLModel | null;
  setActiveModel: (model: STLModel | null) => void;
  activeModelList: STLModel[];
  setActiveModelList: React.Dispatch<React.SetStateAction<STLModel[]>>;
  activeModelIndex: number;
  setActiveModelIndex: (index: number) => void;
  activeConfig: ModelConfiguration;
  setActiveConfig: React.Dispatch<React.SetStateAction<ModelConfiguration>>;
  resetConfigurator: () => void;
  loadModelIntoConfigurator: (model: STLModel, customConfig?: Partial<ModelConfiguration>) => void;
  loadModelsIntoConfigurator: (models: STLModel[], customConfig?: Partial<ModelConfiguration>) => void;
  addModelToConfigurator: (model: STLModel, customConfig?: Partial<ModelConfiguration>) => void;
  removeModelFromConfigurator: (index: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const DEFAULT_CONFIG: ModelConfiguration = {
  modelId: '',
  materialId: 'pla',
  colorId: 'c-pla-red',
  infillPercentage: 20,
  layerHeightMm: 0.20,
  supportType: 'AUTO',
  qualityTier: 'STANDARD',
  scalePercentage: 100,
  scaleX: 100,
  scaleY: 100,
  scaleZ: 100,
  lockAspectRatio: true,
  quantity: 1,
  rushProduction: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePageInternal] = useState<string>('home');
  const [pageTransition, setPageTransition] = useState<PageTransitionType>('push-down');

  const setActivePage = (page: string, transition: PageTransitionType = 'push-down') => {
    setPageTransition(transition);
    setActivePageInternal(page);
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const [adminTab, setAdminTab] = useState<string>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-10082');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    return (
      window.location.hash.includes('sso-callback') ||
      window.location.hash.includes('sign-in') ||
      window.location.hash.includes('sign-up')
    );
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Currency
  const [currency, setCurrency] = useState<Currency>('GHS');

  // Auth - strictly null by default for fresh production visitors (no demo user)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ld3d_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.id === 'usr-customer-1' ||
          parsed.id === 'usr-admin-1' ||
          parsed.id === 'usr-001' ||
          parsed.id === 'usr-002'
        ) {
          localStorage.removeItem('ld3d_user');
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Clerk Auth Integration
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { organization } = useOrganization();

  // Clear demo session if signed out (strictly after Clerk finished loading)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const saved = localStorage.getItem('ld3d_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.id === 'usr-customer-1' || parsed.id === 'usr-admin-1') {
            localStorage.removeItem('ld3d_user');
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      }
    }
  }, [isLoaded, isSignedIn]);

  // Sync Clerk authenticated user with App state and Supabase profiles
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const username = clerkUser.username || undefined;
      const role =
        (clerkUser.publicMetadata?.role as 'CUSTOMER' | 'ADMIN') ||
        (email.toLowerCase().includes('admin') || username?.toLowerCase().includes('admin')
          ? 'ADMIN'
          : 'CUSTOMER');

      const mappedUser: User = {
        id: clerkUser.id,
        username: username,
        name: clerkUser.fullName || username || email.split('@')[0] || 'Lion Customer',
        email: email,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
        role: role,
        avatarUrl: clerkUser.imageUrl,
        createdAt: new Date(clerkUser.createdAt || Date.now()).toISOString(),
      };

      setCurrentUser(mappedUser);
      localStorage.setItem('ld3d_user', JSON.stringify(mappedUser));

      // Asynchronously upsert to Supabase profiles table
      supabase
        .from('profiles')
        .upsert({
          id: clerkUser.id,
          username: username,
          email: email || null,
          name: mappedUser.name,
          phone: mappedUser.phone,
          role: role,
          avatar_url: clerkUser.imageUrl,
          org_id: organization?.id || null,
          org_role: organization ? 'org:member' : null,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase profile sync note:', error.message);
          }
        });
    }
  }, [isSignedIn, clerkUser, organization]);

  // Materials
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('ld3d_materials');
    return saved ? JSON.parse(saved) : DEFAULT_MATERIALS;
  });

  // Pricing Config
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    const saved = localStorage.getItem('ld3d_pricing_config');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING_CONFIG;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ld3d_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ld3d_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  });

  // Printers
  const [printers, setPrinters] = useState<PrinterFleetItem[]>(() => {
    return DEFAULT_PRINTER_FLEET;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ld3d_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // User Models Vault
  const [userModels, setUserModels] = useState<STLModel[]>(() => {
    const saved = localStorage.getItem('ld3d_user_models');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ld3d_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Configurator Active State
  const [activeModelList, setActiveModelList] = useState<STLModel[]>([]);
  const [activeModelIndex, setActiveModelIndex] = useState<number>(0);
  const [activeConfig, setActiveConfig] = useState<ModelConfiguration>(DEFAULT_CONFIG);

  const activeModel = activeModelList[activeModelIndex] || (activeModelList.length > 0 ? activeModelList[0] : null);

  const setActiveModel = (model: STLModel | null) => {
    if (!model) {
      setActiveModelList([]);
      setActiveModelIndex(0);
    } else {
      setActiveModelList([model]);
      setActiveModelIndex(0);
    }
  };

  // Save changes to LocalStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem('ld3d_user', JSON.stringify(currentUser));
    else localStorage.removeItem('ld3d_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ld3d_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('ld3d_pricing_config', JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    localStorage.setItem('ld3d_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ld3d_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('ld3d_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Orders storage error:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ld3d_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart storage error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      const serializable = userModels.map(({ fileBuffer, ...rest }) => rest);
      localStorage.setItem('ld3d_user_models', JSON.stringify(serializable));
    } catch (e) {
      console.warn('User models storage note:', e);
    }
  }, [userModels]);

  // Auth Helpers
  const switchUserRole = (role: 'CUSTOMER' | 'ADMIN') => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('ld3d_user', JSON.stringify(updated));
    }
  };

  const login = (email: string, role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER') => {
    const user: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email: email,
      phone: '',
      role: role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    localStorage.setItem('ld3d_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    if (isSignedIn) {
      try {
        signOut();
      } catch (err) {
        console.warn('Sign out note:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('ld3d_user');
    if (activePage === 'admin' || activePage === 'dashboard') {
      setActivePage('home');
    }
  };

  // Pricing Helpers
  const formatPrice = (amountGHS: number) => {
    return PricingEngineService.formatPrice(amountGHS, currency);
  };

  // Materials Management
  const updateMaterial = (updated: Material) => {
    setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const addMaterial = (newMat: Material) => {
    setMaterials((prev) => [...prev, newMat]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const updatePricingConfig = (newCfg: PricingConfig) => {
    setPricingConfig(newCfg);
  };

  // Products Management
  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // Inventory Management
  const restockFilament = (invId: string, gramsToAdd: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === invId) {
          const newQty = item.quantityGrams + gramsToAdd;
          return {
            ...item,
            quantityGrams: newQty,
            status: newQty < item.lowStockThresholdGrams ? (newQty < 250 ? 'CRITICAL' : 'LOW_STOCK') : 'HEALTHY',
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => prev.map((inv) => (inv.id === item.id ? item : inv)));
  };

  // Printer Management
  const updatePrinter = (printer: PrinterFleetItem) => {
    setPrinters((prev) => prev.map((p) => (p.id === printer.id ? printer : p)));
  };

  // Orders Management
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `LD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser?.id || 'usr-customer-1',
      customerName: orderData.customerName || currentUser?.name || 'Customer',
      customerEmail: orderData.customerEmail || currentUser?.email || 'customer@example.com',
      customerPhone: orderData.customerPhone || currentUser?.phone || '+233 24 000 0000',
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || cartSubtotal,
      printingFee: orderData.printingFee || 0,
      setupFee: orderData.setupFee || 5,
      deliveryFee: orderData.deliveryFee || 25,
      discount: orderData.discount || 0,
      total: orderData.total || (orderData.subtotal || cartSubtotal) + (orderData.deliveryFee || 25),
      currency: currency,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: orderData.paymentMethod || 'MOMO_MTN',
      deliveryMethod: orderData.deliveryMethod || 'DELIVERY_ACCRA',
      deliveryAddress: orderData.deliveryAddress || {
        street: 'Independence Avenue',
        city: 'Accra',
        region: 'Greater Accra',
      },
      timeline: [
        {
          status: 'PENDING',
          label: 'Order Placed',
          description: 'Order received and digital payment confirmed.',
          timestamp: formattedNow,
          completed: true,
          current: false,
        },
        {
          status: 'CONFIRMED',
          label: 'Engineering Verified',
          description: 'STL geometry checked and production ticket created.',
          timestamp: formattedNow,
          completed: true,
          current: true,
        },
        {
          status: 'PREPARING',
          label: 'Printer Scheduled',
          description: 'Queued on Bambu Lab X1-Carbon #01.',
          timestamp: 'Scheduled shortly',
          completed: false,
          current: false,
        },
        {
          status: 'PRINTING',
          label: '3D Printing Production',
          description: 'High-precision layer deposition in progress.',
          timestamp: 'Pending queue',
          completed: false,
          current: false,
        },
        {
          status: 'QUALITY_CHECK',
          label: 'Quality Control',
          description: 'Micrometer inspection & tolerance check.',
          timestamp: 'Pending print',
          completed: false,
          current: false,
        },
        {
          status: 'READY',
          label: 'Ready for Dispatch / Pickup',
          description: 'Packaged in Lion’s Den protective casing.',
          timestamp: 'Pending QC',
          completed: false,
          current: false,
        },
        {
          status: 'SHIPPED',
          label: 'Delivered',
          description: 'Dispatched to customer location.',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, customMessage?: string) => {
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const stages: OrderStatus[] = [
            'PENDING',
            'CONFIRMED',
            'PREPARING',
            'PRINTING',
            'QUALITY_CHECK',
            'READY',
            'SHIPPED',
            'COMPLETED',
          ];
          const currentIdx = stages.indexOf(status);

          const newTimeline = ord.timeline.map((evt) => {
            const evtIdx = stages.indexOf(evt.status);
            const isCompleted = evtIdx < currentIdx || evt.status === status;
            const isCurrent = evt.status === status;
            return {
              ...evt,
              completed: isCompleted,
              current: isCurrent,
              timestamp: isCurrent ? formattedNow : evt.timestamp,
              description: isCurrent && customMessage ? customMessage : evt.description,
            };
          });

          return {
            ...ord,
            status,
            timeline: newTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  // User Model Vault
  const saveUserModel = (model: STLModel) => {
    setUserModels((prev) => {
      const filtered = prev.filter((m) => m.id !== model.id);
      return [model, ...filtered];
    });
  };

  const deleteUserModel = (modelId: string) => {
    setUserModels((prev) => prev.filter((m) => m.id !== modelId));
  };

  // Configurator actions
  const resetConfigurator = () => {
    setActiveModelList([]);
    setActiveModelIndex(0);
    setActiveConfig(DEFAULT_CONFIG);
  };

  const loadModelIntoConfigurator = (model: STLModel, customConfig?: Partial<ModelConfiguration>) => {
    saveUserModel(model);
    setActiveModelList([model]);
    setActiveModelIndex(0);
    const initialConfig: ModelConfiguration = {
      modelId: model.id,
      materialId: customConfig?.materialId || 'pla',
      colorId: customConfig?.colorId || 'c-pla-red',
      infillPercentage: customConfig?.infillPercentage || 20,
      layerHeightMm: customConfig?.layerHeightMm || 0.20,
      supportType: customConfig?.supportType || 'AUTO',
      qualityTier: customConfig?.qualityTier || 'STANDARD',
      scalePercentage: customConfig?.scalePercentage || 100,
      scaleX: model.geometry.dimensions.x,
      scaleY: model.geometry.dimensions.y,
      scaleZ: model.geometry.dimensions.z,
      lockAspectRatio: true,
      quantity: customConfig?.quantity || 1,
      rushProduction: customConfig?.rushProduction || false,
    };
    setActiveConfig(initialConfig);
    setActivePage('configurator');
  };

  const loadModelsIntoConfigurator = (models: STLModel[], customConfig?: Partial<ModelConfiguration>) => {
    if (!models || models.length === 0) return;
    models.forEach((m) => saveUserModel(m));
    setActiveModelList(models);
    setActiveModelIndex(0);
    const firstModel = models[0];
    const initialConfig: ModelConfiguration = {
      modelId: firstModel.id,
      materialId: customConfig?.materialId || 'pla',
      colorId: customConfig?.colorId || 'c-pla-red',
      infillPercentage: customConfig?.infillPercentage || 20,
      layerHeightMm: customConfig?.layerHeightMm || 0.20,
      supportType: customConfig?.supportType || 'AUTO',
      qualityTier: customConfig?.qualityTier || 'STANDARD',
      scalePercentage: customConfig?.scalePercentage || 100,
      scaleX: firstModel.geometry.dimensions.x,
      scaleY: firstModel.geometry.dimensions.y,
      scaleZ: firstModel.geometry.dimensions.z,
      lockAspectRatio: true,
      quantity: customConfig?.quantity || 1,
      rushProduction: customConfig?.rushProduction || false,
    };
    setActiveConfig(initialConfig);
    setActivePage('configurator');
  };

  const addModelToConfigurator = (model: STLModel, customConfig?: Partial<ModelConfiguration>) => {
    saveUserModel(model);
    setActiveModelList((prev) => {
      const nextList = [...prev, model];
      setActiveModelIndex(nextList.length - 1);
      return nextList;
    });
  };

  const removeModelFromConfigurator = (indexToRemove: number) => {
    setActiveModelList((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      if (filtered.length === 0) {
        setActiveModelIndex(0);
        setActiveConfig(DEFAULT_CONFIG);
      } else {
        setActiveModelIndex((currentIdx) => {
          if (currentIdx >= filtered.length) {
            return filtered.length - 1;
          }
          return currentIdx;
        });
      }
      return filtered;
    });
  };

  // Cart actions
  const addToCart = (item: CartItem) => {
    setCart((prev) => [item, ...prev]);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const newTotal = i.unitPrice * quantity;
          return {
            ...i,
            quantity,
            totalPrice: newTotal,
            priceBreakdown: i.priceBreakdown
              ? {
                  ...i.priceBreakdown,
                  total: newTotal,
                }
              : undefined,
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <AppContext.Provider
      value={{
        activePage,
        pageTransition,
        setActivePage,
        setPageTransition,
        adminTab,
        setAdminTab,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        currency,
        setCurrency,
        formatPrice,
        currentUser,
        setCurrentUser,
        switchUserRole,
        login,
        logout,
        materials,
        updateMaterial,
        addMaterial,
        deleteMaterial,
        pricingConfig,
        updatePricingConfig,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        inventory,
        restockFilament,
        updateInventoryItem,
        printers,
        updatePrinter,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        userModels,
        saveUserModel,
        deleteUserModel,
        activeModel,
        setActiveModel,
        activeModelList,
        setActiveModelList,
        activeModelIndex,
        setActiveModelIndex,
        activeConfig,
        setActiveConfig,
        resetConfigurator,
        loadModelIntoConfigurator,
        loadModelsIntoConfigurator,
        addModelToConfigurator,
        removeModelFromConfigurator,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
