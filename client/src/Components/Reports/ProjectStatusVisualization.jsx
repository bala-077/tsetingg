import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@material-ui/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ProjectStatusVisualization() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await axios.get('/api/lead/get-status');
        setStatusData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project status data');
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!statusData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  // Transform data for pie chart
  const pieData = Object.entries(statusData.statusSummary).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Project Status Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">
                {statusData.totalProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {Object.entries(statusData.statusSummary).map(([stage, count]) => (
          <Grid item xs={12} md={4} key={stage}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stage}
                </Typography>
                <Typography variant="h4">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Project Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Project Duration by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData.projects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProjectStatusVisualization; 