
import fs from 'fs';

class CartContainer {
	constructor(route) {
		this.route = route;
		// console.log('Probando Cart ------->', this.route)
	};

	newId(arr, cart = false) {
		if (cart) {
			arr.sort((a, b) => { return a - b }) // Ordenamos de forma ascendente segun el id
			cart.id = parseInt(arr[arr.length - 1].id) + 1 // Tomamos el id mas grande le sumamos 1 y lo asignamos al carrito
			console.log(`Cart's new ID : ${cart.id}`)
			return cart.id;
		}
		return parseInt(arr[arr.length - 1].id + 1);
	};

	async updateCart(cart_id, cart) {
		let carts = await this.getAll();
		let index = carts.indexOf(cart);
		carts.splice(index, 1);
		console.log(cart);
		carts.push(cart);
		await this.saveCarts(carts);
		return true
	};

	async saveCarts(carts) {
		try {
			await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
		} catch (error) {
			console.log(error)
		}
	};

	async getAll() {
		try {
			let arr = await fs.readFile(this.route, 'utf-8');
			return JSON.parse(arr);
		} catch (error) {
			console.log('Failed to get.');
			console.error(error);
		}
	};

	async getById(id) {
		let carts = await this.getAll();
		let cart = carts.find(element => element.id == id);
		return cart ? cart : null;
	};

	async saveCart() {
		try {
			let carts = await this.getAll();
			let id;
			if (carts.length > 0) {
				id = this.newId(carts);
			} else {
				id = 1;
			}
			let products = [];
			let timestamp = Date.now()

			let cart = { id, products, timestamp };

			carts.push(cart);
			await fs.writeFile(this.route, JSON.stringify(carts, null, 2));
			return cart;
		} catch (error) {
			console.log('Failed to create.');
			console.error(error);
		}
	};

	async deleteById(id) {
		let carts = await this.getAll();
		console.log(carts);
		if (!carts.length) {
			console.error('No carts found.')
		} else {
			try {
				const delCart = carts.find(item => item.id === id);
				if (delCart === undefined) {
					console.error('Unexistent ID');
				} else {
					let newArr = carts.filter(element => element != delCart);
					await fs.writeFile(this.route, JSON.stringify(newArr, null, 2));
					console.log(`Deleted cart: ${JSON.stringify(delCart)}`);
					return delCart;
				}
			} catch (error) {
				console.log('Failed to delete.');
				console.error(error);
			}
		};
	};

	async deleteCartProduct(cart, product) {
		let prodIndex = cart.products.map(elem => elem.id).indexOf(product.id);
		cart.products.splice(prodIndex, 1);
		let updatedCart = await this.updateCart(cart.id, cart);
		return updatedCart;
	};

}

const productos = new CartContainer('../../data/cart.json');

export default CartContainer;