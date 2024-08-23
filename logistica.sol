// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract logisticaSimple {

    struct Estado {
        string ubicacion;
        uint marcaTiempo;
    }

    struct Producto {
        string nombre;
        string Descripcion;
        string precio;
        string color;
        string mediaUrl;
        Estado[] historialEstados;
    }

    uint public contadorProductos;

    mapping (uint => Producto) public productos;

    function registrarProducto(
        string memory _nombre, 
        string memory _descripcion, 
        string memory _precio,
        string memory _color, 
        string memory _mediaUrl 
    ) public {
        contadorProductos ++;
        productos[contadorProductos].nombre = _nombre;
        productos[contadorProductos].Descripcion = _descripcion;
        productos[contadorProductos].precio = _precio;
        productos[contadorProductos].color = _color;
        productos[contadorProductos].mediaUrl = _mediaUrl;
    }

    function actualizarEstado(uint _idProducto, string memory _ubicacion) public {
        require(_idProducto > 0 && _idProducto <= contadorProductos, "el producto no existe");
        productos[_idProducto].historialEstados.push(Estado({
            ubicacion: _ubicacion,
            marcaTiempo: block.timestamp
        }));
    }

    function obtenerHistorial(uint _idProducto) public view returns (Estado[] memory) {
        require(_idProducto > 0 && _idProducto <= contadorProductos, "El producto no existe");
        return productos[_idProducto].historialEstados;
    }

    // Nueva función para obtener detalles de todos los productos
    function obtenerListaProductos() public view returns (
        string[] memory, 
        string[] memory, 
        string[] memory, 
        string[] memory, 
        string[] memory
    ) {
        string[] memory nombres = new string[](contadorProductos);
        string[] memory descripciones = new string[](contadorProductos);
        string[] memory precios = new string[](contadorProductos);
        string[] memory colores = new string[](contadorProductos);
        string[] memory mediaUrls = new string[](contadorProductos);

        for (uint i = 1; i <= contadorProductos; i++) {
            nombres[i-1] = productos[i].nombre;
            descripciones[i-1] = productos[i].Descripcion;
            precios[i-1] = productos[i].precio;
            colores[i-1] = productos[i].color;
            mediaUrls[i-1] = productos[i].mediaUrl;
        }

        return (nombres, descripciones, precios, colores, mediaUrls);
    }
}
