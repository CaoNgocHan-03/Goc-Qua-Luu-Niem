// 1. Nhập dữ liệu sản phẩm từ products.js
import { products } from "./products.js";

// 2. Lấy khu vực hiển thị sản phẩm trong HTML
const productGrid = document.querySelector(".product-grid");

// 3. Lấy vị trí hiển thị số lượng sản phẩm
const productCount = document.querySelector(".product-count");
// Lấy ô tìm kiếm và biểu mẫu tìm kiếm
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector(".search-box form");
// Lấy ô lọc sản phẩm theo giá
const priceFilter = document.querySelector("#price-filter");
const categoryCards = document.querySelectorAll(".category-card");
let selectedCategory = "";
console.log("Ô lọc giá:", priceFilter);
// 4. Hàm định dạng giá tiền
function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

// 5. Hàm hiển thị danh sách sản phẩm
function displayProducts(productList) {

    // Cập nhật số lượng sản phẩm
    productCount.textContent =
        String(productList.length).padStart(2, "0") + " sản phẩm";

    // Tạo giao diện cho từng sản phẩm
    productGrid.innerHTML = productList.map(product => `
        <article class="product-card">

            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">

                <span class="product-tag">${product.tag}</span>
            </div>

            <div class="product-info">
                <span class="product-type">${product.type}</span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">
    <strong>${formatPrice(product.price)}</strong>
    <button class="detail-btn" data-id="${product.id}">
        Xem chi tiết →
    </button>
</div>
            </div>

        </article>
    `).join("");
}

// 6. Hiển thị toàn bộ sản phẩm
displayProducts(products);
// Hàm tìm kiếm và lọc sản phẩm
function applyFilters() {

    // Lấy từ khóa tìm kiếm
    const keyword = searchInput.value.trim().toLowerCase();

    // Lấy mức giá được chọn
    const selectedPrice = priceFilter.value;

    // Lọc sản phẩm theo từ khóa và giá tiền
    const filteredProducts = products.filter(product => {

        const matchKeyword =
            product.name.toLowerCase().includes(keyword) ||
            product.type.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword);

        let matchPrice = true;

        if (selectedPrice === "under-100") {
            matchPrice = product.price < 100000;
        } else if (selectedPrice === "100-200") {
            matchPrice = product.price >= 100000 &&
                         product.price <= 200000;
        } else if (selectedPrice === "over-200") {
            matchPrice = product.price > 200000;
        }

        const matchCategory =
    selectedCategory === "" || product.category === selectedCategory;

return matchKeyword && matchPrice && matchCategory;
    });

    // Hiển thị kết quả
    if (filteredProducts.length > 0) {

        displayProducts(filteredProducts);

    } else {

        productCount.textContent = "00 sản phẩm";

        productGrid.innerHTML = `
            <div class="no-products">
                <h3>Không tìm thấy sản phẩm!</h3>
                <p>Rất tiếc, hiện tại chưa có món quà phù hợp với lựa chọn của bạn.</p>
                <p>Hãy thử từ khóa hoặc mức giá khác nhé.</p>
            </div>
        `;
    }

    // Cuộn đến khu vực kết quả
    document.querySelector("#san-pham").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Xử lý khi nhấn nút tìm kiếm
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    applyFilters();
});

// Xử lý khi thay đổi mức giá
priceFilter.addEventListener("change", applyFilters);
categoryCards.forEach(card => {
    card.addEventListener("click", function(event) {
        event.preventDefault();

        selectedCategory = this.dataset.category;

        categoryCards.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        applyFilters();
    });
});
// Xử lý khi bấm nút xem chi tiết sản phẩm
productGrid.addEventListener("click", function(event) {

    const detailButton = event.target.closest(".detail-btn");

    if (!detailButton) return;

    // Lấy mã sản phẩm được chọn
    const productId = Number(detailButton.dataset.id);

    // Tìm sản phẩm trong dữ liệu
    const product = products.find(item => item.id === productId);

    if (!product) return;

    // Tạo khung chi tiết sản phẩm
    const detailOverlay = document.createElement("div");

    detailOverlay.className = "detail-overlay";

    detailOverlay.innerHTML = `
        <div class="detail-content">

            <button class="detail-close">×</button>

            <img src="${product.image}" alt="${product.name}">

            <div class="detail-info">
                <span>${product.type}</span>

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <strong>${formatPrice(product.price)}</strong>

                <p class="detail-tag">${product.tag}</p>
            </div>

        </div>
    `;

    document.body.appendChild(detailOverlay);

    // Đóng khung chi tiết
    detailOverlay.addEventListener("click", function(event) {

        if (
            event.target === detailOverlay ||
            event.target.closest(".detail-close")
        ) {
            detailOverlay.remove();
        }

    });

});