require 'json'

def handler(event:, context:)
  {
    statusCode: 200,
    headers: {
      'Content-Type' => 'application/json',
      'Access-Control-Allow-Origin' => '*'
    },
    body: JSON.generate({
      message: 'Backend is working!',
      time: Time.now.to_s
    })
  }
end 