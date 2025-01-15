import { serve } from "https://deno.fresh.run/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Generate WhatsApp QR function started")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { instanceName } = await req.json()
    console.log('Generating QR for instance:', instanceName)

    // Logic to generate QR code for the WhatsApp instance
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(instanceName)}&size=200x200`;
    
    return new Response(JSON.stringify({ success: true, qrCodeUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
