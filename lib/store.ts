'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  ProductItem,
  CredentialItem,
  OrderItem,
  AuditLogItem,
  TechnicianItem,
  ComplaintItem,
  INITIAL_PRODUCTS,
  INITIAL_CREDENTIALS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TECHNICIANS,
  INITIAL_COMPLAINTS,
} from './initial-data';

export type { ProductItem, CredentialItem, OrderItem, AuditLogItem, TechnicianItem, ComplaintItem };

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: 'CEO' | 'ADMIN' | 'CUSTOMER';
  phoneNumber: string;
}

const STORAGE_KEYS = {
  CART: 'tooba_cart',
  USER: 'tooba_user',
  PRODUCTS: 'tooba_products',
  ORDERS: 'tooba_orders',
  CREDENTIALS: 'tooba_credentials',
  AUDIT_LOGS: 'tooba_audit_logs',
  TECHNICIANS: 'tooba_technicians',
  COMPLAINTS: 'tooba_complaints',
  WHATSAPP_NUMBER: 'tooba_whatsapp_number',
};

// React 19 idiomatic client hydration detector
const emptySubscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function usePortalStore() {
  const isMounted = useIsHydrated();

  // Stable server-safe initial state (Guarantees zero SSR hydration divergence)
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [credentials, setCredentials] = useState<CredentialItem[]>(INITIAL_CREDENTIALS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [technicians, setTechnicians] = useState<TechnicianItem[]>(INITIAL_TECHNICIANS);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [businessWhatsApp, setBusinessWhatsApp] = useState<string>('923001234567');
  const [newComplaintAlert, setNewComplaintAlert] = useState<ComplaintItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Sync with LocalStorage after mount asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (savedProducts) setProducts(JSON.parse(savedProducts));

        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedCredentials = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
        if (savedCredentials) setCredentials(JSON.parse(savedCredentials));

        const savedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
        if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

        const savedTechs = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
        if (savedTechs) setTechnicians(JSON.parse(savedTechs));

        const savedComplaints = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
        if (savedComplaints) setComplaints(JSON.parse(savedComplaints));

        const savedWhatsApp = localStorage.getItem(STORAGE_KEYS.WHATSAPP_NUMBER);
        if (savedWhatsApp) setBusinessWhatsApp(savedWhatsApp);

        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('LocalStorage retrieval failed:', e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  const saveProducts = (newProducts: ProductItem[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrders = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCredentials = (newCreds: CredentialItem[]) => {
    setCredentials(newCreds);
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(newCreds));
    } catch (e) {
      console.error(e);
    }
  };

  const saveAuditLogs = (newLogs: AuditLogItem[]) => {
    setAuditLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(newLogs));
    } catch (e) {
      console.error(e);
    }
  };

  const saveTechnicians = (newTechs: TechnicianItem[]) => {
    setTechnicians(newTechs);
    try {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(newTechs));
    } catch (e) {
      console.error(e);
    }
  };

  const saveComplaints = (newComplaints: ComplaintItem[]) => {
    setComplaints(newComplaints);
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(newComplaints));
    } catch (e) {
      console.error(e);
    }
  };

  const updateBusinessWhatsApp = (newNumber: string) => {
    const cleanNumber = newNumber.replace(/[^0-9]/g, '');
    setBusinessWhatsApp(cleanNumber);
    try {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_NUMBER, cleanNumber);
    } catch (e) {
      console.error(e);
    }

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'ashraf@toobaengineering.com',
      actorRole: 'CEO',
      actorName: 'Ashraf Sahib (CEO)',
      action: 'WHATSAPP_NUMBER_UPDATED',
      target: cleanNumber,
      details: `Official business WhatsApp routing changed to ${cleanNumber}. Future customer orders will route here.`,
      ipAddress: '182.180.142.10',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return cleanNumber;
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const setUser = (user: AuthUser | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Customer Care: Submit Complaint / Warranty Ticket
  const submitComplaint = (data: {
    customerName: string;
    customerPhone: string;
    orderNumber?: string;
    issueType: ComplaintItem['issueType'];
    priority: ComplaintItem['priority'];
    description: string;
  }) => {
    const ticketNumber = `CMP-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const newComplaint: ComplaintItem = {
      id: `cmp-${Date.now()}`,
      ticketNumber,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      orderNumber: data.orderNumber ? data.orderNumber.trim().toUpperCase() : undefined,
      issueType: data.issueType,
      priority: data.priority,
      description: data.description.trim(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    const updated = [newComplaint, ...complaints];
    saveComplaints(updated);

    // Trigger instant alert for logged-in CEO or Admin
    setNewComplaintAlert(newComplaint);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: 'support@tooba.pk',
      actorRole: 'CUSTOMER',
      actorName: data.customerName,
      action: 'CUSTOMER_COMPLAINT_LOGGED',
      target: ticketNumber,
      details: `New issue registered: [${data.priority}] ${data.issueType} - "${data.description.slice(0, 60)}..."`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return newComplaint;
  };

  const resolveComplaint = (ticketId: string, resolutionNotes: string, assignedStaff?: string) => {
    const updated = complaints.map((c) =>
      c.id === ticketId
        ? {
            ...c,
            status: 'RESOLVED' as const,
            resolutionNotes: resolutionNotes.trim(),
            assignedTo: assignedStaff || currentUser?.fullName || 'Operations Lead (Tayyab)',
          }
        : c
    );
    saveComplaints(updated);

    const targetComplaint = complaints.find((c) => c.id === ticketId);
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'admin@toobaengineering.com',
      actorRole: currentUser?.role || 'ADMIN',
      actorName: currentUser?.fullName || 'Tayyab (Admin)',
      action: 'COMPLAINT_RESOLVED',
      target: targetComplaint?.ticketNumber || ticketId,
      details: `Closed ticket with resolution: ${resolutionNotes}`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  const dismissComplaintAlert = () => {
    setNewComplaintAlert(null);
  };

  // Add New Product (Authorized for both CEO & Tayyab/Admin)
  const addProduct = (productData: Omit<ProductItem, '_id'>) => {
    const newProduct: ProductItem = {
      ...productData,
      _id: `prod-${Date.now()}`,
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);

    const actor = currentUser?.fullName || 'Tayyab (Admin)';
    const role = currentUser?.role || 'ADMIN';

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'admin@toobaengineering.com',
      actorRole: role,
      actorName: actor,
      action: 'PRODUCT_CREATED',
      target: newProduct.sku,
      details: `Added new hardware: "${newProduct.title}" (Selling Price: PKR ${newProduct.sellingPrice.toLocaleString()}).`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return newProduct;
  };

  // Add Technician (Includes WhatsApp, address, and completed jobs)
  const addTechnician = (techData: Omit<TechnicianItem, 'id' | 'rating'>) => {
    const cleanWhatsApp = techData.whatsappNumber
      ? techData.whatsappNumber.replace(/[^0-9]/g, '')
      : techData.phone.replace(/[^0-9]/g, '');

    const newTech: TechnicianItem = {
      ...techData,
      whatsappNumber: cleanWhatsApp,
      id: `tech-${Date.now()}`,
      rating: 5.0,
    };

    const updated = [newTech, ...technicians];
    saveTechnicians(updated);

    const actor = currentUser?.fullName || 'Tayyab (Admin)';
    const role = currentUser?.role || 'ADMIN';

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'admin@toobaengineering.com',
      actorRole: role,
      actorName: actor,
      action: 'TECHNICIAN_REGISTERED',
      target: newTech.name,
      details: `Enrolled certified technician: ${newTech.name} (${newTech.specialization.replace(
        /_/g,
        ' '
      )}, ${newTech.experienceYears} Yrs, Completed: ${newTech.totalJobsCompleted} jobs). WhatsApp: ${cleanWhatsApp}`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return newTech;
  };

  const updateTechnicianStatus = (techId: string, status: TechnicianItem['status']) => {
    const updated = technicians.map((t) => (t.id === techId ? { ...t, status } : t));
    saveTechnicians(updated);
  };

  const removeTechnician = (techId: string) => {
    const target = technicians.find((t) => t.id === techId);
    const updated = technicians.filter((t) => t.id !== techId);
    saveTechnicians(updated);

    const actor = currentUser?.fullName || 'Tayyab (Admin)';
    const role = currentUser?.role || 'ADMIN';

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'admin@toobaengineering.com',
      actorRole: role,
      actorName: actor,
      action: 'TECHNICIAN_REMOVED',
      target: target?.name || techId,
      details: `Removed field technician "${target?.name || techId}" from active registry.`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  // Send Order Directly to Technician WhatsApp
  const sendJobToTechnicianWhatsApp = (order: OrderItem, tech?: TechnicianItem) => {
    const rawNumber =
      tech?.whatsappNumber ||
      tech?.phone ||
      order.assignedTechnician?.phone ||
      businessWhatsApp ||
      '923001234567';
    const cleanNumber = String(rawNumber).replace(/[^0-9]/g, '') || '923001234567';
    const techName = tech?.name || order.assignedTechnician?.name || 'Field Technician';

    const itemsList =
      order.items && order.items.length > 0
        ? order.items
            .map((i) => `• ${i.title} x ${i.quantity} (SKU: ${i.sku})`)
            .join('\n')
        : '• Comprehensive Physical Site Survey & BOQ Assessment';

    const message = `*TOOBA ENGINEERING - OFFICIAL FIELD JOB DISPATCH*\n\n` +
      `*Assigned Engineer:* ${techName}\n` +
      `*Order/Job Ref:* ${order.orderNumber}\n` +
      `*Appointment Date:* ${
        order.assignedTechnician?.scheduledDate
          ? new Date(order.assignedTechnician.scheduledDate).toLocaleString('en-PK')
          : 'Immediate / As per schedule'
      }\n\n` +
      `*CLIENT DETAILS:*\n` +
      `• Name: ${order.customer?.fullName || 'Client'}\n` +
      `• Phone: ${order.customer?.phoneNumber || 'N/A'}\n` +
      `• Address: ${order.customer?.address || 'Site Address'}, ${order.customer?.city || 'Lahore'}\n` +
      `• Premises Type: ${order.customer?.siteType || 'Commercial'}\n\n` +
      `*EQUIPMENT & SCOPE:*\n${itemsList}\n\n` +
      `*Gross Total Payable:* PKR ${(order.grossTotal || 0).toLocaleString()} (${(order.paymentMethod || 'COD').replace(/_/g, ' ')})\n` +
      `*Special Tooling/Site Notes:* ${order.assignedTechnician?.notes || order.customerNotes || 'Bring standard test monitor and drill set'}\n\n` +
      `_Dispatched via Tooba Engineering Operations Control._`;

    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // Cart operations
  const addToCart = (product: ProductItem, quantity: number = 1) => {
    const existingIndex = cart.findIndex((i) => i.product._id === product._id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].quantity + quantity;
      if (newQty <= product.stockQuantity) {
        updatedCart[existingIndex].quantity = newQty;
      }
    } else {
      updatedCart = [...cart, { product, quantity: Math.min(quantity, product.stockQuantity) }];
    }

    saveCart(updatedCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cart.map((item) => {
      if (item.product._id === productId) {
        return {
          ...item,
          quantity: Math.min(quantity, item.product.stockQuantity),
        };
      }
      return item;
    });

    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Atomic Checkout Engine
  const processCheckout = async (checkoutData: {
    customer: OrderItem['customer'];
    paymentMethod: OrderItem['paymentMethod'];
    customerNotes?: string;
  }) => {
    if (cart.length === 0) throw new Error('Cart is empty.');

    for (const item of cart) {
      const currentProduct = products.find((p) => p._id === item.product._id);
      if (!currentProduct) {
        throw new Error(`Product ${item.product.title} is no longer available.`);
      }
      if (currentProduct.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${currentProduct.title}". Only ${currentProduct.stockQuantity} remaining.`
        );
      }
    }

    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((c) => c.product._id === prod._id);
      if (cartItem) {
        return {
          ...prod,
          stockQuantity: prod.stockQuantity - cartItem.quantity,
        };
      }
      return prod;
    });

    let grossTotal = 0;
    let totalCostOfGoods = 0;

    const orderItems = cart.map((item) => {
      const unitSelling = item.product.discountedPrice || item.product.sellingPrice;
      const unitCost = item.product.costPrice;
      const subtotalSelling = unitSelling * item.quantity;
      grossTotal += subtotalSelling;
      totalCostOfGoods += unitCost * item.quantity;

      return {
        productId: item.product._id,
        sku: item.product.sku,
        title: item.product.title,
        quantity: item.quantity,
        unitSellingPrice: unitSelling,
        unitCostPrice: unitCost,
        subtotalSellingPrice: subtotalSelling,
      };
    });

    const shippingFee = grossTotal > 50000 ? 0 : 500;
    const finalGrossTotal = grossTotal + shippingFee;
    const netProfit = finalGrossTotal - totalCostOfGoods - shippingFee;

    const orderNumber = `TE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newOrder: OrderItem = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      orderType: 'MARKETPLACE_ORDER',
      customer: checkoutData.customer,
      items: orderItems,
      laborAndInstallationFee: 0,
      shippingFee,
      grossTotal: finalGrossTotal,
      totalCostOfGoods,
      netProfit,
      status: 'Pending',
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: 'Pending',
      customerNotes: checkoutData.customerNotes,
      createdAt: new Date().toISOString(),
    };

    saveProducts(updatedProducts);
    saveOrders([newOrder, ...orders]);
    clearCart();

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: checkoutData.customer.email || 'customer@tooba.pk',
      actorRole: 'CUSTOMER',
      actorName: checkoutData.customer.fullName,
      action: 'CHECKOUT_ORDER_PLACED',
      target: orderNumber,
      details: `Placed order for ${orderItems.length} items. Total: PKR ${finalGrossTotal.toLocaleString()}.`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return newOrder;
  };

  const requestSiteSurvey = (surveyData: {
    customer: OrderItem['customer'];
    customerNotes?: string;
  }) => {
    const orderNumber = `TE-SRV-${Date.now().toString().slice(-6)}`;
    const newSurvey: OrderItem = {
      _id: `srv-${Date.now()}`,
      orderNumber,
      orderType: 'SITE_SURVEY_REQUEST',
      customer: surveyData.customer,
      items: [],
      laborAndInstallationFee: 0,
      shippingFee: 0,
      grossTotal: 0,
      totalCostOfGoods: 0,
      netProfit: 0,
      status: 'Pending',
      paymentMethod: 'ON_SITE_COLLECTION',
      paymentStatus: 'Pending',
      customerNotes: surveyData.customerNotes,
      createdAt: new Date().toISOString(),
    };

    saveOrders([newSurvey, ...orders]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: surveyData.customer.email || 'lead@tooba.pk',
      actorRole: 'CUSTOMER',
      actorName: surveyData.customer.fullName,
      action: 'SITE_SURVEY_BOOKED',
      target: orderNumber,
      details: `Booked physical survey in ${surveyData.customer.city} for ${surveyData.customer.siteType} facility.`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);

    return newSurvey;
  };

  const adjustProductStock = (productId: string, adjustment: number, reason: string) => {
    const target = products.find((p) => p._id === productId);
    if (!target) throw new Error('Product not found.');

    const newQty = target.stockQuantity + adjustment;
    if (newQty < 0) {
      throw new Error(`Insufficient stock. Current stock is ${target.stockQuantity}.`);
    }

    const updated = products.map((p) => (p._id === productId ? { ...p, stockQuantity: newQty } : p));
    saveProducts(updated);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'tayyab@toobaengineering.com',
      actorRole: currentUser?.role || 'ADMIN',
      actorName: currentUser?.fullName || 'Tayyab (Admin)',
      action: adjustment > 0 ? 'STOCK_RESTOCKED' : 'STOCK_WRITEOFF',
      target: target.sku,
      details: `Adjusted stock by ${adjustment > 0 ? '+' : ''}${adjustment} units (Now: ${newQty}). Reason: ${reason}`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  const updateOrder = (orderId: string, updates: Partial<OrderItem>) => {
    const updated = orders.map((o) => (o._id === orderId ? { ...o, ...updates } : o));
    saveOrders(updated);

    const currentOrder = orders.find((o) => o._id === orderId);
    if (currentOrder && updates.status) {
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        actorEmail: currentUser?.email || 'admin@toobaengineering.com',
        actorRole: currentUser?.role || 'ADMIN',
        actorName: currentUser?.fullName || 'Tayyab (Admin)',
        action: 'ORDER_STATUS_CHANGED',
        target: currentOrder.orderNumber,
        details: `Updated status from ${currentOrder.status} to ${updates.status}.`,
        ipAddress: '192.168.1.100',
        timestamp: new Date().toISOString(),
      };
      saveAuditLogs([newLog, ...auditLogs]);
    }
  };

  const toggleCredentialStatus = (credId: string) => {
    const updated = credentials.map((c) => (c.id === credId ? { ...c, isActive: !c.isActive } : c));
    saveCredentials(updated);
  };

  const addCredential = (cred: Omit<CredentialItem, 'id'>) => {
    const newCred: CredentialItem = {
      ...cred,
      id: `cred-${Date.now()}`,
    };
    saveCredentials([...credentials, newCred]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorEmail: currentUser?.email || 'ashraf@toobaengineering.com',
      actorRole: 'CEO',
      actorName: 'Ashraf Sahib (CEO)',
      action: 'CREDENTIAL_ADDED',
      target: newCred.issuer,
      details: `Added new trust credential: "${newCred.title}".`,
      ipAddress: '182.180.142.10',
      timestamp: new Date().toISOString(),
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  return {
    isMounted,
    products,
    credentials,
    orders,
    auditLogs,
    technicians,
    complaints,
    businessWhatsApp,
    newComplaintAlert,
    cart,
    currentUser,
    setUser,
    addProduct,
    addTechnician,
    removeTechnician,
    updateTechnicianStatus,
    sendJobToTechnicianWhatsApp,
    submitComplaint,
    resolveComplaint,
    dismissComplaintAlert,
    updateBusinessWhatsApp,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    processCheckout,
    requestSiteSurvey,
    adjustProductStock,
    updateOrder,
    toggleCredentialStatus,
    addCredential,
  };
}
