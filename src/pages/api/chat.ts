import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // En Astro API routes con output: 'server', usar process.env
    const apiKey = process.env.API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('API_KEY not found in environment variables');
      console.error('Available env vars starting with API:', 
        Object.keys(process.env).filter(key => key.startsWith('API'))
      );
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        reply: 'Error de configuración del servidor. Por favor, contacta al administrador.'
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
        'HTTP-Referer': 'http://localhost:4321',
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
