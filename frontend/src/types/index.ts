// Client interface matching backend API response
export interface Client {
  id: number;
  external_id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Appointment interface matching backend API response
export interface Appointment {
  id: number;
  external_id: string;
  client_id: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Appointment with client details for joined queries
export interface AppointmentWithClient extends Appointment {
  client_name: string;
  client_email: string;
  client_phone?: string;
}

// Form data for creating new appointments
export interface CreateAppointmentData {
  client_id: string;
  time: string;
}

// Form data for creating new clients
export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form validation errors
export interface FormErrors {
  client_id?: string;
  time?: string;
  general?: string;
}

// Search/filter state
export interface FilterState {
  searchTerm: string;
  sortBy: 'name' | 'email' | 'created_at';
  sortOrder: 'asc' | 'desc';
}
