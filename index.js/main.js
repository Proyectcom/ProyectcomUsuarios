const botonMas = document.querySelector('.botonImgMas');
const formTarjeta = document.getElementById('formTarjeta');
const mainContent = document.getElementById('mainContent');
const tarjetasContainer = document.querySelector('.tarjetas-container');
const formCrear = document.getElementById('crearTarjeta');
const editarSection = document.getElementById('editarSection');
const finalizadosContent = document.getElementById('finalizadosContent');
const finalizadosContainer = document.getElementById('finalizadosContainer');

const searchInput = document.querySelector('.inputBus');

document.querySelector('.input-group-addon').addEventListener('click', () => {
    const fechaInput = document.getElementById('fecha');
    fechaInput.focus();
});

botonMas.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'none';
    formTarjeta.style.display = 'block';
    formTarjeta.classList.add('show-card');
});

function crearTarjeta(data) {
    const card = document.createElement('tr');
    card.classList.add('card');

    if (!data.comentarios) {
        data.comentarios = [];
        if (data.descripcion) {
            data.comentarios.push(data.descripcion);
        }
    }

    let estadoColor = "blue";

    card.innerHTML = `
        <tr class="card-body" id="nota${data.id}">
            <span>${data.fecha}</span>
            <h4 class="h4">${data.nombre}</h4>
            <td class="empresa">${data.empresa}</td>
            <td class="motivo">${data.motivo}</td>
            <td class="ciudad">${data.ciudad}</td>
            <td class="celular">${data.celular}</td>
            <td class="info-idEle info-id">${data.numCotizacion}</td>
            <td class="contenedor-estado">
                <select class="select-estado estado" data-id="${data.id}" style="color: ${estadoColor};">
                    <option ${data.estado == 1 ? 'selected' : ''} value="1">Abierto</option>
                    <option ${data.estado == 2 ? 'selected' : ''} value="2">En ejecución</option>
                    <option ${data.estado == 3 ? 'selected' : ''} value="3">Finalizado</option>
                </select>
            </td>
            <td class="Correo">${data.correo}</td>

            <button class="editarBtn">Editar</button>
            <button class="guardarBtn eliminarBtn" style="display: none;">Guardar</button>
        </tr>
    `;

    if (data.estado == 3) {
        card.querySelector('.guardarBtn').style.display = 'block';
    }
    card.querySelector('.select-estado').addEventListener('change', (e) => {
        cambiarEstado(data.id, e.target.value);
    });

    card.querySelector('.guardarBtn').addEventListener('click', () => {
        moverFinalizado(data.id, card);
    });

    card.querySelector('.editarBtn').addEventListener('click', () => {
        mostrarEditarSeccion(data);
    });

    tarjetasContainer.appendChild(card);
}

function cambiarEstado(id, estado) {
    const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    const tarjeta = tarjetasGuardadas.find(tarjeta => tarjeta.id === id);

    if (tarjeta) {
        tarjeta.estado = parseInt(estado);
        localStorage.setItem('tarjetas', JSON.stringify(tarjetasGuardadas));

        const tarjetaElement = document.getElementById(`nota${id}`);
        const selectEstado = tarjetaElement.querySelector('.select-estado');

        let estadoColor = "blue";
        selectEstado.style.color = estadoColor;

        const guardarBtn = tarjetaElement.querySelector('.guardarBtn');
        if (estado == 3) {
            guardarBtn.style.display = 'block';
        } else {
            guardarBtn.style.display = 'none';
        }
    }
}

