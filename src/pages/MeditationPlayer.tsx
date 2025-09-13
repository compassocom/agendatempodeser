import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Meditation } from '@/entities';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Loader2, Play, Pause, RefreshCw, Volume2, VolumeX } from 'lucide-react';

export default function MeditationPlayerPage() {
  const location = useLocation();
  const [meditation, setMeditation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps = useRef([]);
  const timerRef = useRef(null);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      const fetchMeditation = async () => {
        try {
          const med = await Meditation.get(id);
          setMeditation(med);
          steps.current = med.script.split('\\n\\n').map(s => s.trim()).filter(s => s);
        } catch (error) {
          console.error("Erro ao buscar meditação:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeditation();
    }

    return () => {
        clearTimeout(timerRef.current);
        synth.cancel();
    };
  }, [location.search, synth]); // Added synth to dependencies

  useEffect(() => {
    if (isPlaying && currentStep < steps.current.length) {
      const currentText = steps.current[currentStep];
      
      // Cancel any previous speech
      synth.cancel();

      // Speak the current step
      utteranceRef.current = new SpeechSynthesisUtterance(currentText);
      utteranceRef.current.lang = 'pt-BR';
      utteranceRef.current.volume = isMuted ? 0 : 1;
      synth.speak(utteranceRef.current);

      // Estimate duration and set timer for next step
      const estimatedDuration = Math.max(currentText.length * 100, 3000); // 100ms per char, min 3s
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, estimatedDuration);

    } else if (currentStep >= steps.current.length && steps.current.length > 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, isMuted, synth]); // Added synth to dependencies

  const togglePlay = () => {
    if (synth.paused && isPlaying) {
        synth.resume();
    } else if (!synth.paused && isPlaying) {
        synth.pause();
    }
    setIsPlaying(!isPlaying);
  };
  
  const restart = () => {
    clearTimeout(timerRef.current);
    synth.cancel();
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
      if(utteranceRef.current) {
          utteranceRef.current.volume = !isMuted ? 0 : 1;
      }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 animate-spin text-stone-500" /></div>;
  }

  if (!meditation) {
    return <div className="text-center p-8">Meditação não encontrada.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">{meditation.title}</h1>
      <p className="text-stone-600 mb-8">{meditation.description}</p>
      
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8 md:p-12 min-h-[200px] flex items-center justify-center">
            {steps.current.length > 0 ? (
                 <p className="text-2xl text-stone-700 leading-relaxed transition-opacity duration-1000" key={currentStep}>
                    {currentStep < steps.current.length ? steps.current[currentStep] : "Sessão concluída. Respire fundo e leve essa calma com você."}
                </p>
            ) : (
                <p>Script de meditação inválido ou não encontrado.</p>
            )}
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-4 mt-8">
        <Button onClick={toggleMute} variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200">
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </Button>
        <Button onClick={togglePlay} size="lg" className="rounded-full w-16 h-16 bg-stone-800 hover:bg-stone-900 shadow-lg">
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button onClick={restart} variant="ghost" size="icon" className="text-stone-600 hover:bg-stone-200">
          <RefreshCw className="w-6 h-6" />
        </Button>
      </div>
       <div className="text-xs text-stone-500 mt-4">
        Passo {Math.min(currentStep + 1, steps.current.length)} de {steps.current.length}
      </div>
      <div className="text-xs text-stone-400 mt-2">
        (Usando a síntese de voz do seu navegador)
      </div>
    </div>
  );
}
