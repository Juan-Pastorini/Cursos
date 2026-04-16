'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, X, RotateCcw } from 'lucide-react';

interface Mensaje {
    id: string;
    texto: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot() {
    const [mensajes, setMensajes] = useState<Mensaje[]>([
        {
            id: '1',
            texto: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte con el curso hoy?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensajes, typing]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Mensaje = {
            id: Date.now().toString(),
            texto: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMensajes(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Simulamos respuesta del bot
        setTimeout(() => {
            const botResponse = getBotResponse(input);
            const botMsg: Mensaje = {
                id: (Date.now() + 1).toString(),
                texto: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMensajes(prev => [...prev, botMsg]);
            setTyping(false);
        }, 1500);
    };

    const getBotResponse = (query: string): string => {
        const q = query.toLowerCase();

        if (q.includes('error') || q.includes('problema') || q.includes('falla') || q.includes('no anda') || q.includes('no funciona')) {
            return 'Entendido. Por favor, intenta recargar la página (F5). Si el error persiste, descríbelo aquí y te derivaré ahora mismo con un técnico de soporte humano.';
        }

        if (q.includes('examen') || q.includes('prueba') || q.includes('test')) {
            return 'Los exámenes se activan automáticamente al completar el 100% de las lecciones del módulo actual. Revisa que todas tengan el check de completado.';
        }

        if (q.includes('certificado') || q.includes('diploma')) {
            return 'Obtendrás tu certificado apenas termines el curso. Podrás descargarlo directamente desde tu perfil en la sección de "Logros".';
        }

        if (q.includes('pago') || q.includes('comprar') || q.includes('precio')) {
            return 'Para dudas sobre pagos o facturación, te voy a derivar directamente con nuestro equipo administrativo para que lo resuelvan de inmediato.';
        }

        if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes')) {
            return '¡Hola! Soy tu asistente de ayuda rápida. ¿En qué problema puntual puedo asistirte hoy?';
        }

        if (q.includes('gracias') || q.includes('chau') || q.includes('adios')) {
            return '¡De nada! Aquí estaré si surge cualquier otro inconveniente. ¡A seguir aprendiendo!';
        }

        // Respuesta por defecto si no entiende (Derivación directa)
        return 'No estoy seguro de cómo resolver esa duda específica. Para no hacerte perder tiempo, voy a derivar esta conversación con una persona del equipo a cargo. Aguarda un momento, por favor.';
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700/50">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm tracking-tight text-white">Asistente IA</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                            <span className="text-[9px] font-bold text-violet-100 uppercase tracking-widest">En línea</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setMensajes([mensajes[0]])}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-violet-100"
                    title="Reiniciar chat"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900/50">
                {mensajes.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.sender === 'bot' ? 'bg-violet-600 shadow-lg shadow-violet-900/20' : 'bg-slate-700'
                                }`}>
                                {msg.sender === 'bot' ? <Sparkles size={14} /> : <User size={14} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
                                }`}>
                                {msg.texto}
                                <span className="block text-[8px] mt-2 opacity-40 font-bold uppercase tracking-widest">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {typing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <Sparkles size={14} />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700/50">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-800/50 border-t border-slate-700/50">
                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu problema aquí..."
                        className="flex-grow bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-violet-500 transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || typing}
                        className="w-12 h-12 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-900/20 active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-[9px] text-center text-slate-500 mt-4 font-bold uppercase tracking-widest">
                    Desarrollado con IA avanzada para tu soporte
                </p>
            </div>
        </div>
    );
}
