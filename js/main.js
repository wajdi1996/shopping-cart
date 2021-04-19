
var body = document.body;
var container = document.getElementById('blcContainer');
var navbar = document.getElementById('blcNavbar');
var footer = document.getElementById('blcFooter');

function changeModeNight(){
    var hasClassModeNight = body.classList.contains('modeNight');
    console.info('hasClassModeNight : '+hasClassModeNight);
    if(hasClassModeNight){
        body.classList.remove("modeNight");
        container.classList.remove("modeNight");
        navbar.classList.remove("modeNight");
        footer.classList.remove("modeNight");
    } else {
        body.classList.add("modeNight");
        container.classList.add("modeNight");
        navbar.classList.add("modeNight");
        footer.classList.add("modeNight");
    }
}

/** Button add card */
var cookie = {
    set: function(name, value) {
        document.cookie = name+"="+value;
    },
    get: function(name) {
        var cookies = document.cookie;
        var r = cookies.split(';');
        for(var i =0; i < r.length; i++){
            //console.info(r[i]);
            var dd = r[i].split('=');
            //console.info(dd);
            if(dd[0].replace(' ','') == name) return dd[1];
        }
        return;
    }
};

if(!cookie.get('cartItems')) cookie.set('cartItems',[]);
if(!cookie.get('ctp')) cookie.set('ctp',0);

document.getElementsByClassName('fa-shopping-cart')[0].querySelector('span').textContent = cookie.get('ctp');
    
// btn Add
var btnsAdd = document.getElementsByClassName('btn btn-primary');
for(var i=0 ; i < btnsAdd.length; i++){
    btnsAdd[i].addEventListener('click',addItemToCart);
}

function initBtns(){
    // btn remove
    var btnsRemove = document.getElementsByClassName('far fa-trash-alt');
    for(var i=0 ; i < btnsRemove.length; i++){
        btnsRemove[i].addEventListener('click',removeItemFromCart);
    }

    // input quantity
    var qtes = document.querySelectorAll('input[type="number"]');
    for(var i=0 ; i < qtes.length; i++){
        qtes[i].addEventListener('change',updateQuantity);
    }
}
function addItemToCart(object){
    var id, title, price, imageSrc;
    var button = object.target;
    var produit = button.parentNode;
    id = produit.getAttribute('id');
    title = produit.querySelectorAll('h4')[0].textContent;
    price = produit.querySelectorAll('p')[0].textContent.replace('$','');
    imageSrc = produit.querySelectorAll('img')[0].getAttribute('src');
    //cartItems.push([id,title,price, imageSrc]);
    updateCart(id,title,price, imageSrc, 1);
    
}

function removeItemFromCart(object){
    object = object.target;
    console.info(object);
    var tr = object.parentNode.parentNode;
    
    var id = tr.getAttribute('id');
    console.info(id);

    removeItem(id);
}

function removeItem(id){
    var cartItems = cookie.get('cartItems');
    if(!cartItems) cartItems = [];else cartItems = JSON.parse(cartItems);
    var ctp = parseInt(cookie.get('ctp'));
    var pos = null;
    for(var i=0; i < cartItems.length;i++){
        if(cartItems[i].id == id){
            pos = i;
            ctp -=  cartItems[i].quantity;
            break;
        } 
    }
    if(pos >= 0){
        cartItems.splice(pos,1);
    }
    console.info('ctp : '+ctp);
    cookie.set('cartItems',JSON.stringify(cartItems));
    cookie.set('ctp',ctp);
    document.getElementsByClassName('fa-shopping-cart')[0].querySelector('span').textContent = ctp;
    
    getCart();
}

function updateCart(id, title,price, imgSrc,quantity, edit){
    
    var hasExist = false;
    var cartItems = cookie.get('cartItems');
    if(!cartItems) cartItems = [];else cartItems = JSON.parse(cartItems);
    console.info(cartItems);
    var ctp = 0;
    for(var i=0; i < cartItems.length;i++){
        if(cartItems[i].id == id){
            if(edit)
                cartItems[i].quantity = parseInt(quantity);
            else 
                cartItems[i].quantity = parseInt(cartItems[i].quantity) + parseInt(quantity);
            hasExist = true;
        } 
        ctp += parseInt(cartItems[i].quantity);
    }

    if(!hasExist){
        cartItems.push({'id': id, 'title': title,'price': price, 'imgSrc': imgSrc, 'quantity': quantity});
        ctp += parseInt(quantity);
    }
    //ctp += 1;
    console.info(cartItems);
    console.info(ctp);
    document.getElementsByClassName('fa-shopping-cart')[0].querySelector('span').textContent = ctp;
    cookie.set('cartItems',JSON.stringify(cartItems));
    cookie.set('ctp',ctp);
    console.info(cookie.get('cartItems'));
    console.info(cookie.get('ctp'));
}


