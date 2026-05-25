// functions/api/groq.js
export async function onRequest(context) {
    // API key dari Environment Variable Cloudflare
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    if (context.request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }
    
    const body = await context.request.json();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    return new Response(JSON.stringify(await response.json()), {
        headers: { 'Content-Type': 'application/json' }
    });
}
