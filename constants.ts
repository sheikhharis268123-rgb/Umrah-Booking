
import { Hotel, Booking, Agent } from './types';

// NOTE: All prices are in PKR (Pakistani Rupee) as the base currency.
export const HOTELS: Hotel[] = [
  {
    id: 1,
    name: 'Makkah Clock Royal Tower, A Fairmont Hotel',
    city: 'Makkah',
    address: 'King Abdul Aziz Endowment, Makkah 21955, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 100,
    rating: 5,
    priceStart: 264500, // PKR
    imageUrl: 'https://picsum.photos/seed/makkah1/800/600',
    description: 'Located adjacent to the Masjid al Haram, this luxury hotel offers unparalleled views and premium services. It is the centerpiece of the Abraj Al-Bait complex.',
    amenities: ['Free WiFi', 'Fitness Center', 'Restaurant', 'Room Service', 'Family Rooms', 'Kaaba View'],
    rooms: [
      { id: '1-1', type: 'Double', purchasePricePerNight: 208900, agentPricePerNight: 236800, customerPricePerNight: 264500, available: true },
      { id: '1-2', type: 'Suite', purchasePricePerNight: 417800, agentPricePerNight: 459600, customerPricePerNight: 501300, available: true },
      { id: '1-3', type: 'Quad', purchasePricePerNight: 334200, agentPricePerNight: 376000, customerPricePerNight: 417800, available: false },
    ]
  },
  {
    id: 2,
    name: 'Pullman ZamZam Makkah',
    city: 'Makkah',
    address: 'Abraj Al Bait Complex, Makkah 21955, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 150,
    rating: 5,
    priceStart: 222800, // PKR
    imageUrl: 'https://picsum.photos/seed/makkah2/800/600',
    description: 'Facing the King Abdulaziz Gate, this hotel provides easy access to the Holy Mosque and features modern, comfortable rooms with partial Haram views.',
    amenities: ['Free WiFi', 'Restaurant', 'Family Rooms', '24-hour front desk'],
    rooms: [
      { id: '2-1', type: 'Double', purchasePricePerNight: 181000, agentPricePerNight: 199000, customerPricePerNight: 222800, available: true },
      { id: '2-2', type: 'Suite', purchasePricePerNight: 376000, agentPricePerNight: 417800, customerPricePerNight: 459600, available: true },
    ]
  },
  {
    id: 3,
    name: 'Dar Al-Hijra InterContinental Madinah',
    city: 'Madina',
    address: 'King Fahd Rd, Badaah, Medina 42311, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 300,
    rating: 5,
    priceStart: 208900, // PKR
    imageUrl: 'https://picsum.photos/seed/madina1/800/600',
    description: 'Overlooking the Prophet\'s Mosque, this hotel is a favorite among pilgrims for its location and excellent service, offering spacious rooms and fine dining.',
    amenities: ['Free WiFi', 'Restaurant', 'Business Center', 'Room Service'],
    rooms: [
        { id: '3-1', type: 'Double', purchasePricePerNight: 167100, agentPricePerNight: 189400, customerPricePerNight: 208900, available: true },
        { id: '3-2', type: 'Single', purchasePricePerNight: 125300, agentPricePerNight: 139300, customerPricePerNight: 153200, available: false },
        { id: '3-3', 'type': 'Suite', purchasePricePerNight: 306400, agentPricePerNight: 348100, customerPricePerNight: 389900, available: true },
    ]
  },
  {
    id: 4,
    name: 'Anwar Al Madinah Mövenpick Hotel',
    city: 'Madina',
    address: 'Central Area, Medina 41499, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 50,
    rating: 5,
    priceStart: 250700, // PKR
    imageUrl: 'https://picsum.photos/seed/madina2/800/600',
    description: 'As one of the closest hotels to the Prophet\'s Mosque, it offers exceptional convenience for pilgrims. It is Madinah\'s largest hotel complex.',
    amenities: ['Free WiFi', '4 Restaurants', 'Family Rooms', 'ATM on site'],
    rooms: [
        { id: '4-1', type: 'Quad', purchasePricePerNight: 306400, agentPricePerNight: 351000, customerPricePerNight: 389900, available: true },
        { id: '4-2', type: 'Double', purchasePricePerNight: 200500, agentPricePerNight: 225600, customerPricePerNight: 250700, available: true },
    ]
  },
   {
    id: 5,
    name: 'Swissôtel Al Maqam Makkah',
    city: 'Makkah',
    address: 'Ibrahim Al Khalil Street, Makkah 21955, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 200,
    rating: 5,
    priceStart: 245100, // PKR
    imageUrl: 'https://picsum.photos/seed/makkah3/800/600',
    description: 'Part of the Abraj Al Bait complex, this hotel offers direct views of the Kaaba and has a private entrance to the Masjid al Haram.',
    amenities: ['Direct Haram Access', 'Restaurant', 'Room Service', 'Kaaba View'],
     rooms: [
      { id: '5-1', type: 'Double', purchasePricePerNight: 195000, agentPricePerNight: 220000, customerPricePerNight: 245100, available: true },
      { id: '5-2', type: 'Suite', purchasePricePerNight: 445700, agentPricePerNight: 487500, customerPricePerNight: 543200, available: true },
    ]
  },
  {
    id: 6,
    name: 'Madinah Hilton',
    city: 'Madina',
    address: 'King Fahd Rd, Opposite Prophet Masjid, Medina 56000, Saudi Arabia',
    availableFrom: '2024-01-01',
    availableTo: '2025-12-31',
    distanceToHaram: 100,
    rating: 4,
    priceStart: 181000, // PKR
    imageUrl: 'https://picsum.photos/seed/madina3/800/600',
    description: 'Located on the edge of the Prophet\'s Mosque, offering shopping and dining options within the hotel building.',
    amenities: ['Free WiFi', 'Restaurant', 'Shopping Mall', 'Room Service'],
    rooms: [
        { id: '6-1', type: 'Double', purchasePricePerNight: 139300, agentPricePerNight: 162900, customerPricePerNight: 181000, available: true },
        { id: '6-2', type: 'Single', purchasePricePerNight: 97500, agentPricePerNight: 111400, customerPricePerNight: 125300, available: true },
    ]
  }
];

