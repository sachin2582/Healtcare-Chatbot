/**
 * Fallback data for when backend API is not available
 * This prevents "Failed to fetch" errors during development and demo
 */

export const FALLBACK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    image_url: null,
    phone: "+1-555-0101",
    email: "sarah.johnson@hospital.com",
    bio: "Expert cardiologist with extensive experience in heart disease treatment.",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: "12 years",
    rating: 4.8,
    image_url: null,
    phone: "+1-555-0102",
    email: "michael.chen@hospital.com",
    bio: "Specialized in neurological disorders and brain surgery.",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    experience: "10 years",
    rating: 4.9,
    image_url: null,
    phone: "+1-555-0103",
    email: "emily.rodriguez@hospital.com",
    bio: "Dedicated pediatrician with a gentle approach to child healthcare.",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Dr. David Kim",
    specialty: "Orthopedics",
    experience: "18 years",
    rating: 4.7,
    image_url: null,
    phone: "+1-555-0104",
    email: "david.kim@hospital.com",
    bio: "Expert in bone and joint surgery with advanced techniques.",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Dermatology",
    experience: "8 years",
    rating: 4.8,
    image_url: null,
    phone: "+1-555-0105",
    email: "lisa.thompson@hospital.com",
    bio: "Specialized in skin conditions and cosmetic dermatology.",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const FALLBACK_SPECIALTIES = [
  {
    id: 1,
    name: "Cardiology",
    description: "Heart and cardiovascular system treatment",
    icon: "❤️",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Neurology",
    description: "Brain and nervous system disorders",
    icon: "🧠",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    icon: "👶",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Orthopedics",
    description: "Bone, joint, and muscle treatment",
    icon: "🦴",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Dermatology",
    description: "Skin, hair, and nail conditions",
    icon: "🧴",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Oncology",
    description: "Cancer diagnosis and treatment",
    icon: "🎗️",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "Gynecology",
    description: "Women's reproductive health",
    icon: "👩",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Urology",
    description: "Urinary tract and male reproductive system",
    icon: "🚽",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const FALLBACK_TIME_SLOTS = [
  {
    id: 1,
    doctor_id: 1,
    day_of_week: 1, // Monday
    start_time: "09:00",
    end_time: "10:00",
    duration_minutes: 60,
    is_available: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    doctor_id: 1,
    day_of_week: 1, // Monday
    start_time: "10:00",
    end_time: "11:00",
    duration_minutes: 60,
    is_available: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    doctor_id: 2,
    day_of_week: 2, // Tuesday
    start_time: "14:00",
    end_time: "15:00",
    duration_minutes: 60,
    is_available: true,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const FALLBACK_HEALTH_PACKAGES = [
  {
    id: 1,
    name: "Basic Health Checkup",
    description: "Comprehensive basic health screening",
    price: 2999,
    duration_hours: 2,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Executive Health Package",
    description: "Complete executive health assessment",
    price: 8999,
    duration_hours: 4,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Women's Health Package",
    description: "Comprehensive women's health screening",
    price: 4999,
    duration_hours: 3,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const FALLBACK_PATIENTS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-1001",
    age: 35,
    gender: "Male",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-1002",
    age: 28,
    gender: "Female",
    created_at: "2024-01-01T00:00:00Z"
  }
];

// Helper function to check if API is available
export const isApiAvailable = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.log('API not available, using fallback data:', error.message);
    return false;
  }
};

// Helper function to get fallback data based on endpoint
export const getFallbackData = (endpoint) => {
  switch (endpoint) {
    case '/doctors':
    case '/admin/doctors':
      return FALLBACK_DOCTORS;
    case '/specialities':
    case '/admin/specialities':
      return FALLBACK_SPECIALTIES;
    case '/doctor-time-slots':
    case '/admin/time-slots':
      return FALLBACK_TIME_SLOTS;
    case '/health-packages':
    case '/admin/health-packages':
      return FALLBACK_HEALTH_PACKAGES;
    case '/patients':
      return FALLBACK_PATIENTS;
    case '/health':
      return { status: "healthy", environment: "demo", version: "1.0.0" };
    default:
      return [];
  }
};

