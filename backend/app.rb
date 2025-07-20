#!/usr/bin/env ruby
# frozen_string_literal: true

require 'sinatra'
require 'json'
require 'sequel'
require 'pg'

before do
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
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
    String :email, null: false
    String :phone
    DateTime :created_at, default: Sequel::CURRENT_TIMESTAMP
    DateTime :updated_at, default: Sequel::CURRENT_TIMESTAMP
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

clients = DB[:clients]
appointments = DB[:appointments]

get '/' do
  content_type :json
  { message: 'Virtual Wellness Platform API', version: '1.0.0' }.to_json
end

get '/health' do
  content_type :json
  { status: 'OK', timestamp: Time.now }.to_json
end

get '/api/clients' do
  content_type :json
  clients.all.to_json
end

post '/api/clients' do
  content_type :json
  
  begin
    data = JSON.parse(request.body.read)
    
    unless data['name'] && data['email']
      status 400
      return { error: 'Missing required fields: name and email' }.to_json
    end
    
    if clients.where(email: data['email']).first
      status 409
      return { error: 'Client with this email already exists' }.to_json
    end
    
    max_id = clients.select(:external_id).map { |c| c[:external_id].to_i }.max || 0
    new_id = clients.insert(
      external_id: (max_id + 1).to_s,
      name: data['name'],
      email: data['email'],
      phone: data['phone']
    )
    
    status 201
    clients.where(id: new_id).first.to_json
    
  rescue JSON::ParserError => e
    status 400
    { error: "Invalid JSON: #{e.message}" }.to_json
  rescue => e
    status 500
    { error: "Internal server error: #{e.message}" }.to_json
  end
end

get '/api/appointments' do
  content_type :json
  appointments.all.to_json
end

get '/api/appointments/with_clients' do
  content_type :json
  
  DB["SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone 
      FROM appointments a 
      JOIN clients c ON a.client_id = c.external_id 
      ORDER BY a.appointment_time"].all.to_json
end

post '/api/appointments' do
  content_type :json
  
  begin
    data = JSON.parse(request.body.read)
    
    unless data['client_id'] && data['time']
      status 400
      return { error: 'Missing required fields: client_id and time' }.to_json
    end
    
    appointment_time = DateTime.parse(data['time'])
    if appointment_time <= DateTime.now
      status 400
      return { error: 'Appointment time must be in the future' }.to_json
    end
    
    unless clients.where(external_id: data['client_id']).first
      status 400
      return { error: 'Client not found' }.to_json
    end
    
    max_id = appointments.select(:external_id).map { |a| a[:external_id].to_i }.max || 0
    new_id = appointments.insert(
      external_id: (max_id + 1).to_s,
      client_id: data['client_id'],
      appointment_time: appointment_time
    )
    
    status 201
    appointments.where(id: new_id).first.to_json
    
  rescue JSON::ParserError => e
    status 400
    { error: "Invalid JSON: #{e.message}" }.to_json
  rescue => e
    status 500
    { error: "Internal server error: #{e.message}" }.to_json
  end
end

post '/api/sync' do
  content_type :json
  { message: 'Sync completed successfully' }.to_json
end 