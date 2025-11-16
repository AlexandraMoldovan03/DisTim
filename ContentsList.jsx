import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function ContentsList() {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (isAuthenticated) fetchContents();
  }, [isAuthenticated]);

  async function fetchContents() {
    const token = await getAccessTokenSilently();
    const res = await fetch('http://localhost:4000/api/contents', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContents(data);
  }

  async function handleDelete(id) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`http://localhost:4000/api/contents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setContents(contents.filter(c => c.id !== id));
    } else {
      alert('You are not authorized to delete this content.');
    }
  }

  return (
    <div>
      <h2>Contents</h2>
      <ul>
        {contents.map(c => (
          <li key={c.id}>
            <strong>{c.title}</strong> by {c.artist || 'Unknown'} ({c.category})
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
