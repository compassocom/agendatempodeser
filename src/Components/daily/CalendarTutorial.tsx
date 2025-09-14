import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/Button";
import { CalendarPlus, Download, ExternalLink } from "lucide-react";

export default function CalendarTutorial({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            Como Adicionar à sua Agenda
          </DialogTitle>
          <DialogDescription>
            Existem duas formas fáceis de mover seus compromissos para o Google Agenda ou outro calendário.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <CalendarPlus className="w-4 h-4" />
              Método 1: Um Evento por Vez (Mais Rápido)
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Ao lado de cada compromisso que você escreve na agenda, um pequeno ícone de calendário <CalendarPlus className="inline w-4 h-4" /> aparece.
              <br/>
              Clique nele para abrir o Google Agenda com o evento já preenchido. É só salvar!
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 flex items-center gap-2 mb-2">
              <Download className="w-4 h-4" />
              Método 2: O Dia Inteiro de Uma Vez
            </h4>
            <p className="text-sm text-green-800 leading-relaxed">
              Use o botão <strong>"Exportar para Calendário (.ics)"</strong> para baixar um arquivo com todos os seus compromissos do dia.
              <br/>
              Depois, no seu Google Agenda, vá em <strong>Configurações &gt; Importar e Exportar</strong> e selecione o arquivo que você baixou.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}