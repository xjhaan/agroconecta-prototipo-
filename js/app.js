// AgroConecta Pamplona - prototipo de alta fidelidad (Fase 4, Proyecto de Ingeniería II)
// Los datos se guardan en localStorage, no hay backend todavía.

var KEY = "agroconecta-v1";
var ESTADOS = ["Nuevo", "En preparación", "Entregado"];
var ICONOS = ["🥔", "🧅", "🍓", "🥕", "🍅", "🧀"];

var datos = { users: [], prods: [
  { id: 1, f: "🥔", n: "Papa criolla",  p: "Finca La Esperanza",   v: "Chichira",    c: "Tubérculos", pr: 3200, q: 50 },
  { id: 2, f: "🧅", n: "Cebolla larga", p: "Hortalizas El Páramo", v: "Cimitarigua", c: "Verduras",   pr: 2800, q: 30 },
  { id: 3, f: "🍓", n: "Fresa",         p: "Fresas San Rafael",    v: "Alcaparral",  c: "Frutas",     pr: 6500, q: 20 }
], ped: [], nid: 4 };

var me = null, registro = false, cat = "Todos", foto = "🥔", cart = [];

// --- utilidades ---
function $(id) { return document.getElementById(id); }
function cop(n) { return n.toLocaleString("es-CO"); }
function guardar() { try { localStorage.setItem(KEY, JSON.stringify(datos)); } catch (e) {} }
function cargar() {
  try { var d = localStorage.getItem(KEY); if (d) datos = JSON.parse(d); } catch (e) {}
}

// --- navegación ---
function ir(s) {
  if (s === "salir") { me = null; cart = []; $("who").textContent = "Del campo a tu mesa, sin intermediarios"; $("nav").innerHTML = ""; s = "auth"; }
  document.querySelectorAll("section").forEach(function (e) { e.classList.remove("on"); });
  $(s).classList.add("on");
  var tabs = !me ? [] : me.r === "p"
    ? [["publicar", "Publicar"], ["bandeja", "Pedidos"], ["salir", "Salir"]]
    : [["catalogo", "Catálogo"], ["carrito", "Carrito (" + cart.length + ")"], ["historial", "Historial"], ["salir", "Salir"]];
  $("nav").innerHTML = tabs.map(function (t) {
    return '<button class="' + (t[0] === s ? "on" : "") + '" onclick="ir(\'' + t[0] + '\')">' + t[1] + "</button>";
  }).join("");
  if (s === "catalogo") lista();
  if (s === "carrito") verCarrito();
  if (s === "historial") historial();
  if (s === "bandeja") bandeja();
  if (s === "publicar") iconos();
  window.scrollTo(0, 0);
}

// --- HU1 / HU2: registro e inicio de sesión ---
function modo(ingresar) {
  registro = !ingresar;
  $("fn").style.display = $("fr").style.display = ingresar ? "none" : "block";
  $("ab").textContent = ingresar ? "Ingresar" : "Crear cuenta";
  $("ae").textContent = "";
}
function entrar() {
  var c = $("ac").value.trim(), p = $("ap").value, n = $("an").value.trim();
  if (!c || !p || (registro && !n)) { $("ae").textContent = "Completa todos los campos."; return; }
  if (registro) {
    if (datos.users.some(function (u) { return u.c === c; })) { $("ae").textContent = "Ese correo ya está registrado."; return; }
    me = { n: n, c: c, p: p, r: $("ar").value };
    datos.users.push(me); guardar();
  } else {
    me = datos.users.filter(function (u) { return u.c === c && u.p === p; })[0];
    if (!me) { $("ae").textContent = "Datos incorrectos. Si no tienes cuenta, regístrate."; return; }
  }
  $("who").textContent = me.n + " · " + (me.r === "p" ? "Productor" : "Comprador");
  ir(me.r === "p" ? "publicar" : "catalogo");
}

// --- HU3: publicar producto ---
function iconos() {
  $("pk").innerHTML = ICONOS.map(function (e) {
    return '<span class="chip ' + (e === foto ? "on" : "") + '" onclick="foto=\'' + e + '\';iconos()">' + e + "</span>";
  }).join("");
}
function publicar() {
  var n = $("pn").value.trim(), pr = +$("pq").value, q = +$("pd").value;
  if (!n || !pr || !q) { $("pm").style.color = ""; $("pm").textContent = "Falta nombre, precio o cantidad."; return; }
  datos.prods.push({ id: datos.nid++, f: foto, n: n, p: me.n, v: "Pamplona", c: $("pc").value, pr: pr, q: q });
  guardar();
  $("pm").style.color = "var(--pri)";
  $("pm").textContent = "Guardado. Ya aparece en el catálogo.";
  $("pn").value = $("pq").value = $("pd").value = $("pe").value = "";
}

