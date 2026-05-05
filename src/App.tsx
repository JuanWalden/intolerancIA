import { useMemo, useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { ReflectionTextarea, RatingSlider, TherapeuticCard } from './components/Common';
import { demoExposure, therapeuticQuotes, traps } from './data/content';
import type { AppData, BehavioralExperiment, ExposureStep, ModuleKey } from './types';
import { clearData, loadData, saveData } from './utils/storage';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const skills = ['Hora de darle vueltas', 'Árbol de decisión', 'Escalera de exposición', 'Experimento conductual', 'Apoyo sin reaseguramiento', 'Búsqueda de información con límite', 'Decidir con incertidumbre'];

const emptyExperiment: BehavioralExperiment = { id: crypto.randomUUID(), situation: '', prediction: '', fearedOutcome: '', trapToAvoid: '', distressBefore: 5, valueDirection: '', createdAt: new Date().toISOString() };
const moduleOrder: ModuleKey[] = ['inicio', 'situacion', 'trampas', 'cadena', 'arbol', 'hora', 'escalera', 'experimento', 'registro', 'resumen'];

export default function App() {
  const [current, setCurrent] = useState<ModuleKey>('inicio');
  const [data, setData] = useState<AppData>(() => loadData());
  const [newConcern, setNewConcern] = useState('');
  const [decisionType, setDecisionType] = useState<'productive' | 'unproductive' | ''>('');
  const [decisionAction, setDecisionAction] = useState('');
  const [newStep, setNewStep] = useState<ExposureStep>({ id: crypto.randomUUID(), situation: '', distressLevel: 3, certaintyTrap: '', safetyBehaviorToDrop: '', valueDirection: '', status: 'pending' });
  const [experiment, setExperiment] = useState<BehavioralExperiment>(emptyExperiment);

  const update = (next: AppData) => { setData(next); saveData(next); };
  const completed = moduleOrder.slice(1, 9).filter((m) => {
    if (m === 'situacion') return Boolean(data.situation?.description);
    if (m === 'trampas') return Object.keys(data.trapsReflections).length > 0;
    if (m === 'cadena') return Boolean(data.chain?.chainName);
    if (m === 'arbol') return data.decisionLogs.length > 0;
    if (m === 'hora') return data.worryPlanner.worries.length > 0;
    if (m === 'escalera') return data.exposureSteps.length > 0;
    if (m === 'experimento') return data.experiments.length > 0;
    return Object.keys(data.weeklyLog).length > 0;
  }).length;
  const progress = Math.round((completed / 8) * 100);
  const quote = useMemo(() => therapeuticQuotes[Math.floor(Math.random() * therapeuticQuotes.length)], [current]);

  const goto = (delta: -1 | 1) => {
    const idx = moduleOrder.indexOf(current);
    const next = moduleOrder[idx + delta];
    if (next) setCurrent(next);
  };

  const exportSummary = (format: 'txt' | 'json') => {
    const summaryText = `Resumen personal\nSituación: ${data.situation?.description ?? '-'}\nMalestar inicial: ${data.situation?.distress ?? '-'}\nTrampas frecuentes: ${Object.keys(data.trapsReflections).length}\nCadena: ${data.chain?.chainName ?? '-'}\nExperimentos: ${data.experiments.length}`;
    const content = format === 'json' ? JSON.stringify(data, null, 2) : summaryText;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `resumen-incertidumbre.${format}`; a.click();
  };

  return <AppLayout current={current} setCurrent={setCurrent} progress={progress}>
    <p className='quote'>{quote}</p>

    {current === 'inicio' && <TherapeuticCard title='Bienvenida'>
      <h1>Vivir en el quizás</h1><p>Entrenamiento práctico para relacionarte de forma más flexible con la incertidumbre.</p>
      <p>La incertidumbre forma parte de la vida. El objetivo de esta herramienta no es darte certezas absolutas, sino ayudarte a detectar cuándo tu mente intenta fabricarlas, reducir las conductas que mantienen la duda y practicar pequeños pasos para seguir adelante sin saberlo todo.</p>
      <div className='grid3'><div className='card'>Detecta tus trampas de certeza.</div><div className='card'>Distingue cuándo actuar y cuándo soltar.</div><div className='card'>Entrena tu tolerancia paso a paso.</div></div>
      <button onClick={() => setCurrent('situacion')}>Empezar mi práctica</button>
    </TherapeuticCard>}

    {current === 'situacion' && <TherapeuticCard title='Mi situación de incertidumbre'>{(() => { const s = data.situation ?? { id: 's1', description: '', unknownElement: '', fearedOutcome: '', bodySensations: '', distress: 4, urgencyForCertainty: 5, createdAt: new Date().toISOString() }; return <>
      <ReflectionTextarea label='¿Qué situación de incertidumbre estás viviendo?' value={s.description} onChange={(v) => update({ ...data, situation: { ...s, description: v } })} />
      <ReflectionTextarea label='¿Qué es lo que no sabes o no puedes controlar?' value={s.unknownElement} onChange={(v) => update({ ...data, situation: { ...s, unknownElement: v } })} />
      <ReflectionTextarea label='¿Qué temes que pueda ocurrir?' value={s.fearedOutcome} onChange={(v) => update({ ...data, situation: { ...s, fearedOutcome: v } })} />
      <ReflectionTextarea label='¿Qué notas en el cuerpo cuando piensas en ello?' value={s.bodySensations} onChange={(v) => update({ ...data, situation: { ...s, bodySensations: v } })} />
      <RatingSlider label='Malestar' value={s.distress} onChange={(v) => update({ ...data, situation: { ...s, distress: v } })} />
      <RatingSlider label='Urgencia de buscar certeza' value={s.urgencyForCertainty} onChange={(v) => update({ ...data, situation: { ...s, urgencyForCertainty: v } })} />
      <p><strong>Esto no es todavía un problema confirmado. Es una experiencia de no saber.</strong></p></>; })()}</TherapeuticCard>}

    {current === 'trampas' && <TherapeuticCard title='Trampas de la certeza'>{traps.map((t) => { const r = data.trapsReflections[t.id] ?? { presence: '', shortRelief: '', longCost: '' }; return <div className='card' key={t.id}><label><input type='checkbox' checked={Boolean(data.trapsReflections[t.id])} onChange={(e) => { const n = { ...data.trapsReflections }; if (e.target.checked) n[t.id] = r; else delete n[t.id]; update({ ...data, trapsReflections: n }); }} /> {t.name}</label><small>{t.description}</small>{data.trapsReflections[t.id] && <><ReflectionTextarea label='¿Cómo aparece esta trampa en tu caso?' value={r.presence} onChange={(v) => update({ ...data, trapsReflections: { ...data.trapsReflections, [t.id]: { ...r, presence: v } } })} /><ReflectionTextarea label='¿Qué alivio te da a corto plazo?' value={r.shortRelief} onChange={(v) => update({ ...data, trapsReflections: { ...data.trapsReflections, [t.id]: { ...r, shortRelief: v } } })} /><ReflectionTextarea label='¿Qué coste tiene a largo plazo?' value={r.longCost} onChange={(v) => update({ ...data, trapsReflections: { ...data.trapsReflections, [t.id]: { ...r, longCost: v } } })} /></>}</div>; })}<p>Las trampas de certeza no son defectos personales. Son intentos comprensibles de reducir el malestar.</p></TherapeuticCard>}

    {current === 'cadena' && <TherapeuticCard title='Cadena de “¿y si…?”'>
      <ReflectionTextarea label='Pensamiento inicial de incertidumbre' value={data.chain?.initialTrigger ?? ''} onChange={(v) => update({ ...data, chain: { id: data.chain?.id ?? crypto.randomUUID(), initialTrigger: v, links: data.chain?.links ?? [''], chainName: data.chain?.chainName ?? '', finalCatastrophe: data.chain?.finalCatastrophe ?? '', createdAt: new Date().toISOString() } })} />
      {(data.chain?.links ?? ['']).map((l, i) => <ReflectionTextarea key={i} label={`¿Y si...? ${i + 1}`} value={l} onChange={(v) => { const links = [...(data.chain?.links ?? [''])]; links[i] = v; update({ ...data, chain: { ...(data.chain ?? { id: crypto.randomUUID(), initialTrigger: '', chainName: '', finalCatastrophe: '', createdAt: new Date().toISOString(), links: [''] }), links } }); }} />)}
      <button disabled={(data.chain?.links.length ?? 1) >= 10} onClick={() => update({ ...data, chain: { ...(data.chain ?? { id: crypto.randomUUID(), initialTrigger: '', chainName: '', finalCatastrophe: '', createdAt: new Date().toISOString(), links: [''] }), links: [...(data.chain?.links ?? ['']), ''] } })}>Añadir otro ¿y si…?</button>
      <ReflectionTextarea label='¿Dónde terminó la cadena?' value={data.chain?.finalCatastrophe ?? ''} onChange={(v) => update({ ...data, chain: { ...(data.chain ?? { id: crypto.randomUUID(), initialTrigger: '', chainName: '', createdAt: new Date().toISOString(), links: [''], finalCatastrophe: '' }), finalCatastrophe: v } })} />
      <ReflectionTextarea label='Nombrar esta cadena' value={data.chain?.chainName ?? ''} onChange={(v) => update({ ...data, chain: { ...(data.chain ?? { id: crypto.randomUUID(), initialTrigger: '', links: [''], chainName: '', finalCatastrophe: '', createdAt: new Date().toISOString() }), chainName: v } })} />
      <p>Estoy teniendo la cadena mental de: <strong>{data.chain?.chainName || '...'}</strong></p>
    </TherapeuticCard>}

    {current === 'arbol' && <TherapeuticCard title='Árbol de decisión'>
      <ReflectionTextarea label='Escribe tu preocupación en una frase concreta' value={newConcern} onChange={setNewConcern} />
      <label>¿Se refiere a un problema real y actual?
        <select value={decisionType} onChange={(e) => setDecisionType(e.target.value as 'productive' | 'unproductive' | '')}><option value=''>Seleccionar</option><option value='productive'>Sí</option><option value='unproductive'>No / es hipotético</option></select>
      </label>
      <ReflectionTextarea label={decisionType === 'productive' ? 'Paso más pequeño que puedes dar' : 'Acción valiosa aunque no haya certeza'} value={decisionAction} onChange={setDecisionAction} />
      <button onClick={() => { if (!newConcern || !decisionType) return; update({ ...data, decisionLogs: [...data.decisionLogs, { concern: newConcern, kind: decisionType, action: decisionAction }] }); setNewConcern(''); setDecisionAction(''); setDecisionType(''); }}>Guardar</button>
    </TherapeuticCard>}

    {current === 'hora' && <TherapeuticCard title='Hora de darle vueltas'>
      <label>Hora del día<input type='time' value={data.worryPlanner.hour} onChange={(e) => update({ ...data, worryPlanner: { ...data.worryPlanner, hour: e.target.value } })} /></label>
      <label>Duración<select value={data.worryPlanner.duration} onChange={(e) => update({ ...data, worryPlanner: { ...data.worryPlanner, duration: Number(e.target.value) } })}>{[10,15,20,25,30].map((d)=><option key={d} value={d}>{d} minutos</option>)}</select></label>
      <ReflectionTextarea label='Lugar/contexto' value={data.worryPlanner.context} onChange={(v)=>update({...data,worryPlanner:{...data.worryPlanner,context:v}})} />
      <ReflectionTextarea label='Recordatorio textual' value={data.worryPlanner.reminder} onChange={(v)=>update({...data,worryPlanner:{...data.worryPlanner,reminder:v}})} />
      <ReflectionTextarea label='Anota la preocupación brevemente' value={newConcern} onChange={setNewConcern} /><button onClick={() => { if (!newConcern) return; update({ ...data, worryPlanner: { ...data.worryPlanner, worries: [...data.worryPlanner.worries, { text: newConcern, createdAt: new Date().toISOString() }] } }); setNewConcern(''); }}>Lo dejo para mi hora</button>
    </TherapeuticCard>}

    {current === 'escalera' && <TherapeuticCard title='Escalera de exposición'>
      <button onClick={() => update({ ...data, exposureSteps: data.exposureSteps.length ? data.exposureSteps : demoExposure })}>Cargar modo demo</button>
      <ReflectionTextarea label='Situación incierta' value={newStep.situation} onChange={(v)=>setNewStep({...newStep,situation:v})} />
      <RatingSlider label='Nivel de malestar' value={newStep.distressLevel} onChange={(v)=>setNewStep({...newStep,distressLevel:v})} />
      <ReflectionTextarea label='Trampa de certeza que suelo usar' value={newStep.certaintyTrap} onChange={(v)=>setNewStep({...newStep,certaintyTrap:v})} />
      <ReflectionTextarea label='Conducta que voy a dejar de hacer' value={newStep.safetyBehaviorToDrop} onChange={(v)=>setNewStep({...newStep,safetyBehaviorToDrop:v})} />
      <ReflectionTextarea label='Valor/dirección importante' value={newStep.valueDirection} onChange={(v)=>setNewStep({...newStep,valueDirection:v})} />
      <button onClick={() => { if (!newStep.situation) return; update({ ...data, exposureSteps: [...data.exposureSteps, newStep].sort((a, b) => a.distressLevel - b.distressLevel) }); setNewStep({ ...newStep, id: crypto.randomUUID(), situation: '' }); }}>Guardar</button>
      {data.exposureSteps.map((s) => <div key={s.id} className='card'><strong>{s.situation}</strong><p>Nivel {s.distressLevel}</p><select value={s.status} onChange={(e)=>update({...data,exposureSteps:data.exposureSteps.map((x)=>x.id===s.id?{...x,status:e.target.value as ExposureStep['status']}:x)})}><option value='pending'>Pendiente</option><option value='practicing'>En práctica</option><option value='completed'>Completado</option><option value='repeat'>Repetir</option></select></div>)}
    </TherapeuticCard>}

    {current === 'experimento' && <TherapeuticCard title='Experimento conductual'>
      <ReflectionTextarea label='Situación incierta que voy a practicar' value={experiment.situation} onChange={(v)=>setExperiment({...experiment,situation:v})} />
      <ReflectionTextarea label='Predicción de mi mente' value={experiment.prediction} onChange={(v)=>setExperiment({...experiment,prediction:v})} />
      <ReflectionTextarea label='¿Qué teme mi mente que ocurra?' value={experiment.fearedOutcome} onChange={(v)=>setExperiment({...experiment,fearedOutcome:v})} />
      <ReflectionTextarea label='¿Qué trampa de certeza voy a evitar?' value={experiment.trapToAvoid} onChange={(v)=>setExperiment({...experiment,trapToAvoid:v})} />
      <RatingSlider label='Malestar antes' value={experiment.distressBefore} onChange={(v)=>setExperiment({...experiment,distressBefore:v})} />
      <ReflectionTextarea label='¿Qué valor quiero cuidar?' value={experiment.valueDirection} onChange={(v)=>setExperiment({...experiment,valueDirection:v})} />
      <ReflectionTextarea label='¿Qué ocurrió realmente?' value={experiment.actualOutcome ?? ''} onChange={(v)=>setExperiment({...experiment,actualOutcome:v})} />
      <RatingSlider label='Malestar máximo' value={experiment.distressPeak ?? 5} onChange={(v)=>setExperiment({...experiment,distressPeak:v})} />
      <RatingSlider label='Malestar después' value={experiment.distressAfter ?? 4} onChange={(v)=>setExperiment({...experiment,distressAfter:v})} />
      <ReflectionTextarea label='¿Qué aprendí?' value={experiment.learning ?? ''} onChange={(v)=>setExperiment({...experiment,learning:v})} />
      <button onClick={() => { if (!experiment.situation) return; update({ ...data, experiments: [...data.experiments, experiment] }); setExperiment({ ...emptyExperiment, id: crypto.randomUUID(), createdAt: new Date().toISOString() }); }}>Guardar</button>
      <p>El objetivo era atravesar la incertidumbre sin obedecer automáticamente la trampa de certeza.</p>
    </TherapeuticCard>}

    {current === 'registro' && <TherapeuticCard title='Registro semanal'>{days.map((d) => { const r = data.weeklyLog[d] ?? { skill: skills[0], distress: 4, trap: '', different: '', observed: '', shift: '' }; return <div key={d} className='card'><h4>{d}</h4><label>Habilidad practicada<select value={r.skill} onChange={(e)=>update({...data,weeklyLog:{...data.weeklyLog,[d]:{...r,skill:e.target.value}}})}>{skills.map((s)=><option key={s}>{s}</option>)}</select></label><RatingSlider label='Malestar' value={r.distress} onChange={(v)=>update({...data,weeklyLog:{...data.weeklyLog,[d]:{...r,distress:v}}})} /><ReflectionTextarea label='Trampa detectada' value={r.trap} onChange={(v)=>update({...data,weeklyLog:{...data.weeklyLog,[d]:{...r,trap:v}}})} /></div>; })}
      <ReflectionTextarea label='¿Qué he aprendido esta semana sobre mi relación con la incertidumbre?' value={data.weeklyReflection.learned ?? ''} onChange={(v)=>update({...data,weeklyReflection:{...data.weeklyReflection,learned:v}})} />
    </TherapeuticCard>}

    {current === 'resumen' && <TherapeuticCard title='Resumen personal'><pre>{JSON.stringify(data, null, 2)}</pre><button onClick={() => exportSummary('txt')}>Exportar resumen</button><button onClick={() => exportSummary('json')}>Exportar JSON</button><button onClick={() => { if (confirm('¿Borrar todos tus datos?')) { clearData(); location.reload(); } }}>Borrar todos mis datos</button><p className='disclaimer'>Esta herramienta es psicoeducativa y de práctica personal. No sustituye la atención psicológica o médica profesional. Si estás atravesando una crisis o tienes pensamientos de hacerte daño, busca ayuda profesional o servicios de emergencia.</p></TherapeuticCard>}

    <TherapeuticCard title='Análisis funcional (FunctionalAnalysisCard)'>
      <ReflectionTextarea label='Situación' value={data.functionalAnalysis.situation} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,situation:v}})} />
      <ReflectionTextarea label='Pensamiento' value={data.functionalAnalysis.thought} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,thought:v}})} />
      <ReflectionTextarea label='Emoción/sensación' value={data.functionalAnalysis.emotion} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,emotion:v}})} />
      <ReflectionTextarea label='Trampa de certeza' value={data.functionalAnalysis.trap} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,trap:v}})} />
      <ReflectionTextarea label='Alivio corto plazo' value={data.functionalAnalysis.shortRelief} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,shortRelief:v}})} />
      <ReflectionTextarea label='Coste largo plazo' value={data.functionalAnalysis.longCost} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,longCost:v}})} />
      <ReflectionTextarea label='Alternativa flexible' value={data.functionalAnalysis.flexibleAlternative} onChange={(v)=>update({...data,functionalAnalysis:{...data.functionalAnalysis,flexibleAlternative:v}})} />
    </TherapeuticCard>

    <div><button onClick={() => goto(-1)}>Volver</button><button onClick={() => goto(1)}>Continuar</button></div>
  </AppLayout>;
}