function getCart(){
    var cartItems = cookie.get('cartItems');
    if(!cartItems) cartItems = [];else cartItems = JSON.parse(cartItems);
    var html = '';
    var total = 0;
    for(var i =  0; i <cartItems.length;i++){
        var somme = cartItems[i].price * cartItems[i].quantity;
        html +='<tr id="'+cartItems[i].id+'">';
        html +='<td>';
        html +='            <div class="cart-info">';
        html +='                <img src="'+cartItems[i].imgSrc+'" alt="">';
        html +='            </div>';
        html +='            <div><p>'+cartItems[i].title+'</p></div>';
        html +='         </td>';
        html +='        <td><p>'+cartItems[i].title+'</p></td>';
        html +='        <td><input type="number" value="'+cartItems[i].quantity+'"></td>';
        html +='        <td>'+cartItems[i].price+'$</td>';
        html +='        <td><i class="far fa-trash-alt"></i></td>';
        html +='    </tr>';
        total = total + somme;
    }
    html +='<tr>';
              
    html +='            <td><div class="choping"><a href="file:///home/wajdi/Bureau/Gnvl/index.html">Continue shopping</a></div></td>';
    html +='            <td></td>';
    html +='            <td></td>';
    html +='            <td></td>';
    html +='            <td>';
    html +='                <p>Delevry: Free</p>';
    html +='                <div class="tot">';
    html +='                    <p>total:   '+total+'$</p>';
    html +='                    <button class="btn btn-primary" type="button">Checkout</button>';

                       
    html +='                </div>';
    html +='            </td>';
    html +='        </tr>';
    document.getElementById('tbodyTableau').innerHTML = html;
    initBtns();
}



function updateQuantity(object){
    
    object = object.target;
    var tr = object.parentNode.parentNode;
    var id = tr.getAttribute('id');
    var quantity = object.value;
    console.info(id, quantity);//return;
    if(quantity && quantity>0){
        console.info("quantity : "+quantity);
        updateCart(id, '', 0, '', quantity, true);
        getCart();
    } else{
        removeItem(id);
    }
}
































/*if (document.teadyState == ''){
    document.addEventListener('DOMContentLoaded',ready)    
} else {
ready()
}


function ready(){
var removeCartItemButtons = document.getElementsByClassName('')
for (var i=0; i < removeCartItemButtons.length; i++){
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
    }

var quantityInputs = document.getElementsByClassName('')
for (var i=0; i < quantityInputs.length; i++){
    var input = quantityInputs[i]
    input.addEventListener('change', removeCartItem)
    }    
          
var addToCartButtons = document.getElementsByClassName('')
for (var i=0; i < addToCartButtons.length; i++){
    var button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
    }
    document.getElementsByClassName('')[0].addEventListener('click',purchaseCliceked)
    }

    function purchaseCliceked(){
        alert('thank you for your purchase')
        var cartItems = document.getElementsByClassName('')[0]
        while (cartItemes.hasChildNodes()) {
            cartItemes.removechild(cartItemes.firstChild)
        }
        updateCartTotal()
    }


    function removeCartItem(event) {
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    }

    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        updateCartTotal()
    }

    function addToCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement.parentElement
        var title = shopItem.getElementsByClassName()[0].innerText
        var price = shopItem.getElementsByClassName()[0].innerText
        var imageSrc = shopItem.getElementsByClassName('')[0].src
addItemToCart(title, price, imageSrc)
updateCartTotal()
}

function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div')
    cartRow.classList.add('')
var cartItems = document.getElementsByClassName('')[0]
var cartItemsNames = cartItems.getElementsByClassName('')
for (var i=0; i < cartItems.length; i++){
    if (cartItemsNames[i].innerText == title){
        alert('This item is already added to the cart')
        return
    }
}

/*
    function(event) {
var button.addEventListener = event.target
buttonClicked.parentElement.parentElement.remove()
updateCartTotal()        
    })
}
}
*/
/*
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('')[0]
    var cartRows = cartItemContainer.getElementsByClassName('')
    for (var i=0; i < cartRows.length; i++){
var cartRows = cartRows[i]
var priceElemet = cartRows.getElementsByClassName('')[0]
var quantityElement = cartRow.getElementsByClassName('')[0]
var price = parseFloat(priceElemet.innerTexe.replace('$',''))
var quantity = quantityElement.value
total = total + (price * quantity)
}
document.getElementsByClassName('')[0].innerTexe = '$' + total*/