import React, { useEffect, useState } from 'react';
import { getTitles, deleteTitle } from '../services/TitleService';

const TitleList = () => {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    async function fetchTitles() {
      const data = await getTitles();
      setTitles(data);
    }
    fetchTitles();
  }, []);

  const handleDelete = async (id) => {
    await deleteTitle(id);
    setTitles(titles.filter(title => title.id !== id));
  };

  return (
    <div>
      {titles.map(title => (
        <div key={title.id}>
          <h3>{title.subject}</h3>
          <button onClick={() => handleDelete(title.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TitleList;
