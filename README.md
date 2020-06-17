# chatNodejsAngularjs
Chat web con Nodejs y Angularjs

Esta es una pequeña practica realizada para aprender NodeJs y poner en practica los conocimientos previamente adquiridos de AngularJS

### Funcionamiento
Se inicia el servidor con "node app.js", debe encontrase en la carpeta del proyecto.

Ingrese con "localhost" ó "localhost:80".

Para iniciar las conversaciones se debe colocar un nombre de usuario y hacer clic en Guardar, el nombre de usuario se enviara al servidor, el cual verificara que el nombre de usuario no exista, el nombre de usuario se guarda en un arreglo de no encontrarse registrado.

En el cliente la ruta se cambia a la sala de chat "localhost/sala" ó "localhost:80/sala".

Los mensajes enviados y recibidos son guardado en el localstorage del navegador, se utiliza un contador de mensajes que sirve como id de cada mensaje, el ultimo numero del contado es pasado en la ruta para posicionar el chat en el ultimo mensaje, Ejemplo: "localhost/sala#1000" ó "localhost:80/sala#1000".

Se pueden eliminar los mensajes del localsotage con el botón borrar, e puede finalizar conexión con el chat en el botón salir

### Screenshots

#### Vista de Inicio

![Screenshot](https://raw.githubusercontent.com/Marco90v/Cuotas_controlDePago/master/caps/sistPago-cap-1.png)

#### Vista de chat

![Screenshot](https://raw.githubusercontent.com/Marco90v/Cuotas_controlDePago/master/caps/sistPago-cap-1.png)