export const AGENTS: Agent[] = [
    {
        id: 'AHT-001',
        profile: {
            agencyName: 'Al-Huda Travels',
            agencyId: 'AHT-001',
            iataCode: '22-3 4567-8',
            contactEmail: 'bookings@alhudatravels.com',
            contactNumber: '+966 12 345 6789'
        },
        status: 'Active',
        walletBalance: 13930000, // PKR
    },
    {
        id: 'NT-002',
        profile: {
            agencyName: 'Noor Tours',
            agencyId: 'NT-002',
            iataCode: '33-1 9876-5',
            contactEmail: 'contact@noortours.com',
            contactNumber: '+971 4 321 9876'
        },
        status: 'Active',
        walletBalance: 7000000, // PKR
    },
    {
        id: 'ITP-003',
        profile: {
            agencyName: 'Iman Travel Pakistan',
            agencyId: 'ITP-003',
            iataCode: '11-2 1234-5',
            contactEmail: 'info@imantravel.pk',
            contactNumber: '+92 301 8765432'
        },
        status: 'Inactive',
        walletBalance: 0,
    }
];


export const BOOKINGS: Booking[] = [
    {
        id: 'BK12345',
        hotel: HOTELS[0],
        room: HOTELS[0].rooms[0],
        guestName: 'Ahmad Khan',
        guestEmail: 'ahmad.khan@example.com',
        contactNumber: '+92 300 1234567',
        checkInDate: '2024-08-10',
        checkOutDate: '2024-08-15',
        totalPrice: 1322500, // PKR
        status: 'Confirmed',
        paymentMethod: 'Online',
    },
    {
        id: 'BK12346',
        hotel: HOTELS[3],
        room: HOTELS[3].rooms[1],
        guestName: 'Fatima Al-Sayed',
        guestEmail: 'fatima.as@example.com',
        contactNumber: '+20 100 123 4567',
        checkInDate: '2024-08-12',
        checkOutDate: '2024-08-18',
        totalPrice: 1500000, // PKR
        status: 'Confirmed',
        paymentMethod: 'Cash',
    },
    {
        id: 'BK12347',
        hotel: HOTELS[1],
        room: HOTELS[1].rooms[1],
        guestName: 'Yusuf Ali (Customer)',
        guestEmail: 'yusuf.ali@example.com',
        contactNumber: '+966 50 123 4567',
        checkInDate: '2024-09-01',
        checkOutDate: '2024-09-10',
        totalPrice: 4136400, // PKR
        status: 'Pending',
        paymentMethod: 'Online',
        agentDetails: AGENTS[0].profile
    },
     {
        id: 'BK12348',
        hotel: HOTELS[4],
        room: HOTELS[4].rooms[0],
        guestName: 'Aisha Begum',
        guestEmail: 'a.begum@example.com',
        contactNumber: '+44 20 7946 0958',
        checkInDate: '2024-09-05',
        checkOutDate: '2024-09-12',
        totalPrice: 2729300, // PKR
        status: 'Confirmed',
        paymentMethod: 'Online',
        agentDetails: AGENTS[1].profile
    }
];