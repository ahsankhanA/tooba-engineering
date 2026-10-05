export interface ProductItem {
  _id: string;
  title: string;
  slug: string;
  category: 'COMPLETE_PACKAGE' | 'CCTV_CAMERA' | 'DVR_NVR' | 'STORAGE_HDD' | 'NETWORKING_CABLE' | 'BIOMETRIC_ATTENDANCE';
  brand: string;
  description: string;
  costPrice: number; // Hidden from customers
  sellingPrice: number;
  discountedPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  sku: string;
  isFeatured: boolean;
  warrantyMonths: number;
  imageUrl: string;
  specifications: {
    resolution?: string;
    channels?: number;
    storageCapacity?: string;
    cableLengthMeters?: number;
    indoorOutdoor?: 'INDOOR' | 'OUTDOOR' | 'BOTH';
  };
}

export interface CredentialItem {
  id: string;
  title: string;
  type: 'OEM_PARTNERSHIP' | 'GOVERNMENT_REGISTRATION' | 'ISO_CERTIFICATION' | 'AWARD';
  issuer: string;
  licenseNumber?: string;
  validFrom: string;
  validUntil?: string;
  badgeImageUrl: string;
  badgeColor: string;
  displayOrder: number;
  isActive: boolean;
}

export interface OrderItem {
  _id: string;
  orderNumber: string;
  orderType: 'MARKETPLACE_ORDER' | 'SITE_SURVEY_REQUEST' | 'CUSTOM_QUOTATION';
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    address: string;
    city: string;
    siteType: 'Residential' | 'Commercial' | 'Corporate_B2B' | 'Industrial' | 'Government_Education';
  };
  items: Array<{
    productId: string;
    sku: string;
    title: string;
    quantity: number;
    unitSellingPrice: number;
    unitCostPrice: number;
    subtotalSellingPrice: number;
  }>;
  laborAndInstallationFee: number;
  shippingFee: number;
  grossTotal: number;
  totalCostOfGoods: number;
  netProfit: number;
  status: 'Pending' | 'Survey_Scheduled' | 'Quoted' | 'Installed' | 'Cancelled';
  paymentMethod: 'CASH_ON_DELIVERY' | 'MANUAL_BANK_TRANSFER' | 'ON_SITE_COLLECTION';
  paymentStatus: 'Pending' | 'Verified' | 'Failed' | 'Refunded';
  assignedTechnician?: {
    name: string;
    phone: string;
    scheduledDate: string;
    notes?: string;
  };
  customerNotes?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorEmail: string;
  actorRole: 'CEO' | 'ADMIN' | 'CUSTOMER';
  actorName: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const INITIAL_CREDENTIALS: CredentialItem[] = [
  {
    id: 'cred-1',
    title: 'Authorized Gold Solution Partner',
    type: 'OEM_PARTNERSHIP',
    issuer: 'Hikvision Digital Technology',
    licenseNumber: 'HIK-PK-GLD-8821',
    validFrom: '2023-01-01',
    validUntil: '2027-12-31',
    badgeImageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&q=80',
    badgeColor: 'border-red-500/40 bg-red-950/20 text-red-400',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cred-2',
    title: 'Certified Engineering Contractor',
    type: 'GOVERNMENT_REGISTRATION',
    issuer: 'Pakistan Engineering Council (PEC)',
    licenseNumber: 'PEC-C6/ELECT-44912',
    validFrom: '2018-05-15',
    validUntil: '2028-05-14',
    badgeImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80',
    badgeColor: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cred-3',
    title: 'Tier-1 System Integrator',
    type: 'OEM_PARTNERSHIP',
    issuer: 'Dahua Technology Middle East',
    licenseNumber: 'DH-ME-INT-1092',
    validFrom: '2022-03-01',
    validUntil: '2026-12-31',
    badgeImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80',
    badgeColor: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cred-4',
    title: 'ISO 9001:2015 Quality Management',
    type: 'ISO_CERTIFICATION',
    issuer: 'Bureau Veritas Quality Certification',
    licenseNumber: 'ISO-QM-PK-9041',
    validFrom: '2021-09-10',
    validUntil: '2027-09-09',
    badgeImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&q=80',
    badgeColor: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    displayOrder: 4,
    isActive: true,
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    _id: 'prod-pkg-1',
    title: '4-Camera Hikvision 5MP ColorVu Smart Package',
    slug: 'hikvision-5mp-4-camera-package',
    category: 'COMPLETE_PACKAGE',
    brand: 'Hikvision',
    description: 'Complete 24/7 Full-Color surveillance solution including 4x 5MP ColorVu audio cameras, 4-Channel AcuSense DVR, 1TB Surveillance HDD, central power supply, and professional installation accessories.',
    costPrice: 42000,
    sellingPrice: 58500,
    discountedPrice: 54900,
    stockQuantity: 14,
    lowStockThreshold: 4,
    sku: 'TE-PKG-HIK4C',
    isFeatured: true,
    warrantyMonths: 24,
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
    specifications: {
      resolution: '5MP (2560x1944) 24/7 ColorVu',
      channels: 4,
      storageCapacity: '1TB Western Digital Purple',
      cableLengthMeters: 60,
      indoorOutdoor: 'BOTH',
    },
  },
  {
    _id: 'prod-pkg-2',
    title: '8-Camera Enterprise 4K Ultra HD AI Security Setup',
    slug: 'dahua-8-camera-4k-enterprise-package',
    category: 'COMPLETE_PACKAGE',
    brand: 'Dahua',
    description: 'B2B commercial grade CCTV installation featuring 8x 4K Ultra HD motorized varifocal cameras with AI perimeter tripwire human/vehicle classification, 8-Ch 4K NVR, and 2TB Surveillance HDD.',
    costPrice: 85000,
    sellingPrice: 125000,
    discountedPrice: 118000,
    stockQuantity: 8,
    lowStockThreshold: 3,
    sku: 'TE-PKG-DH8C4K',
    isFeatured: true,
    warrantyMonths: 24,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    specifications: {
      resolution: '8MP 4K Ultra HD Motorized Optical Zoom',
      channels: 8,
      storageCapacity: '2TB Seagate SkyHawk AI',
      cableLengthMeters: 150,
      indoorOutdoor: 'BOTH',
    },
  },
  {
    _id: 'prod-cam-1',
    title: 'Hikvision DS-2CE10DF0T-F ColorVu Bullet 5MP',
    slug: 'hikvision-colorvu-bullet-5mp',
    category: 'CCTV_CAMERA',
    brand: 'Hikvision',
    description: 'High-performance outdoor IP67 weatherproof CCTV camera with F1.0 aperture, warm light supplement up to 20m distance, and built-in mic for synchronous audio capture.',
    costPrice: 4800,
    sellingPrice: 7200,
    discountedPrice: 6800,
    stockQuantity: 42,
    lowStockThreshold: 10,
    sku: 'HIK-DF0T-5MP',
    isFeatured: false,
    warrantyMonths: 12,
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
    specifications: {
      resolution: '5MP High Definition',
      indoorOutdoor: 'OUTDOOR',
    },
  },
  {
    _id: 'prod-cam-2',
    title: 'Dahua 4MP Smart Dual Illuminators Eyeball Dome',
    slug: 'dahua-4mp-smart-dual-eyeball',
    category: 'CCTV_CAMERA',
    brand: 'Dahua',
    description: 'Aesthetic indoor ceiling dome with dual warm light and IR illuminators, intelligent motion detection SMD Plus, and vandal-resistant casing.',
    costPrice: 5200,
    sellingPrice: 7900,
    stockQuantity: 28,
    lowStockThreshold: 6,
    sku: 'DH-HDW1409T',
    isFeatured: false,
    warrantyMonths: 12,
    imageUrl: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?w=600&q=80',
    specifications: {
      resolution: '4MP Full HD',
      indoorOutdoor: 'INDOOR',
    },
  },
  {
    _id: 'prod-dvr-1',
    title: 'Hikvision iDS-7208HUHI-M1/E 8-Channel AcuSense DVR',
    slug: 'hikvision-8ch-acusense-dvr',
    category: 'DVR_NVR',
    brand: 'Hikvision',
    description: 'Deep learning-based AcuSense video recorder with human/vehicle false alarm filtering, H.265+ compression, up to 10TB HDD support, and 4K HDMI monitor output.',
    costPrice: 19500,
    sellingPrice: 28000,
    discountedPrice: 26500,
    stockQuantity: 11,
    lowStockThreshold: 3,
    sku: 'HIK-DVR-7208',
    isFeatured: false,
    warrantyMonths: 24,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    specifications: {
      channels: 8,
      resolution: 'Supports up to 8MP cameras',
    },
  },
  {
    _id: 'prod-bio-1',
    title: 'ZKTeco BioTime Facial & Fingerprint Attendance Terminal',
    slug: 'zkteco-biotime-facial-fingerprint-terminal',
    category: 'BIOMETRIC_ATTENDANCE',
    brand: 'ZKTeco',
    description: 'Visible light facial recognition terminal with fingerprint sensor, RFID badge reader, automated payroll export, and electromagnetic door lock trigger.',
    costPrice: 26000,
    sellingPrice: 38000,
    discountedPrice: 35500,
    stockQuantity: 6,
    lowStockThreshold: 2,
    sku: 'ZK-MB20-PLUS',
    isFeatured: true,
    warrantyMonths: 12,
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80',
    specifications: {
      storageCapacity: '1,500 Faces / 2,000 Fingerprints',
    },
  },
  {
    _id: 'prod-cbl-1',
    title: 'Schneider Electric Cat6 Pure Copper 305m Network Roll',
    slug: 'schneider-cat6-pure-copper-305m',
    category: 'NETWORKING_CABLE',
    brand: 'Schneider Electric',
    description: '23AWG 100% Solid Pure Copper Gigabit Ethernet cable spool with internal spline separator, tested up to 550MHz, zero packet drop for enterprise IP surveillance.',
    costPrice: 22000,
    sellingPrice: 29500,
    stockQuantity: 19,
    lowStockThreshold: 5,
    sku: 'SCH-CAT6-305M',
    isFeatured: false,
    warrantyMonths: 60,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    specifications: {
      cableLengthMeters: 305,
      indoorOutdoor: 'BOTH',
    },
  },
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    _id: 'ord-101',
    orderNumber: 'TE-20261001-4412',
    orderType: 'MARKETPLACE_ORDER',
    customer: {
      fullName: 'Brig. (Retd) Tariq Mehmood',
      phoneNumber: '03008451234',
      email: 'tariq.mehmood@pkmail.com',
      address: 'House 88, Sector G, Phase 5 DHA',
      city: 'Lahore',
      siteType: 'Residential',
    },
    items: [
      {
        productId: 'prod-pkg-1',
        sku: 'TE-PKG-HIK4C',
        title: '4-Camera Hikvision 5MP ColorVu Smart Package',
        quantity: 1,
        unitSellingPrice: 54900,
        unitCostPrice: 42000,
        subtotalSellingPrice: 54900,
      },
    ],
    laborAndInstallationFee: 6500,
    shippingFee: 0,
    grossTotal: 61400,
    totalCostOfGoods: 42000,
    netProfit: 19400,
    status: 'Installed',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'Verified',
    assignedTechnician: {
      name: 'Muhammad Irfan (Senior Tech)',
      phone: '03219876543',
      scheduledDate: '2026-10-02T10:00:00.000Z',
      notes: 'Completed 4-camera installation with conduit piping. Tested remote mobile view for client.',
    },
    createdAt: '2026-10-01T14:30:00.000Z',
  },
  {
    _id: 'ord-102',
    orderNumber: 'TE-20261002-8819',
    orderType: 'CUSTOM_QUOTATION',
    customer: {
      fullName: 'Engr. Mian Salman',
      phoneNumber: '03224419988',
      email: 'salman@apextextiles.com.pk',
      address: 'Apex Spinning Mills, Plot 42-B, Industrial Estate Sundar',
      city: 'Lahore',
      siteType: 'Industrial',
    },
    items: [
      {
        productId: 'prod-pkg-2',
        sku: 'TE-PKG-DH8C4K',
        title: '8-Camera Enterprise 4K Ultra HD AI Security Setup',
        quantity: 2,
        unitSellingPrice: 118000,
        unitCostPrice: 85000,
        subtotalSellingPrice: 236000,
      },
      {
        productId: 'prod-cbl-1',
        sku: 'SCH-CAT6-305M',
        title: 'Schneider Electric Cat6 Pure Copper 305m Network Roll',
        quantity: 3,
        unitSellingPrice: 29500,
        unitCostPrice: 22000,
        subtotalSellingPrice: 88500,
      },
    ],
    laborAndInstallationFee: 35000,
    shippingFee: 0,
    grossTotal: 359500,
    totalCostOfGoods: 236000,
    netProfit: 123500,
    status: 'Installed',
    paymentMethod: 'MANUAL_BANK_TRANSFER',
    paymentStatus: 'Pending', // Outstanding receivable
    assignedTechnician: {
      name: 'Kashif Ali & Team',
      phone: '03017765432',
      scheduledDate: '2026-10-03T09:00:00.000Z',
      notes: 'Industrial perimeter cabling completed. Invoice sent to accounts for 30% final milestone.',
    },
    createdAt: '2026-10-02T09:15:00.000Z',
  },
  {
    _id: 'ord-103',
    orderNumber: 'TE-20261003-9120',
    orderType: 'SITE_SURVEY_REQUEST',
    customer: {
      fullName: 'Dr. Ayesha Haroon',
      phoneNumber: '03335123987',
      email: 'ayesha.haroon@punjabuniv.edu.pk',
      address: 'Department of Computer Science, University of the Punjab, New Campus',
      city: 'Lahore',
      siteType: 'Government_Education',
    },
    items: [],
    laborAndInstallationFee: 0,
    shippingFee: 0,
    grossTotal: 0,
    totalCostOfGoods: 0,
    netProfit: 0,
    status: 'Survey_Scheduled',
    paymentMethod: 'ON_SITE_COLLECTION',
    paymentStatus: 'Pending',
    assignedTechnician: {
      name: 'Muhammad Irfan (Senior Tech)',
      phone: '03219876543',
      scheduledDate: '2026-10-05T11:00:00.000Z',
      notes: 'Site survey requested for 32 IP cameras and biometric turnstiles across 3 academic blocks.',
    },
    customerNotes: 'Require PEC-certified quotation with 3-year SLA and OEM warranty letters.',
    createdAt: '2026-10-03T16:45:00.000Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    actorEmail: 'ashraf@toobaengineering.com',
    actorRole: 'CEO',
    actorName: 'Ashraf Sahib (CEO)',
    action: 'CREDENTIAL_VERIFIED',
    target: 'Dahua Technology Middle East',
    details: 'Renewed Tier-1 System Integrator certification valid through December 2026.',
    ipAddress: '182.180.142.10',
    timestamp: '2026-10-04T08:30:00.000Z',
  },
  {
    id: 'log-2',
    actorEmail: 'tayyab@toobaengineering.com',
    actorRole: 'ADMIN',
    actorName: 'Tayyab (Operations Lead)',
    action: 'DISPATCH_SCHEDULED',
    target: 'TE-20261003-9120',
    details: 'Assigned Senior Technician Muhammad Irfan for Punjab University site audit.',
    ipAddress: '39.40.112.55',
    timestamp: '2026-10-04T09:12:00.000Z',
  },
  {
    id: 'log-3',
    actorEmail: 'tayyab@toobaengineering.com',
    actorRole: 'ADMIN',
    actorName: 'Tayyab (Operations Lead)',
    action: 'STOCK_RESTOCKED',
    target: 'TE-PKG-HIK4C',
    details: 'Received +10 units from Hikvision official distributor warehouse.',
    ipAddress: '39.40.112.55',
    timestamp: '2026-10-04T10:00:00.000Z',
  },
];

