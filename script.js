     document.addEventListener('DOMContentLoaded', function() {
            // Cart functionality
            const cartIcon = document.querySelector('.cart-icon');
            const cartSidebar = document.querySelector('.cart-sidebar');
            const closeCart = document.querySelector('.close-cart');
            const overlay = document.querySelector('.overlay');
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const cartItemsContainer = document.querySelector('.cart-items');
            const cartCount = document.querySelector('.cart-count');
            const totalAmount = document.querySelector('.total-amount');
            const proceedButton = document.getElementById('checkout-button') || document.querySelector('.cart-sidebar .btn');

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Open cart
            cartIcon.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            });
            
            // Close cart
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            overlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
            
            // Add to cart
            addToCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    const name = button.getAttribute('data-name');
                    const price = parseFloat(button.getAttribute('data-price'));
                    const image = button.getAttribute('data-image');
                    
                    // Check if item already in cart
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            image,
                            quantity: 1
                        });
                    }
                    
                    updateCart();
                    cartSidebar.classList.add('active');
                    overlay.classList.add('active');
                    
                    // Animation feedback
                    button.textContent = 'Added!';
                    setTimeout(() => {
                        button.textContent = 'Add to Cart';
                    }, 1000);
                });
            });
            
            // Update cart
            function updateCart() {
                // Render cart items
                cartItemsContainer.innerHTML = '';

                let total = 0;
                let count = 0;

                if (!cart || cart.length === 0) {
                    cartItemsContainer.innerHTML = `
                        <div class="empty-cart" style="padding:20px; text-align:center; color:#666;">
                            <p style="font-weight:600; margin:0 0 8px 0;">Your cart is empty</p>
                            <p style="margin:0;">Add items to see them here.</p>
                        </div>
                    `;
                } else {
                    cart.forEach(item => {
                        total += item.price * item.quantity;
                        count += item.quantity;

                        const cartItemElement = document.createElement('div');
                        cartItemElement.classList.add('cart-item');
                        cartItemElement.innerHTML = `
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${item.name}</h4>
                                <p class="cart-item-price">K${(item.price * item.quantity).toFixed(2)}</p>
                                <div>
                                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="increase-quantity" data-id="${item.id}">+</button>
                                </div>
                                <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                            </div>
                        `;

                        cartItemsContainer.appendChild(cartItemElement);
                    });
                }

                // Update total and count
                totalAmount.textContent = total.toFixed(2);
                cartCount.textContent = count;

                // Show or hide proceed button based on cart content
                if (proceedButton) {
                    proceedButton.style.display = (cart && cart.length > 0) ? '' : 'none';
                }

                // Add event listeners to quantity buttons (only present when items exist)
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);

                        if (!item) return;

                        if (item.quantity > 1) {
                            item.quantity -= 1;
                        } else {
                            cart = cart.filter(item => item.id !== id);
                        }

                        updateCart();
                    });
                });

                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        if (!item) return;
                        item.quantity += 1;
                        updateCart();
                    });
                });

                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        cart = cart.filter(item => item.id !== id);
                        updateCart();
                    });
                });

                // Persist cart
                localStorage.setItem('cart', JSON.stringify(cart));
            }
            
            // Render initial cart and hook checkout behaviour
            updateCart();

            if (proceedButton) {
                proceedButton.addEventListener('click', (event) => {
                    event.preventDefault();

                    if (cart.length == 0) {
                        // display an empty body page
                        document.body.innerHTML = `
                        <div style="text-align: center; margin-top: 100px; font-family: Arial, Helvetica, sans-serif;">
            <h2>Your cart is empty</h2>
            <p>Please add some items in your cart before checking out</p>
            <button id="BackToShop" style="
            background: rgb(255, 61, 3);
            color: azure;
            padding: 10px 20px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 16px;border-radius: 10px;
            ">Back To Shop</button>
        </div>
        `;

                        document.getElementById('BackToShop').addEventListener('click',() =>{
                            window.location.href = 'index.html';
                        });

                    } else {
                        window.location.href = 'checkout.html'
                    }
                });
            }
        });

// Simple animation for stats counting
        document.addEventListener('DOMContentLoaded', function() {
            const statItems = document.querySelectorAll('.stat-number');
            
            statItems.forEach(item => {
                const target = parseInt(item.textContent);
                let count = 0;
                const duration = 2000; // in milliseconds
                const increment = target / (duration / 16); // 60fps
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        item.textContent = Math.round(count) + '+';
                        setTimeout(updateCount, 16);
                    } else {
                        item.textContent = target + '+';
                    }
                };
                
                updateCount();
            });
        });

// Login functionality
const loginBtn = document.getElementById('loginToggle');
const registerBtn = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginBtn.classList.add('active');
  registerBtn.classList.remove('active');
});

registerBtn.addEventListener('click', () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  registerBtn.classList.add('active');
  loginBtn.classList.remove('active');
});

// Tab switching
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".form-section");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(tab.dataset.target).classList.add("active");
      });
    });

    // payment processing
    function processPayment(method) {
      alert("Payment processed successfully with " + method + " ");
    };
// Responsive navbar toggle
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
