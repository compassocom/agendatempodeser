import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Clock, CalendarPlus } from "lucide-react";
import { Button } from '@/Components/ui/button';
import { generateGoogleCalendarLink } from '@/@/utils/calendar.js';

export default function Schedule({ date, morningSchedule, afternoonSchedule, onMorningChange, onAfternoonChange }) {
  const morningSlots = ["6AM", "6:30", "7", "7:30", "8", "8:30", "9", "9:30", "10", "10:30", "11", "11:30", "12PM", "12:30"];
  const afternoonSlots = ["1PM", "1:30", "2", "2:30", "3", "3:30", "4", "4:30", "5", "5:30", "6", "6:30", "7", "7:30"];

  const handleMorningChange = (slot, value) => {
    onMorningChange({ ...morningSchedule, [slot]: value });
  };

  const handleAfternoonChange = (slot, value) => {
    onAfternoonChange({ ...afternoonSchedule, [slot]: value });
  };
  
  const renderSlot = (slot, schedule, handler) => (
    <div key={slot} className="flex items-center gap-2">
      <Label className="w-16 text-right text-stone-600 font-mono text-xs">{slot}</Label>
      <Input
        value={schedule[slot] || ''}
        onChange={(e) => handler(slot, e.target.value)}
        placeholder="Atividade..."
        className="flex-1 bg-stone-50/50"
      />
      {schedule[slot] && (
        <Button variant="ghost" size="icon" asChild>
          <a
            href={generateGoogleCalendarLink(schedule[slot], date, slot)}
            target="_blank"
            rel="noopener noreferrer"
            title="Adicionar ao Google Agenda"
          >
            <CalendarPlus className="w-4 h-4 text-stone-500 hover:text-stone-700" />
          </a>
        </Button>
      )}
    </div>
  );

  return (
    <Card className="bg-white border-stone-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <Clock className="w-5 h-5" />
            Tarefas e Horários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <div className="space-y-2">
            {morningSlots.map((slot) => renderSlot(slot, morningSchedule, handleMorningChange))}
          </div>
          <div className="space-y-2">
            {afternoonSlots.map((slot) => renderSlot(slot, afternoonSchedule, handleAfternoonChange))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}