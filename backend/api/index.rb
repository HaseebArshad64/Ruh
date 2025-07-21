require 'json'
require 'sequel'

def handler(event:, context:)
  headers = {
    'Content-Type' => 'application/json',
    'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' => 'Content-Type'
  }

  # Handle OPTIONS request
  if event['httpMethod'] == 'OPTIONS'
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    }
  end

  begin
    # Connect to database using environment variable
    db = Sequel.connect(ENV['DATABASE_URL'])
    
    case event['path']
    when '/api/test'
      {
        statusCode: 200,
        headers: headers,
        body: JSON.generate({
          message: 'Backend is working!',
          time: Time.now.to_s
        })
      }
    when '/api/clients'
      clients = db[:clients].all
      {
        statusCode: 200,
        headers: headers,
        body: JSON.generate(clients)
      }
    when '/api/appointments'
      appointments = db[:appointments]
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
      {
        statusCode: 200,
        headers: headers,
        body: JSON.generate(appointments)
      }
    else
      {
        statusCode: 404,
        headers: headers,
        body: JSON.generate({ error: 'Not Found', path: event['path'] })
      }
    end
  rescue => e
    {
      statusCode: 500,
      headers: headers,
      body: JSON.generate({ error: e.message })
    }
  ensure
    db.disconnect if db
  end
end 