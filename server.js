const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./data/agentes');
const crypto = require('crypto');
const app = express();

app.listen(3000, ()=> console.info('http://localhost:3000'))

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};
const secretKey = generateSecretKey();
console.log(secretKey);

app.use(express.static(__dirname + "/img"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.get("/SignIn", (req, res)=>{
    const { email, password } = req.query;
    // console.log(email, password);
    const user = users.results.find((user)=> user.email == email && user.password == password);
    if(user){
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 120,
            payload: user
        },
        secretKey
    )
    res.send(`<img src="fbi.png" alt="deparment of justice"><br><br>
        <p>${email}</p>
        <button> <a href="/Restringido?token=${token}"><p>Ir al area Restringida</p></a></button>
        <style>
            body{
                background-color: #202355;
                text-align: center;
                color: white;
            }
                img{
                    margin-top: 5rem;
                    width: 15rem
                }
            button{
                margin-top: 10rem;
                background-color: gray;
                color: white;
                width: 10rem;
                font-size: small;
            }
            p,a{
                text-decoration: none;
                color: white;  
            }

        </style>
        <script>
        sessionStorage.setItem('token', JSON.stringify("${token}"))
        </script>`)
    }else{
        res.send("El usuario o la contraseña son incorrectos!");
    }
});

app.get("/Restringido", (req, res)=>{
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, data)=>{
        err 
        ? res.status(401).send({
            error: "401 Unauthorized",
            message: err.message
        }) 
        : res.send(`<h3>Bienvenido agente: ${data.payload.email}</h3><br>
            <p><strong>Objetivo1: </strong>Nicolas Maduro <strong>$15.000.000</strong></p>
            <img src="maduro.png"/>
            <style>
            img{
                    width: 10rem
            }
            body{
                background-color: #202355;
                text-align: center;
                color: white;
            }
            </style>`)
    })
})