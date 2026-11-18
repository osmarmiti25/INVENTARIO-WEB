const KEY="inventario_productos";
const SEED=[{id:1,nombre:"Lápiz",categoria:"Papelería",descripcion:"",cantidad:120},{id:2,nombre:"Cuaderno",categoria:"Papelería",descripcion:"",cantidad:50},{id:3,nombre:"Borrador",categoria:"Papelería",descripcion:"",cantidad:35},{id:4,nombre:"Regla",categoria:"Papelería",descripcion:"",cantidad:40}];
function cargar(){
  try{const r=localStorage.getItem(KEY);if(r===null){guardar(SEED);return SEED.slice()}
    const d=JSON.parse(r);return Array.isArray(d)?d:[]}catch(e){return []}
}
function guardar(l){try{localStorage.setItem(KEY,JSON.stringify(l));return true}catch(e){return false}}
function nuevoId(l){return l.reduce((m,p)=>Math.max(m,p.id),0)+1}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function norm(s){return s.trim().replace(/\s+/g," ")}
function validar(d,lista,idActual){
  const e={};
  if(d.nombre.length<2)e.nombre="El nombre es obligatorio (mínimo 2 caracteres).";
  else if(d.nombre.length>60)e.nombre="Máximo 60 caracteres.";
  if(!d.categoria)e.categoria="La categoría es obligatoria.";
  if(d.descripcion.length>200)e.descripcion="Máximo 200 caracteres.";
  if(d.cantidadTxt==="")e.cantidad="La cantidad es obligatoria.";
  else if(!/^\d+$/.test(d.cantidadTxt))e.cantidad="Solo números enteros, sin negativos ni decimales.";
  else if(+d.cantidadTxt>1000000)e.cantidad="Cantidad demasiado grande.";
  if(!e.nombre&&lista.some(p=>p.id!==idActual&&p.nombre.toLowerCase()===d.nombre.toLowerCase()&&p.categoria.toLowerCase()===d.categoria.toLowerCase()))
    e.nombre="Ya existe un producto con ese nombre en esa categoría.";
  return e;
}
function exportarCSV(lista){
  const celda=v=>{let s=String(v);if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
  const filas=[["ID","Producto","Categoría","Descripción","Existencia"],...lista.map(p=>[p.id,p.nombre,p.categoria,p.descripcion,p.cantidad])];
  const csv="\uFEFF"+filas.map(f=>f.map(celda).join(",")).join("\r\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const h=new Date().toISOString().slice(0,10);
  a.download="reporte_inventario_"+h+".csv";
  document.body.appendChild(a);a.click();a.remove();
}
