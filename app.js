const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server);

let usuarios = [];


app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/node_modules/'));

app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static(__dirname + '/public'));

app.get('/',(req, res) => { res.render('index'); });

app.get('/partials/sala',(req, res) => { res.render('partials/sala'); });

app.post('/valida',(req,res)=>{
    let existe = false;
    usuarios.forEach(nombre=>{
        if(nombre.usuario==req.body.n){existe=true;return;}
    });
    res.send(existe);
})

app.post('/pruebaEnvio',(req, res) => { res.status(200).send({respuesta:'Bien'}); });

app.get('*',(req, res) => { res.render('index'); });

io.on('connection', (socket)=>{
    socket.on('Nuevo',(data)=>{
        let existe=false;
        usuarios.forEach(nombre =>{
            if(data.nickName == nombre.usuario && nombre.id == data.id){
                nombre.id=socket.id;
                existe=true;
            }
        });
        if(!existe){
            usuarios.push({usuario:data.nickName, id:socket.id, s:socket});
            socket.broadcast.emit('EnviarCliente',{nombre: data.nickName,mensaje:'Se a conectado'});
            console.log(data.nickName + ' Se a Conectado');
        }
        socket.emit('id');
    });

    socket.on('EnviarServer',(data)=>{
        io.emit('EnviarCliente',{nombre:data.nombre,mensaje:data.mensaje});
    });

    socket.on('cerrar', ()=>{
        usuarios.forEach(nombre =>{
            if(nombre.id == socket.id){
                socket.broadcast.emit('EnviarCliente',{nombre: nombre.usuario, mensaje:'Cerro Sesion'});
                socket.disconnect();
                usuarios.splice(usuarios[nombre],1);
            }
        });
    });

    socket.on('disconnect', ()=>{});
});

server.listen(80, ()=>{ console.log('Servidor Activado'); });