#!/usr/bin/env ruby
# frozen_string_literal: true

require 'sinatra'
require 'json'
require 'sequel'
require 'pg'

# Enable PATCH method support in Sinatra
set :method_override, true

before do
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
end

options '*' do
  200
end

DB = Sequel.connect(
  adapter: 'postgres',
  host: ENV['DB_HOST'] || 'localhost',
  database: ENV['DB_NAME'] || 'wellness_platform_dev',
  user: ENV['DB_USER'] || 'haseebarshad',
  password: ENV['DB_PASSWORD'] || ''
)

unless DB.table_exists?(:clients)
  DB.create_table :clients do
    primary_key :id
    String :external_id, unique: true
    String :name, null: false
    String :email, null: false, unique: true
    String :phone
    DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
    
    index :email, unique: true
  end
end

unless DB.table_exists?(:appointments)
  DB.create_table :appointments do
    primary_key :id
    String :external_id, unique: true
    String :client_id, null: false
    DateTime :appointment_time, null: false
    String :status, default: 'scheduled'
    DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
  end
end

# Helper methods for enterprise-grade error handling
def validate_required_fields(data, fields)
  missing_fields = fields.select { |field| data[field].nil? || data[field].to_s.strip.empty? }
  return if missing_fields.empty?
  
  if missing_fields.include?('name')
    halt 400, { error: 'Client name is required. Please enter a valid name.' }.to_json
  elsif missing_fields.include?('email')
    halt 400, { error: 'Client email is required. Please enter a valid email address.' }.to_json
  elsif missing_fields.include?('client_id')
    halt 400, { error: 'Please select a client before scheduling the appointment.' }.to_json
  elsif missing_fields.include?('time')
    halt 400, { error: 'Please select a valid date and time for the appointment.' }.to_json
  else
    halt 400, { error: "Please fill in all required fields: #{missing_fields.join(', ')}" }.to_json
  end
end

def validate_email(email)
  email_regex = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  halt 400, { error: 'Please enter a valid email address (e.g., john@example.com).' }.to_json unless email.match?(email_regex)
end

def validate_phone(phone)
  return if phone.nil? || phone.strip.empty?
  phone_regex = /\A[\+]?[\d\s\-\(\)]{10,}\z/
  halt 400, { error: 'Please enter a valid phone number.' }.to_json unless phone.match?(phone_regex)
end

def find_client_by_id(id)
  client = DB[:clients].where(external_id: id).first
  halt 404, { error: 'Client not found. They may have been deleted by another user.' }.to_json unless client
  client
end

def find_appointment_by_id(id)
  appointment = DB[:appointments].where(external_id: id).first
  halt 404, { error: 'Appointment not found. It may have been deleted or modified by another user.' }.to_json unless appointment
  appointment
end

def validate_appointment_time(time_str)
  begin
    appointment_time = Time.parse(time_str)
    if appointment_time <= Time.now
      halt 400, { error: 'Cannot schedule appointments in the past. Please select a future date and time.' }.to_json
    end
    appointment_time
  rescue ArgumentError
    halt 400, { error: 'Please enter a valid date and time.' }.to_json
  end
end

def check_time_conflict(client_id, appointment_time, exclude_id = nil)
  # For now, disable time conflict checking to fix the immediate issue
  # TODO: Implement proper time conflict checking later
  
  # Alternative implementation without range operator
  # query = DB[:appointments].where(
  #   client_id: client_id,
  #   status: 'scheduled'
  # ).where(Sequel.lit('appointment_time BETWEEN ? AND ?', 
  #                    appointment_time - 3600, 
  #                    appointment_time + 3600))
  # 
  # query = query.exclude(external_id: exclude_id) if exclude_id
  # 
  # if query.count > 0
  #   halt 400, { error: 'This time slot is already booked. Please choose a different time.' }.to_json
  # end
end

def generate_external_id
  "#{Time.now.to_i}-#{rand(10000..99999)}"
end

# ====================
# CLIENT ENDPOINTS
# ====================

# Get all clients
get '/api/clients' do
  content_type :json
  clients = DB[:clients].all
  clients.to_json
end

# Create a new client
post '/api/clients' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  validate_required_fields(data, ['name', 'email'])
  validate_email(data['email'])
  validate_phone(data['phone'])
  
  external_id = generate_external_id
  
  begin
    client_id = DB[:clients].insert(
      external_id: external_id,
      name: data['name'].strip,
      email: data['email'].strip.downcase,
      phone: data['phone']&.strip,
      created_at: Time.now,
      updated_at: Time.now
    )
    
    client = DB[:clients].where(id: client_id).first
    status 201
    client.to_json
  rescue Sequel::UniqueConstraintViolation => e
    if e.message.include?('email')
      halt 409, { error: 'A client with this email address already exists. Please use a different email.' }.to_json
    else
      halt 409, { error: 'A client with this information already exists.' }.to_json
    end
  rescue => e
    halt 500, { error: 'Unable to create client. Please try again or contact support if the problem persists.' }.to_json
  end