export interface TechnicianItem {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  specialization: 'CCTV_NVR' | 'FIBER_NETWORKING' | 'BIOMETRICS_ACCESS' | 'ELECTRICAL_CONDUIT';
  experienceYears: number;
  status: 'AVAILABLE' | 'ON_JOB' | 'LEAVE';
  totalJobsCompleted: number;
  rating: number;
  activeCity: string;
}

export const INITIAL_TECHNICIANS: TechnicianItem[] = [
  {
    id: 'tech-1',
    name: 'Muhammad Irfan (Lead Field Engineer)',
    phone: '03219876543',
    whatsappNumber: '923219876543',
    address: 'Street 4, Sector B, Model Town, Lahore',
    specialization: 'CCTV_NVR',
    experienceYears: 8,
    status: 'AVAILABLE',
    totalJobsCompleted: 142,
    rating: 4.9,
    activeCity: 'Lahore & Suburbs',
  },
  {
    id: 'tech-2',
    name: 'Kashif Ali & Fiber Crew',
    phone: '03017765432',
    whatsappNumber: '923017765432',
    address: 'Plot 12, Industrial Estate Road, Kot Lakhpat, Lahore',
    specialization: 'FIBER_NETWORKING',
    experienceYears: 10,
    status: 'ON_JOB',
    totalJobsCompleted: 215,
    rating: 4.8,
    activeCity: 'Lahore / Sundar / Sheikhupura',
  },
  {
    id: 'tech-3',
    name: 'Zeeshan Haider',
    phone: '03348821944',
    whatsappNumber: '923348821944',
    address: 'House 55, Cavalry Ground, Lahore Cantt',
    specialization: 'BIOMETRICS_ACCESS',
    experienceYears: 6,
    status: 'AVAILABLE',
    totalJobsCompleted: 98,
    rating: 4.9,
    activeCity: 'Lahore & Rawalpindi',
  },
  {
    id: 'tech-4',
    name: 'Tariq Javed',
    phone: '03004455667',
    whatsappNumber: '923004455667',
    address: 'Main Commercial Market, Gulberg III, Lahore',
    specialization: 'ELECTRICAL_CONDUIT',
    experienceYears: 5,
    status: 'AVAILABLE',
    totalJobsCompleted: 76,
    rating: 4.7,
    activeCity: 'Lahore',
  },
];

