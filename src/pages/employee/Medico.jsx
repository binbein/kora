import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Send, Clock, Shield } from 'lucide-react';

const initialMessages = [
  {
    role: 'system',
    text: 'Benvenuta nel servizio medico virtuale Kora. Sono il Dr. Andrea Fontana. Come posso aiutarti oggi?',
  },
];

const autoReplies = {
  default: 'Capisco. Potrebbe descrivermi meglio i sintomi? Da quanto tempo li avverte?',
  schiena: 'Mi dispiace per il dolore. Ti faccio alcune domande per capire meglio. Il dolore scende lungo la gamba? Hai febbre o formicolii?',
  testa: 'Il mal di testa può avere diverse cause. È localizzato o diffuso? Prende farmaci attualmente?',
  stress: 'Lo stress può manifestarsi in molti modi. Le consiglierei di prenotare una sessione con uno psicologo dalla sezione dedicata. Nel frattempo, posso aiutarla con i sintomi fisici.',
  sonno: 'I disturbi del sonno sono molto comuni. Da quanto tempo ha difficoltà? Si sveglia durante la notte o fa fatica ad addormentarsi?',
};

export default function Medico() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const lower = input.toLowerCase();
    let reply = autoReplies.default;
    for (const [key, val] of Object.entries(autoReplies)) {
      if (key !== 'default' && lower.includes(key)) {
        reply = val;
        break;
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'system', text: reply }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Medico Virtuale</h1>
          <p className="text-sm text-muted-foreground mt-1">Consulta un medico online.</p>
        </div>
        <Badge className="bg-secondary/10 text-secondary">
          <Clock className="w-3 h-3 mr-1" /> Risposta entro 4h (Plus)
        </Badge>
      </div>

      <Card className="flex flex-col h-[calc(100vh-280px)] lg:h-[calc(100vh-220px)]">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Dr. Andrea Fontana</p>
            <p className="text-xs text-muted-foreground">Medico virtuale · Online</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-secondary font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-secondary text-white rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground">
                Il medico sta scrivendo...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descrivi i tuoi sintomi..."
            className="flex-1"
          />
          <Button type="submit" className="bg-secondary hover:bg-secondary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 mt-0.5 text-secondary flex-shrink-0" />
        <span>Le conversazioni sono private e protette. La tua azienda non accede mai a queste informazioni.</span>
      </div>
    </div>
  );
}