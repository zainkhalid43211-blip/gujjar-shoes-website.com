const WHATSAPP_NUMBER = "923112930862"; // Pakistan country code +92; no leading zero
const products = [
  {id:1,name:"Gujjar Street Runner",category:"Sneakers",price:4490,old:5990,tag:"BEST SELLER",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Gujjar Court Classic",category:"Sneakers",price:3990,old:5290,tag:"NEW DROP",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"Gujjar Motion Pro",category:"Sports",price:4990,old:6490,tag:"SPORT",image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Gujjar Urban Low",category:"Casual",price:3690,old:4790,tag:"EVERYDAY",image:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Gujjar Active Flex",category:"Sports",price:4590,old:5990,tag:"LIGHTWEIGHT",image:"https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Gujjar Mono Essential",category:"Sneakers",price:4290,old:5590,tag:"POPULAR",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80"},
  {id:7,name:"Gujjar Daily Ease",category:"Casual",price:3490,old:4490,tag:"DAILY WEAR",image:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"},
  {id:8,name:"Gujjar Sprint X",category:"Sports",price:5190,old:6790,tag:"NEW DROP",image:"https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80"}
];
let activeCategory="All", cart=[], selectedProduct=null;
const $=s=>document.querySelector(s);
const money=n=>"Rs. "+Number(n).toLocaleString("en-PK");
function renderProducts(){
  const q=$("#searchInput").value.trim().toLowerCase();
  const shown=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.name} ${p.category}`).toLowerCase().includes(q));
  $("#productGrid").innerHTML=shown.length?shown.map(p=>`
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-label">${p.tag}</span><button class="quick-add" data-order="${p.id}">SELECT SIZE & ORDER ↗</button></div>
      <div class="product-info"><span class="product-type">${p.category.toUpperCase()} / GUJJAR</span><h3>${p.name}</h3><div class="product-price">${money(p.price)} <del>${money(p.old)}</del></div></div>
    </article>`).join(""):`<p>No shoes found. Try another search.</p>`;
}
function openOrder(id){
  selectedProduct=products.find(p=>p.id===id);
  if(!selectedProduct)return;
  $("#modalProduct").innerHTML=`<img src="${selectedProduct.image}" alt=""><div><strong>${selectedProduct.name}</strong><p>${money(selectedProduct.price)}</p></div>`;
  $("#sizeSelect").value="";$("#quantityInput").value=1;$("#customerName").value="";$("#customerArea").value="";
  $("#overlay").classList.add("show");$("#orderModal").classList.add("open");
}
function closePanels(){
  $("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open");$("#orderModal").classList.remove("open");
}
function updateCart(){
  $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  $("#cartSubtotal").textContent=money(cart.reduce((s,x)=>s+x.product.price*x.qty,0));
  $("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-line"><img src="${x.product.image}" alt=""><div><h4>${x.product.name}</h4><p>${x.size} · Qty ${x.qty}</p><p>${money(x.product.price*x.qty)}</p></div><button class="remove-item" data-remove="${x.product.id}">REMOVE</button></div>`).join(""):`<p class="empty-cart">Your bag is waiting for the right pair.</p>`;
}
function addToCart(product,size,qty){const found=cart.find(x=>x.product.id===product.id&&x.size===size);if(found)found.qty+=qty;else cart.push({product,size,qty});updateCart();}
function whatsappLink(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
function sendSingleOrder(){
  if(!selectedProduct)return;
  const size=$("#sizeSelect").value,qty=Math.max(1,Math.min(10,Number($("#quantityInput").value)||1));
  const name=$("#customerName").value.trim(),area=$("#customerArea").value.trim();
  if(!size){alert("Please select your shoe size.");return;}
  if(!name){alert("Please enter your name.");return;}
  if(!area){alert("Please enter your delivery area.");return;}
  const total=selectedProduct.price*qty;
  const message=`Assalam-o-Alaikum GUJJAR Shoes Shop! I want to place an order:\n\nProduct: ${selectedProduct.name}\nCategory: ${selectedProduct.category}\nPrice: ${money(selectedProduct.price)}\nSize: ${size}\nQuantity: ${qty}\nTotal: ${money(total)}\n\nCustomer name: ${name}\nDelivery area: ${area}\n\nPlease confirm availability, delivery charges and payment details.`;
  window.open(whatsappLink(message),"_blank","noopener");
  closePanels();
}
function sendCartOrder(){
  if(!cart.length){alert("Your bag is empty. Select a shoe first.");return;}
  const lines=cart.map(x=>`• ${x.product.name} | Size ${x.size} | Qty ${x.qty} | ${money(x.product.price*x.qty)}`).join("\n");
  const total=cart.reduce((s,x)=>s+x.product.price*x.qty,0);
  const message=`Assalam-o-Alaikum GUJJAR Shoes Shop! I want to order:\n\n${lines}\n\nCart total: ${money(total)}\n\nPlease confirm stock, delivery charges and payment details.`;
  window.open(whatsappLink(message),"_blank","noopener");
}
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-order]");if(b)openOrder(Number(b.dataset.order));});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeCategory=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("#searchInput").addEventListener("input",renderProducts);
$("#searchFocus").addEventListener("click",()=>{$("#searchInput").focus();$("#collection").scrollIntoView();});
document.querySelectorAll("[data-category-link]").forEach(a=>a.addEventListener("click",()=>{activeCategory=a.dataset.categoryLink;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeCategory));renderProducts();}));
$("#cartOpen").addEventListener("click",()=>{$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open");});
$("#cartClose").addEventListener("click",closePanels);$("#modalClose").addEventListener("click",closePanels);$("#overlay").addEventListener("click",closePanels);
$("#sendOrder").addEventListener("click",sendSingleOrder);$("#checkoutButton").addEventListener("click",sendCartOrder);
$("#cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b){cart=cart.filter(x=>x.product.id!==Number(b.dataset.remove));updateCart();}});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
renderProducts();updateCart();

// Customer reviews: local demo storage (browser only; no server database).
let chosenRating = 5;
const savedReviewsKey = "gujjarCustomerReviews";
function getSavedReviews(){
  try { return JSON.parse(localStorage.getItem(savedReviewsKey) || "[]"); }
  catch { return []; }
}
function updateReviews(){
  const saved=getSavedReviews();
  const all=[
    {name:"GUJJAR CUSTOMER",rating:5,title:"Great everyday style",text:"Comfortable look and a clean design. Really liked the style."},
    {name:"GUJJAR CUSTOMER",rating:5,title:"Easy ordering",text:"The WhatsApp ordering process was simple and convenient."},
    ...saved
  ];
  const avg=all.reduce((sum,r)=>sum+Number(r.rating),0)/all.length;
  $("#averageRating").textContent=avg.toFixed(1);
  $("#averageStars").textContent="★★★★★";
  $("#reviewCount").textContent=all.length;
  $("#reviewList").innerHTML=all.slice().reverse().map(r=>`
    <article class="review-card"><div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div><h4>${escapeHTML(r.title || "Customer review")}</h4><p>${escapeHTML(r.text)}</p><small>${escapeHTML(r.name).toUpperCase()}</small></article>
  `).join("");
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
$("#starPicker").addEventListener("click",e=>{
  const btn=e.target.closest("[data-rating]");if(!btn)return;
  chosenRating=Number(btn.dataset.rating);
  $("#starPicker").querySelectorAll("button").forEach(b=>b.classList.toggle("selected",Number(b.dataset.rating)<=chosenRating));
});
$("#starPicker").querySelector('[data-rating="5"]').classList.add("selected");
$("#reviewForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#reviewName").value.trim(),text=$("#reviewText").value.trim();
  if(!name||!text){alert("Please enter your name and review.");return;}
  const saved=getSavedReviews();
  saved.push({name,rating:chosenRating,title:`${chosenRating}-star customer review`,text});
  try{localStorage.setItem(savedReviewsKey,JSON.stringify(saved));}
  catch{alert("This browser could not save the review.");return;}
  $("#reviewForm").reset();chosenRating=5;
  $("#starPicker").querySelectorAll("button").forEach(b=>b.classList.toggle("selected",Number(b.dataset.rating)<=5));
  updateReviews();
  alert("Thank you! Your rating has been added on this browser.");
});
$("#complaintForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#complaintName").value.trim();
  const order=$("#complaintOrder").value.trim()||"Not provided";
  const type=$("#complaintType").value;
  const details=$("#complaintMessage").value.trim();
  if(!name||!type||!details){alert("Please complete all required complaint fields.");return;}
  const message=`Assalam-o-Alaikum GUJJAR Support Team,\n\nI want to submit a complaint / feedback:\n\nName: ${name}\nOrder number: ${order}\nCategory: ${type}\nMessage: ${details}\n\nPlease contact me regarding this issue.`;
  window.open(whatsappLink(message),"_blank","noopener");
});
updateReviews();