export interface ComplaintItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  orderNumber?: string;
  issueType:
    | 'CAMERA_OFFLINE'
    | 'NIGHT_VISION_BLUR'
    | 'DVR_STORAGE_FAILURE'
    | 'TECHNICIAN_DELAY'
    | 'WIRING_DAMAGE'
    | 'GENERAL_WARRANTY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  assignedTo?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'cmp-1',
    ticketNumber: 'CMP-202610-001',
    customerName: 'Engr. Mian Salman',
    customerPhone: '03224419988',
    orderNumber: 'TE-20261002-8819',
    issueType: 'CAMERA_OFFLINE',
    priority: 'HIGH',
    description: 'Camera #6 on spinning warehouse perimeter went offline after heavy rain. Needs connector inspection.',
    status: 'INVESTIGATING',
    assignedTo: 'Muhammad Irfan (Lead Field Engineer)',
    resolutionNotes: 'Technician dispatched for waterproof box sealing.',
    createdAt: '2026-10-04T11:20:00.000Z',
  },
  {
    id: 'cmp-2',
    ticketNumber: 'CMP-202610-002',
    customerName: 'Brig. (Retd) Tariq Mehmood',
    customerPhone: '03008451234',
    orderNumber: 'TE-20261001-4412',
    issueType: 'GENERAL_WARRANTY',
    priority: 'MEDIUM',
    description: 'Require mobile application re-sync on family member iPhone 15 Pro.',
    status: 'RESOLVED',
    assignedTo: 'Tayyab (Operations Lead)',
    resolutionNotes: 'Guided client on Hik-Connect P2P barcode scan over phone. Resolved.',
    createdAt: '2026-10-03T15:40:00.000Z',
  },
];


