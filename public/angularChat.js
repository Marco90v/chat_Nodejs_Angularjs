const chat = angular.module('chat',['ngRoute']);

chat.config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider){
    $routeProvider.
    when('/sala',{
        templateUrl: 'partials/sala'
    });
    $locationProvider.html5Mode(true);
}]);

chat.controller('controladorChat',($scope,$http)=>{
    $scope.listMensaje=[]; // arreglo para almacenar mensajes y ser mostrados por la vista

    if(recuperarName() &&  window.location.pathname=='/sala'){
        let usuario = recuperarName(); // recupera los datos del usuario
        $scope.nombUser = usuario.nombre;
        $scope.socket = io('http://localhost'); // conexión el socket
        $scope.socket.emit('Nuevo',{nickName:$scope.nombUser, id: usuario.id!=null||usuario.id!=undefined?usuario.id:false}); // registra nuevo una usuario
        $scope.socket.on('id', ()=>{ cargarName(usuario.nombre,$scope.socket.id); }); // actualiza los datos del usuario según lo recibido del servidor (ID)
    }

    (recuperarName() && window.location.pathname!='/sala') ? location.href="/sala" : false; // si existe datos de usuario y la ruta es distinta a /sala, redirecciona

    // método para iniciar sesión, valida si existe el nombre de usuario, si no lo registra y redirecciona
    $scope.iniciar = function(){
        if($scope.nombUser){
            $http.post('/valida',{n:'Marco'}).then((res)=>{
                if(res.data){ alert('Nombre de usuario ya existe');
                }else{
                    cargarName($scope.nombUser);
                    location.href="/sala";
                }
            });
        }else{ alert("Nombre de usuario es obligatorio"); }
    }

    // borra los mensaje, mantiene la conexión
    $scope.borrarChat = ()=>{
        localStorage.removeItem('msj');
        $scope.listMensaje = [];
    }

    $scope.salir = ()=>{ $scope.socket.emit('cerrar'); }
});

chat.controller('chatSala', ($scope)=>{
    
    ($scope.socket==undefined||$scope.socket==null)?location.href="/":false; // Valida de existe el socket so no redirecciona a la raíz
    let msj = recuperarLS(); // recupera los mensajes
    let contador=0;
    if(msj!=null){
        msj.forEach(element => {
            $scope.listMensaje.push(element); // agrega los mensajes al array
            contador++;
        });
        location.href="/sala#"+contador; // necesario para ubicar el scroll en el ultimo mensaje recibido
    }

    // Función enviar, Valida que el input no se encuentre vacío
    $scope.enviar = ()=>{
        if($scope.mensajeChat!=undefined&&$scope.mensajeChat!=""){
            $scope.socket.emit('EnviarServer',{nombre:recuperarName().nombre, mensaje:$scope.mensajeChat});
            $scope.mensajeChat ='';
        }
    }

    // función llamada al presionar una tecla en el campo de mensaje, verifica si la tecla presiona es Enter y si el campo no esta vacío, llama a la función enviar.
    $scope.enter = (evento)=>{
        (evento.key=="Enter") ? ($scope.mensajeChat!=undefined&&$scope.mensajeChat!="") ? $scope.enviar() : false : false ;
    }

    // método que recibe datos del Servidor.
    $scope.socket.on('EnviarCliente', function (data){
        $scope.listMensaje.push(VerificaUsuario(data)); // verifica los datos recibidos y los almacena en el arreglo
        cargarLS($scope.listMensaje); // carga los nuevos mensajes
        $scope.$apply(); // aplica los cambios
    });

    // método desconectar
    $scope.socket.on('disconnect',()=>{
        localStorage.removeItem('msj'); // borra los mensajes del localStorage
        localStorage.removeItem('usuario'); // borra los datos de usuario del localStorage
        $scope.listMensaje=[]; // coloca el arreglo en cero
        location.href="/"; // redirecciona a la raíz
    })

});

// función para Verificar usuario, es usado para asignar estilos a la vista
function VerificaUsuario(data){
    return (data.nombre==recuperarName().nombre)? 
    { nombre: '', mensaje:data.mensaje, style: 'yo', arrow: 'arrowRigth', h5: 'h5Rigth' } : // si los datos del usuario que recibió son igual al que envía se asignan estos estilos
    { nombre: data.nombre, mensaje:data.mensaje, style: 'el', arrow: 'arrorLeft', h5: 'h5Left' } ; // si los datos del usuario que recibió son distinto al que envía se asignan estos estilos
}

// almacena en el localStorage los mensajes
function cargarLS(msj) { localStorage.setItem('msj', JSON.stringify(msj)); }

// recupera los mensajes del localStorage
function recuperarLS() { return JSON.parse(localStorage.getItem('msj')); }

// almacena los datos del Usuario
function cargarName(nombre,id) { localStorage.setItem('usuario',JSON.stringify({nombre:nombre, id:id})); }

// recupera los datos del usuario
function recuperarName() { return JSON.parse(localStorage.getItem('usuario')); }