// --- HU4 / HU5: catálogo y búsqueda ---
function lista() {
  var cats = ["Todos", "Verduras", "Frutas", "Tubérculos", "Lácteos"], b = $("bq").value.toLowerCase();
  $("chips").innerHTML = cats.map(function (c) {
    return '<span class="chip ' + (c === cat ? "on" : "") + '" onclick="cat=\'' + c + '\';lista()">' + c + "</span>";
  }).join("");
  var r = datos.prods.filter(function (x) {
    return (cat === "Todos" || x.c === cat) && (x.n + x.p).toLowerCase().indexOf(b) > -1;
  });
  $("lista").innerHTML = r.length ? r.map(function (x) {
    return '<div class="card"><div class="ph">' + x.f + "</div><b>" + x.n + '</b><div class="mut">$' + cop(x.pr) +
      " / unidad<br>" + x.p + " · " + x.v + '</div><button class="btn" onclick="agregar(' + x.id + ')">Agregar</button></div>';
  }).join("") : '<p class="mut">Sin resultados para esa búsqueda.</p>';
}

// --- HU6: carrito y pedido ---
function agregar(id) {
  var x = datos.prods.filter(function (a) { return a.id === id; })[0];
  var f = cart.filter(function (c) { return c.id === id; })[0];
  if (f) f.k++; else cart.push({ id: id, f: x.f, n: x.n, p: x.p, pr: x.pr, k: 1 });
  ir("catalogo");
}
function verCarrito() {
  if (!cart.length) { $("cv").innerHTML = '<div class="card mut">Tu carrito está vacío. Agrega productos desde el catálogo.</div>'; return; }
  var t = 0;
  $("cv").innerHTML = '<div class="card"><b>Mi pedido</b>' + cart.map(function (c, i) {
    t += c.pr * c.k;
    return '<div class="row" style="margin-top:8px"><span>' + c.f + " <b>" + c.n + '</b><div class="mut">$' + cop(c.pr) +
      '</div></span><span class="q"><button onclick="cambiar(' + i + ',-1)">-</button>' + c.k +
      '<button onclick="cambiar(' + i + ',1)">+</button></span></div>';
  }).join("") + '<hr><div class="row"><b>Total</b><b>$' + cop(t) + '</b></div><label>Nota para el productor</label>' +
    '<textarea id="nt" rows="2"></textarea><button class="btn" onclick="confirmar(' + t + ')">Confirmar pedido</button></div>';
}
function cambiar(i, d) { cart[i].k += d; if (cart[i].k < 1) cart.splice(i, 1); ir("carrito"); }
function confirmar(total) {
  datos.ped.push({ id: datos.ped.length + 1, b: me.n, items: cart.slice(), t: total, nt: $("nt").value, e: 0 });
  guardar(); cart = [];
  alert("Pedido enviado. El productor lo verá en su bandeja.");
  ir("historial");
}

// --- HU7: historial del comprador ---
function historial() {
  var m = datos.ped.filter(function (o) { return o.b === me.n; });
  $("hv").innerHTML = m.length ? m.map(function (o) {
    return '<div class="card"><div class="row"><b>Pedido #' + o.id + '</b><span class="tag">' + ESTADOS[o.e] +
      '</span></div><div class="mut">' + o.items.length + " productos · $" + cop(o.t) + "</div></div>";
  }).join("") : '<div class="card mut">Aún no tienes pedidos.</div>';
}

// --- HU8: bandeja de pedidos del productor ---
function bandeja() {
  $("bv").innerHTML = datos.ped.length ? datos.ped.map(function (o, i) {
    return '<div class="card"><div class="row"><b>Pedido #' + o.id + '</b><span class="tag">' + ESTADOS[o.e] + '</span></div>' +
      '<div class="mut">' + o.b + " · " + o.items.map(function (c) { return c.k + " " + c.n; }).join(", ") +
      (o.nt ? "<br>Nota: " + o.nt : "") + '</div><button class="btn g" onclick="siguiente(' + i + ')">Cambiar estado</button></div>';
  }).join("") : '<div class="card mut">Aún no hay pedidos. Pide algo como comprador para verlo aquí.</div>';
}
function siguiente(i) { datos.ped[i].e = (datos.ped[i].e + 1) % 3; guardar(); bandeja(); }

// --- arranque ---
cargar();
modo(true);
