
// const socket = io();

// const productForm = document.getElementById('productForm');

// productForm.addEventListener('submit', evt => {
//     evt.preventDefault();
//     let product = {
//         name: evt.target[0].value,
//         price: evt.target[1].value,
//         url: evt.target[2].value,
//         code: evt.target[3].value,
//         stock: evt.target[4].value
//     };
//     console.log(product);
//     socket.emit("addProduct", product);
//     productForm.reset();
// });

// const messageForm = document.getElementById("messageForm");

// messageForm.addEventListener("submit", evt => {
//     evt.preventDefault();
//     let message = {
//         name: evt.target[0].value,
//         email: evt.target[1].value,
//         text: evt.target[2].value
//     }
//     console.log(message)
//     socket.emit("sendMessage", message);
//     messageForm.reset();
// });

// socket.on('connect', () => {
//     console.log('Conectado al servidor SOCKET');
// });

// socket.on('loadProducts', products => {
//     fetch('http://localhost:8080/views/products.hbs')
//         .then(response => {
//             return response.text()
//         })
//         .then(plantilla => {
//             let template = Handlebars.compile(plantilla);
//             let html = template({ products })
//             document.getElementById('productsTable').innerHTML = html;
//         })
// });

// socket.on('loadMessages', messages => {
//     fetch('http://localhost:8080/views/messages.hbs')
//         .then(response => {
//             return response.text()
//         })
//         .then(plantilla => {
//             let template = Handlebars.compile(plantilla);
//             let html = template({ messages })
//             document.getElementById('messagesContainer').innerHTML = html;
//         })
// });