import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Select, MenuItem, FormControl,
  InputLabel, Grid, Typography, Box, InputAdornment, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../services/api';
import { format } from 'date-fns';

const DatabaseAdmin = () => {
  const [gatePasses, setGatePasses] = useState([]);
  const [filteredPasses, setFilteredPasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hostelBlockFilter, setHostelBlockFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'requestDate', direction: 'desc' });
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gate passes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/gatepass/public/all');
        setGatePasses(res.data);
        setFilteredPasses(res.data);

        // Extract unique hostel blocks
        const blocks = [...new Set(res.data.map(p => p.hostelBlock))];
        setHostelBlocks(blocks.sort());

      } catch (err) {
        setError("Failed to fetch gate passes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering + Sorting
  useEffect(() => {
    let filtered = [...gatePasses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Hostel block filter
    if (hostelBlockFilter !== 'all') {
      filtered = filtered.filter(p => p.hostelBlock === hostelBlockFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Convert requestDate to real date object
      if (sortConfig.key === 'requestDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPasses(filtered);

  }, [gatePasses, searchTerm, statusFilter, hostelBlockFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Gate Pass Database
      </Typography>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search by Name / Reason / Destination"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Hostel Block</InputLabel>
              <Select value={hostelBlockFilter} label="Hostel Block"
                onChange={(e) => setHostelBlockFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                {hostelBlocks.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>

              <TableCell onClick={() => handleSort('name')}>
                Name <SortIcon />
              </TableCell>

              <TableCell onClick={() => handleSort('hostelBlock')}>
                Hostel Block <SortIcon />
              </TableCell>

              <TableCell onClick={() => handleSort('journeyDate')}>
                Journey Date <SortIcon />
              </TableCell>

              <TableCell>Leaving Time</TableCell>

              <TableCell>Destination</TableCell>

              <TableCell onClick={() => handleSort('requestDate')}>
                Request Date <SortIcon />
              </TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Reason</TableCell>

              <TableCell>Luggage</TableCell>

            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPasses.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.hostelBlock}</TableCell>
                <TableCell>{p.journeyDate}</TableCell>
                <TableCell>{p.leavingTime}</TableCell>
                <TableCell>{p.destination}</TableCell>
                <TableCell>{format(new Date(p.requestDate), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.reason}</TableCell>
                <TableCell>{p.luggageDetails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  );
};

export default DatabaseAdmin;
