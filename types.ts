
export interface Room {
  id: string;
  type: 'Single' | 'Double' | 'Suite' | 'Quad';
  purchasePricePerNight: number; // Price we pay to hotel
  agentPricePerNight: number; // Price for agents
  customerPricePerNight: number; // Price for direct customers
  available: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  city: 'Makkah' | 'Madina';
  address: string;
  availableFrom: string;
  availableTo: string;
  distanceToHaram: number; // in meters
  rating: number; // 1 to 5
  priceStart: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  rooms: Room[];
}

export interface AgentProfile {
    agencyName: string;
    agencyId: string;
    password?: string; // Added for login
    iataCode: string;
    contactEmail: string;
    contactNumber: string;
}

export interface Agent {
    id: string; // agencyId
    profile: AgentProfile;
    status: 'Active' | 'Inactive';
    walletBalance: number;
}

export interface Invoice {
    id: string;
    agentId: string;
    agentName: string;
    amount: number;
    type: 'Credit' | 'Debit';
    description: string;
    createdAt: string; // ISO date string
}

export interface Booking {
    id: string;
    hotel: Hotel;
    room: Room;
    guestName: string;
    guestEmail: string;
    contactNumber: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Cancellation Requested' | 'Date Change Requested';
    paymentMethod: 'Online' | 'Cash';
    promoCodeApplied?: string;
    agentDetails?: AgentProfile;
    showPriceOnVoucher?: boolean;
    bookingType?: 'customer' | 'agent-assigned';
    requestedCheckInDate?: string;
    requestedCheckOutDate?: string;
    requestedTotalPrice?: number;
    customerId?: string; // Link to customer account
}

export interface BulkOrderItem {
    id: string; // unique item id
    hotelId: number;
    hotelName: string;
    roomId: string;
    roomType: string;
    quantity: number;
    pricePerNight: number;
    subtotal: number;
    hotel: Hotel;
    room: Room;
    checkInDate: string;
    checkOutDate: string;
}

export interface BulkOrder {
    id: string;
    agentId: string;
    agentName: string;
    items: BulkOrderItem[];
    totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Rejected';
    createdAt: string; // ISO string date
}


export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

export type Currency = 'USD' | 'SAR' | 'PKR';

// New Types for Customer Auth and Notifications
export interface Customer {
    id: number; // The numeric ID from the database
    name: string;
    email: string;
    password?: string; // Only used for forms
}

export interface EmailNotification {
    id: string;
    to: string;
    subject: string;
    body: string; // HTML content
    attachmentUrl?: string; // Link to the voucher page
    sentAt: string;
}