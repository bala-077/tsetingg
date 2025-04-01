import React, { useState, useEffect } from 'react';
import {
  Paper, Grid, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Container, Button
} from '@material-ui/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchBooks } from './../../Api/Books/Books'; // Import API function

function Books() {
  const [projects, setBooks] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      let booksData = await fetchBooks();
      setBooks(booksData);
    };
    fetchApi();
  }, []);

  // Transform Data for Chart
  const chartData = projects.map(project => ({
    name: project.projectname,
    duration: parseInt(project.duration) || 0, // Ensure it's a number
  }));

  return (
    <Container>
      <h2>Project Duration Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>

      {/* Table */}
     

    </Container>
  );
}

export default Books;
