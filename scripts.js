let cart = JSON.parse(localStorage.getItem("myCart")) || [];
const products=[
    {productId:"101", productName:"Samosa" ,price:10},
    {productId:"102", productName:"paneer Tika" ,price:150},
    {productId:"103", productName:"Burger" ,price:50},
    {productId:"104", productName:"Pasta" ,price:120}  
];
const productfilterinput=document.getElementById("product-filter");
const productpriceinput=document.getElementById("product-price");
const productqtyinput=document.getElementById("product-qty");
const addtocartbtn=document.getElementById("add-to-cart");
const tablebody=document.getElementById("cart-items-body");
const totalitems=document.getElementById("totalitems");
const subtotal=document.getElementById("subtotal");
const gst=document.getElementById("gst");
const grandtotal=document.getElementById("grandtotal");
const invoicePreview=document.getElementById("invoice-preview");
const generateInvoiceBtn=document.getElementById("generate-invoice-btn");
function saveCartToLocalStorage(){
    localStorage.setItem("myCart",JSON.stringify(cart));
}
function getData (value){
    const product=products.filter(data=>data.productId===value);
    if(product.length<=0){
        window.alert("Product not found");
        return;
    }
    else{
        productfilterinput.value=product[0].productName;
        productpriceinput.value=product[0].price;
        productqtyinput.focus();
    }
}
productfilterinput.addEventListener("keydown", (event)=>{
    if(event.key==="Enter" && event.target.value!==""){
        getData(event.target.value);
    }
})
function renderDataToDom(){
    tablebody.innerHTML = "";
    cart.forEach(item=>{
        const row = tablebody.insertRow();
        row.setAttribute('data-id', item.id);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        cell1.textContent = item.productName;
        cell2.textContent = Number(item.productPrice).toFixed(2);
        cell3.textContent = item.productQty;
        cell4.textContent = Number(item.total).toFixed(2);
        cell5.innerHTML = `<button class="delete-btn">&#10060;</button>`;
    });
    billCalculate();
    renderInvoice();
}
function renderInvoice(){
    if(cart.length === 0){
        invoicePreview.innerHTML = '<p class="invoice-empty">No items in cart yet.</p>';
        return;
    }
    const subTotalAmount = cart.reduce((sum,item)=> sum + Number(item.total),0);
    const gstAmount = subTotalAmount * 0.18;
    const grandTotalAmount = subTotalAmount + gstAmount;
    const now = new Date();
    const invoiceDate = now.toLocaleDateString();
    const invoiceTime = now.toLocaleTimeString();

    invoicePreview.innerHTML = `
        <h3>Invoice</h3>
        <p class="invoice-date-time">${invoiceDate} ${invoiceTime}</p>
        ${cart.map(item=>`
            <div class="invoice-item">
                <span>${item.productName} x ${item.productQty}</span>
                <span>${Number(item.total).toFixed(2)}</span>
            </div>
        `).join("")}
        <hr>
        <div class="invoice-item"><span>Sub Total</span><span>${subTotalAmount.toFixed(2)}</span></div>
        <div class="invoice-item"><span>GST (18%)</span><span>${gstAmount.toFixed(2)}</span></div>
        <div class="invoice-item grand-total"><span>Grand Total</span><span>${grandTotalAmount.toFixed(2)}</span></div>
    `;
}

document.addEventListener("DOMContentLoaded",()=>{
    renderDataToDom();
})
function addNewRow(Desc, Price, Qty) {
    const priceValue = Number(Price);
    const qtyValue = Number(Qty);
    const rowTotal = priceValue * qtyValue;
    const uniqueId= Date.now().toString();
    const item={
        id:uniqueId,
        productName:Desc,
        productPrice:priceValue,
        productQty:qtyValue,
        total:rowTotal.toFixed(2),
    }
    cart.push(item);
    saveCartToLocalStorage();
    renderDataToDom();
}
function billCalculate(){
    const itemsCount = cart.reduce((sum,item)=> sum + Number(item.productQty),0);
    const subTotalAmount = cart.reduce((sum,item)=> sum + Number(item.total),0);
    const gstAmount = subTotalAmount * 0.18;
    const grandTotalAmount = subTotalAmount + gstAmount;

    totalitems.textContent = itemsCount;
    subtotal.textContent = subTotalAmount.toFixed(2);
    gst.textContent = gstAmount.toFixed(2);
    grandtotal.textContent = grandTotalAmount.toFixed(2);
}
addtocartbtn.addEventListener("click", (e)=>{
    if(productfilterinput.value === "" || productpriceinput.value === "" || productqtyinput.value === ""){
        window.alert("please fill all the fields");
        return;
    }
    addNewRow(productfilterinput.value,productpriceinput.value,productqtyinput.value );
    productfilterinput.value = "";
    productpriceinput.value = "";
    productqtyinput.value = "1";
    productfilterinput.focus();
})
tablebody.addEventListener("click",(e)=>{
  const button = e.target.closest(".delete-btn");
  if(button ){
    const row= button.closest("tr");
    const rowId= row.getAttribute("data-id");
    cart=cart.filter(item=>item.id !==rowId);
    saveCartToLocalStorage();
    renderDataToDom();
  }
})
generateInvoiceBtn.addEventListener("click", ()=>{
    if(cart.length === 0){
        window.alert("Cart is empty. Add items before generating invoice.");
        return;
    }
    window.print();
})