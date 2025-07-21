require 'json'
require 'sequel'

Handler = Proc.new do |req, res|
  # Set CORS headers
  res['Access-Control-Allow-Origin'] = '*'
  res['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  res['Access-Control-Allow-Headers'] = 'Content-Type'
  res['Content-Type'] = 'application/json'

  # Handle OPTIONS
  if req.request_method == 'OPTIONS'
    res.status = 200
    return
  end

  # Connect to database
  db = Sequel.connect('postgresql://neondb_owner:npg_UZtDCEB5Llj6@ep-gentle-cherry-aeh1a67u-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')

  begin
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
    res.status = 200
    res.body = appointments.to_json
  rescue => e
    res.status = 500
    res.body = { error: e.message }.to_json
  ensure
    db.disconnect if db
  end
end 