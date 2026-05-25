// functions/api/groq.js
export async function onRequest(context) {
    // Ambil API key dari Environment Variable Cloudflare
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    // Cek apakah API key sudah diset
    if (!GROQ_API_KEY) {
        return new Response(
            JSON.stringify({ error: 'GROQ_API_KEY not configured. Silakan set Environment Variable di Cloudflare.' }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    // Hanya menerima method POST
    if (context.request.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed. Gunakan POST.' }),
            { 
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    try {
        // Baca request dari frontend
        const body = await context.request.json();
        
        // Panggil Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: body.messages || [{ role: 'user', content: 'Halo' }],
                temperature: 0.7
            })
        });
        
        // Ambil respons dari Groq
        const data = await response.json();
        
        // Kirim balik ke frontend
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
