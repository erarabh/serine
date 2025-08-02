'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { ui } from '@/lib/i18n';
import ToggleVoice from '@/components/ToggleVoice';
import LangSelector from '@/components/LangSelector';
import { isVoiceAllowed } from '@/utils/planCheck';
import { useAgent } from '@/lib/AgentContext';

interface Props {
  userPlan?: string;
  userId?: string;
}

type ChatMessage = {
  sender: 'user' | 'bot';
  text: string;
  sessionId?: string;
};

export default function ChatWidget({ userPlan = 'pro', userId }: Props) {
  const { lang } = useLanguage();
  const { selectedAgent } = useAgent();
  const t = ui[lang] || ui['en'];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    if (!userId || !selectedAgent?.id) return;
    setMessages([]);
    fetch(`/api/sessions?userId=${userId}&agentId=${selectedAgent.id}`)
      .then(r => r.json())
      .then(json => {
        if (json.data) {
          setMessages(
            json.data.map((s: any) => ({
              sender: s.role === 'user' ? 'user' : 'bot',
              text:   s.message
            }))
          );
        }
      })
      .catch(console.error);
  }, [userId, selectedAgent]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice setup
  useEffect(() => {
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const spoken = e.results[0][0].transcript;
      setInput(spoken);
      setTimeout(() => sendMessage(spoken), 500);
    };
    rec.onend = () => { rec.started = false; };
    recognitionRef.current = rec;
  }, [lang, voiceEnabled, selectedAgent, userId]);

  // Send a message
  const sendMessage = async (msg: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);
    try {
      // 1) Call Next.js proxy
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          agentId: selectedAgent?.id,
          message: msg
        })
      });
      const { reply, sessionId } = await res.json();

      // 2) Append the bot reply
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: reply, sessionId }
      ]);

      // 3) Optionally speak it
      if (voiceEnabled) {
        const u = new SpeechSynthesisUtterance(reply);
        u.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
        speechSynthesis.speak(u);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: t.serverError || '⚠️ Server error.' }
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput('');
  };

  const startVoice = () => {
    const rec = recognitionRef.current;
    if (rec && !rec.started) {
      try { rec.start(); rec.started = true }
      catch { console.warn('Voice start error') }
    }
  };

  // Find last bot message with a sessionId
  const lastBot = [...messages]
    .reverse()
    .find(m => m.sender === 'bot' && m.sessionId);

  // Send thumbs feedback
  const sendFeedback = async (sessionId: string, feedback: 'positive' | 'negative') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          agentId: selectedAgent?.id,
          sessionId,
          feedback
        })
      });
    } catch (err) {
      console.error('Feedback error', err);
    }
  };

  return (
    <div className="flex flex-col h-full p-2 space-y-2">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto space-y-2 border rounded p-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className={`text-sm whitespace-pre-wrap ${
              msg.sender === 'bot' ? 'text-gray-800' : 'text-black'
            } ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {msg.sender === 'user' ? msg.text : `🤖: ${msg.text}`}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input + controls */}
      <div className="border-t pt-2 bg-white">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={2}
          placeholder={t.inputPlaceholder || 'Type a message'}
          className="w-full border px-3 py-2 rounded resize-none text-black"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="flex items-center gap-2 mt-2">
          {isVoiceAllowed(userPlan) && (
            <button
              onClick={startVoice}
              className="px-3 py-2 bg-gray-100 text-purple-600 rounded hover:bg-gray-200"
            >🎤</button>
          )}
          {isVoiceAllowed(userPlan) && (
            <ToggleVoice enabled={voiceEnabled} onToggle={setVoiceEnabled} />
          )}
          {lastBot?.sessionId && (
            <div className="flex flex-col items-center space-y-1 mx-1">
              <button onClick={() => sendFeedback(lastBot.sessionId!, 'positive')} className="hover:text-green-600">👍</button>
              <button onClick={() => sendFeedback(lastBot.sessionId!, 'negative')} className="hover:text-red-600">👎</button>
            </div>
          )}
          <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >{t.send || 'Send'}</button>
          <LangSelector small />
        </div>
      </div>
    </div>
  );
}
