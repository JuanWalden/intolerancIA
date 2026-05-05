import type { CertaintyTrap, ExposureStep } from '../types';

export const therapeuticQuotes = [
  'No necesitas certeza absoluta para dar un paso razonable.',
  'La duda puede venir contigo; no tiene que conducir.',
  'Puedo actuar sin saberlo todo.',
  'El objetivo no es eliminar el “¿y si…?”, sino cambiar tu relación con él.',
];

export const traps: CertaintyTrap[] = [
  { id: 't1', name: 'Preocupación como pseudo-solución', family: 'head', description: 'Darle vueltas genera ilusión de control sin resolver.' },
  { id: 't2', name: 'Sobreplanificación', family: 'head', description: 'Intentar cubrir todos los escenarios posibles.' },
  { id: 't3', name: 'Búsqueda de reaseguramiento', family: 'information', description: 'Preguntar repetidamente para aliviarse.' },
  { id: 't4', name: 'Investigación infinita', family: 'information', description: 'Buscar información sin límite claro.' },
  { id: 't5', name: 'Chequeo compulsivo', family: 'information', description: 'Revisar una y otra vez para calmar la duda.' },
  { id: 't6', name: 'Apoyo disfrazado de certeza', family: 'others_decisions', description: 'Pedir garantías en lugar de apoyo emocional.' },
  { id: 't7', name: 'Parálisis ante decisiones', family: 'others_decisions', description: 'Posponer por no poder garantizar resultado.' },
];

export const demoExposure: ExposureStep[] = [
  { id: 'e1', situation: 'Probar un plato nuevo sin mirar fotos', distressLevel: 3, certaintyTrap: 'Investigación infinita', safetyBehaviorToDrop: 'Mirar reseñas', valueDirection: 'Apertura a experiencias', status: 'pending' },
  { id: 'e2', situation: 'Enviar un mensaje y no comprobar si lo han leído', distressLevel: 5, certaintyTrap: 'Chequeo compulsivo', safetyBehaviorToDrop: 'Revisar doble check', valueDirection: 'Vínculos más libres', status: 'pending' },
];
