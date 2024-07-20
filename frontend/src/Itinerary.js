
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Table, Autocomplete, MenuItem, Select, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


function StationBox({ value, onChange, options }) {
  return (
    <Autocomplete
      disablePortal
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Station" />}
    />
  );
}

function Itinerary({ trips, handleChange, handleDelete, stations, prices }) {

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>Moment</TableCell>
            <TableCell>Best price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip) => (
            <TripRow key={trip.id}
              trip={trip}
              handleChange={handleChange}
              handleDelete={handleDelete}
              stations={stations}
              price={prices[trip.id]}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TripRow({ trip, handleChange, handleDelete, stations, price }) {
  return (
    <TableRow id={`trip-row-${trip.id}`}>
      <TableCell><StationBox
        value={trip.start}
        onChange={(newValue) => handleChange(trip.id, 'start', newValue)}
        options={stations}
      /></TableCell>
      <TableCell><StationBox
        value={trip.end}
        onChange={(newValue) => handleChange(trip.id, 'end', newValue)}
        options={stations}
      /></TableCell>
      <TableCell>
        <Select
          labelId="rate-label"
          id={`trip-rate-${trip.id}`}
          value={trip.moment}
          onChange={(e => handleChange(trip.id, 'moment', e.target.value))}
        >
          <MenuItem value={1}>Spits</MenuItem>
          <MenuItem value={6}>Dal</MenuItem>
          <MenuItem value={2}>Weekend</MenuItem>
        </Select>
      </TableCell>
      <TableCell><Typography gutterBottom variant="h6" component="div">
        {price !== undefined ? "€ " + price.toFixed(2) : "-"}
      </Typography></TableCell>
      <TableCell>
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDelete(trip.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default Itinerary;
