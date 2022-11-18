$(document).ready(function() {
    $("#sidebarCollapse").on("click", function() {
        $("#sidebar").toggleClass("active");
        $("#content").toggleClass("active");
        $(".list-unstyled").removeClass("show");
        $("#prodSubmenu").prev().attr("aria-expanded", "false");
        $("#catSubmenu").prev().attr("aria-expanded", "false");
        $("#adminSubmenu").prev().attr("aria-expanded", "false");
    });

    var forms = document.getElementsByClassName("form-group");
    forms[0].addEventListener("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();
        let adminName = validateLogin();
        if (adminName != "") {
            setTimeout(function() {
                $(".sidebar-header h3").text("Welcome " + adminName + "!");
                $(".login-cont").hide();
                $(".wrapper").css("display", "flex");
            }, 1000);
        }
    });

    $("#prodSubmenu li:first-child").on("click", function() {
        $(".admin-create-container").addClass("d-none");
        $(".admin-table-container").addClass("d-none");

        $("#product-table tbody").empty();
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.products.forEach((product) => {
            appendProduct(product);
        });
        $("#product-cont").removeClass("d-none");
    });

    $("#catSubmenu li:first-child").on("click", function() {
        $(".admin-create-container").addClass("d-none");
        $(".admin-table-container").addClass("d-none");
        $("#category-table tbody").empty();
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.categories.forEach((category) => {
            appendCategory(category);
        });
        $("#category-cont").removeClass("d-none");
    });

    $("#adminSubmenu li:first-child").on("click", function() {
        $(".admin-create-container").addClass("d-none");
        $(".admin-table-container").addClass("d-none");
        $("#admin-table tbody").empty();
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.admins.forEach((admin) => {
            appendAdmin(admin);
        });
        $("#admin-cont").removeClass("d-none");
    });

    $(".bi-emoji-smile-upside-down").on("click", function() {
        $(".admin-create-container").addClass("d-none");
        $(".admin-table-container").addClass("d-none");
    });
});

$("#addNewProduct").click(function() {
    $("#createNewProduct .form-control").val("");
    $("#createNewProduct .form-control").removeClass("is-valid");
    $("#createNewProduct .form-control").removeClass("is-invalid");
    $("#invalid-cat").addClass("d-none");

    $(".form-check").remove();
    let cats = getExistingCategories();
    cats.forEach((cat) => {
        generateCheckbox(cat);
    });

    
});






$("#createProdBtn").on("click", function(e) {
    e.preventDefault();

    let results = validateProduct();
    let isValid = results[0];
    let categories = results[1];
    if (isValid) {
        let newId = getHighestId("product") + 1;
        let newProd = {
            id: newId,
            title: $("#productTitle").val().trim(),
            img: $("#imgUrl").val().trim(),
            price: parseFloat($("#productPrice").val().trim()),
            description: $("#productDescription").val().trim(),
            stockQty: parseFloat($("#itemsStock").val().trim()),
            category: categories,
        };
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.products.push(newProd);
        localStorage.setItem("shopJSON", JSON.stringify(shop));
        $("#createNewProduct").addClass("d-none");
    }
});

$("#editProdBtn").on("click", function(e) {
    e.preventDefault();

    let results = validateProduct();
    let isValid = results[0];
    let categories = results[1];
    if (isValid) {
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.products.forEach((prod) => {
            if (prod.id == $("#productTitle").data("prodid")) {
                prod.title = $("#productTitle").val().trim();
                prod.price = parseFloat($("#productPrice").val().trim());
                prod.img = $("#imgUrl").val().trim();
                prod.description = $("#productDescription").val().trim();
                prod.stockQty = parseFloat($("#itemsStock").val().trim());
                prod.category = categories;
                $("#productTitle").removeData("prodid");
                $("#productTitle").removeAttr("data-prodid");
                localStorage.setItem("shopJSON", JSON.stringify(shop));
            }
        });
        $("#createNewProduct").addClass("d-none");
        $("#createNewProduct .form-control").removeClass("is-valid");
        $("#product-table tbody").empty();
        shop.products.forEach((prod) => {
            appendProduct(prod);
        });
        $("#product-cont").removeClass("d-none");
    }
});


