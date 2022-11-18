var cart = [];
var total = 0;

if (localStorage.getItem('shopJSON') == null) {
    localStorage.setItem('shopJSON', JSON.stringify(jsonSeeder));
    var shop = JSON.parse(localStorage.getItem('shopJSON'));
} else {
    var shop = JSON.parse(localStorage.getItem('shopJSON'));
}

printProducts();

function printProducts(filter) {
    $("#products_list").empty();

    let products = filter == undefined ? [...shop.products] : filter;

    let emptyCol = '<div class="col-sm-6 col-md-4 col-lg-3 pb-4"></div>';
    let card = '<div class="card h-100"><div>';
    let img = '<img src="" class="card-img-top" data-toggle="modal" data-target="#product_details">';
    let cardBody = '<div class="card-body"></div>';
    let cardTitle = '<h5 class="card-title"></h5>';
    let cardText = '<p class="card-text"></p>';
    let productsNumber = products.length;

    for (let n = 0; n < productsNumber; n++) {
        $("#products_list").append(
            $(emptyCol).append(
                $(card).append(
                    $(img).attr("src", products[0].img).data("idProduct", products[0].id).click(showProduct),
                    $(cardBody).append(
                        $(cardTitle).text(products[0].title),
                        $(cardText).text(products[0].price.toFixed(2) + " ৳/pc")
                    )
                )
            )
        )
        products.shift();
    }
}

$("#categoryFilter").change(function() {
    $("#searchInput").val("");
    let filter = $(event.target).val();
    let filteredProducts;
    if ($("#categoryFilter").val() == "all") {
        filteredProducts = [...shop.products];
    } else {
        filteredProducts = shop.products.filter(function(product) {
            for (i = 0; i < product.category.length; i++) {
                if (product.category[i] == filter) return product
            }
        });
    }
    printProducts(filteredProducts)
});

$("#searchInput").on('input', function() {
    $("#categoryFilter").val("all");
    let filter = $(event.target).val();
    let filteredProducts = shop.products.filter(function(product) {
        if (product.title.toUpperCase().includes(filter.toUpperCase())) return product
    });
    printProducts(filteredProducts)
})

function showProduct() {
    let idProduct = $(event.target).data("idProduct");
    let product = shop.products.find(({ id }) => id === idProduct);
    let ctgrColor = [];
    $("#product_details_header h2").remove();
    $(".img-thumbnail").removeClass("border-info");
    $("#productQnt").text("1");
    $("#detailsMainImg").attr("src", product.img).data("idProduct", idProduct);
    for (let i = 0; i < product.category.length; i++) {
        ctgrColor.push(shop.categories.find(({ name }) => name === product.category[i]));
        $("#product_details_header").prepend($('<h2 class="mr-1 badge modal-title badge-' + ctgrColor[i].color.toLowerCase() + '">').text(product.category[i]));
    }
    $("#details_title").text(product.title);
    $("#details_description").text(product.description);
    $("#details_price").text(product.price.toFixed(2) + " ৳/pc");
    $("#thumb1").attr("src", product.img).addClass("border-info").click(changeThumb);
    $("#thumb2").attr("src", "src/img/" + idProduct + "_thumb2.jpg").click(changeThumb);
    $("#thumb3").attr("src", "src/img/" + idProduct + "_thumb3.jpg").click(changeThumb);
}

function changeThumb() {
    $(".img-thumbnail").removeClass("border-info");
    $(event.target).addClass("border-info");
    $("#detailsMainImg").attr("src", $(event.target).attr("src"));
}

$('#restProduct').click(function() {
    let quantity = parseInt($('#productQnt').text());
    if (quantity > 1) {
        quantity--;
        $('#productQnt').text(quantity);
    }
});

$('#addProduct').click(function() {
    let quantity = parseInt($('#productQnt').text());
    quantity++;
    $('#productQnt').text(quantity);
});

$("#addCartBtn").click(function() {
    let foundOnCart = false;
    let quantity = parseInt($("#productQnt").text());
    let id = $("#product_details img").data("idProduct");

    for (i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].quantity += quantity;
            foundOnCart = true;
        }
    }
    if (!foundOnCart) {
        let buy = {
            id: id,
            quantity: quantity
        };
        cart.push(buy);
        
        $("#itemsCartNum").text(parseInt($("#itemsCartNum").text()) + 1);
        $("#itemsCartNum").removeClass("d-none");
    }
    $('#product_details').modal('hide');
});



