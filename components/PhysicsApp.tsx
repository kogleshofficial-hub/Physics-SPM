"use client";
import {useEffect,useMemo,useState} from "react";
import {BookOpen,Brain,CheckCircle2,ChevronLeft,ChevronRight,Clock3,FlaskConical,Heart,Home,RotateCcw,Search,Sigma,Target,Zap} from "lucide-react";
import raw from "@/data/physics.json";

type Chapter=typeof raw.chapters[number];
type Tab="learn"|"exam"|"formula"|"lab"|"recall";
const chapters=raw.chapters as Chapter[];
const pad=(n:number)=>String(n).padStart(2,"0");

const ui={
 en:{home:"Overview",learn:"Learn",exam:"Exam Hits",formula:"Formula Vault",lab:"Experiment Lab",recall:"Recall",search:"Search anything in Physics…",start:"START REVISING",continue:"CONTINUE",focus:"MASTER THESE FIRST",why:"WHY THIS MATTERS",trap:"EXAM TRAP",memory:"MEMORY LOCK",test:"TEST YOURSELF",next:"NEXT",prev:"PREVIOUS",done:"DONE",progress:"chapter progress",quick:"QUICK REVISION",all:"ALL CHAPTERS",t4:"FORM 4",t5:"FORM 5",xray:"X-RAY",reset:"RESET",show:"SHOW ANSWER",hide:"HIDE ANSWER",score:"SCORE",strong:"Strong",weak:"Needs another look",slogan:"KNOW IT. SPOT IT. SOLVE IT.",tip:"Read → hide → recall → check. That is the loop."},
 ms:{home:"Utama",learn:"Belajar",exam:"Fokus SPM",formula:"Bilik Formula",lab:"Makmal Eksperimen",recall:"Imbas Kembali",search:"Cari apa sahaja dalam Fizik…",start:"MULA ULANG KAJI",continue:"SAMBUNG",focus:"KUASAI INI DAHULU",why:"KENAPA INI PENTING",trap:"PERANGKAP PEPERIKSAAN",memory:"KUNCI INGATAN",test:"UJI DIRI",next:"SETERUSNYA",prev:"SEBELUM",done:"SIAP",progress:"kemajuan bab",quick:"ULANG KAJI PANTAS",all:"SEMUA BAB",t4:"TINGKATAN 4",t5:"TINGKATAN 5",xray:"X-RAY",reset:"RESET",show:"TUNJUK JAWAPAN",hide:"SOROK JAWAPAN",score:"SKOR",strong:"Kuat",weak:"Perlu ulang",slogan:"FAHAM. KENAL PASTI. SELESAIKAN.",tip:"Baca → tutup → ingat semula → semak. Ulang gelung ini."},
 id:{home:"Beranda",learn:"Belajar",exam:"Fokus Ujian",formula:"Gudang Rumus",lab:"Lab Eksperimen",recall:"Ingatan",search:"Cari apa saja dalam Fisika…",start:"MULAI BELAJAR",continue:"LANJUTKAN",focus:"KUASAI INI DAHULU",why:"MENGAPA PENTING",trap:"JEBAKAN UJIAN",memory:"KUNCI INGATAN",test:"UJI DIRI",next:"BERIKUTNYA",prev:"SEBELUMNYA",done:"SELESAI",progress:"kemajuan bab",quick:"ULANG KAJI CEPAT",all:"SEMUA BAB",t4:"TINGKAT 4",t5:"TINGKAT 5",xray:"X-RAY",reset:"RESET",show:"LIHAT JAWABAN",hide:"SEMBUNYIKAN",score:"SKOR",strong:"Kuat",weak:"Perlu diulang",slogan:"PAHAM. KENALI. SELESAIKAN.",tip:"Baca → tutup → ingat → cek. Ulangi."},
 zh:{home:"总览",learn:"学习",exam:"考试重点",formula:"公式库",lab:"实验室",recall:"主动回忆",search:"搜索物理内容…",start:"开始复习",continue:"继续",focus:"先掌握这些",why:"为什么重要",trap:"考试陷阱",memory:"记忆锁",test:"测试自己",next:"下一项",prev:"上一项",done:"完成",progress:"章节进度",quick:"快速复习",all:"全部章节",t4:"中四",t5:"中五",xray:"X-RAY",reset:"重置",show:"显示答案",hide:"隐藏答案",score:"得分",strong:"掌握",weak:"再看一次",slogan:"理解。识别。解决。",tip:"阅读 → 遮住 → 回忆 → 检查。"},
 ta:{home:"முகப்பு",learn:"கற்க",exam:"தேர்வு முக்கியம்",formula:"சூத்திர அறை",lab:"பரிசோதனை",recall:"நினைவூட்டல்",search:"இயற்பியலில் தேடவும்…",start:"மீள்பார்வை தொடங்கு",continue:"தொடரவும்",focus:"முதலில் இவற்றைக் கற்கவும்",why:"இது ஏன் முக்கியம்",trap:"தேர்வு சிக்கல்",memory:"நினைவுக் பூட்டு",test:"உங்களைச் சோதிக்கவும்",next:"அடுத்து",prev:"முந்தையது",done:"முடிந்தது",progress:"அத்தியாய முன்னேற்றம்",quick:"விரைவு மீள்பார்வை",all:"அனைத்து அத்தியாயங்கள்",t4:"படிவம் 4",t5:"படிவம் 5",xray:"X-RAY",reset:"மீட்டமை",show:"பதிலை காட்டு",hide:"பதிலை மறை",score:"மதிப்பெண்",strong:"நன்று",weak:"மீண்டும் பார்க்கவும்",slogan:"புரிந்து கொள். கண்டுபிடி. தீர்வு காண்.",tip:"படி → மறை → நினைவில் கூறு → சரிபார்."}
} as const;

