// administracion.js
const apiUsers = '/api/users';

async function loadUsers() {
  const res = await fetch(apiUsers);
  const list = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  list.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${new Date(u.createdAt).toLocaleString()}</td>
      <td>
        <button class="btn small" onclick="editUser(${u.id})">Editar</button>
        <button class="btn small" onclick="deleteUser(${u.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = { name: fd.get('name'), email: fd.get('email'), role: fd.get('role') };
    const res = await fetch(apiUsers, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (res.ok) { e.target.reset(); loadUsers(); alert('Usuario creado'); }
    else { const err = await res.json(); alert('Error: '+(err.error||res.statusText)); }
  });
});

async function editUser(id) {
  const name = prompt('Nuevo nombre');
  const email = prompt('Nuevo email');
  const role = prompt('Nuevo rol (Administrador/Operador)');
  if (!name || !email || !role) return;
  const res = await fetch(`${apiUsers}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, role }) });
  if (res.ok) { loadUsers(); alert('Usuario actualizado'); } else { alert('Error al actualizar'); }
}

async function deleteUser(id) {
  if (!confirm('Eliminar usuario?')) return;
  const res = await fetch(`${apiUsers}/${id}`, { method:'DELETE' });
  if (res.ok) { loadUsers(); alert('Usuario eliminado'); } else { alert('Error al eliminar'); }
}
