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

def validate_required_fields(data, fields)
  missing_fields = fields.select { |field| data[field].nil? || data[field].to_s.strip.empty? }
  return if missing_fields.empty?
  
  halt 400, { error: "Please fill in all required fields: #{missing_fields.join(', ')}" }.to_json
end

def validate_email(email)
  email_regex = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  halt 400, { error: 'Please enter a valid email address.' }.to_json unless email.match?(email_regex)
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

def generate_external_id
  "#{Time.now.to_i}-#{rand(10000..99999)}"
end

# Get all clients
get '/api/clients' do
  content_type :json
  clients = DB[:clients].all
  clients.to_json
end

# Create a new appointment (simplified version)
post '/api/appointments' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  puts "📝 Creating appointment with data: #{data.inspect}"
  
  validate_required_fields(data, ['client_id', 'time'])
  
  # Validate client exists
  client = DB[:clients].where(external_id: data['client_id']).first
  halt 404, { error: 'Client not found.' }.to_json unless client
  
  # Validate and parse appointment time
  appointment_time = validate_appointment_time(data['time'])
  
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
    puts "✅ Appointment created successfully: #{appointment.inspect}"
    status 201
    appointment.to_json
  rescue => e
    puts "💥 Error creating appointment: #{e.message}"
    halt 500, { error: 'Unable to create appointment. Please try again.' }.to_json
  end
end

# Create appointment with new client (atomic operation)
post '/api/appointments/with_new_client' do
  content_type :json
  data = JSON.parse(request.body.read)
  
  puts "📝 Creating appointment with new client: #{data.inspect}"
  
  validate_required_fields(data, ['name', 'email', 'time'])
  validate_email(data['email'])
  
  appointment_time = validate_appointment_time(data['time'])
  client_external_id = generate_external_id
  appointment_external_id = generate_external_id
  
  begin
    DB.transaction do
      # Create client
      client_id = DB[:clients].insert(
        external_id: client_external_id,
        name: data['name'].strip,
        email: data['email'].strip.downcase,
        phone: data['phone']&.strip,
        created_at: Time.now,
        updated_at: Time.now
      )
      
      # Create appointment
      appointment_id = DB[:appointments].insert(
        external_id: appointment_external_id,
        client_id: client_external_id,
        appointment_time: appointment_time,
        status: 'scheduled',
        created_at: Time.now,
        updated_at: Time.now
      )
      
      # Return appointment with client details
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
        
      puts "✅ Appointment with new client created: #{appointment_with_client.inspect}"
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
    puts "💥 Error creating appointment with new client: #{e.message}"
    halt 500, { error: 'Unable to create appointment and client. Please try again.' }.to_json
  end
end

# Health check
get '/health' do
  content_type :json
  { status: 'OK', timestamp: Time.now }.to_json
end

puts "🚀 Simple server starting on port 4567..." 