$('#cart-modal').click(showCart);

function showCart() {
    
    $('#cart-content').empty();

    total = 0;
    let row = '<div class="row"></div>';
    let cartImage = '<div class="col-4"></div>';
    let divColum = '<div class="col"></div>';
    let cartsProducts = [];

    
    for (let i = 0; i < cart.length; i++) {
        cartsProducts.push(shop.products.find(({ id }) => id === cart[i].id));
    }

    
    for (let j = 0; j < cartsProducts.length; j++) {
        total += cart[j].quantity * cartsProducts[j].price;
        let piece = cart[j].quantity > 1 ? " pieces" : " piece";
        $('#cart-content').append(
            $(row).attr('data-id', cart[j].id)
            .append($(cartImage).append('<img class="img-thumbnail" src="' + cartsProducts[j].img + '" />'))
            .append($(divColum)
                .append($('<h6>', { text: cartsProducts[j].title }))
                .append($('<h6>', { text: cartsProducts[j].price.toFixed(2) + '\u20ac' }))
                .append($('<span>', { text: cart[j].quantity })
                    .append($('<span>', { text: piece }))
                    .append($('<i id="remove-item" class="fas fa-trash float-right"></i>').attr('data-id', cart[j].id))
                )
            )
        ).append($('<hr class="col-xs-12">'));
    }
    $('#cart-total').text(total.toFixed(2) + '\u20ac');
}


$('#cart-content').on('click', '#remove-item', function(e) {
    let id = $(e.target).attr('data-id');

    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) cart.splice(i, 1);
    }

    $('div[data-id="' + id + '"]').next().remove();
    $('div[data-id="' + id + '"]').remove();
    let singlePrice = parseFloat($(this).parent().prev().text());
    let quantity = parseFloat($(this).parent().text());
    total = total - singlePrice * quantity;
    $('#cart-total').text(total.toFixed(2) + '\u20ac');
    $('#cart-content').show();

    
    $("#itemsCartNum").text(parseInt($("#itemsCartNum").text()) - 1);
    if (cart.length < 1) $("#itemsCartNum").addClass("d-none");
});



$("#checkoutBtn").click(function() {
    if (cart.length == 0) {
        $('#checkoutBtn').popover('enable')
        $('#checkoutBtn').popover('show')
    } else {
        $('#checkoutBtn').popover('disable')
        $('#cartModal').modal("hide");
        $('#registration_modal').modal();
    }
});

(function() {
    'use strict';
    window.addEventListener('load', function() {
    
        var forms = document.getElementsByClassName('needs-validation');
        
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                if (form.checkValidity() === false) {
                    event.stopPropagation();
                } else {
                    $('#registration_modal').modal("hide");
                    showSummary();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

$("#submitRegistration").click(function() {
    $("#submitRegistrationHidden").click();
});

function showSummary() {
    refreshStock();
    $('form').get(0).reset();
    $("#summary_products").empty();
    $('#summary_finish').modal();

    let emptyCol = '<div class="col-6 mb-3"></div>';
    let cartsProducts = [];
    
    for (let i = 0; i < cart.length; i++) {
        cartsProducts.push(shop.products.find(({ id }) => id === cart[i].id));
    }
    for (let j = 0; j < cartsProducts.length; j++) {
        let pieceNumber = cart[j].quantity > 1 ? "pieces" : "piece";
        $("#summary_products").append(
            $(emptyCol).append(
                $('<img class="img-thumbnail col-5 float-left" src="' + cartsProducts[j].img + '" />'),
                $('<h6 class="col-7 float-right mb-0">').text(cartsProducts[j].title),
                $('<small class="col-7 float-right d-block">').text(cartsProducts[j].price.toFixed(2) + " ৳/pc"),
                $('<small class="col-7 float-right">').text(cart[j].quantity + " " + pieceNumber)
            )
        );
    }
    $("#summary_subtotal").text(total.toFixed(2) + " ৳");
    $("#summary_total").text(total.toFixed(2) + " ৳");
    cart = [];
    
    $("#itemsCartNum").text("0");
    $("#itemsCartNum").addClass("d-none");
};

function refreshStock() {
    for (let i = 0; i < cart.length; i++) {
        var product = shop.products.find(function(cartProduct) {
            return cartProduct.id == cart[i].id
        });
        product.stockQty -= cart[i].quantity;
    }
    localStorage.setItem("shopJSON", JSON.stringify(shop));
}