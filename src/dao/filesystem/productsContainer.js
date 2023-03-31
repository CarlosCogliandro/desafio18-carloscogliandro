
import fs from 'fs';

class Container {
	constructor(route) {
		this.route = route;
		// console.log("Probando ---->", this.route)
	};

	async getAll() {
		try {
			const prod = await fs.promises.readFile(this.route, 'utf-8') || [];
			return JSON.parse(prod)
		} catch (error) {
			console.log('Tenemos un error al traer los productos ----->', error);
		}
	};

	async getRandom() {
		const products = await this.getAll();
		const randomID = (Math.floor(Math.random() * products.length) + 1);
		console.log(`Numero random ${randomID}`)
		return this.getById(randomID)
	}

	async save(prod) {
		const data = await this.getAll();
		let newId = data;
		if (data.length == 0) {
			newId = 1;
		} else {
			newId = data[data.length - 1].id + 1;
		}
		const newProd = { ...prod, id: newId }
		data.push(newProd);
		try {
			await fs.promises.writeFile(this.route, JSON.stringify(data, null, 2), (e, contenido) => { });
			return newProd;
		} catch (error) {
			console.log('Error al guardar un nuevo producto ----->', error);
		}
	};

	async getById(id) {
		const data = await this.getAll()
		try {
			const prod = data.find(prod => prod.id == id);
			if (prod == undefined) {
				console.log(`No existe el producto con id ${id}`);
			} else {
				console.log(`El producto con id ${id} es:`, prod);
				return prod;
			}
		} catch (error) {
			console.log('Error al mostrar producto ----->', error);
		}
	};

	async deleteById(id) {
		const data = await this.getAll()
		try {
			const prod = data.find(obj => obj.id == id)
			if (prod == undefined) {
				console.log(`No existe el objeto con id ${id}`)
			} else {
				const newProd = data.filter(obj => obj.id != id)
				await fs.writeFile(this.route, JSON.stringify(newProd, null, 2), (e, contenido) => { })
				console.log(`Se elimino el producto con id ${id}`, prod);
				return prod;
			}
		} catch (error) {
			console.log(`Error al borrar un producto por ID ${id} ----->`, error)
		}
	};

	async deleteAll() {
		const data = await this.getAll()
		try {
			const newProd = []
			await fs.promises.writeFile(this.route, JSON.stringify(newProd, null, 2), (e, contenido) => { })
			console.log('Se borraron todos los productos')
			return data;
		} catch (error) {
			console.log('Error al vaciar ----->', error);
		}
	};

	async update(obj) {
		try {
			let productos = await this.getAll();
			productos.map(function (item) {
				if (item.id == obj.id) {
					item.title = obj.title,
					item.price = obj.price,
					item.thumbnail = obj.thumbnail
				};
			});
			await fs.promises.writeFile(this.route, JSON.stringify(productos, null, '\t'));
			return productos;
		} catch (error) {
			console.log('Error al actualizar ----->', error);
		}
	};
};

const productos = new Container('../../data/productos.json');

export default Container;