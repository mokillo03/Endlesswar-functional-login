const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const user = form.elements.user.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const password_confirm = form.elements.password_confirm.value;
    const is_license_accepted = form.elements.is_license_accepted.checked; // Si es un checkbox, usa checked en lugar de value
    const is_rules_accepted = form.elements.is_rules_accepted.checked;
    const is_receive_email = form.elements.is_receive_email.checked;

    console.log(user);
    const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: user,
            email: email,
            password: password,
            password_confirm: password_confirm,
            is_license_accepted: is_license_accepted,
            is_rules_accepted: is_rules_accepted,
            is_receive_email: is_receive_email
        })
    });
    if (!res.ok) return mensajeError.classList.toggle("escondido", false);
    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
})