function validateLogin() {
    let adminName = "";

    let emailFound = false;
    let email = document.getElementById("email");
    let emailValue = email.value.trim();

    let passwordFound = false;
    let password = document.getElementById("password");
    let passwordValue = password.value.trim();

    let shop = JSON.parse(localStorage.getItem("shopJSON"));
    shop.admins.forEach((admin) => {
        if (admin.email == emailValue) {
            emailFound = true;
            if (admin.password == passwordValue) {
                passwordFound = true;
                adminName = admin.name;
            }
        }
    });

    if (emailFound) {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
    } else {
        email.classList.add("is-invalid");
    }
    if (passwordFound) {
        password.classList.remove("is-invalid");
        password.classList.add("is-valid");
    } else {
        password.classList.add("is-invalid");
    }
    return adminName;
}



function appendProduct(prodObj) {
    let $newRow = $("<tr>");
    let $id = $("<td>").text(prodObj.id).appendTo($newRow);
    let $name = $("<td>").text(prodObj.title).appendTo($newRow);
    let $price = $("<td>").text(prodObj.price).appendTo($newRow);
    let $stock = $("<td>").text(prodObj.stockQty).appendTo($newRow);

    let $btnEdit = $("<td>")
        .html('<i class="fas fa-marker"></i>')
        .appendTo($newRow);
    $btnEdit.on("click", function() {
        $("#product-cont").addClass("d-none");
        $("#createNewProduct").removeClass("d-none");
        $("#createProdBtn").addClass("d-none");
        $("#editProdBtn").removeClass("d-none");
        $(".form-check").remove();
        let cats = getExistingCategories();
        cats.forEach((cat) => {
            generateCheckbox(cat);
        });
        $("#productTitle").val(prodObj.title);
        $("#productTitle").attr("data-prodId", prodObj.id);
        $("#productPrice").val(prodObj.price);
        $("#imgUrl").val(prodObj.img);
        $("#productDescription").val(prodObj.description);
        $("#itemsStock").val(prodObj.stockQty);
        $(".form-check-input").each(function(item, element) {
            if (prodObj.category.includes($(element).val())) {
                $(element).attr("checked", "true");
            }
        });
        $("#createNewProduct .form-control").removeClass("is-valid");
        $("#createNewProduct .form-control").removeClass("is-invalid");
        $("#invalid-cat").addClass("d-none");
    });

    let $btnRemove = $("<td>")
        .html('<i class="fas fa-trash-alt"></i>')
        .appendTo($newRow);
    $btnRemove.on("click", function() {
        let id = prodObj.id;
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        for (let i = 0; i < shop.products.length; i++) {
            if (shop.products[i].id == id) {
                shop.products.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("shopJSON", JSON.stringify(shop));
        $(this).parent().remove();
    });
    $("#product-table tbody").append($newRow);
}

function appendCategory(catObj) {
    let $newRow = $("<tr>");
    let $id = $("<td>").text(catObj.id).appendTo($newRow);
    let $name = $("<td>").text(catObj.name).appendTo($newRow);
    let $color = $("<td>").text(catObj.color).appendTo($newRow);
    let $btnEdit = $("<td>")
        .html('<i class="fas fa-marker"></i>')
        .appendTo($newRow);
    $btnEdit.on("click", function() {
        $("#category-cont").addClass("d-none");
        $("#createCategoryBtn").addClass("d-none");
        $("#editCategoryBtn").removeClass("d-none");
        $("#createNewCategory").removeClass("d-none");
        $("#categoryTitle").removeClass("is-valid");
        $("#chooseColorCategory").removeClass("is-valid");
        $("#categoryTitle").removeClass("is-invalid");
        $("#chooseColorCategory").removeClass("is-invalid");
        $("#categoryTitle").val(catObj.name);
        $("#categoryTitle").attr("data-catId", catObj.id);
        $("#chooseColorCategory").val(catObj.color);
    });
    let $btnRemove = $("<td>")
        .html('<i class="fas fa-trash-alt"></i>')
        .appendTo($newRow);
    $btnRemove.on("click", function() {
        let id = catObj.id;
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        let found = false;
        for (let i = 0; i < shop.products.length; i++) {
            for (let j = 0; j < shop.products[i].category.length; j++) {
                if (shop.products[i].category[j] == catObj.name) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            for (let i = 0; i < shop.categories.length; i++) {
                if (shop.categories[i].id == id) {
                    shop.categories.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("shopJSON", JSON.stringify(shop));
            $(this).parent().remove();
        } else {
            alert(
                "Deletion is not possible! Category being used in products.\nPlease delete products first."
            );
        }
    });
    $("#category-table tbody").append($newRow);
}

function getHighestId(objType) {
    let shop = JSON.parse(localStorage.getItem("shopJSON"));
    let highestId = 0;
    switch (objType) {
        case "product":
            shop.products.forEach((product) => {
                if (product.id > highestId) {
                    highestId = product.id;
                }
            });
            break;
        case "category":
            shop.categories.forEach((category) => {
                if (category.id > highestId) {
                    highestId = category.id;
                }
            });
            break;
        case "admin":
            shop.admins.forEach((admin) => {
                if (admin.id > highestId) {
                    highestId = admin.id;
                }
            });
    }
    return highestId;
}

function getExistingCategories() {
    let shop = JSON.parse(localStorage.getItem("shopJSON"));
    let cats = [];
    shop.categories.forEach((cat) => {
        if (!cats.includes(cat.name)) {
            cats.push(cat.name);
        }
    });
    return cats;
}

function validateProduct() {
    let validated = true;

    let prodName = $("#productTitle").val().trim();
    if (prodName == "") {
        $("#productTitle").addClass("is-invalid");
        validated = false;
    } else {
        $("#productTitle").removeClass("is-invalid");
        $("#productTitle").addClass("is-valid");
    }

    let price = $("#productPrice").val().trim();
    if (price == "" || parseFloat(price) <= 0) {
        $("#productPrice").addClass("is-invalid");
        validated = false;
    } else {
        $("#productPrice").removeClass("is-invalid");
        $("#productPrice").addClass("is-valid");
    }

    let url = $("#imgUrl").val().trim();
    if (url == "") {
        $("#imgUrl").addClass("is-invalid");
        validated = false;
    } else {
        $("#imgUrl").removeClass("is-invalid");
        $("#imgUrl").addClass("is-valid");
    }

    let stock = $("#itemsStock").val().trim();
    if (stock == "" || parseFloat(stock) <= 0) {
        $("#itemsStock").addClass("is-invalid");
        validated = false;
    } else {
        $("#itemsStock").removeClass("is-invalid");
        $("#itemsStock").addClass("is-valid");
    }

    let catBoxes = $("#createNewProduct input[type=checkbox]");
    let categories = [];
    $(catBoxes).each(function(index, element) {
        if ($(element).prop("checked") == true) {
            categories.push($(element).val());
        }
    });
    if (categories.length > 0) {
        $("#invalid-cat").addClass("d-none");
    } else {
        $("#invalid-cat").removeClass("d-none");
        validated = false;
    }
    return [validated, categories];
}

function validateCategory() {
    let validated = false;
    let categoryNameOk = false;
    let categoryColorOk = false;

    let categoryTitle = $("#categoryTitle").val().trim();
    if (categoryTitle == "") {
        $("#categoryTitle").addClass("is-invalid");
        $("#categoryEx").addClass("d-none");
        $("#categoryEmpty").removeClass("d-none");
    }
    let shop = JSON.parse(localStorage.getItem("shopJSON"));
    let found = false;
    shop.categories.forEach((cat) => {
        if (cat.name == categoryTitle) {
            found = true;
        }
    });
    if (categoryTitle != "" && !found) {
        $("#categoryTitle").removeClass("is-invalid");
        $("#categoryTitle").addClass("is-valid");
        categoryNameOk = true;
    }
    if (found) {
        $("#categoryTitle").addClass("is-invalid");
        $("#categoryEmpty").addClass("d-none");
        $("#categoryEx").removeClass("d-none");
    }
    let categoryColor = $("#chooseColorCategory").val();
    if (categoryColor == "Choose Color..") {
        $("#chooseColorCategory").addClass("is-invalid");
    } else {
        $("#chooseColorCategory").removeClass("is-invalid");
        $("#chooseColorCategory").addClass("is-valid");
        categoryColorOk = true;
    }
    if (categoryNameOk && categoryColorOk) {
        validated = true;
    }
    return validated;
}

function validateEditedCat() {
    let id = $("#categoryTitle").data("catid");

    let validated = false;
    let categoryNameOk = false;
    let categoryColorOk = false;

    let categoryTitle = $("#categoryTitle").val().trim();
    if (categoryTitle == "") {
        $("#categoryTitle").addClass("is-invalid");
        $("#categoryEx").addClass("d-none");
        $("#categoryEmpty").removeClass("d-none");
    }
    let shop = JSON.parse(localStorage.getItem("shopJSON"));
    let found = false;
    for (let i = 0; i < shop.categories.length; i++) {
        if (shop.categories[i].id == id) {
            continue;
        } else if (shop.categories[i].name == categoryTitle) {
            found = true;
            break;
        }
    }
    if (categoryTitle != "" && !found) {
        $("#categoryTitle").removeClass("is-invalid");
        $("#categoryTitle").addClass("is-valid");
        categoryNameOk = true;
    }
    if (found) {
        $("#categoryTitle").addClass("is-invalid");
        $("#categoryEmpty").addClass("d-none");
        $("#categoryEx").removeClass("d-none");
    }
    let categoryColor = $("#chooseColorCategory").val();
    if (categoryColor == "Choose Color..") {
        $("#chooseColorCategory").addClass("is-invalid");
    } else {
        $("#chooseColorCategory").removeClass("is-invalid");
        $("#chooseColorCategory").addClass("is-valid");
        categoryColorOk = true;
    }
    if (categoryNameOk && categoryColorOk) {
        validated = true;
    }
    return validated;
}


function generateCheckbox(str) {
    let $div = $("<div>").addClass("form-check form-check-inline");
    let $input = $("<input>").addClass("form-check-input");
    $input.attr("type", "checkbox");
    $input.attr("id", str);
    $input.attr("value", str);
    let $label = $("<label>").addClass("form-check-label");
    $label.attr("for", $input.attr("id"));
    $label.text(str);
    $div.append($input).append($label);
    $("#cat-cont").prepend($div);
}

$("#editAdminBtn").click(function(e) {
    e.preventDefault();

    let isValid = validateEditedAdmin();
    if (isValid) {
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.admins.forEach((admin) => {
            if (admin.id == $("#nameAdmin").data("adminid")) {
                admin.name = $("#nameAdmin").val().trim();
                admin.surname = $("#surnameAdmin").val().trim();
                admin.email = $("#inputEmail").val().trim();
                admin.password = $("#inputPassword").val().trim();

                $("#nameAdmin").removeData("adminid");
                $("#nameAdmin").removeAttr("data-adminid");
                localStorage.setItem("shopJSON", JSON.stringify(shop));
            }
        });

        $("#createNewAdmin").addClass("d-none");
        $("#nameAdmin").removeClass("is-valid");
        $("#surnameAdmin").removeClass("is-valid");
        $("#inputEmail").removeClass('is-valid');
        $("#inputPassword").removeClass('is-valid');
        $("#admin-table tbody").empty();
        shop.admins.forEach((admin) => {
            appendAdmin(admin);
        });
        $("#admin-cont").removeClass("d-none");
    }
});

$("#createAdminBtn").click(function(e) {
    e.preventDefault();
    let isValid = validateAdmin()
    if (isValid) {
        let newId = getHighestId("admin") + 1;
        let newAdmin = {
            id: newId,
            name: $("#nameAdmin").val().trim(),
            surname: $("#surnameAdmin").val().trim(),
            email: $("#inputEmail").val().trim(),
            password: $("#inputPassword").val().trim()
        };
        let shop = JSON.parse(localStorage.getItem("shopJSON"));
        shop.admins.push(newAdmin);
        localStorage.setItem("shopJSON", JSON.stringify(shop));
        //Hide form
        $("#createNewAdmin").addClass("d-none");
    }
})


function validateAdmin() {

    let validName = true;
    let validSurName = true;
    let validEmail = true;
    let validPassword = true;

    let nameAdmin = $("#nameAdmin").val().trim();
    let surnameAdmin = $("#surnameAdmin").val().trim();
    let email = $("#inputEmail").val().trim();
    let password = $("#inputPassword").val().trim();

    if (nameAdmin == "") {
        $("#nameAdmin").addClass("is-invalid");
        validName = false;
    } else {
        $("#nameAdmin").removeClass("is-invalid");
        $("#nameAdmin").addClass("is-valid");
    }

    if (surnameAdmin == "") {
        $("#surnameAdmin").addClass("is-invalid");
        validSurName = false;
    } else {
        $("#surnameAdmin").removeClass("is-invalid");
        $("#surnameAdmin").addClass("is-valid");
    }

    if (email == "") {
        $("#inputEmail").addClass("is-invalid");
        $("#emailEmpty").removeClass("d-none");
        $("#emailInv").addClass("d-none");
        $("#emailEx").addClass("d-none");
        validEmail = false;
    } else {
        if (!isEmail(email)) {
            $("#inputEmail").addClass("is-invalid");
            $("#emailInv").removeClass("d-none");
            $("#emailEmpty").addClass("d-none");
            $("#emailEx").addClass("d-none");
            validEmail = false;
        } else {
            let shop = JSON.parse(localStorage.getItem("shopJSON"));
            let found = false;
            for (let i = 0; i < shop.admins.length; i++) {
                if (shop.admins[i].email == email) {
                    found = true;
                    break;
                }
            }
            if (found) {
                $("#inputEmail").addClass("is-invalid");
                $("#emailEmpty").addClass("d-none");
                $("#emailEx").removeClass("d-none");
                validEmail = false;
            } else {
                $("#inputEmail").removeClass("is-invalid");
                $("#inputEmail").addClass("is-valid");
            }
        }
    }

    if (password == "") {
        $("#inputPassword").addClass("is-invalid");
        $("#passwordEmpty").removeClass("d-none");
        $("#passwordInv").addClass("d-none");
        validPassword = false;
    } else {
        if (!CheckPassword(password)) {
            $("#inputPassword").addClass("is-invalid");
            $("#passwordInv").removeClass("d-none");
            $("#passwordEmpty").addClass("d-none");
            validPassword = false;
        } else {
            $("#inputPassword").removeClass("is-invalid");
            $("#inputPassword").addClass("is-valid");
        }
    }
    if (validName && validSurName && validEmail && validPassword) {
        return true;
    } else {
        return false;
    }
}


function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function CheckPassword(password) {
    let passw = /^[A-Za-z0-9]\w{7,11}$/;
    if (password.match(passw)) {
        return true;
    } else {
        return false;
    }
}

function validateEditedAdmin() {
    let id = $('#nameAdmin').data('adminid');

    let validName = true;
    let validSurName = true;
    let validEmail = true;
    let validPassword = true;

    let nameAdmin = $("#nameAdmin").val().trim();
    let surnameAdmin = $("#surnameAdmin").val().trim();
    let email = $("#inputEmail").val().trim();
    let password = $("#inputPassword").val().trim();

    if (nameAdmin == "") {
        $("#nameAdmin").addClass("is-invalid");
        validName = false;
    } else {
        $("#nameAdmin").removeClass("is-invalid");
        $("#nameAdmin").addClass("is-valid");
    }

    if (surnameAdmin == "") {
        $("#surnameAdmin").addClass("is-invalid");
        validSurName = false;
    } else {
        $("#surnameAdmin").removeClass("is-invalid");
        $("#surnameAdmin").addClass("is-valid");
    }

    if (email == "") {
        $("#inputEmail").addClass("is-invalid");
        $("#emailEmpty").removeClass("d-none");
        $("#emailInv").addClass("d-none");
        $("#emailEx").addClass("d-none");
        validEmail = false;
    } else {
        if (!isEmail(email)) {
            $("#inputEmail").addClass("is-invalid");
            $("#emailInv").removeClass("d-none");
            $("#emailEmpty").addClass("d-none");
            $("#emailEx").addClass("d-none");
            validEmail = false;
        } else {
            let shop = JSON.parse(localStorage.getItem("shopJSON"));
            let found = false;
            for (let i = 0; i < shop.admins.length; i++) {
                if (shop.admins[i].id == id) {
                    continue;
                } else if (shop.admins[i].email == email) {
                    found = true;
                    break;
                }
            }
            if (found) {
                $("#inputEmail").addClass("is-invalid");
                $("#emailEmpty").addClass("d-none");
                $("#emailEx").removeClass("d-none");
                validEmail = false;
            } else {
                $("#inputEmail").removeClass("is-invalid");
                $("#inputEmail").addClass("is-valid");
            }
        }
    }

    if (password == "") {
        $("#inputPassword").addClass("is-invalid");
        $("#passwordEmpty").removeClass("d-none");
        $("#passwordInv").addClass("d-none");
        validPassword = false;
    } else {
        if (!CheckPassword(password)) {
            $("#inputPassword").addClass("is-invalid");
            $("#passwordInv").removeClass("d-none");
            $("#passwordEmpty").addClass("d-none");
            validPassword = false;
        } else {
            $("#inputPassword").removeClass("is-invalid");
            $("#inputPassword").addClass("is-valid");
        }
    }

    if (validName && validSurName && validEmail && validPassword) {
        return true;
    } else {
        return false;
    }
}