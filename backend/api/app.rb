require 'json'

Handler = Proc.new do |req, res|
  res.status = 200
  res['Content-Type'] = 'application/json'
  res.body = {
    message: 'Backend is working!',
    path: req.path,
    method: req.request_method,
    time: Time.now
  }.to_json
end 