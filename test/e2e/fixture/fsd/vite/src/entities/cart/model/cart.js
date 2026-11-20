import { cartStore } from "./store/cart-store";

export function addToCart(item) {
	return [...cartStore.items, item];
}
