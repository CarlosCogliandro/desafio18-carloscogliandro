// const form = document.getElementById('registerForm');

// form.addEventListener('submit', evt => {
//     evt.preventDefault();
//     const data = new FormData(form);
//     const obj = {};
//     data.forEach((value, key) => obj[key] = value);
//     fetch('/sessions/register', {
//         method: 'POST',
//         body: JSON.stringify(obj),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(result => result.json()).then(json => console.log(json));
// })

const form = document.getElementById('registerForm');

form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const response = await fetch('/sessions/register', {
        method: 'POST',
        body: data
    });
    const result = await response.json();
    if (result.status === "success")
        window.location.replace('/home');
    else
        alert(result.error);
})