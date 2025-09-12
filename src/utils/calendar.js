function parseTime(timeStr) {
  if (!timeStr) return { hours: 9, minutes: 0 }; // Default fallback
  
  // Remove spaces and convert to uppercase for consistency
  const cleanTime = timeStr.trim().toUpperCase();
  
  // Handle different time formats
  let hours = 0;
  let minutes = 0;
  
  if (cleanTime.includes('AM') || cleanTime.includes('PM')) {
    const isPM = cleanTime.includes('PM');
    const timeOnly = cleanTime.replace(/[AP]M/, '').trim();
    
    if (timeOnly.includes(':')) {
      const [h, m] = timeOnly.split(':');
      hours = parseInt(h, 10) || 0;
      minutes = parseInt(m, 10) || 0;
    } else {
      hours = parseInt(timeOnly, 10) || 0;
      minutes = 0;
    }
    
    // Convert to 24-hour format
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0; // 12 AM is midnight
    }
  } else {
    // Handle formats like "7", "7:30" without AM/PM
    if (cleanTime.includes(':')) {
      const [h, m] = cleanTime.split(':');
      hours = parseInt(h, 10) || 0;
      minutes = parseInt(m, 10) || 0;
    } else {
      hours = parseInt(cleanTime, 10) || 0;
      minutes = 0;
    }
    
    // Assume afternoon times for single digits 1-5, morning for 6-12
    if (hours >= 1 && hours <= 5) {
      hours += 12;
    }
  }
  
  // Validate ranges
  if (hours < 0 || hours > 23) hours = 9;
  if (minutes < 0 || minutes > 59) minutes = 0;
  
  return { hours, minutes };
}

function formatGoogleDate(date, timeStr) {
  try {
    const { hours, minutes } = parseTime(timeStr);
    
    // Create date in local timezone first
    const eventDate = new Date(date + 'T00:00:00');
    
    // Validate the date
    if (isNaN(eventDate.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Set the time
    eventDate.setHours(hours, minutes, 0, 0);
    
    // Convert to UTC for Google Calendar
    const utcDate = new Date(eventDate.getTime() - (eventDate.getTimezoneOffset() * 60000));
    
    return utcDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } catch (error) {
    console.error('Error formatting Google date:', error);
    // Return current date + 1 hour as fallback
    const fallback = new Date();
    fallback.setHours(fallback.getHours() + 1);
    return fallback.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}

export function generateGoogleCalendarLink(summary, date, timeStr) {
  try {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    
    const startTime = formatGoogleDate(date, timeStr);
    
    // Create end time by adding 30 minutes
    const startDateObj = new Date(startTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
    
    // Validate start date
    if (isNaN(startDateObj.getTime())) {
      throw new Error('Invalid start date');
    }
    
    const endDateObj = new Date(startDateObj.getTime() + 30 * 60000); // Add 30 minutes
    const endTime = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const params = new URLSearchParams({
      text: summary || 'Evento da Agenda Reflexiva',
      dates: `${startTime}/${endTime}`,
      details: `Adicionado a partir da Agenda Reflexiva.`
    });

    return `${baseUrl}&${params.toString()}`;
  } catch (error) {
    console.error('Error generating Google Calendar link:', error);
    
    // Return a fallback URL that opens Google Calendar
    const params = new URLSearchParams({
      text: summary || 'Evento da Agenda Reflexiva',
      details: `Horário: ${timeStr} - Adicionado a partir da Agenda Reflexiva.`
    });
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  }
}

function formatICSDate(date, timeStr) {
  try {
    const { hours, minutes } = parseTime(timeStr);
    const eventDate = new Date(date + 'T00:00:00');
    
    if (isNaN(eventDate.getTime())) {
      throw new Error('Invalid date');
    }
    
    eventDate.setUTCHours(hours, minutes, 0, 0);
    
    return eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } catch (error) {
    console.error('Error formatting ICS date:', error);
    const fallback = new Date();
    return fallback.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}

export function generateICS(dailyData) {
  try {
    let icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//base44//Agenda Reflexiva//PT',
    ];

    const processSchedule = (schedule) => {
      if (!schedule || typeof schedule !== 'object') return;
      
      for (const time in schedule) {
        if (schedule[time] && schedule[time].trim()) {
          try {
            const startDate = formatICSDate(dailyData.date, time);
            const startDateObj = new Date(startDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z'));
            
            if (!isNaN(startDateObj.getTime())) {
              const endDateObj = new Date(startDateObj.getTime() + 30 * 60000);
              const endDate = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
              
              icsString.push('BEGIN:VEVENT');
              icsString.push(`UID:${dailyData.date}-${time}-${Date.now()}@base44.com`);
              icsString.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
              icsString.push(`DTSTART:${startDate}`);
              icsString.push(`DTEND:${endDate}`);
              icsString.push(`SUMMARY:${schedule[time].replace(/[,;\\]/g, '')}`);
              icsString.push('DESCRIPTION:Adicionado da Agenda Reflexiva');
              icsString.push('END:VEVENT');
            }
          } catch (error) {
            console.error(`Error processing schedule item for ${time}:`, error);
          }
        }
      }
    };

    processSchedule(dailyData.morning_schedule);
    processSchedule(dailyData.afternoon_schedule);

    icsString.push('END:VCALENDAR');
    return icsString.join('\r\n');
  } catch (error) {
    console.error('Error generating ICS:', error);
    return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//base44//Agenda Reflexiva//PT\r\nEND:VCALENDAR';
  }
}