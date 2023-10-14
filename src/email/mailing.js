
import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.nodemailer.GMAIL_USER,
    pass: config.nodemailer.GMAIL_PWD
  }
});

const sendEmail = async (to, subject, message, attachment) => {
  try {
    const from = config.nodemailer.GMAIL_USER;
    const mailOptions = {
      from,
      to,
      subject,
      html: message,
      attachments: attachment ? [{ path: attachment }] : []
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Envío de email: ${JSON.stringify(info)}`);
  } catch (error) {
    console.error(error);
  }
};

const registerTable = userData => {
  const { email, first_name, last_name, age, address, phone, avatar } = userData;
  return `
    <h1>Nuevo usuario registrado</h1>
    </br>
    <h3> Email: </h3> 
    <p>${email}</p>
    </br>
    <h3> Nombre y apellido: </h3>
    <p>${first_name} ${last_name}</p>
    </br>
    <h3> Edad: </h3>
    <p>${age}</p>
    </br>
    <h3> Dirección: </h3>
    <p> ${address}</p>
    </br>
    <h3>Teléfono:</h3>
    <p>${phone}</p>
    </br>
    <h3>Avatar:</h3>
    <p>${avatar}</p>`
};

const orderTable = (orderData, type) => {
  const { number, email, first_name, timestamp, address, phone, status, total, products } = orderData;
  const title = type == "admin" ? "Nueva órden de pedido" : "¡Estamos procesando tu pedido!";
  let html = `
        <div>
          <h1>${title}</h1>
          <p><b>N°: ${number.toString().padStart(6, "0")}</b></p>
          <p><b>Fecha: </b>${new Date(timestamp).toLocaleString()}</p>
          ${type == "admin" ? `<p><b>Usuario: </b>${email}</p>` : ""}
          ${type == "admin" ? `<p><b>Nombre: </b>${first_name}</p>` : ""}
          <p><b>Domicilio: </b>${address}</p>
          <p><b>Teléfono: </b>${phone}</p>
          <p><i><b>ESTADO: </b>${status}</i></p>
          <table style="border-collapse:collapse;">`;
  if (type == "admin") {
    html += `
            <thead>
              <tr style="background-color:#d3d3d3;">
                <th>#id</th>
                <th>Producto</th>
                <th>Cant</th>
                <th>Precio</th>
              </tr>
            </thead>`;
  }
  html += `
            <tbody>`;
  for (const item of products) {
    html += `
              <tr>
                ${type == "admin"
        ? `<td style="border-bottom:1px solid black;padding-right:8px;"><p>${item.product.id}</p></td>`
        : ""
      }
                <td style="border-bottom:1px solid black;">
                  <p>${item.product.title}</p>
                </td>
                <td style="padding:0 16px;border-bottom:1px solid black;">${item.quantity
      }x</td>
                <td style="border-bottom:1px solid black;text-align:right;"><b>$${formatoPrecio(
        item.product.price
      )}</b></td>
              </tr>`;
  }
  html += `
              <tr style="background-color:#add8e6;">
                <td colspan="${type == "admin" ? 3 : 2}">
                  <h3>TOTAL</h3>
                </td>
                <td style="text-align:right;"><h3>$${formatoPrecio(total)}</h3></td>
              </tr>
            </tbody>
          </table>
          ${type != "admin"
      ? `<br><h2 style="color:#b30404;">¡Muchas gracias por tu compra!</h2>`
      : ""
    }
        </div>`;
  return html;
};

export default {
  sendEmail,
  registerTable,
  orderTable
};
