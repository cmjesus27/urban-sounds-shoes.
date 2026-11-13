const products = [
  {id:1,name:"Cactus Runner",artist:"TRAVIS-INSPIRED",category:"travis",price:68900,color:"#777d67",tag:"BEST SELLER",sizes:"39–44"},
  {id:2,name:"Certified Court",artist:"DRAKE-INSPIRED",category:"drake",price:74900,color:"#b8a68e",tag:"PREMIUM",sizes:"38–44"},
  {id:3,name:"Heroes Night",artist:"METRO-INSPIRED",category:"metro",price:79900,color:"#45494a",tag:"LIMITED DROP",sizes:"39–45"},
  {id:4,name:"Conejo Club",artist:"BAD BUNNY-INSPIRED",category:"badbunny",price:71900,color:"#c77e55",tag:"NEW DROP",sizes:"37–44"}
];
const money = n => "₡" + n.toLocaleString("es-CR");
let cart = JSON.parse(localStorage.getItem("uss_cart") || "[]");
let profile = JSON.parse(localStorage.getItem("uss_profile") || "null");
const $ = id => document.getElementById(id);
const productGrid = $("productGrid");

function renderProducts(filter="all"){
  const shown = products.filter(p=>filter==="all"||p.category===filter);
  $("productCount").textContent = String(shown.length).padStart(2,"0")+" PRODUCTOS";
  productGrid.innerHTML = shown.map(p=>`<article class="product-card"><div class="product-image"><span class="product-badge">${p.tag}</span><div class="product-shoe" style="--shoe:${p.color}"></div><button class="quick-add" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button></div><div class="product-info"><div class="product-meta"><span>${p.artist}</span><span>US / 0${p.id}</span></div><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><span class="sizes">Tallas ${p.sizes}</span></div></div></article>`).join("");
}
function saveCart(){localStorage.setItem("uss_cart",JSON.stringify(cart));renderCart()}
function addToCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();toast("Producto agregado a tu bolsa")}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  $("cartCount").textContent=count;$("drawerCount").textContent=`(${count})`;$("cartSubtotal").textContent=money(total);
  $("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-line"><div class="cart-thumb">US / 0${p.id}</div><div><h4>${p.name}</h4><p>${money(p.price)} · ${p.artist}</p><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Eliminar">×</button></div>`}).join(""):`<p class="cart-empty">Tu bolsa está vacía. Encuentra un par que hable por ti.</p>`;
  $("checkoutBtn").disabled=!cart.length;$("checkoutBtn").style.opacity=cart.length?1:.45;
}
function openDrawer(){$("overlay").classList.add("show");$("cartDrawer").classList.add("open")}
function closeAll(){$("overlay").classList.remove("show");$("cartDrawer").classList.remove("open");document.querySelectorAll(".modal").forEach(m=>m.classList.remove("show"))}
function openModal(id){closeAll();$("overlay").classList.add("show");$(id).classList.add("show")}
let toastTimer;function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}

productGrid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add))});
$("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)});
$("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const item=cart.find(x=>x.id===Number(q.dataset.qty));item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x!==item);saveCart()}if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));saveCart()}});
$("cartBtn").onclick=openDrawer;$("overlay").onclick=closeAll;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);
$("accountBtn").onclick=()=>{if(profile){$("userRole").value=profile.role;$("userName").value=profile.name;$("userEmail").value=profile.email}openModal("accountModal")};
$("saveAccount").onclick=()=>{const name=$("userName").value.trim(),email=$("userEmail").value.trim();if(!name||!email){$("accountMessage").textContent="Completa tu nombre y correo.";return}profile={role:$("userRole").value,name,email};localStorage.setItem("uss_profile",JSON.stringify(profile));$("accountMessage").textContent=`Perfil guardado: ${profile.role==="mayorista"?"Comercio / Mayorista":profile.role==="admin"?"Administrador (demo)":"Cliente individual"}.`;toast("Perfil guardado en este navegador")};
$("checkoutBtn").onclick=()=>{if(!cart.length)return;closeAll();if(profile){$("checkoutName").value=profile.name;$("checkoutEmail").value=profile.email}openModal("checkoutModal")};
$("checkoutForm").onsubmit=e=>{e.preventDefault();const order={items:cart.map(x=>({product:products.find(p=>p.id===x.id).name,quantity:x.qty})),total:cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0),customer:$("checkoutName").value,email:$("checkoutEmail").value,phone:$("checkoutPhone").value,delivery:$("deliveryMethod").value,payment:$("paymentMethod").value,address:$("checkoutAddress").value};const code="US-"+Date.now().toString().slice(-6);$("orderConfirmation").classList.remove("hidden");$("orderConfirmation").innerHTML=`<strong>Solicitud ${code} preparada.</strong><br>Subtotal: ${money(order.total)}<br>Método de entrega: ${order.delivery}<br>Método de pago: ${order.payment}<br><br>Esta demo no envía el pedido a un servidor. Conecta un backend o servicio de pedidos antes de publicar una tienda real.`;cart=[];saveCart();$("checkoutForm").classList.add("hidden")};
function openRequest(type){$("requestForm").reset();$("requestMessage").textContent="";$("requestForm").classList.remove("hidden");if(type==="wholesale"){$("requestEyebrow").textContent="SOLUCIONES PARA COMERCIOS";$("requestTitle").textContent="Crece con nosotros.";$("requestIntro").textContent="Solicita información de catálogo, cantidades mínimas y precios por volumen.";$("requestType").value="Catálogo y precios mayoristas"}else{$("requestEyebrow").textContent="DISEÑO PERSONALIZADO";$("requestTitle").textContent="Cuéntanos tu idea.";$("requestIntro").textContent="Describe el par que buscas. Te contactaremos para revisar disponibilidad y detalles.";$("requestType").value="Pedido especial / diseño único"}if(profile){$("requestName").value=profile.name;$("requestEmail").value=profile.email}openModal("requestModal")}
$("customBtn").onclick=()=>openRequest("custom");$("wholesaleBtn").onclick=()=>openRequest("wholesale");
$("requestForm").onsubmit=e=>{e.preventDefault();const details={name:$("requestName").value,email:$("requestEmail").value,type:$("requestType").value,details:$("requestDetails").value};const subject=encodeURIComponent("Solicitud Urban Sounds Shoes: "+details.type);const body=encodeURIComponent(`Nombre: ${details.name}\nCorreo: ${details.email}\nTipo: ${details.type}\nDetalles: ${details.details}`);$("requestMessage").innerHTML=`Solicitud lista. <a href="mailto:ventas@tudominio.com?subject=${subject}&body=${body}">Abrir correo para enviarla</a>. Cambia ventas@tudominio.com por el correo real de tu negocio.`};
$("newsletterForm").onsubmit=e=>{e.preventDefault();$("newsletterMessage").textContent="¡Gracias! La suscripción es una demostración; conecta un servicio de correo para guardar contactos.";e.target.reset()};
$("menuToggle").onclick=()=>$("mainNav").classList.toggle("open");
document.querySelectorAll("#mainNav a").forEach(a=>a.onclick=()=>$("mainNav").classList.remove("open"));
renderProducts();renderCart();