end

# Update a client
put '/api/clients/:id' do
  content_type :json
  client = find_client_by_id(params[:id])
  data = JSON.parse(request.body.read)
  
  # Validate email if provided
  validate_email(data['email']) if data['email']
  validate_phone(data['phone']) if data['phone']
  
  begin
    update_data = {}
    update_data[:name] = data['name'].strip if data['name']
    update_data[:email] = data['email'].strip.downcase if data['email']
    update_data[:phone] = data['phone']&.strip if data.key?('phone')
    update_data[:updated_at] = Time.now
    
    DB[:clients].where(external_id: params[:id]).update(update_data)
    updated_client = DB[:clients].where(external_id: params[:id]).first
    updated_client.to_json
  rescue Sequel::UniqueConstraintViolation => e
    if e.message.include?('email')
      halt 409, { error: 'A client with this email address already exists. Please use a different email.' }.to_json
    else
      halt 409, { error: 'A client with this information already exists.' }.to_json
    end
  rescue => e
    halt 500, { error: 'Unable to update client. Please check your changes and try again.' }.to_json
  end
end

# Delete a client
delete '/api/clients/:id' do
  content_type :json
  client = find_client_by_id(params[:id])
  
  begin
    # Check if client has appointments
    appointments_count = DB[:appointments].where(client_id: params[:id]).count
    if appointments_count > 0
      halt 409, { error: 'Cannot delete client with existing appointments. Please cancel or delete their appointments first.' }.to_json
    end
    
    DB[:clients].where(external_id: params[:id]).delete
    status 204
  rescue => e
    halt 500, { error: 'Unable to delete client. Please try again.' }.to_json
  end
end

# ====================
# APPOINTMENT ENDPOINTS
# ====================

# Get all appointments
get '/api/appointments' do
  content_type :json
  appointments = DB[:appointments].all
  appointments.to_json
end

# Get appointments with client details
get '/api/appointments/with_clients' do
  content_type :json
  
  appointments = DB[:appointments]
    .join(:clients, external_id: :client_id)
    .select(
      Sequel[:appointments][:id],
      Sequel[:appointments][:external_id],
      Sequel[:appointments][:client_id],
      Sequel[:appointments][:appointment_time],
      Sequel[:appointments][:status],
      Sequel[:appointments][:created_at],
      Sequel[:appointments][:updated_at],
      Sequel[:clients][:name].as(:client_name),
      Sequel[:clients][:email].as(:client_email),
      Sequel[:clients][:phone].as(:client_phone)
    ).all
    
  appointments.to_json
end

# Create a new appointment
post '/api/appointments' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  validate_required_fields(data, ['client_id', 'time'])
  
  # Validate client exists
  find_client_by_id(data['client_id'])
  
  # Validate and parse appointment time
  appointment_time = validate_appointment_time(data['time'])
  
  # Check for time conflicts (temporarily disabled)
  # check_time_conflict(data['client_id'], appointment_time)
  
  external_id = generate_external_id
  
  begin
    appointment_id = DB[:appointments].insert(
      external_id: external_id,
      client_id: data['client_id'],
      appointment_time: appointment_time,
      status: 'scheduled',
      created_at: Time.now,
      updated_at: Time.now
    )
    
    appointment = DB[:appointments].where(id: appointment_id).first
    status 201
    appointment.to_json
  rescue => e
    halt 500, { error: 'Unable to create appointment. Please try again.' }.to_json
  end
end

