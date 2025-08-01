import React, { useState, useEffect } from 'react';

const ResponsiveSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar sidebar al cambiar a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Botón de hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800/90 hover:bg-gray-700 p-3 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen z-50 
          w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
          text-white p-6 border-r border-gray-700 backdrop-blur-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex w-full justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">SimpleChat</h2>
              <p className="text-xs text-gray-400">AI Assistant</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="mb-8">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold text-white">Nuevo Chat</span>
          </button>
        </div>

        {/* Conversations */}
        <nav className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Conversaciones</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">4</span>
            <span className="text-xs text-gray-500 px-2 py-1 ">En desarollo</span>
          </div>
          
          <ul className="space-y-2">
            {Array.from({ length: 1 }).map((_, i) => (
              <li key={i} className="group">
                <div className="group flex items-center justify-between rounded-xl hover:bg-gray-700/50 transition-all duration-200 px-3 py-2 cursor-pointer border border-transparent hover:border-gray-600">
                  <a
                    href="#"
                    className="flex items-center gap-3 flex-1 text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium truncate">JavaScript + React! </span>
                  </a>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <button className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-red-600/20 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Info */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">DeepSeek AI</p>
              <p className="text-xs text-gray-500">Conectado</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ResponsiveSideBar;
