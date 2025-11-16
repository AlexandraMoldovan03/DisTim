import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function ProfilesList() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (isAuthenticated) fetchProfiles();
  }, [isAuthenticated]);

  async function fetchProfiles() {
    const token = await getAccessTokenSilently();
    const res = await fetch('http://localhost:4000/api/profiles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfiles(data);
  }

  async function handleDelete(id) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`http://localhost:4000/api/profiles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProfiles(profiles.filter(p => p.id !== id));
    } else {
      alert('You are not authorized to delete this profile.');
    }
  }

  return (
    <div>
      <h2>Profiles</h2>
      <ul>
        {profiles.map(p => (
          <li key={p.id}>
            {p.display_name || 'Unknown'} ({p.email}) {p.is_artist ? '[Artist]' : ''}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
