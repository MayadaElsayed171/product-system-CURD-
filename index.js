var productNameInput = document.getElementById("productName");
var productPriceInput = document.getElementById("productPrise");
var productCategoryInput = document.getElementById("productCategory");
var productImageInput = document.getElementById("productImage");
var productDescriptionInput = document.getElementById("productDescription");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var productList = [];
var updatedIdx;
var productSearchInput = document.getElementById("productSearch");


if (JSON.parse(localStorage.getItem('allProducts'))) {
    productList = JSON.parse(localStorage.getItem("allProducts"));
    displayProduct(productList);
};

function addproduct() {
    if (!validateInputs()) return;
    var product = {
        name: productNameInput.value.trim(),
        price: productPriceInput.value.trim(),
        category: productCategoryInput.value.trim(),
        image: `img/${productImageInput.files[0].name}`,
        desc: productDescriptionInput.value.trim(),
    };

    productList.push(product);
    localStorage.setItem("allProducts", JSON.stringify(productList));
    displayProduct(productList);
    clearForm();    
};


function clearForm() {
    productNameInput.value = "";
    productPriceInput.value = "";
    productCategoryInput.value = "";
    productDescriptionInput.value = "";
    productImageInput.type = "";

    const preview = document.getElementById("imagePreview");
    preview.src = "";
    preview.classList.add("d-none");
}


function displayProduct(list) {
    var blackBox = ``;

    if (list.length === 0) {
        document.getElementById("productList").innerHTML = `<div class="alert alert-warning text-center w-100">🚫 لا توجد منتجات مطابقة للبحث.</div>`;
        return;
    }

    for (var i = 0; i < list.length; i++) {
        blackBox += `
        <div class="col-md-3">
            <div class="card product">
                <figure class="bg-light p-3">
                    <img src="${list[i].image}" class="card-img-top" alt="${list[i].name}">
                </figure>
                <div class="d-flex justify-content-between p-3">
                    <span class="badge text-bg-primary">${list[i].category}</span>
                    <span class="text-danger">${list[i].price}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title h5">${list[i].name}</h3>
                    <p class="card-text">${list[i].desc}</p>
                </div>
                <div class="d-flex justify-content-between p-3">
                    <button onclick="editProduct(${i})" class="btn btn-outline-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct(${i})" class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("productList").innerHTML = blackBox;
};


function deleteProduct(deletedIndex){
    productList.splice(deletedIndex , 1);
    localStorage.setItem("allProducts", JSON.stringify(productList));
    displayProduct(productList);
};


function editProduct(editIndex){
    updatedIdx = editIndex ;

    productNameInput.value = productList[editIndex].name;
    productPriceInput.value = productList[editIndex].price;
    productDescriptionInput.value = productList[editIndex].desc;
    productCategoryInput.value = productList[editIndex].category;

    const preview = document.getElementById("imagePreview");
    preview.src = productList[editIndex].image;
    preview.classList.remove("d-none");

    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
};


function updateproduct() {
    if (!validateInputs()) return;

    productList[updatedIdx].name = productNameInput.value.trim();
    productList[updatedIdx].price = productPriceInput.value.trim();
    productList[updatedIdx].category = productCategoryInput.value.trim();
    productList[updatedIdx].desc = productDescriptionInput.value.trim();

    if (productImageInput.files[0]) {
        productList[updatedIdx].image = `img/${productImageInput.files[0].name}`;
    }

    localStorage.setItem("allProducts", JSON.stringify(productList));
    displayProduct(productList);
    clearForm();

    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
};



productSearchInput.addEventListener("input", function () {
    var searchTerm = productSearchInput.value.toLowerCase();
    var filteredProducts = productList.filter(function (product) {
        return product.name.toLowerCase().includes(searchTerm);
    });
    displayProduct(filteredProducts);
});


function validateInputs() {
    var name = productNameInput.value.trim();
    var price = productPriceInput.value.trim();
    var category = productCategoryInput.value.trim();
    var desc = productDescriptionInput.value.trim();
    const imageFile = productImageInput.files[0];
    const isEditMode = !updateBtn.classList.contains('d-none');

    var nameRegex = /^[A-Z][a-zA-Z0-9\s]{2,}$/;
    var priceRegex = /^\d+(\.\d{1,2})?$/;
    var descRegex = /^.{3,250}$/;
    var categoryRegex = /^(Phones|Screens|Airpods|Watches)$/;

    
    document.getElementById("productNameError").textContent = "";
    document.getElementById("productPriceError").textContent = "";
    document.getElementById("productDescError").textContent = "";
    document.getElementById("productCategoryError").textContent = "";
    document.getElementById("productImageError").textContent = "";

    let isValid = true;

    if (!nameRegex.test(name)) {
        document.getElementById("productNameError").textContent = "يجب أن يبدأ الاسم بحرف كابيتال ويكون 3 أحرف على الأقل.";
        isValid = false;
    }

    if (!priceRegex.test(price) || Number(price) < 6000 || Number(price) > 60000) {
        document.getElementById("productPriceError").textContent = "السعر يجب أن يكون بين 6000 و 60000.";
        isValid = false;
    }

    if (!descRegex.test(desc)) {
        document.getElementById("productDescError").textContent = "الوصف يجب أن يكون بين 10 إلى 250 حرف.";
        isValid = false;
    }

    if (!categoryRegex.test(category)) {
        document.getElementById("productCategoryError").textContent = "اختر فئة صحيحة من القائمة.";
        isValid = false;
    }

    
    if (!imageFile && !isEditMode) {
        document.getElementById("productImageError").textContent = "يجب رفع صورة للمنتج";
        isValid = false;
    } else if (imageFile) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(imageFile.type)) {
            document.getElementById("productImageError").textContent = "نوع الصورة يجب أن يكون JPG أو PNG أو WebP فقط.";
            isValid = false;
        }

        if (imageFile.size > maxSize) {
            document.getElementById("productImageError").textContent = "حجم الصورة يجب ألا يزيد عن 2 ميجابايت.";
            isValid = false;
        }
    }

    return isValid;
};



productImageInput.addEventListener("change", function () {
    const file = productImageInput.files[0];
    const preview = document.getElementById("imagePreview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove("d-none");
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.classList.add("d-none");
    }
});


function sortByPriceAsc() {
    const sorted = [...productList].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    displayProduct(sorted);
}

function sortByPriceDesc() {
    const sorted = [...productList].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    displayProduct(sorted);
}