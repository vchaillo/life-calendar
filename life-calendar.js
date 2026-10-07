
(()=>{
const root=document.getElementById('life-minimal');
const categoryKey='life-calendar.categories.v1';
let categories=[['sport','Sport & mouvement','#839775'],['travel','Voyages','#c49a67'],['project','Projets','#8394af'],['social','Liens sociaux','#b28394'],['learn','Apprentissage','#a49b68']];
try {
 const saved=JSON.parse(localStorage.getItem(categoryKey)||'null');
 if(Array.isArray(saved)&&saved.length&&saved.every(c=>Array.isArray(c)&&c.length===3&&typeof c[0]==='string'&&/^[a-zA-Z0-9_-]+$/.test(c[0])&&c[0]!=='all'&&typeof c[1]==='string'&&c[1].trim()&&/^#[0-9a-f]{6}$/i.test(c[2]))&&new Set(saved.map(c=>c[0])).size===saved.length) categories=saved;
} catch(error) { console.warn('Could not read saved categories.',error); }
function saveCategories(){
 try { localStorage.setItem(categoryKey,JSON.stringify(categories));root.querySelector('.save-error').hidden=true; }
 catch(error) { root.querySelector('.save-error').hidden=false;console.warn('Could not save categories.',error); }
}
const marks=new Map(),history=[];let selected=null,eraser=false,stroke=null,anchor=0,last=0,pointer=null;
const storageKey='life-calendar.weeks.v1';
try {
  const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
  if(Array.isArray(saved)) saved.forEach(entry=>{
    if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||! /^(?:[0-9]|[1-8][0-9]):(?:[0-9]|[1-4][0-9]|5[01])$/.test(entry[0])||!categories.some(category=>category[0]===entry[1])) return;
    const [age,week]=entry[0].split(':').map(Number);
    marks.set(age*52+week,entry[1]);
  });
} catch(error) { console.warn('Could not read saved weeks.',error); }
function save(){
  try {
    const saved=Array.from(marks,([index,id])=>[Math.floor(index/52)+':'+(index%52),id]);
    localStorage.setItem(storageKey,JSON.stringify(saved));root.querySelector('.save-error').hidden=true;
  } catch(error) { root.querySelector('.save-error').hidden=false;console.warn('Could not save weeks.',error); }
}
const nav=root.querySelector('nav'),grid=root.querySelector('.grid');
function renderPalette(){
 nav.replaceChildren();
 [['all','Tout'],...categories].forEach(([id,label,color])=>{
  const button=document.createElement('button');button.type='button';button.dataset.category=id;button.textContent=label;
  if(id!=='all'){const dot=document.createElement('span');dot.className='swatch';dot.style.setProperty('--swatch',color);button.prepend(dot)}
  nav.append(button);
 });
 const add=document.createElement('button');add.type='button';add.dataset.add='true';add.textContent='+';add.setAttribute('aria-label','Créer une catégorie');add.title='Créer une catégorie';nav.append(add);
}
const dialog=root.querySelector('dialog'),editor=root.querySelector('.category-editor'),addForm=root.querySelector('.category-add');
function openManager(focusNew=false){
 finish();editor.replaceChildren();
 categories.forEach(category=>{
  const row=document.createElement('div');row.className='editor-row';
  const color=document.createElement('input');color.type='color';color.value=category[2];color.setAttribute('aria-label','Couleur de '+category[1]);
  const name=document.createElement('input');name.type='text';name.value=category[1];name.maxLength=60;name.setAttribute('aria-label','Nom de la catégorie '+category[1]);
  name.addEventListener('change',()=>{const value=name.value.trim();if(!value){name.value=category[1];return}category[1]=value;saveCategories();renderPalette();render()});
  color.addEventListener('input',()=>{category[2]=color.value;saveCategories();renderPalette();render()});
  row.append(color,name);editor.append(row);
 });
 if(!dialog.open)dialog.showModal();
 if(focusNew)addForm.elements.name.focus();
}
root.querySelector('[data-tool=manage]').addEventListener('click',()=>openManager());
addForm.addEventListener('submit',event=>{
 event.preventDefault();const name=addForm.elements.name.value.trim();if(!name)return;
 const id='category-'+crypto.randomUUID();categories.push([id,name,addForm.elements.color.value]);
 saveCategories();addForm.elements.name.value='';renderPalette();render();openManager(true);
});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});
renderPalette();
const cells=[];for(let age=0;age<90;age++){const row=document.createElement('div');row.className='row'+(age%10===0?' decade':'');const label=document.createElement('span');label.className='age';label.textContent=age;const group=document.createElement('div');group.className='cells';for(let week=0;week<52;week++){const b=document.createElement('button');b.type='button';b.className='week cursor-interaction';b.dataset.index=age*52+week;group.append(b);cells.push(b)}row.append(label,group);grid.append(row)}
for(let week=1;week<=52;week++){const b=document.createElement('b');b.textContent=[1,10,20,30,40,52].includes(week)?week:'';root.querySelector('.axis>div').append(b)}
function render(){cells.forEach((b,i)=>{const id=marks.get(i);b.style.background=id?categories.find(c=>c[0]===id)?.[2]||'':'';b.classList.toggle('filtered',!!selected&&id!==selected);b.setAttribute('aria-label',Math.floor(i/52)+' ans, semaine '+(i%52+1)+(id?', '+categories.find(c=>c[0]===id)[1]:', vide'))});grid.classList.toggle('editing',!!selected||eraser);nav.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===(selected||'all'))));root.querySelector('[data-tool=erase]').setAttribute('aria-pressed',String(eraser));root.querySelector('[data-tool=undo]').disabled=!history.length}
function finish(){if(stroke)for(const [index,original] of stroke){if(marks.get(index)===original)stroke.delete(index)}const changed=!!stroke?.size;if(changed)history.push(stroke);stroke=null;if(pointer!==null&&grid.hasPointerCapture(pointer))grid.releasePointerCapture(pointer);pointer=null;render();if(changed)save()}
function range(end){const lo=Math.min(anchor,end),hi=Math.max(anchor,end);for(let i=Math.min(lo,anchor,last);i<=Math.max(hi,anchor,last);i++){if(i>=lo&&i<=hi){if(!stroke.has(i))stroke.set(i,marks.get(i));if(eraser)marks.delete(i);else marks.set(i,selected)}else if(stroke.has(i)){const original=stroke.get(i);if(original)marks.set(i,original);else marks.delete(i);stroke.delete(i)}}last=end;render()}
nav.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.add){openManager(true);return}finish();selected=b.dataset.category==='all'?null:b.dataset.category;eraser=false;render()});
root.querySelector('[data-tool=erase]').addEventListener('click',()=>{finish();eraser=!eraser;render()});
root.querySelector('[data-tool=undo]').addEventListener('click',()=>{finish();const change=history.pop();change?.forEach((id,i)=>{if(id)marks.set(i,id);else marks.delete(i)});render();if(change)save()});
grid.addEventListener('pointerdown',e=>{const b=e.target.closest('.week');if(!b||e.button!==0||(!selected&&!eraser))return;e.preventDefault();finish();stroke=new Map();anchor=last=Number(b.dataset.index);pointer=e.pointerId;grid.setPointerCapture(pointer);range(anchor)});
grid.addEventListener('pointermove',e=>{if(!stroke||e.pointerId!==pointer)return;const b=document.elementFromPoint(e.clientX,e.clientY)?.closest('.week');if(b&&grid.contains(b))range(Number(b.dataset.index))});
grid.addEventListener('click',e=>{const b=e.target.closest('.week');if(b&&e.detail===0&&(selected||eraser)){stroke=new Map();anchor=last=Number(b.dataset.index);range(anchor);finish()}});
['pointerup','pointercancel','lostpointercapture'].forEach(event=>grid.addEventListener(event,finish));window.addEventListener('blur',finish);grid.addEventListener('dragstart',e=>e.preventDefault());render();
})();
