document.addEventListener('DOMContentLoaded', async function () {
    const contractAddress = '0xe0085fabd543f24d1f80ecade8110e2832ac280e';
    const abi = [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_idProducto',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: '_ubicacion',
            type: 'string',
          },
        ],
        name: 'actualizarEstado',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_nombre',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_descripcion',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_precio',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_color',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_mediaUrl',
            type: 'string',
          },
        ],
        name: 'registrarProducto',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'contadorProductos',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_idProducto',
            type: 'uint256',
          },
        ],
        name: 'obtenerHistorial',
        outputs: [
          {
            components: [
              {
                internalType: 'string',
                name: 'ubicacion',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'marcaTiempo',
                type: 'uint256',
              },
            ],
            internalType: 'struct logisticaSimple.Estado[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'obtenerListaProductos',
        outputs: [
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'productos',
        outputs: [
          {
            internalType: 'string',
            name: 'nombre',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'Descripcion',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'precio',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'color',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'mediaUrl',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
  
    async function requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  
    await requestAccount();
  
    document
      .getElementById('registrarProductoForm')
      .addEventListener('submit', async event => {
        event.preventDefault();
  
        try {
          const nombre = document.getElementById('nombreProducto').value;
          const descripcion = document.getElementById(
            'descripcionProducto'
          ).value;
          const precio = document.getElementById('precioProducto').value;
          const color = document.getElementById('colorProducto').value;
          const mediaUrl = document.getElementById('mediaUrlProducto').value;
  
          const transaction = await contract.registrarProducto(
            nombre,
            descripcion,
            precio,
            color,
            mediaUrl
          );
  
          await transaction.wait();
  
          alert('Producto registrado exitosamente');
        } catch (error) {
          console.error('Error al registrar el producto:', error);
          alert(
            'Error al registrar el producto. Verifica la consola para más detalles.'
          );
        }
      });
  
    document
      .getElementById('actualizarEstadoForm')
      .addEventListener('submit', async event => {
        event.preventDefault();
  
        try {
          const idProducto = document.getElementById('idProducto').value;
          const ubicacion = document.getElementById('ubicacion').value;
  
          const transaction = await contract.actualizarEstado(
            idProducto,
            ubicacion
          );
  
          await transaction.wait();
  
          alert('Estado actualizado exitosamente');
        } catch (error) {
          console.error('Error al actualizar el estado:', error);
          alert(
            'Error al actualizar el estado. Verifica la consola para más detalles.'
          );
        }
      });
  
    document
      .getElementById('obtenerHistorialForm')
      .addEventListener('submit', async event => {
        event.preventDefault();
  
        try {
          const idProducto = document.getElementById('idProductoHistorial').value;
          const historial = await contract.obtenerHistorial(idProducto);
  
          const formattedHistorial = historial.map(entry => {
            return {
              ubicacion: entry.ubicacion,
              marcaTiempo: formatTimestamp(entry.marcaTiempo.toNumber()),
            };
          });
  
          document.getElementById('historialOutput').textContent = JSON.stringify(
            formattedHistorial,
            null,
            2
          );
        } catch (error) {
          console.error('Error al obtener el historial:', error);
          alert(
            'Error al obtener el historial. Verifica la consola para más detalles.'
          );
        }
      });
  
    document
      .getElementById('obtenerListaProductos')
      .addEventListener('click', async () => {
        try {
          const [nombres, descripciones, precios, colores, mediaUrls] =
            await contract.obtenerListaProductos();
          const container = document.getElementById('listaProductosOutput');
          container.innerHTML = '';
  
          for (let i = 0; i < nombres.length; i++) {
            const productoData = {
              nombre: nombres[i],
              Descripcion: descripciones[i],
              precio: precios[i],
              color: colores[i],
              mediaUrl: mediaUrls[i],
            };
  
            const precioFormateado = new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(parseFloat(productoData.precio));
  
            const card = document.createElement('div');
            card.className = 'col-md-6 product-card card mt-4';
  
            if (productoData.mediaUrl) {
              const img = document.createElement('img');
              img.src = productoData.mediaUrl;
              img.className = 'card-img-top';
              img.alt = productoData.nombre;
              img.style.maxHeight = '200px';
              img.style.objectFit = 'cover';
              card.appendChild(img);
            }
  
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
  
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = productoData.nombre;
  
            const description = document.createElement('p');
            description.className = 'card-text';
            description.textContent = `Descripción: ${
              productoData.Descripcion || 'N/A'
            }`;
  
            const price = document.createElement('p');
            price.className = 'card-text';
            price.textContent = `Precio: ${precioFormateado || 'N/A'}`;
  
            const color = document.createElement('p');
            color.className = 'card-text';
            color.innerHTML = `Color: <span style="background-color: ${productoData.color}; padding: 5px; border-radius: 5px;">${productoData.color}</span>`;
  
            cardBody.appendChild(title);
            cardBody.appendChild(description);
            cardBody.appendChild(price);
            cardBody.appendChild(color);
  
            card.appendChild(cardBody);
  
            container.appendChild(card);
          }
        } catch (error) {
          console.error('Error al obtener la lista de productos:', error);
        }
      });
  
    function formatTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    }
  });
  