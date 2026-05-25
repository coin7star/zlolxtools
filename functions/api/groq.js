// functions/api/groq.js
// Endpoint proxy untuk panggil Groq API (API key tersimpan di ENV Cloudflare)

export async function onRequest(context) {
    // Ambil API key dari Environment Variable (sudah kamu set di dashboard)
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    // Cek apakah API key sudah di-set
    if (!GROQ_API_KEY) {
        return new Response(
            JSON.stringify({ error: 'GROQ_API_KEY not configured. Please set it in Cloudflare Environment Variables.' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    // Hanya terima method POST
    if (context.request.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed. Use POST.' }),
            { 
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    try {
        // Ambil body dari request frontend
        const body = await context.request.json();
        
        // Panggil Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        // Ambil respons dari Groq
        const data = await response.json();
        
        // Kirim balik ke frontend
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        // Jika terjadi error
        return new Response(
            JSON.stringify({ error: error.message }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
