import type { ModuleKey } from '../types';

const modules: Array<{ key: ModuleKey; label: string }> = [
  { key: 'inicio', label: 'Inicio' }, { key: 'situacion', label: 'Mi situación' }, { key: 'trampas', label: 'Trampas' }, { key: 'cadena', label: 'Cadena ¿y si?' }, { key: 'arbol', label: 'Árbol' }, { key: 'hora', label: 'Hora de vueltas' }, { key: 'escalera', label: 'Escalera' }, { key: 'experimento', label: 'Experimento' }, { key: 'registro', label: 'Registro' }, { key: 'resumen', label: 'Resumen' },
];

export function AppLayout({ current, setCurrent, progress, children }: { current: ModuleKey; setCurrent: (m: ModuleKey) => void; progress: number; children: React.ReactNode }) {
  return <div className="app"><aside className="sidebar"><h2>Vivir en el quizás</h2><p>{progress}% completado</p><nav>{modules.map((m) => <button key={m.key} className={current === m.key ? 'active' : ''} onClick={() => setCurrent(m.key)}>{m.label}</button>)}</nav></aside><main>{children}</main></div>;
}
