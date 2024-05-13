// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/names');
      setNames(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddName = async () => {
    try {
      const response = await axios.post('http://localhost:3001/names', { name: newName });
      setNames([...names, response.data]);
      setNewName('');
    } catch (error) {
      console.error('Error adding name:', error);
    }
  };

  const handleEditName = async () => {
    try {
      await axios.put(`http://localhost:3001/names/${editingId}`, { name: editingName });
      setNames(names.map(name => (name.id === editingId ? { ...name, name: editingName } : name)));
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error editing name:', error);
    }
  };

  const handleDeleteName = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/names/${id}`);
      setNames(names.filter(name => name.id !== id));
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  return (
    <div>
      <h1>Daftar Nama</h1>
      <ul>
        {names.map(name => (
          <li key={name.id}>
            {editingId === name.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Edit nama"
              />
            ) : (
              <span>{name.name}</span>
            )}
            {editingId === name.id ? (
              <button onClick={handleEditName}>Simpan</button>
            ) : (
              <button onClick={() => { setEditingId(name.id); setEditingName(name.name); }}>Edit</button>
            )}
            <button onClick={() => handleDeleteName(name.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Tambahkan nama baru"
      />
      <button onClick={handleAddName}>Tambah</button>
    </div>
  );
}

export default App;
