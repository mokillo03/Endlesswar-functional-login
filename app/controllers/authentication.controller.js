import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const usuarios = [
    {
        user: "aaaa",
        email: "a@a.com",
        password: "$2a$05$0KNfzhEzXPOwAoabtwXANeKgNJYVHjM8WI.LqgkV4jNa.517BXrS6"
    }
];

async function login(req, res) {
    console.log(req.body); // borrar luego de depuración
    const { user, password } = req.body;
    
    if (!user || !password) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
    if (!usuarioAResvisar) {
        return res.status(400).send({ status: "Error", message: "Error durante login" });
    }

    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Error durante login" });
    }

    const token = jsonwebtoken.sign(
        { user: usuarioAResvisar.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieOption = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000),
        path: "/"
    };
    res.cookie("jwt", token, cookieOption);
    res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });

}

async function register(req, res) {
    console.log(req.body);
    const { user, email, password, password_confirm, is_license_accepted, is_rules_accepted } = req.body;
    
    if (!user || !password || !email || !password_confirm || !is_license_accepted || !is_rules_accepted) {
        return res.status(400).send({ status: "Error", message: "Complete todos los campos" });
    }
    
    const usuarioRevisar = usuarios.find(usuario => usuario.user === user);
    if (usuarioRevisar) {
        return res.status(400).send({ status: "Error", message: "Usuario ya existente" });
    }
    
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);
    const nuevoUsuario ={
    user, email, password: hashPassword
  }

    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(200).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
}

export const method = {
    login,
    register
};
