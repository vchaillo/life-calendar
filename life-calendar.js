
(()=>{
 const root=document.getElementById('life-preview');
 const categories=[{id:'sport',name:'Sport & mouvement',color:'var(--lc-sport)'},{id:'travel',name:'Voyages',color:'var(--lc-travel)'},{id:'project',name:'Projets',color:'var(--lc-project)'},{id:'social',name:'Liens sociaux',color:'var(--lc-social)'},{id:'learn',name:'Apprentissage',color:'var(--lc-learn)'}];
 const storageKey='life-calendar.weeks.v1';
 let saved=[];
 try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(parsed))saved=parsed.filter(entry=>Array.isArray(entry)&&entry.length===2&&/^(?:[0-9]|[1-8][0-9]):(?:[0-9]|[1-4][0-9]|5[01])$/.test(entry[0])&&categories.some(category=>category.id===entry[1]));}catch(error){console.warn('Could not read saved weeks.',error);}
 const marks=new Map(saved);const history=[];const years=90;let active='sport',painting=false,stroke=null,anchor=0,lastEnd=0,pointerId=null;let cells=[];
 const grid=root.querySelector('.lc-grid'),palette=root.querySelector('.lc-palette'),detail=root.querySelector('.lc-selected');
 categories.forEach(category=>{const button=document.createElement('button');button.className='lc-category cursor-interaction';button.dataset.category=category.id;button.innerHTML='<span class="lc-swatch" style="background:'+category.color+'"></span><span>'+category.name+'</span><small>0</small>';palette.append(button)});
 function select(id){active=id;root.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===id)));root.querySelector('[data-action=erase]').setAttribute('aria-pressed',String(id===null))}
 function updateCounts(){const counts={};marks.forEach(id=>{counts[id]=(counts[id]||0)+1});root.querySelector('.lc-count').textContent=marks.size+' semaine'+(marks.size>1?'s colorées':' colorée');categories.forEach(category=>{palette.querySelector('[data-category='+category.id+'] small').textContent=counts[category.id]||0});root.querySelector('[data-action=undo]').disabled=!history.length}
 function paintCell(button){const id=marks.get(button.dataset.key),category=categories.find(item=>item.id===id);button.style.background=category?category.color:'';const age=Number(button.dataset.key.split(':')[0]),week=Number(button.dataset.key.split(':')[1])+1;button.setAttribute('aria-label',age+' ans, semaine '+week+', '+(category?category.name:'non colorée'));button.title=button.getAttribute('aria-label')}
 function render(){grid.replaceChildren();root.querySelector('.lc-badge').textContent=years+' années';const fragment=document.createDocumentFragment();for(let age=0;age<years;age++){const row=document.createElement('div');row.className='lc-row'+(age>0&&age%10===0?' decade':'');const label=document.createElement('span');label.className='lc-age';label.textContent=age;row.append(label);const rowCells=document.createElement('div');rowCells.className='lc-cells';for(let week=0;week<52;week++){const button=document.createElement('button');button.type='button';button.className='lc-week cursor-interaction';button.dataset.key=age+':'+week;button.dataset.index=age*52+week;paintCell(button);rowCells.append(button)}row.append(rowCells);fragment.append(row)}grid.append(fragment);cells=Array.from(grid.querySelectorAll('.lc-week'));updateCounts()}
 function apply(button){const key=button.dataset.key;const old=marks.get(key)||null;if(old===active)return;if(!stroke.has(key))stroke.set(key,old);if(active)marks.set(key,active);else marks.delete(key);paintCell(button)}
 function applyRange(end){
  const start=Math.min(anchor,end),stop=Math.max(anchor,end);
  const previousStart=Math.min(anchor,lastEnd),previousStop=Math.max(anchor,lastEnd);
  for(let index=Math.min(start,previousStart);index<=Math.max(stop,previousStop);index++){
   const button=cells[index],key=button.dataset.key;
   if(index>=start&&index<=stop){apply(button)}
   else if(stroke.has(key)){const original=stroke.get(key);if(original)marks.set(key,original);else marks.delete(key);paintCell(button);stroke.delete(key)}
  }
  lastEnd=end;
  detail.textContent=start===stop?cells[end].getAttribute('aria-label'):'De '+Math.floor(start/52)+' ans, semaine '+(start%52+1)+' à '+Math.floor(stop/52)+' ans, semaine '+(stop%52+1)+' · '+(stop-start+1)+' semaines';
  updateCounts();
 }
 function save(){try{localStorage.setItem(storageKey,JSON.stringify([...marks]));root.querySelector('.lc-session').lastChild.textContent=' Sauvegarde locale dans ce navigateur';}catch(error){root.querySelector('.lc-session').lastChild.textContent=' Sauvegarde indisponible';console.warn('Could not save weeks.',error);}}
 function finish(){if(!painting&&!stroke)return;if(stroke&&stroke.size)history.push(stroke);stroke=null;painting=false;if(pointerId!==null&&grid.hasPointerCapture(pointerId))grid.releasePointerCapture(pointerId);pointerId=null;updateCounts();save()}
 palette.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(button)select(button.dataset.category)});
 root.querySelector('[data-action=erase]').addEventListener('click',()=>select(null));
 root.querySelector('[data-action=undo]').addEventListener('click',()=>{finish();const last=history.pop();if(!last)return;last.forEach((id,key)=>{if(id)marks.set(key,id);else marks.delete(key)});render();save();detail.textContent='Dernier geste annulé.'});
 grid.style.userSelect='none';grid.style.touchAction='none';
 grid.addEventListener('dragstart',event=>event.preventDefault());
 grid.addEventListener('pointerdown',event=>{const button=event.target.closest('.lc-week');if(!button||event.button!==0)return;event.preventDefault();finish();painting=true;stroke=new Map();anchor=lastEnd=Number(button.dataset.index);pointerId=event.pointerId;grid.setPointerCapture(pointerId);applyRange(anchor)});
 grid.addEventListener('pointermove',event=>{if(!painting||event.pointerId!==pointerId)return;const button=document.elementFromPoint(event.clientX,event.clientY)?.closest('.lc-week');if(button&&grid.contains(button)){const end=Number(button.dataset.index);if(end!==lastEnd)applyRange(end)}});
 grid.addEventListener('pointerover',event=>{if(painting)return;const button=event.target.closest('.lc-week');if(button)detail.textContent=button.getAttribute('aria-label')});
 grid.addEventListener('click',event=>{const button=event.target.closest('.lc-week');if(button&&event.detail===0){stroke=new Map();apply(button);detail.textContent=button.getAttribute('aria-label');finish()}});
 grid.addEventListener('pointerup',finish);grid.addEventListener('pointercancel',finish);grid.addEventListener('lostpointercapture',finish);window.addEventListener('blur',finish);
 grid.addEventListener('focusin',event=>{if(event.target.matches('.lc-week'))detail.textContent=event.target.getAttribute('aria-label')});
 const axis=root.querySelector('.lc-axis>div');for(let week=1;week<=52;week++){const label=document.createElement('b');label.textContent=[1,10,20,30,40,52].includes(week)?week:'';axis.append(label)}
 select('sport');render();
})();
