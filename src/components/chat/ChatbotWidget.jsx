import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { createNewSession, sendMessage } from '../../services/chatbotService';

const SESSION_EXPIRY_TIME = 30 * 60 * 1000; // 30 phút

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const messagesEndRef = useRef(null);
    const sessionTimeoutRef = useRef(null);

    const clearSession = () => {
        setSessionId(null);
        setMessages([]);
        setTimeLeft(null);
        if (sessionTimeoutRef.current) {
            clearTimeout(sessionTimeoutRef.current);
            sessionTimeoutRef.current = null;
        }
        localStorage.removeItem('chatbotSession');
    };

    const initializeSession = async () => {
        try {
            const session = await createNewSession();
            setSessionId(session.sessionId);
            if (session.messages) {
                setMessages(session.messages);
            }
            const expiryTime = Date.now() + SESSION_EXPIRY_TIME;
            localStorage.setItem('chatbotSession', JSON.stringify({ sessionId: session.sessionId, expiryTime }));
            sessionTimeoutRef.current = setTimeout(clearSession, SESSION_EXPIRY_TIME);
        } catch (error) {
            console.error('Error initializing chat session:', error);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('chatbotSession');
        if (saved) {
            const { sessionId: savedId, expiryTime } = JSON.parse(saved);
            if (Date.now() < expiryTime) {
                setSessionId(savedId);
                const remaining = expiryTime - Date.now();
                sessionTimeoutRef.current = setTimeout(clearSession, remaining);
            } else {
                localStorage.removeItem('chatbotSession');
            }
        }

        return () => {
            if (sessionTimeoutRef.current) {
                clearTimeout(sessionTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const setupSessionIfNeeded = async () => {
            if (isOpen && !sessionId) {
                await initializeSession();
            }
        };
        setupSessionIfNeeded();
    }, [isOpen, sessionId]);

    // Cập nhật thời gian còn lại mỗi giây
    useEffect(() => {
        let intervalId;

        const updateTimeLeft = () => {
            const saved = localStorage.getItem('chatbotSession');
            if (!saved) {
                setTimeLeft(null);
                return;
            }

            const { expiryTime } = JSON.parse(saved);
            const remaining = Math.max(0, expiryTime - Date.now());
            setTimeLeft(remaining);
        };

        if (sessionId) {
            updateTimeLeft(); // cập nhật lần đầu
            intervalId = setInterval(updateTimeLeft, 1000);
        }

        return () => clearInterval(intervalId);
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTimeLeft = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        if (!sessionId) {
            await initializeSession();
        }

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await sendMessage(sessionId, inputMessage);
            const botMessage = {
                role: 'model',
                content: response.response,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response?.status === 401) {
                clearSession();
                await initializeSession();
            }
            const errorMessage = {
                role: 'model',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#0078E8] text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
                {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="bg-[#0078E8] text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <FaRobot className="mr-2" />
                            <h3 className="font-semibold">Assistant</h3>
                        </div>
                        {sessionId && timeLeft !== null && (
                            <span className="text-xs bg-opacity-20 px-2 py-1 rounded">
                                Làm mới sau: {formatTimeLeft(timeLeft)}
                            </span>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                        ? 'bg-[#0078E8] text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-[#0078E8]"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-[#0078E8] text-white p-2 rounded-lg disabled:opacity-50"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
