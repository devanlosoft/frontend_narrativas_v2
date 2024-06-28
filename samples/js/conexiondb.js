const API_URL = 'http://localhost:3001';

const itemsPerPage = 3; // Define un valor predeterminado para itemsPerPage
let currentPage = 1; // Inicializa currentPage con 1 o cualquier otra lógica para determinar la página actual

// Función para obtener datos de la API
function fetchData(page) {
    fetch(`${API_URL}/narrativas/contents?page=${page}&limit=${itemsPerPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos del API:', data); // Debug
        
            if (data && data.contents) {
                actualizarItemsCatalogo(data.contents);
                // Asegurarse de que currentPage y totalPages están definidos y son pasados correctamente
                actualizarPaginacion(data.currentPage, data.totalPages);
            } else {
                console.error('Estructura de datos inesperada:', data);
            }
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}

// Función para actualizar la paginación
function actualizarPaginacion(currentPage, totalPages) {
    document.addEventListener('DOMContentLoaded', function() {
        const contenedorPaginacion = document.querySelector('.tm-pagination');
        if (contenedorPaginacion) {
            console.log('Contenedor de paginación encontrado');
            contenedorPaginacion.innerHTML = ''; // Vaciar el contenedor de paginación

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.className = 'tm-pagination-button';
                button.textContent = i;
                if (i === currentPage) {
                    button.disabled = true;
                }
                button.addEventListener('click', () => {
                    fetchData(i);
                });
                contenedorPaginacion.appendChild(button);
            }
        } else {
            console.error('El contenedor de paginación no se encontró.');
        }
    });
   
}


// Función para actualizar items del catálogo
function actualizarItemsCatalogo(contents) {
    const contenedorItems = document.querySelector('.tm-catalog-item-list');
    if (contenedorItems) {
        contenedorItems.innerHTML = ''; // Vaciar el contenedor de ítems

        if (Array.isArray(contents)) {
            contents.forEach(content => {
                const div = document.createElement('div');
                div.className = 'col-lg-4 col-md-6 col-sm-12 tm-catalog-item';
                const innerDiv = document.createElement('div');
                innerDiv.className = 'p-4 tm-bg-gray tm-catalog-item-description';

                const imgContainer = document.createElement('div');
                imgContainer.className = 'position-relative tm-thumbnail-container';
                
                const img = document.createElement('img');
                img.src = content.imagen;
                img.alt = content.title;
                img.height = 200;
                img.width = 415;
                img.addEventListener('click', function() {
                    window.location.href = `video-page.html?id=${content._id}`;
                });
                img.className = 'img-fluid tm-catalog-item-img';
                imgContainer.appendChild(img);
                innerDiv.appendChild(imgContainer);

                const h3 = document.createElement('h3');
                h3.textContent = content.title;
                h3.className = 'tm-text-primary tm-catalog-item-title mt-3';
                innerDiv.appendChild(h3);

                const p = document.createElement('p');
                p.textContent = content.description;
                p.className = 'tm-catalog-item-text';
                innerDiv.appendChild(p);

                div.appendChild(innerDiv);
                contenedorItems.appendChild(div);
            });
        } else {
            console.error('Se esperaba un array de contenidos, pero se recibió:', contents);
        }
    } else {
        console.error('Contenedor de items no encontrado');
    }
}


// Inicializar la carga de datos
fetchData(currentPage);

