document.addEventListener('DOMContentLoaded', function () {
    const formUsuario = document.getElementById('formUsuario');
    const contenedorUsuarios = document.getElementById('contenedorUsuarios');
    const modalElement = document.getElementById('modalConfirmacion');
    const modalConfirmacion = new bootstrap.Modal(modalElement);
    const cuerpoModal = document.getElementById('cuerpoModal');
    const btnConfirmarGuardar = document.getElementById('btnConfirmarGuardar');

   let usuarios = [
        {
            nombre: 'Fabian',
            apellido: 'Guzman',
            fechaNacimiento: '1997-08-19',
            correo: 'f.guzman@constructora.cl',
            cargo: 'Jefe de Proyecto',
            fechaIngreso: '2024-03-25'
        },
        {
            nombre: 'Isabel',
            apellido: 'Henriquez',
            fechaNacimiento: '2004-05-12',
            correo: 'i.henriquez@constructora.cl',
            cargo: 'Ingeniera en Jefe',
            fechaIngreso: '2022-04-25'
        }
    ];

    let nuevoUsuarioTemp = null;

    function mostrarUsuarios() {
        contenedorUsuarios.innerHTML = '';

        for (let i = 0; i < usuarios.length; i++) {
            let u = usuarios[i];
            let tarjeta = document.createElement('div');
            tarjeta.className = 'col';

            tarjeta.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0 fw-bold text-dark">${u.nombre} ${u.apellido}</h5>
                            <span class="badge badge-cargo">${u.cargo}</span>
                        </div>
                        <p class="card-text text-muted mb-1">
                            <i class="bi bi-envelope text-primary me-2"></i><small>${u.correo}</small>
                        </p>
                        <p class="card-text text-muted mb-1">
                            <i class="bi bi-calendar-date text-primary me-2"></i><small>Nacimiento: ${u.fechaNacimiento}</small>
                        </p>
                        <p class="card-text text-muted mb-3">
                            <i class="bi bi-briefcase text-primary me-2"></i><small>Ingreso: ${u.fechaIngreso}</small>
                        </p>
                        <button class="btn btn-outline-danger btn-sm mt-auto w-100" onclick="borrarUsuario(${i})">
                            <i class="bi bi-trash me-1"></i>Eliminar Trabajador
                        </button>
                    </div>
                </div>
            `;

            contenedorUsuarios.appendChild(tarjeta);
        }
    }

    window.borrarUsuario = function (index) {
        usuarios.splice(index, 1);
        mostrarUsuarios();
    };

    formUsuario.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputs = formUsuario.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('is-invalid'));

        let nombre = document.getElementById('nombre');
        let apellido = document.getElementById('apellido');
        let fechaNacimiento = document.getElementById('fechaNacimiento');
        let correo = document.getElementById('correo');
        let cargo = document.getElementById('cargo');
        let fechaIngreso = document.getElementById('fechaIngreso');

        let esValido = true;

        [nombre, apellido, fechaNacimiento, correo, cargo, fechaIngreso].forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                esValido = false;
            }
        });

        if (!esValido) {
            return;
        }

        let correoVal = correo.value.trim().toLowerCase();
        let existe = usuarios.some(u => u.correo.toLowerCase() === correoVal);

        if (existe) {
            correo.classList.add('is-invalid');
            document.getElementById('feedbackCorreo').textContent = 'El correo electrónico ya existe en el sistema.';
            return;
        }

        let fechaNac = new Date(fechaNacimiento.value);
        let fechaIng = new Date(fechaIngreso.value);

        let edadAnios = fechaIng.getFullYear() - fechaNac.getFullYear();
        let mes = fechaIng.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && fechaIng.getDate() < fechaNac.getDate())) {
            edadAnios--;
        }

        if (edadAnios < 18) {
            fechaIngreso.classList.add('is-invalid');
            document.getElementById('feedbackIngreso').textContent = 'La fecha de ingreso debe ser cuando el trabajador tenga al menos 18 años.';
            return;
        }

        nuevoUsuarioTemp = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            fechaNacimiento: fechaNacimiento.value,
            correo: correoVal,
            cargo: cargo.value.trim(),
            fechaIngreso: fechaIngreso.value
        };

        cuerpoModal.innerHTML = `
            <p class="mb-3">¿Desea confirmar el registro del siguiente trabajador?</p>
            <ul class="list-group list-group-flush border rounded">
                <li class="list-group-item"><strong>Nombre:</strong> ${nuevoUsuarioTemp.nombre} ${nuevoUsuarioTemp.apellido}</li>
                <li class="list-group-item"><strong>Cargo:</strong> ${nuevoUsuarioTemp.cargo}</li>
                <li class="list-group-item"><strong>Correo:</strong> ${nuevoUsuarioTemp.correo}</li>
                <li class="list-group-item"><strong>F. Nacimiento:</strong> ${nuevoUsuarioTemp.fechaNacimiento}</li>
                <li class="list-group-item"><strong>F. Ingreso:</strong> ${nuevoUsuarioTemp.fechaIngreso}</li>
            </ul>
        `;

        modalConfirmacion.show();
    });

    btnConfirmarGuardar.addEventListener('click', function () {
        if (nuevoUsuarioTemp !== null) {
            usuarios.push(nuevoUsuarioTemp);
            nuevoUsuarioTemp = null;
            mostrarUsuarios();
            formUsuario.reset();
            formUsuario.querySelectorAll('.form-control').forEach(input => input.classList.remove('is-invalid'));
            modalConfirmacion.hide();
        }
    });

    mostrarUsuarios();
});