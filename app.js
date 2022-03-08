let products = [];

// create cart product
function productsItem(x) {
    $(".products").empty();
    x.map(el => {
        let description = el.description.length > 150 ? el.description.slice(0, 150) +  "..." : el.description;
    $(".products").append(`
     <div class="card border-0 ">
        <img src="${el.image}" alt="" class="card-img-top product-img">
        <div class="card-body border rounded pt-5 d-flex flex-column justify-content-between">
            <div>
                <h4 class="text-primary title text-nowarp overflow-hidden">${el.title}</h4>
                <p class="text-black-50">${description}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="price ">$ ${el.price}</h4>
                <button class="btn btn-outline-primary add-to-cart-btn" data-id="${el.id}">
                    Add<i class="ms-2 fa fa-cart-plus"></i>
                </button>
            </div>
        </div>
        
    </div>
`)
})
};

//cart display
function cart(x) {
    $(".cart-to-show").append(`
        <div class="item-in-cart"  data-id="${x.id}" >
            <div class="d-flex justify-content-between align-items-center mt-3">
                <img src="${x.image}" class="cart-img" alt="">
                <button class="btn btn-outline-danger delete-btn">
                    <i class="fa fa-trash-can"></i>
                </button>
            </div>
            <p>${x.title}</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <button class="decrease btn btn-outline-primary">
                        <i class=" fa fa-minus"></i>
                    </button>
                    <input type="number" class="form-control quantity" cost="${x.price}"  value="1" min="1">
                    <button class="increase btn btn-outline-primary">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
                <p> $ <span class="each-price"> ${x.price}</span></p>
            </div>
            <hr>
        </div>

    `)
}

// create categories option
function categories(category) {
    category.map(el => {
        $("#category").append(`
            <option class="selected" value="${el}">${el}</option>
        `)
    })
}

$.get("https://fakestoreapi.com/products/", function(data) {
    products = data;
    productsItem(products);
});

$.get("https://fakestoreapi.com/products/categories", function(data) {
    categories(data);
});

// search products
$("#search").on("keyup", function() {
    let keyword = $(this).val().toLowerCase();
    if(keyword.trim()) {

        let filtered = products.filter(product => {
            if(product.title.toLowerCase().indexOf(keyword) > -1 || product.description.toLowerCase().indexOf(keyword) > -1 || product.price == keyword) {
                return product;
            }
        })
        productsItem(filtered);
    }
})

// appear products with selected category
$("#category").on( "change", function() {
    let selected = $(this).val();
    console.log(selected);
    if(selected  == 0) {
        productsItem(products);
        return;
        }
    let filtered = products.filter(product => {       
        if(product.category == selected) {
            return product;
        }
    })
    productsItem(filtered);
});

//total calculation
let add = 0;
function total() {
    if(add == 0) {
        $(".total").html(`<p class="text-primary">No Item Added</p>`);
    }
    else {

        let totalResult = $(".each-price").toArray().map(el => Number(el.innerText)).reduce((sum, el) => sum + el).toFixed(2);
         $(".total").html(`
             <h4 class="d-flex justify-content-between align-items-center position-sticky bottom-0">
                 <span>Total :</span>
                 <span>$  <span class="total-price">${totalResult}</span> </span>
             </h4>
         `)
    }
    
}

if($(".cart-to-show").html("")) {
    $(".total").html(`<p class="text-primary">No Item Added</p>`);
}


//add product to cart
$(".products").delegate(".add-to-cart-btn", "click", function() {
    let currentId = $(this).attr("data-id");
    let currentCart = $(".item-in-cart").toArray().map(el => el.getAttribute("data-id")).includes(currentId);
    if(currentCart) {
        alert("Item Added");
    }
    else {
        products.filter(el => {
        if(el.id ==  currentId) {
            cart(el);
            add++;
            total();
            $(".unit").text(add);
        }
    })
    } 
})

//delete from cart list
$(".cart-to-show").delegate(".delete-btn", "click", function() {
    if($(".unit").text == 0) {
        $(".cart-to-show").text("No Item Added");
        total();
        return;
    } else {

        add--;
        $(".unit").text(add);
        $(this).parentsUntil(".cart-to-show").remove();
        total();
    }
})

//increase quantity
$(".cart-to-show").delegate(".increase", "click", function() {
    let quantityValue = $(this).siblings(".quantity").val();
    let cost = $(this).siblings(".quantity").attr("cost");
    let newQuantity = Number(quantityValue) + 1;
    let newCost = Number(cost) * newQuantity;
    $(this).siblings(".quantity").val(newQuantity);
    $(this).parent().siblings("p").find(".each-price").text(newCost);
    total();
})

//decrease quantity
$(".cart-to-show").delegate(".decrease", "click", function() {
    let quantityValue = $(this).siblings(".quantity").val();
    if(quantityValue > 1 ) {

        let cost = $(this).siblings(".quantity").attr("cost");
        let newQuantity = Number(quantityValue) - 1;
        let newCost = Number(cost) * newQuantity;
        $(this).siblings(".quantity").val(newQuantity);
        $(this).parent().siblings("p").find(".each-price").text(newCost);
        total();
    }
})

//manual put quantity
$(".cart-to-show").delegate(".quantity", "keyup", function() {
    let inputValue = $(this).val();
    let cost = $(this).attr("cost");
    let newCost = Number(inputValue) * Number(cost);
    $(this).parent().siblings("p").find(".each-price").text(newCost);
    total();
})

$(".cart-sm").on("click", function() {
    $(".cart-item").toggleClass("cart-to-hide");
    $(".cart-item").toggleClass("cart-to-show-sm");
})

$(".fa-arrow-circle-left").on("click", function() {
    $(".cart-item").toggleClass("cart-to-hide");
    $(".cart-item").toggleClass("cart-to-show-sm");
})