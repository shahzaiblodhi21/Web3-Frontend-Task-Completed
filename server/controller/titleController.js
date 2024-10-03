const db = require('../config/db');

// Controller to add a title
// Controller to add a title with custom UID logic
exports.addTitle = (req, res) => {
    const { name, data3, description } = req.body;
    const userId = req.userId; // Extracted from the token by middleware

    console.log('Received userId:', userId); // Debugging: Make sure userId is not null or undefined

    if (!name || !data3 || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing.' });
    }

    // Query to find the smallest available UID
    const findAvailableUIDQuery = `
      SELECT MIN(t1.id + 1) AS nextUID
      FROM titles_man t1
      LEFT JOIN titles_man t2
      ON t1.id + 1 = t2.id
      WHERE t2.id IS NULL;
    `;

    db.query(findAvailableUIDQuery, (err, result) => {
      if (err) {
        console.error('Error finding available UID:', err);
        return res.status(500).json({ message: 'Database error while finding available UID.' });
      }

      const nextUID = result[0].nextUID || 1; // Default to 1 if no UID exists

      // Insert the new record with the available UID
      const insertQuery = `INSERT INTO titles_man (id, user_id, name, data3, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;

      db.query(insertQuery, [nextUID, userId, name, data3, description], (err, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json({ message: 'Title added successfully!', data: result });
      });
    });
};

// Controller to get all titles for a user
exports.getTitles = (req, res) => {
  const userId = req.userId; // Extracted from the token by middleware

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing.' });
  }

  const query = `SELECT * FROM titles_man WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching titles from MySQL:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(200).json({ data: results });
  });
};


// Controller to update a title
exports.editTitle = (req, res) => {
  const { id } = req.params;
  const { name, data3, description } = req.body;
  const userId = req.userId; // Extracted from the token by middleware

  console.log('Received userId:', userId); // Debugging: Ensure userId is set

  if (!name || !data3 || !description) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing.' });
  }

  const query = `UPDATE titles_man SET name = ?, data3 = ?, description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`;

  db.query(query, [name, data3, description, id, userId], (err, result) => {
    if (err) {
      console.error('Error updating title in MySQL:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(200).json({ message: 'Title updated successfully!' });
  });
};

// Controller to delete a title
exports.deleteTitle = (req, res) => {
  const { id } = req.params;  // ID of the title to delete
  const userId = req.userId;   // Extracted from the token

  // Step 1: Delete the record
  const deleteQuery = `DELETE FROM titles_man WHERE id = ? AND user_id = ?`;
  db.query(deleteQuery, [id, userId], (err, result) => {
    if (err) {
      console.error('Error deleting title from MySQL:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    // Step 2: Shift down the IDs of all titles with an ID greater than the one deleted
    const shiftIdsQuery = `UPDATE titles_man SET id = id - 1 WHERE id > ?`;
    db.query(shiftIdsQuery, [id], (err, result) => {
      if (err) {
        console.error('Error shifting IDs:', err);
        return res.status(500).json({ message: 'Database error while shifting IDs.' });
      }

      // Step 3: Reset the AUTO_INCREMENT to the maximum ID + 1
      const resetAutoIncrementQuery = `
        SET @max_id := (SELECT MAX(id) FROM titles_man);
        ALTER TABLE titles_man AUTO_INCREMENT = @max_id + 1;
      `;
      db.query(resetAutoIncrementQuery, (err, result) => {
        if (err) {
          console.error('Error resetting AUTO_INCREMENT:', err);
          return res.status(500).json({ message: 'Database error while resetting AUTO_INCREMENT.' });
        }

        res.status(200).json({ message: 'Title deleted and IDs shifted successfully!' });
      });
    });
  });
};
