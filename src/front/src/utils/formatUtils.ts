/**
 * Formata um array de skills que pode vir como string ou objeto
 */
export const formatSkills = (skills: (string | { id?: number; skill: string })[]): string[] => {
  if (!skills || !Array.isArray(skills)) return [];
  return skills.map(skill => typeof skill === 'string' ? skill : skill.skill);
};

/**
 * Formata uma data do backend para o formato brasileiro
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Data não disponível';
  
  try {
    // Se já estiver no formato brasileiro "dd/MM/yyyy HH:mm" ou "dd/MM/yyyy"
    if (dateString.includes('/')) {
      // Parse do formato brasileiro
      const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?/);
      if (parts) {
        const [, day, month, year, hour, minute] = parts;
        // Cria a data (mês é 0-indexed no JS)
        const date = new Date(
          parseInt(year), 
          parseInt(month) - 1, 
          parseInt(day), 
          hour ? parseInt(hour) : 0, 
          minute ? parseInt(minute) : 0
        );
        
        // Subtrai 3 horas (ajuste de timezone)
        date.setHours(date.getHours() - 3);
        
        // Formata de volta para o padrão brasileiro
        const adjustedDay = String(date.getDate()).padStart(2, '0');
        const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
        const adjustedYear = date.getFullYear();
        
        if (hour && minute) {
          // Com hora
          const adjustedHour = String(date.getHours()).padStart(2, '0');
          const adjustedMinute = String(date.getMinutes()).padStart(2, '0');
          return `${adjustedDay}/${adjustedMonth}/${adjustedYear} ${adjustedHour}:${adjustedMinute}`;
        } else {
          // Sem hora
          return `${adjustedDay}/${adjustedMonth}/${adjustedYear}`;
        }
      }
    }
    
    // Caso contrário, tenta parsear como ISO
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data não disponível';
    }
    
    // Subtrai 3 horas
    date.setHours(date.getHours() - 3);
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch {
    return 'Data não disponível';
  }
};

/**
 * Formata uma data simples para exibição
 */
export const formatSimpleDate = (dateString: string): string => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Retorna a string original se não for uma data válida
    }
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

/**
 * Trunca um texto para um tamanho máximo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

