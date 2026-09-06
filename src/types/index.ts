export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  username?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type ValidationStatus = 'VALID' | 'WARNING' | 'ERROR' | 'ANALYZING';

export interface ValidationIssue {
  type: 'ERROR' | 'WARNING' | 'INFO';
  code: string;
  message: string;
}

export interface STLGeometryData {
  dimensions: {
    x: number; // width in mm
    y: number; // depth in mm
    z: number; // height in mm
  };
  originalDimensions: {
    x: number;
    y: number;
    z: number;
  };
  volumeMm3: number; // mm³
  volumeCm3: number; // cm³
  surfaceAreaMm2: number; // mm²
  triangleCount: number;
  isManifold: boolean;
  center: [number, number, number];
  validationStatus: ValidationStatus;
  validationIssues: ValidationIssue[];
}

export interface STLModel {
  id: string;
  userId?: string;
  filename: string;
  fileSize: number; // bytes
  fileBuffer?: ArrayBuffer;
  geometry: STLGeometryData;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface MaterialColor {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface Material {
  id: string;
  name: string;
  code: string;
  description: string;
  density: number; // g/cm³ (e.g. PLA: 1.24, PETG: 1.27, ABS: 1.04, TPU: 1.21)
  pricePerGram: number; // in primary currency (GHS)
  colors: MaterialColor[];
  strengthRating: number; // 1-10
  flexibilityRating: number; // 1-10
  heatResistanceRating: number; // 1-10
  detailRating: number; // 1-10
  finish: 'Glossy' | 'Matte' | 'Semi-Gloss' | 'Rubberized' | 'Satin';
  recommendedFor: string[];
  active: boolean;
}

export type SupportType = 'NONE' | 'AUTO' | 'TREE' | 'FULL';
export type QualityTier = 'DRAFT' | 'STANDARD' | 'HIGH_DETAIL' | 'ULTRA';

export interface ModelConfiguration {
  modelId: string;
  materialId: string;
  colorId: string;
  infillPercentage: number; // e.g. 20 (meaning 20%)
  layerHeightMm: number; // e.g. 0.20
  supportType: SupportType;
  qualityTier: QualityTier;
  scalePercentage: number; // 100 = 100%
  scaleX: number; // mm
  scaleY: number; // mm
  scaleZ: number; // mm
  lockAspectRatio: boolean;
  quantity: number;
  rushProduction: boolean;
}

export interface PriceBreakdown {
  materialCost: number;
  machineCost: number;
  setupFee: number;
  supportFee: number;
  rushFee: number;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  total: number;
  minimumOrderApplied: boolean;
  estimatedWeightGrams: number;
  estimatedPrintTimeMinutes: number;
  currency: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  sampleModelKey?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  dimensions: string;
  material: string;
  estimatedPrintTime: string;
  featured?: boolean;
}

export interface AssemblyPart {
  id: string;
  model: STLModel;
  configuration: ModelConfiguration;
  priceBreakdown?: PriceBreakdown;
}

export interface CartItem {
  id: string;
  type: 'CUSTOM_STL' | 'PRODUCT';
  title: string;
  subtitle: string;
  model?: STLModel;
  configuration?: ModelConfiguration;
  parts?: AssemblyPart[];
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  priceBreakdown?: PriceBreakdown;
  previewUrl?: string;
  addedAt: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'PRINTING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'MOMO_MTN' | 'MOMO_TELECEL' | 'CARD' | 'CRYPTO' | 'CASH_PICKUP';
export type DeliveryMethod = 'DELIVERY_ACCRA' | 'DELIVERY_KUMASI' | 'DELIVERY_REGIONAL' | 'STUDIO_PICKUP';

export interface TimelineEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  printingFee: number;
  setupFee: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    notes?: string;
  };
  timeline: TimelineEvent[];
  assignedPrinterId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion: string;
}

export interface PricingConfig {
  setupFeeGHS: number;
  machineHourlyRateGHS: number;
  supportFeePerGramGHS: number;
  minimumOrderGHS: number;
  rushMultiplier: number;
  deliveryAccraGHS: number;
  deliveryKumasiGHS: number;
  deliveryRegionalGHS: number;
  deliveryStudioPickupGHS: number;
  printerMaxX: number; // mm
  printerMaxY: number; // mm
  printerMaxZ: number; // mm
  globalMarkupPercent: number; // 0%
}

export interface InventoryItem {
  id: string;
  materialId: string;
  materialName: string;
  colorName: string;
  colorHex: string;
  quantityGrams: number;
  lowStockThresholdGrams: number;
  spoolCostGHS: number;
  status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL';
  updatedAt: string;
}

export type PrinterStatus = 'IDLE' | 'PRINTING' | 'MAINTENANCE' | 'OFFLINE';

export interface PrinterFleetItem {
  id: string;
  name: string;
  model: string;
  status: PrinterStatus;
  currentJobName?: string;
  currentOrderId?: string;
  progressPercent: number;
  nozzleTemp: number;
  targetNozzleTemp: number;
  bedTemp: number;
  targetBedTemp: number;
  timeRemainingMins: number;
  materialLoaded: string;
}

export type Currency = 'GHS' | 'USD' | 'EUR';