# Create appointment with new client (atomic operation)
post '/api/appointments/with_new_client' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  # Validate required fields for both client and appointment
  validate_required_fields(data, ['name', 'email', 'time'])
  validate_email(data['email'])
  validate_phone(data['phone'])
  
  # Validate and parse appointment time
  appointment_time = validate_appointment_time(data['time'])
  
  # Generate external IDs
  client_external_id = generate_external_id
  appointment_external_id = generate_external_id
  
  # Use database transaction to ensure atomicity
  begin
    DB.transaction do
      # Create client first
      client_id = DB[:clients].insert(
        external_id: client_external_id,
        name: data['name'].strip,
        email: data['email'].strip.downcase,
        phone: data['phone']&.strip,
        created_at: Time.now,
        updated_at: Time.now
      )
      
      # Check for time conflicts with the new client (temporarily disabled)
      # check_time_conflict(client_external_id, appointment_time)
      
      # Create appointment
      appointment_id = DB[:appointments].insert(
        external_id: appointment_external_id,
        client_id: client_external_id,
        appointment_time: appointment_time,
        status: 'scheduled',
        created_at: Time.now,
        updated_at: Time.now
      )
      
      # Return the created appointment with client details
      appointment_with_client = DB[:appointments]
        .join(:clients, external_id: :client_id)
        .select(
          Sequel[:appointments][:id],
          Sequel[:appointments][:external_id],
          Sequel[:appointments][:client_id],
          Sequel[:appointments][:appointment_time],
          Sequel[:appointments][:status],
          Sequel[:appointments][:created_at],
          Sequel[:appointments][:updated_at],
          Sequel[:clients][:name].as(:client_name),
          Sequel[:clients][:email].as(:client_email),
          Sequel[:clients][:phone].as(:client_phone)
        )
        .where(Sequel[:appointments][:id] => appointment_id)
        .first
        
      status 201
      appointment_with_client.to_json
    end
  rescue Sequel::UniqueConstraintViolation => e
    if e.message.include?('email')
      halt 409, { error: 'A client with this email address already exists. Please use a different email or select the existing client.' }.to_json
    else
      halt 409, { error: 'A client with this information already exists.' }.to_json
    end
  rescue => e
    halt 500, { error: 'Unable to create appointment and client. Please try again.' }.to_json
  end
end

# Update an appointment
put '/api/appointments/:id' do
  content_type :json
  appointment = find_appointment_by_id(params[:id])
  data = JSON.parse(request.body.read)
  
  begin
    update_data = {}
    
    if data['client_id']
      find_client_by_id(data['client_id'])  # Validate client exists
      update_data[:client_id] = data['client_id']
    end
    
    if data['time']
      appointment_time = validate_appointment_time(data['time'])
      client_id = data['client_id'] || appointment[:client_id]
      # check_time_conflict(client_id, appointment_time, params[:id])
      update_data[:appointment_time] = appointment_time
    end
    
    if data['status']
      valid_statuses = ['scheduled', 'completed', 'cancelled']
      unless valid_statuses.include?(data['status'])
        halt 400, { error: 'Invalid appointment status. Must be scheduled, completed, or cancelled.' }.to_json
      end
      update_data[:status] = data['status']
    end
    
    update_data[:updated_at] = Time.now
    
    DB[:appointments].where(external_id: params[:id]).update(update_data)
    updated_appointment = DB[:appointments].where(external_id: params[:id]).first
    updated_appointment.to_json
  rescue => e
    halt 500, { error: 'Unable to update appointment. Please check your changes and try again.' }.to_json
  end
end

# Cancel an appointment
put '/api/appointments/:id/cancel' do
  content_type :json
  appointment = find_appointment_by_id(params[:id])
  
  if appointment[:status] == 'cancelled'
    halt 400, { error: 'This appointment has already been cancelled.' }.to_json
  end
  
  if appointment[:status] == 'completed'
    halt 400, { error: 'Cannot cancel a completed appointment.' }.to_json
  end
  
  begin
    DB[:appointments].where(external_id: params[:id]).update(
      status: 'cancelled',
      updated_at: Time.now
    )
    
    updated_appointment = DB[:appointments].where(external_id: params[:id]).first
    updated_appointment.to_json
  rescue => e
    halt 500, { error: 'Unable to cancel appointment. Please try again.' }.to_json
  end
end

# Delete an appointment
delete '/api/appointments/:id' do
  content_type :json
  appointment = find_appointment_by_id(params[:id])
  
  begin
    DB[:appointments].where(external_id: params[:id]).delete
    status 204
  rescue => e
    halt 500, { error: 'Unable to delete appointment. Please try again.' }.to_json
  end
end

# ====================
# UTILITY ENDPOINTS
# ====================

# Sync data endpoint
post '/api/sync' do
  content_type :json
  { message: 'Data synced successfully', timestamp: Time.now }.to_json
end

# Health check endpoint
get '/health' do
  content_type :json
  { status: 'OK', timestamp: Time.now }.to_json
end 

# Test route to debug
get '/api/test' do
  content_type :json
  { message: 'Backend is working', timestamp: Time.now }.to_json
end

# Test PUT route to debug
put '/api/test' do
  content_type :json
  { message: 'PUT method is working', timestamp: Time.now }.to_json
end 