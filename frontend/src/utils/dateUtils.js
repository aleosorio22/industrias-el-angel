export const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  
  // Ensure date is handled as UTC
  const [year, month, day] = dateString.split('-');
  const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};