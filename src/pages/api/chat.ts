import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // Diagnosticar todas las variables de entorno
  console.log("=== ENVIRONMENT VARIABLES DEBUG ===");
  console.log("VERCEL_URL:", process.env.VERCEL_URL);
  console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
  
  // Mostrar todas las variables que empiecen con API
  
  // Mostrar las primeras letras de todas las variables de entorno
  console.log("Todas las variables de entorno disponibles:");
  Object.keys(process.env).forEach(key => {
    console.log(`${key}: ${process.env[key] ? '[SET]' : '[EMPTY]'}`);
  });
  
  const apiKey = process.env.API_KEY;
  console.log("API_KEY exists:", !!apiKey);
  console.log("API_KEY value (first 10 chars):", apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
  console.log("API_KEY length:", apiKey?.length || 0);
  console.log("=== END DEBUG ===");
  
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // En Astro API routes con output: 'server', usar process.env

    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);

    if (!apiKey) {
      console.error('API_KEY not found in environment variables');
      return new Response(JSON.stringify({
        error: 'API key not configured',
        reply: 'Error de configuración del servidor.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //console.log('Sending request to OpenRouter API with message:', message.substring(0, 50) + '...');

    const requestBody = {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    //console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4321',
        'X-Title': 'AI Chatbot',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error status:', response.status);
      console.error('OpenRouter API error data:', errorData);

      return new Response(JSON.stringify({
        error: `API request failed: ${response.status}`,
        reply: 'Lo siento, hubo un problema con el servicio de IA. Por favor, intenta de nuevo.',
        details: errorData
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const responseText = await response.text();
    console.log('OpenRouter raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenRouter response as JSON:', parseError);
      return new Response(JSON.stringify({
        error: 'Invalid response from AI service',
        reply: 'Lo siento, hubo un problema al procesar la respuesta. Por favor, intenta de nuevo.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //console.log('Parsed OpenRouter response:', data);

    const reply = data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({
      error: 'Error interno del servidor',
      reply: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
