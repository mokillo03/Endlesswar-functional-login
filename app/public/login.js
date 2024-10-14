const mensajeError = document.getElementsByClassName("error")[0]

document.getElementById("login-form").addEventListener("submit",async (e)=>{
  e.preventDefault();
  const form = e.target;
  const user = form.elements.user.value;
  const password = form.elements.password.value
  const res = await fetch("http://localhost:4000/api/Login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      user: user,
      password: password
    })
  });
  if(!res.ok) return mensajeError.classList.toggle("escondido",false);
  const resJson = await res.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
