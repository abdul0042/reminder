import React, { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Mic, MicOff, X, Check, Loader2, Volume2, ArrowRight } from 'lucide-react';
import { playAlarmSound } from '../utils/playAlarmSound';

// Sleek minimalist Audio Waveform AI Voice Emblem
function AIVoiceIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M17 7v10" />
      <path d="M7 7v10" />
      <path d="M22 11v2" />
      <path d="M2 11v2" />
    </svg>
  );
}

export default function AIVoiceModal({ isOpen, onClose }) {
  const { addSubscription, addGeneralReminder, showToast } = useSubscriptions();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        reco.onerror = (err) => {
          console.warn('Speech recognition error:', err.error);
          setIsListening(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognition) {
      showToast('Speech recognition is not supported on this browser. Try Chrome/Edge!', 'error');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setParsedResult(null);
      recognition.start();
      setIsListening(true);
    }
  };

  const parseVoiceClientFallback = (text) => {
    const tLower = text.toLowerCase();
    const isGeneral = tLower.includes('remind me') || tLower.includes('signature') || tLower.includes('buy') || tLower.includes('task') || (!tLower.includes('bill') && !tLower.includes('rupees') && !tLower.includes('₹'));

    if (isGeneral) {
      const cleanTitle = text.replace(/^remind me to/i, '').replace(/^remind me/i, '').trim();
      return {
        type: 'general_reminder',
        action: 'add_general_reminder',
        title: cleanTitle ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : text,
        minutes: 15,
        note: 'Added via AI Voice Assistant'
      };
    }

    const priceMatch = tLower.match(/(?:value|price|cost|is|for|of)?\s*(?:₹|\$|rs\.?|rupees)?\s*(\d+(?:\.\d+)?)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 100;

    let serviceName = 'Subscription';
    const knownServices = ['spotify', 'netflix', 'youtube', 'chatgpt', 'amazon', 'adobe', 'apple', 'jio', 'airtel', 'vi', 'figma', 'github', 'hotstar', 'disney'];
    for (const s of knownServices) {
      if (tLower.includes(s)) {
        serviceName = s.charAt(0).toUpperCase() + s.slice(1);
        break;
      }
    }

    let days = 30;
    const daysMatch = tLower.match(/(\d+)\s*(?:days|day)/);
    if (daysMatch) {
      days = parseInt(daysMatch[1], 10);
    }

    let billingCycle = 'monthly';
    if (tLower.includes('year') || days > 180) billingCycle = 'yearly';
    else if (tLower.includes('week') || days <= 7) billingCycle = 'weekly';

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);

    return {
      type: 'subscription',
      action: 'add_subscription',
      serviceName,
      price,
      billingCycle,
      days,
      nextBillingDate: nextDate.toISOString().split('T')[0],
      category: serviceName.toLowerCase().includes('spotify') ? 'Music' : 'Entertainment',
      planType: 'Standard'
    };
  };

  const handleProcessTranscript = async (textToProcess) => {
    const text = textToProcess || transcript;
    if (!text) return;

    setIsProcessing(true);
    const storedKey = localStorage.getItem('unsub_groq_api_key') || '';

    try {
      let res = await fetch('/api/ai/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, apiKey: storedKey })
      });

      if (!res.ok) {
        res = await fetch('http://localhost:5000/api/ai/parse-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: text, apiKey: storedKey })
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setParsedResult(data.data);
          playAlarmSound();
          return;
        }
      }

      const fallbackData = parseVoiceClientFallback(text);
      setParsedResult(fallbackData);
      playAlarmSound();

    } catch (err) {
      const fallbackData = parseVoiceClientFallback(text);
      setParsedResult(fallbackData);
      playAlarmSound();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!parsedResult) return;

    if (parsedResult.type === 'general_reminder' || parsedResult.action === 'add_general_reminder') {
      addGeneralReminder(
        parsedResult.title || 'General Task',
        parsedResult.minutes || 15,
        parsedResult.note || ''
      );
      setParsedResult(null);
      setTranscript('');
      onClose();
      return;
    }

    const nextDate = parsedResult.nextBillingDate || new Date().toISOString().split('T')[0];

    const success = await addSubscription({
      serviceName: parsedResult.serviceName || 'Subscription',
      price: parsedResult.price || 100,
      currency: 'INR',
      billingCycle: parsedResult.billingCycle || 'monthly',
      nextBillingDate: nextDate,
      category: parsedResult.category || 'Entertainment',
      planType: parsedResult.planType || 'Standard',
      notes: 'Added via AI Voice Assistant'
    });

    if (success) {
      setParsedResult(null);
      setTranscript('');
      onClose();
    }
  };

  const sampleCommands = [
    "Remind me to get a signature from them",
    "Remind me to call John in 10 minutes",
    "Add a bill of Spotify for ₹100 for 30 days",
    "Add Netflix ₹649 starting today"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#EBE6DD] dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-2xl p-6 text-[#1C1917] dark:text-[#F5F5F3] space-y-5 animate-in slide-in-from-bottom-8 duration-300 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E2DDD4] dark:bg-[#24221E] text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-center hover:bg-[#D5CFC5] dark:hover:bg-[#2D2A25] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="p-2 rounded-2xl bg-[#DF4F38] text-white shadow-sm">
            <AIVoiceIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">
              AI Voice Assistant
            </h2>
            <p className="text-xs font-bold text-[#78746D] dark:text-[#A8A29E]">
              Speak naturally for bills OR general reminders!
            </p>
          </div>
        </div>

        {/* Mic Pulse Button */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {isListening && (
              <div className="w-24 h-24 rounded-full bg-[#DF4F38]/20 absolute -inset-2 animate-ping" />
            )}
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all touch-shrink shadow-xl relative z-10 ${
                isListening 
                  ? 'bg-[#DF4F38] text-white ring-4 ring-[#DF4F38]/30 scale-105' 
                  : 'bg-[#1C1917] dark:bg-white text-white dark:text-[#1C1917] hover:scale-105'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-pulse stroke-[2.5]" />
              ) : (
                <MicOff className="w-8 h-8 stroke-[2.5]" />
              )}
            </button>
          </div>

          <p className="text-xs font-extrabold text-center text-[#78746D] dark:text-[#A8A29E]">
            {isListening ? 'Listening... Speak your command out loud!' : 'Tap mic button to speak out loud'}
          </p>
        </div>

        {/* Live Transcript Box */}
        {transcript && (
          <div className="p-4 rounded-[22px] bg-white dark:bg-[#1A1918] border border-black/5 dark:border-white/10 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#78746D] dark:text-[#A8A29E] flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-[#DF4F38]" /> Speech Heard:
            </span>
            <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3] leading-relaxed italic">
              "{transcript}"
            </p>

            {!parsedResult && (
              <button
                onClick={() => handleProcessTranscript(transcript)}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-[#DF4F38] text-white font-extrabold text-xs flex items-center justify-center gap-2 mt-2 shadow-sm transition-all touch-shrink"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Parsing with Groq AI...</span>
                  </>
                ) : (
                  <>
                    <AIVoiceIcon className="w-4 h-4" />
                    <span>Parse with AI Assistant</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* AI Parsed Results Card */}
        {parsedResult && (
          <div className="p-4 rounded-[22px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Check className="w-4 h-4" /> AI Parsed Details:
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 uppercase">
                {parsedResult.type === 'general_reminder' ? 'General Reminder' : 'Subscription'}
              </span>
            </div>

            {parsedResult.type === 'general_reminder' ? (
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A1918] space-y-1">
                <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] block">Task Title</span>
                <span className="font-extrabold text-sm text-[#1C1917] dark:text-[#F5F5F3] block">
                  {parsedResult.title}
                </span>
                <span className="text-xs font-semibold text-[#DF4F38]">
                  Alert set for {parsedResult.minutes || 15} mins
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#1C1917] dark:text-[#F5F5F3]">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1918]">
                  <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] block">Service</span>
                  <span className="font-extrabold text-sm">{parsedResult.serviceName}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1918]">
                  <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] block">Price</span>
                  <span className="font-extrabold text-sm text-[#DF4F38]">₹{parsedResult.price}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1918]">
                  <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] block">Cycle</span>
                  <span className="capitalize">{parsedResult.billingCycle || 'monthly'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1918]">
                  <span className="text-[10px] text-[#78746D] dark:text-[#A8A29E] block">Category</span>
                  <span>{parsedResult.category || 'Music'}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmAdd}
              className="w-full py-3 rounded-[16px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all touch-shrink"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm & Add to UnSub</span>
            </button>
          </div>
        )}

        {/* Quick Sample Command Presets */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-extrabold text-[#78746D] dark:text-[#A8A29E] block">
            Tap a sample command to test out-loud:
          </span>
          <div className="space-y-1.5">
            {sampleCommands.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(sample);
                  handleProcessTranscript(sample);
                }}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1A1918] hover:bg-[#E2DDD4] dark:hover:bg-[#252320] border border-black/5 dark:border-white/5 text-left text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F3] flex items-center justify-between group transition-all"
              >
                <span className="truncate pr-2">"{sample}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DF4F38] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
