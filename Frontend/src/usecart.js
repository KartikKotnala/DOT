import { ref, computed } from 'vue';

// Initialize cart state from LocalStorage
const cart = ref(JSON.parse(localStorage.getItem('CART_ITEMS') || '[]'));

const saveCart = () => {
  localStorage.setItem('CART_ITEMS', JSON.stringify(cart.value));
};

export function useCart() {
  const cartItems = computed(() => cart.value);

  const totalItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + (item.quantity || 1), 0);
  });

  const subtotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  });

  const addToCart = (product) => {
    if (!product) return;
    const existingIndex = cart.value.findIndex(item => String(item.id) === String(product.id));

    if (existingIndex !== -1) {
      cart.value[existingIndex].quantity = (cart.value[existingIndex].quantity || 1) + 1;
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        storage: product.storage || '',
        floor: product.floor || 1,
        image: product.image || '',
        quantity: 1
      });
    }
    saveCart();
  };

  const increaseQty = (id) => {
    const item = cart.value.find(i => String(i.id) === String(id));
    if (item) {
      item.quantity++;
      saveCart();
    }
  };

  const decreaseQty = (id) => {
    const item = cart.value.find(i => String(i.id) === String(id));
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeFromCart(id);
      }
      saveCart();
    }
  };

  const removeFromCart = (id) => {
    cart.value = cart.value.filter(i => String(i.id) !== String(id));
    saveCart();
  };

  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  return {
    cartItems,
    totalItemCount,
    subtotal,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart
  };
}