function mostrarEditarSeccion(data) {
    mainContent.style.display = 'none';
    formTarjeta.style.display = 'none';
    editarSection.style.display = 'flex';
    editarSection.classList.remove('hide-card');
    editarSection.classList.add('show-card');

    const inputs = editarSection.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.name in data) {
            input.value = data[input.name];
        }
    });

    const formEditar = editarSection.querySelector('form');

    formEditar.querySelectorAll('.botones-edicion').forEach(el => el.remove());

    const botonesEdicion = document.createElement('div');
    botonesEdicion.classList.add('botones-edicion');

    const guardarBtn = document.createElement('button');
    guardarBtn.type = 'submit';
    guardarBtn.textContent = 'Guardar Cambios';
    guardarBtn.classList.add('guardarBtn2');

    const comentariosBtn = document.createElement('button');
    comentariosBtn.type = 'button';
    comentariosBtn.textContent = 'Comentarios';
    comentariosBtn.classList.add('comentariosBtn');

    const comentariosBox = document.createElement('textarea');
    comentariosBox.classList.add('comentarios-box');
    comentariosBox.placeholder = 'Agrega tus comentarios aquí...';
    comentariosBox.style.display = 'none';

    const guardarComentarioBtn = document.createElement('button');
    guardarComentarioBtn.type = 'button';
    guardarComentarioBtn.textContent = 'Guardar Comentario';
    guardarComentarioBtn.classList.add('guardarComentarioBtn');

    botonesEdicion.appendChild(guardarBtn);
    botonesEdicion.appendChild(comentariosBtn);
    botonesEdicion.appendChild(guardarComentarioBtn);
    botonesEdicion.appendChild(comentariosBox);
    formEditar.appendChild(botonesEdicion);

    const comentariosCard = document.createElement('div');
    comentariosCard.classList.add('comentarios-card');
    comentariosCard.innerHTML = `
        <div class="card-header">
            <h5>Comentarios</h5>
        </div>
        <div class="card-body">
            ${data.comentarios && data.comentarios.length > 0 ? 
                data.comentarios.map(com => 
                    `<div class="mini-comentario">
                        <span class="fecha-comentario">${com.fecha}</span>
                        <p class="comentario-texto">${com.texto}</p>
                    </div>` 
                ).join('') : 
                `<p></p>`
            }
        </div>
    `;
    
    editarSection.appendChild(comentariosCard);

    comentariosBtn.addEventListener('click', () => {
        comentariosBox.style.display = comentariosBox.style.display === 'none' ? 'block' : 'none';
    });

    guardarComentarioBtn.addEventListener('click', () => {
        const nuevoComentario = comentariosBox.value.trim();
        if (nuevoComentario) {
            const comentarioConFecha = {
                texto: nuevoComentario,
                fecha: new Date().toLocaleDateString()
            };

            data.comentarios = data.comentarios || [];
            data.comentarios.push(comentarioConFecha);

            const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
            const tarjetaIndex = tarjetasGuardadas.findIndex(tarjeta => tarjeta.id === data.id);
            if (tarjetaIndex !== -1) {
                tarjetasGuardadas[tarjetaIndex] = { ...tarjetasGuardadas[tarjetaIndex], comentarios: data.comentarios };
                localStorage.setItem('tarjetas', JSON.stringify(tarjetasGuardadas));
            }

            const comentariosContainer = comentariosCard.querySelector('.card-body');
            const nuevoComentarioHTML = `
                <div class="mini-comentario">
                    <span class="fecha-comentario">${comentarioConFecha.fecha}</span>
                    <p class="comentario-texto">${comentarioConFecha.texto}</p>
                </div>
            `;
            comentariosContainer.insertAdjacentHTML('beforeend', nuevoComentarioHTML);
            comentariosBox.value = '';
        }
    });

    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formEditar);
        const updatedData = Object.fromEntries(formData.entries());

        const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
        const tarjetaIndex = tarjetasGuardadas.findIndex(tarjeta => tarjeta.id === data.id);

        if (tarjetaIndex !== -1) {
            tarjetasGuardadas[tarjetaIndex] = { ...tarjetasGuardadas[tarjetaIndex], ...updatedData };
            localStorage.setItem('tarjetas', JSON.stringify(tarjetasGuardadas));
        }

        editarSection.style.display = 'none';
        mainContent.style.display = 'block';
        location.reload();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    tarjetasGuardadas.forEach(crearTarjeta);
});