export default function PhysicsApp(){
 const [selected,setSelected]=useState(chapters[0]?.id??"F4_C1");
 const [tab,setTab]=useState<Tab>("learn");
 const [query,setQuery]=useState("");
 const [theme,setTheme]=useState<"dark"|"light">("dark");
 const [lang,setLang]=useState<keyof typeof ui>("en");
 const [progress,setProgress]=useState<Record<string,number>>({});
 const [flipped,setFlipped]=useState<Record<string,boolean>>({});
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [test,setTest]=useState(false);
 const [testIndex,setTestIndex]=useState(0);
 const [testScore,setTestScore]=useState(0);
 const [liked,setLiked]=useState<Record<string,boolean>>({});
 const [xray,setXray]=useState(false);
 const [xrayIndex,setXrayIndex]=useState(0);
 const L=ui[lang];
 const chapter=chapters.find(c=>c.id===selected)??chapters[0];
 const translate=(target:keyof typeof ui)=>{setLang(target);if(target!=="en"){const code=target==="zh"?"zh-CN":target;document.cookie="googtrans=/ms/"+code+";path=/"}else{document.cookie="googtrans=/ms/ms;path=/"}window.location.reload()};
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?chapters.filter(c=>JSON.stringify(c).toLowerCase().includes(q)):chapters},[query]);
 const f4=filtered.filter(c=>c.id.startsWith("F4_")),f5=filtered.filter(c=>c.id.startsWith("F5_"));
 const chapterProgress=progress[selected]??0;
 const quiz=chapter.interactive_features.quiz;
 const xrayItems=[...chapter.focus.map(x=>({kind:"FOCUS",text:x})),...chapter.patterns.map(x=>({kind:"PATTERN",text:x})),...chapter.formulas.map(x=>({kind:"FORMULA",text:x.symbol+" — "+x.relation}))];

 useEffect(()=>{try{const saved=localStorage.getItem("physics-spm-state");if(saved){const s=JSON.parse(saved);if(s.theme)setTheme(s.theme);if(s.lang)setLang(s.lang);if(s.progress)setProgress(s.progress)}}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("physics-spm-state",JSON.stringify({theme,lang,progress}))}catch{}},[theme,lang,progress]);
 useEffect(()=>{const onHash=()=>{const m=location.hash.match(/#\/t([45])\/(\d+)/);if(m){const id="F"+m[1]+"_C"+m[2];if(chapters.some(c=>c.id===id))setSelected(id)}};onHash();addEventListener("hashchange",onHash);return()=>removeEventListener("hashchange",onHash)},[]);
 const go=(id:string)=>{setSelected(id);setTab("learn");const c=chapters.find(x=>x.id===id);if(c){history.replaceState(null,"","#/t"+(id.startsWith("F4")?"4":"5")+"/"+c.chapter_number)}window.scrollTo({top:0,behavior:"smooth"})};
 const selectedIndex=chapters.findIndex(c=>c.id===selected);
 const previous=chapters[selectedIndex-1], next=chapters[selectedIndex+1];
 const mark=(amount:number)=>setProgress(v=>({...v,[selected]:Math.max(0,Math.min(100,amount))}));
 const openTest=()=>{setTest(true);setTestIndex(0);setTestScore(0);setAnswers({})};
 const answerTest=(choice:string)=>{const q=quiz[testIndex];if(!answers["test-"+testIndex]){setAnswers(v=>({...v,["test-"+testIndex]:choice}));if(choice===q.correct_answer)setTestScore(s=>s+1)}};
 const finishTest=()=>{mark(Math.max(chapterProgress,100));setTest(false)};
 const tabList:[Tab,string,any][]=[["learn",L.learn,BookOpen],["exam",L.exam,Target],["formula",L.formula,Sigma],["lab",L.lab,FlaskConical],["recall",L.recall,Brain]];
 return <div className={"app "+(theme==="light"?"light":"")}>
  <header className="topbar"><div className="top-inner">
   <button className="logo" onClick={()=>go(chapters[0].id)}><span>Φ</span><div><strong>PHYSICS SPM</strong><small>KSSM F4 + F5</small></div></button>
   <div className="global-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={L.search}/>{query&&<span>{filtered.length}</span>}</div>
   <div className="top-actions"><button className="tiny-btn" onClick={()=>setTheme(v=>v==="dark"?"light":"dark")}>◐ {theme==="dark"?"Bright":"Dark"}</button><select value={lang} onChange={e=>translate(e.target.value as keyof typeof ui)}><option value="en">English</option><option value="ms">Bahasa Melayu</option><option value="id">Indonesia</option><option value="zh">中文</option><option value="ta">தமிழ்</option></select><button className="xray" onClick={()=>setXray(true)}><Zap size={14}/> {L.xray}</button></div>
  </div></header>

  <div className="mobile-bar"><select value={selected} onChange={e=>go(e.target.value)}>{chapters.map(c=><option key={c.id} value={c.id}>{c.id.replace("_"," ")} · {c.title}</option>)}</select></div>

  <div className="workspace">
   <aside className="chapters"><div className="side-label">{L.all}</div>{[[L.t4,f4],[L.t5,f5]].map(([label,list])=><div key={String(label)}><div className="form-label">{label}</div>{(list as Chapter[]).map(c=><button key={c.id} className={"chapter-link "+(c.id===selected?"active":"")} onClick={()=>go(c.id)}><span>{pad(c.chapter_number)}</span><b>{c.title}</b><i>{progress[c.id]??0}%</i></button>)}</div>)}
    <div className="side-card"><div className="eyebrow">⚡ {L.slogan}</div><p>{L.tip}</p></div>
   </aside>

   <main className="reader">
    <section className="welcome"><div className="welcome-copy"><div className="eyebrow">KSSM · SPM REVISION SYSTEM</div><h1>Physics that feels like<br/><em>revision, not reading.</em></h1><p>Everything you need for a chapter is compressed into a path: understand it, lock the memory, recognise the exam pattern, then prove you can answer it.</p><div className="welcome-actions"><button className="primary" onClick={()=>{setTab("learn");mark(Math.max(chapterProgress,10))}}>{chapterProgress>0?L.continue:L.start} <ChevronRight size={16}/></button><button className="secondary" onClick={openTest}><Brain size={16}/> {L.test}</button></div></div><div className="orbit"><div className="orbit-ring r1"/><div className="orbit-ring r2"/><div className="orbit-core">Φ</div><span>13<br/><small>CHAPTERS</small></span></div></section>

    <div className="chapter-intro"><div><div className="crumb">{chapter.id.replace("_"," ")} · {chapter.id.startsWith("F4")?"FORM 4":"FORM 5"}</div><h2>{chapter.title}</h2><p>{chapter.slogan}</p></div><div className="chapter-tools"><button onClick={()=>setLiked(v=>({...v,[selected]:!v[selected]}))} className={liked[selected]?"liked":"icon-btn"}><Heart size={16} fill={liked[selected]?"currentColor":"none"}/></button><button className="xray-mini" onClick={()=>setXray(true)}><Zap size={14}/> {L.xray}</button></div></div>

    <div className="progress-line"><div><b>{chapterProgress}%</b> {L.progress}</div><div className="bar"><span style={{width:chapterProgress+"%"}}/></div><button onClick={()=>mark(chapterProgress>=100?0:100)}>{chapterProgress>=100?L.reset:L.done}</button></div>

    <nav className="reader-tabs">{tabList.map(([id,label,Icon])=><button key={id} className={tab===id?"active":""} onClick={()=>{setTab(id);mark(Math.max(chapterProgress,id==="learn"?15:35))}}><Icon size={15}/>{label}</button>)}</nav>

    {tab==="learn"&&<Learn chapter={chapter} L={L} onExam={()=>{setTab("exam");mark(Math.max(chapterProgress,45))}}/>}
    {tab==="exam"&&<Exam chapter={chapter} L={L} onTest={openTest}/>}
    {tab==="formula"&&<Formula chapter={chapter} L={L}/>}
    {tab==="lab"&&<Lab chapter={chapter} L={L}/>}
    {tab==="recall"&&<Recall chapter={chapter} L={L} flipped={flipped} setFlipped={setFlipped} answers={answers} setAnswers={setAnswers}/>}

    <div className="chapter-nav"><button disabled={!previous} onClick={()=>previous&&go(previous.id)}><ChevronLeft size={16}/><span>{L.prev}<b>{previous?.title}</b></span></button><button disabled={!next} onClick={()=>next&&go(next.id)}><span>{L.next}<b>{next?.title}</b></span><ChevronRight size={16}/></button></div>
   </main>
  </div>

  {xray&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setXray(false)}><div className="xray-modal"><div className="modal-head"><div><div className="eyebrow">⚡ SPM X-RAY</div><h2>Find the marks hiding in this chapter.</h2></div><button onClick={()=>setXray(false)}>×</button></div><div className="xray-type">{xrayItems[xrayIndex%xrayItems.length]?.kind}</div><div className="xray-text">{xrayItems[xrayIndex%xrayItems.length]?.text}</div><div className="xray-actions"><button className="secondary" onClick={()=>setXrayIndex(i=>(i+1)%xrayItems.length)}>NEXT HIT <ChevronRight size={15}/></button><button className="primary" onClick={()=>{setXray(false);setTab("exam")}}>OPEN EXAM HITS</button></div><small>{xrayIndex+1} / {xrayItems.length} · {L.slogan}</small></div></div>}

  {test&&<TestModal quiz={quiz} index={testIndex} score={testScore} answers={answers} onAnswer={answerTest} onNext={()=>setTestIndex(i=>i+1)} onFinish={finishTest} L={L}/>}
 </div>
}

function Learn({chapter,L,onExam}:{chapter:Chapter;L:any;onExam:()=>void}){return <section className="content">
 <div className="hero-slogan"><div><div className="eyebrow">{L.memory}</div><h3>{chapter.slogan}</h3><p>{L.tip}</p></div><button className="primary" onClick={onExam}>{L.exam}<ChevronRight size={15}/></button></div>
 <div className="section-heading"><div><span>01</span><h3>{L.focus}</h3></div><p>These are the pieces most worth carrying into a question.</p></div>
 <div className="focus-grid">{chapter.focus.map((x,i)=><article className="focus-card" key={i}><span>{pad(i+1)}</span><strong>{x}</strong><small>HIGH-YIELD</small></article>)}</div>
 <div className="section-heading"><div><span>02</span><h3>{L.learn}</h3></div><p>Short enough to revise. Complete enough to understand.</p></div>
 <div className="concept-list">{chapter.core_concepts.map((x,i)=><article className="concept" key={i}><div className="concept-no">{pad(i+1)}</div><div className="concept-main"><div className="eyebrow">{x.topic}</div><p className="summary">{x.summary}</p><ul>{x.high_yield_notes.map((n,j)=><li key={j}>{n}</li>)}</ul><div className="trap"><b>⚠ {L.trap}</b><span>{Array.isArray(x.exam_traps)?x.exam_traps.join(" · "):x.exam_traps}</span></div></div></article>)}</div>
 <div className="recall-banner"><Brain size={20}/><div><b>{L.test}</b><span>Don't reread this chapter yet. Try recalling it first.</span></div><button className="secondary" onClick={()=>document.querySelector(".reader-tabs")?.scrollIntoView({behavior:"smooth"})}>{L.recall}</button></div>
 </section>}

function Exam({chapter,L,onTest}:{chapter:Chapter;L:any;onTest:()=>void}){return <section className="content"><div className="exam-hero"><div className="eyebrow">SPM-STYLE PATTERNS</div><h2>{chapter.slogan}</h2><p>{raw.exam_slogan}</p><button className="primary" onClick={onTest}>{L.test} <Brain size={15}/></button></div><div className="section-heading"><div><span>01</span><h3>{L.focus}</h3></div></div><div className="exam-focus">{chapter.focus.map((x,i)=><div key={i}><b>{pad(i+1)}</b><span>{x}</span><strong>KNOW</strong></div>)}</div><div className="section-heading"><div><span>02</span><h3>Question patterns to master</h3></div><p>These are patterns, not leaked future questions.</p></div><div className="pattern-list">{chapter.patterns.map((x,i)=><article key={i}><span>{pad(i+1)}</span><p>{x}</p><CheckCircle2 size={17}/></article>)}</div><div className="marking"><b>MARK-SAVER</b><p>Before you move on: show working, use SI units, label diagrams, state vector direction where needed, and ask whether the answer makes physical sense.</p></div></section>}

function Formula({chapter,L}:{chapter:Chapter;L:any}){return <section className="content"><div className="formula-head"><div><div className="eyebrow">{L.formula}</div><h2>See the relationship. Then use it.</h2></div><div className="formula-count">{chapter.formulas.length}<small>FORMULAS</small></div></div><div className="formula-vault">{chapter.formulas.map((f,i)=><article key={i}><div className="formula-index">{pad(i+1)}</div><div><div className="formula-symbol">{f.symbol}</div><p>{f.relation}</p></div><code>{f.unit}</code></article>)}</div><div className="unit-strip"><Sigma size={18}/><b>UNIT CHECK</b><span>Write the SI unit before you submit a numerical answer. A correct number with a wrong unit can lose marks.</span></div></section>}

function Lab({chapter,L}:{chapter:Chapter;L:any}){return <section className="content"><div className="lab-head"><FlaskConical size={25}/><div><div className="eyebrow">{L.lab}</div><h2>Variables are marks too.</h2><p>Train yourself to identify what changes, what responds, and what stays fixed.</p></div></div><div className="lab-grid">{chapter.experiments.map((e,i)=><article key={i}><div className="lab-title"><span>{pad(i+1)}</span><h3>{e.title}</h3></div><div className="variable"><b>MANIPULATED</b><p>{e.variables.manipulated}</p></div><div className="variable"><b>RESPONDING</b><p>{e.variables.responding}</p></div><div className="variable"><b>CONSTANT</b><p>{e.variables.constant}</p></div><div className="takeaway"><CheckCircle2 size={15}/><span>{e.key_takeaway}</span></div></article>)}</div></section>}

function Recall({chapter,L,flipped,setFlipped,answers,setAnswers}:{chapter:Chapter;L:any;flipped:Record<string,boolean>;setFlipped:any;answers:Record<string,string>;setAnswers:any}){return <section className="content"><div className="recall-head"><div><div className="eyebrow">{L.recall}</div><h2>Make your brain do the work.</h2><p>{L.tip}</p></div><RotateCcw size={25}/></div><div className="flash-grid">{chapter.interactive_features.flashcards.map((f,i)=>{const k=chapter.id+"-f"+i;return <article className={"flashcard "+(flipped[k]?"revealed":"")} key={k}><span>CARD {pad(i+1)}</span><div>{flipped[k]?f.answer:f.question}</div><button onClick={()=>setFlipped((v:any)=>({...v,[k]:!v[k]}))}>{flipped[k]?L.hide:L.show}</button></article>})}</div><div className="quiz-stack">{chapter.interactive_features.quiz.map((m,i)=>{const k=chapter.id+"-q"+i;const chosen=answers[k];return <article className="quiz-card" key={k}><div className="eyebrow">QUESTION {pad(i+1)}</div><h3>{m.question}</h3><div className="options">{m.options.map((o,j)=>{const letter=String.fromCharCode(65+j);const cls=chosen?(o===m.correct_answer?"correct":chosen===letter?"wrong":""):"";return <button className={cls} key={letter} onClick={()=>setAnswers((v:any)=>({...v,[k]:letter}))}>{letter}. {o}</button>})}</div>{chosen&&<p className="explanation"><b>{chosen===String.fromCharCode(65+m.options.indexOf(m.correct_answer))?"✓ "+L.strong:"↻ "+L.weak}</b> · {m.explanation}</p>}</article>})}</div></section>}

function TestModal({quiz,index,score,answers,onAnswer,onNext,onFinish,L}:{quiz:any[];index:number;score:number;answers:Record<string,string>;onAnswer:(x:string)=>void;onNext:()=>void;onFinish:()=>void;L:any}){const done=index>=quiz.length;const q=quiz[Math.min(index,quiz.length-1)];if(done)return <div className="modal-backdrop"><div className="test-modal result"><div className="result-icon">✓</div><div className="eyebrow">{L.score}</div><h2>{score} / {quiz.length}</h2><p>{score===quiz.length?"You cleared every question.":"You found the gaps — that is exactly what this test is for."}</p><button className="primary" onClick={onFinish}>{L.done}</button></div></div>;const key="test-"+index;const chosen=answers[key];return <div className="modal-backdrop"><div className="test-modal"><div className="test-top"><span>{L.test}</span><b>{index+1}/{quiz.length}</b></div><div className="test-progress"><span style={{width:((index)/quiz.length)*100+"%"}}/></div><div className="eyebrow">QUESTION {pad(index+1)}</div><h2>{q.question}</h2><div className="options test-options">{q.options.map((o,j)=>{const letter=String.fromCharCode(65+j);const cls=chosen?(o===q.correct_answer?"correct":chosen===letter?"wrong":""):"";return <button className={cls} key={letter} onClick={()=>onAnswer(letter)}>{letter}. {o}</button>})}</div>{chosen&&<><p className="explanation">{q.explanation}</p><button className="primary next-test" onClick={onNext}>{index===quiz.length-1?L.done:L.next}<ChevronRight size={15}/></button></>}</div></div>}
