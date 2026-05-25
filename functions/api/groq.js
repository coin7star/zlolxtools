// functions/api/groq.js
export async function onRequest(context) {
    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        return new Response(
            JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    if (context.request.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    try {
        const body = await context.request.json();
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: body.messages || [{ role: 'user', content: body.content || 'Halo' }],
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
