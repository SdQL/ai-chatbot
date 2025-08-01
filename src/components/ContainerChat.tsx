import { useState, useRef, useEffect } from "react";
import SendIcon from "./Icons/SendIcon";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

// Tipo para los mensajes
type MessageType = {
  text: string;
  sender: "user" | "assistant";
};

const ContainerChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 1. Mostrar mensaje del usuario
    const userMessage = { text: inputValue, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 2. Fetch a la API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      // 3. Mostrar respuesta del bot
      const botMessage = {
        text: data.reply || data.error || "No se pudo obtener respuesta",
        sender: "assistant" as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error en el chat:", error);
      const errorMessage = {
        text: "Hubo un error al conectar con el servidor 😓",
        sender: "assistant" as const,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-2rem)] lg:h-[670px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-none lg:rounded-3xl shadow-2xl border-0 lg:border border-gray-700 backdrop-blur-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs lg:text-sm">
                AI
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 bg-green-500 rounded-full border-2 border-gray-800 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-white font-semibold text-base lg:text-lg">
              SimpleAI Chat
            </h2>
            <p className="text-gray-400 text-xs lg:text-sm">
              {isLoading ? "Escribiendo..." : "En línea"}
            </p>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent scrollable">
        {messages.length === 0 && (
          <div className="text-center py-8 lg:py-12 animate-fade-in">
            <div className="w-12 lg:w-16 h-12 lg:h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">
                AI
              </span>
            </div>
            <h3 className="text-gray-300 text-base lg:text-lg font-medium mb-2">
              ¡Hola! Soy SimpleAI
            </h3>
            <p className="text-gray-500 text-sm max-w-sm lg:max-w-md mx-auto px-4">
              Puedo ayudarte con preguntas, análisis, programación y mucho más.
              ¿En qué puedo asistirte hoy?
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} sender={msg.sender} />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center space-x-3 bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
              <TypingIndicator />
              <span className="text-gray-400 text-sm">Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-600">
        <div className="flex items-end space-x-2 lg:space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              disabled={isLoading}
              className="w-full bg-gray-900 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-sm lg:text-base"
              placeholder={
                isLoading
                  ? "SimpleAI está escribiendo..."
                  : "Escribe tu mensaje aquí..."
              }
              autoComplete="off"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            <SendIcon className="w-4 lg:w-5 h-4 lg:h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span className="hidden sm:block">Presiona Enter para enviar</span>
          <span className="ml-auto">{inputValue.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ContainerChat;
