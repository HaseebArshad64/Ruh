require './app'

# Clear existing data
DB[:appointments].delete
DB[:clients].delete

# Create dummy clients
clients = [
  {
    external_id: '1-12345',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1234567890',
    created_at: Time.now,
    updated_at: Time.now
  },
  {
    external_id: '2-12345',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1987654321',
    created_at: Time.now,
    updated_at: Time.now
  },
  {
    external_id: '3-12345',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1122334455',
    created_at: Time.now,
    updated_at: Time.now
  }
]

# Insert clients
clients.each do |client|
  DB[:clients].insert(client)
end

# Create dummy appointments
appointments = [
  {
    external_id: 'apt-1-12345',
    client_id: '1-12345',
    appointment_time: Time.now + (60 * 60 * 24), # tomorrow
    status: 'scheduled',
    created_at: Time.now,
    updated_at: Time.now
  },
  {
    external_id: 'apt-2-12345',
    client_id: '2-12345',
    appointment_time: Time.now + (60 * 60 * 48), # day after tomorrow
    status: 'scheduled',
    created_at: Time.now,
    updated_at: Time.now
  },
  {
    external_id: 'apt-3-12345',
    client_id: '3-12345',
    appointment_time: Time.now + (60 * 60 * 72), # 3 days from now
    status: 'scheduled',
    created_at: Time.now,
    updated_at: Time.now
  }
]

# Insert appointments
appointments.each do |appointment|
  DB[:appointments].insert(appointment)
end

puts "Seed data created successfully!"
puts "Created #{DB[:clients].count} clients"
puts "Created #{DB[:appointments].count} appointments" 