formCrear.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(formCrear);
    const data = Object.fromEntries(formData.entries());

    data.estado = 1;

    crearTarjeta(data);

    const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    tarjetasGuardadas.push(data);
    localStorage.setItem('tarjetas', JSON.stringify(tarjetasGuardadas));

    formTarjeta.classList.remove('show-card');
    formTarjeta.style.display = 'none';
    mainContent.style.display = 'block';

    formCrear.reset();
});

document.querySelector('.submenu li:nth-child(2)').addEventListener('click', () => {
    mainContent.classList.add('hide-section');
    formTarjeta.classList.add('hide-section');
    finalizadosContent.classList.add('show-section');

    setTimeout(() => {
        mainContent.style.display = 'none';
        formTarjeta.style.display = 'none';
        finalizadosContent.style.display = 'block';
    }, 300);

    mostrarFinalizados();
});

document.querySelector('.submenu li:nth-child(1)').addEventListener('click', () => {
    mainContent.classList.add('show-section');
    formTarjeta.classList.add('hide-section');
    finalizadosContent.classList.add('hide-section');

    setTimeout(() => {
        mainContent.style.display = 'block';
        formTarjeta.style.display = 'none';
        finalizadosContent.style.display = 'none';
    }, 300);

    botonMas.style.display = 'block';
});

function moverFinalizado(id, cardElement) {
    const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
    const tarjetaIndex = tarjetasGuardadas.findIndex(tarjeta => tarjeta.id === id);

    if (tarjetaIndex !== -1) {
        const tarjetaFinalizada = tarjetasGuardadas.splice(tarjetaIndex, 1)[0];

        const finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];
        finalizados.push(tarjetaFinalizada);
        localStorage.setItem('finalizados', JSON.stringify(finalizados));

        localStorage.setItem('tarjetas', JSON.stringify(tarjetasGuardadas));
        cardElement.remove();
    }
}

function eliminarTarjeta(id, cardElement) {
    const finalizadosContent = document.getElementById('finalizadosContent');

    if (finalizadosContent.style.display === 'block') {
        cardElement.remove();

        const tarjetasGuardadas = JSON.parse(localStorage.getItem('tarjetas')) || [];
        const tarjetasActualizadas = tarjetasGuardadas.filter(tarjeta => tarjeta.id !== id);
        localStorage.setItem('tarjetas', JSON.stringify(tarjetasActualizadas));

        const finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];
        const finalizadosActualizados = finalizados.filter(tarjeta => tarjeta.id !== id);
        localStorage.setItem('finalizados', JSON.stringify(finalizadosActualizados));
    } else {
        alert("Solo puedes eliminar clientes desde la sección de 'Clientes Finalizados'");
    }
}

function mostrarFinalizados() {
    const finalizados = JSON.parse(localStorage.getItem('finalizados')) || [];

    finalizados.forEach(data => {
        const card = document.createElement('tr');
        card.classList.add('card');

        card.innerHTML = `
            <tr class="card-body">
                <span >${data.fecha}</span>
                <h4 class="h4">${data.nombre}</h4>
                <td class="empresa">${data.empresa}</td>
                <td class="motivo">${data.motivo}</td>
                <td class="ciudad">${data.ciudad}</td>
                <td class="celular">${data.celular}</td>
                <td class="info-id">${data.numCotizacion}</td>
                <td class="cardBodyEle contenedor-estado" style="color: blue;">Finalizado</td>
                <td class="Correo">${data.correo}</td>

                <button class="eliminarBtn editarBtn">Eliminar</button>
            </tr>
        `;

        const eliminarBtn = card.querySelector('.eliminarBtn');
        eliminarBtn.addEventListener('click', () => {
            eliminarTarjeta(data.id, card);
        });

        finalizadosContainer.appendChild(card);
    });
}

searchInput.addEventListener('input', buscarPorCotizacion);

function buscarPorCotizacion() {
    const searchTerm = searchInput.value.toLowerCase();
    const tarjetas = document.querySelectorAll('.tarjetas-container .card');
    tarjetas.forEach(tarjeta => {
        const numCotizacion = tarjeta.querySelector('.info-id').textContent.toLowerCase();
        if (numCotizacion.includes(searchTerm)) {
            tarjeta.style.display = '';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}
