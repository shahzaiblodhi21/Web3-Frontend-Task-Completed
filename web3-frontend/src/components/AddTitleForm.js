import React, { useState } from 'react';
import { addTitle } from '../services/TitleService';

const AddTitleForm = () => {
  const [subject, setSubject] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTitle({ subject });
    setSubject('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Title Subject" />
      <button type="submit">Add Title</button>
    </form>
  );
};

export default AddTitleForm;
