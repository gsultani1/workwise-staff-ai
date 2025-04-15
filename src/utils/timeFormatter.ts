
export const formatTimeDisplay = (time: string) => {
  if (!time) return '';
  
  try {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    if (isNaN(hours)) {
      return '';
    }
    
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  } catch (err) {
    console.error('Error formatting time:', err, time);
    return '';
  }
};
