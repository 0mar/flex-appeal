import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import { Table, Autocomplete, Fab, MenuItem, Select, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import NavigationIcon from '@mui/icons-material/Navigation';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const initialTrips = [
  { id: 0, start: null, end: null, moment: 1 },
]
function OfferCard({ offer }) {
  const trip_prices = Object.values(offer.per_trip_prices).reduce((a, b) => a + b, 0);
  const total_price = trip_prices + offer.base_price;
  return (
    <React.Fragment>
      <Card sx={{
        maxWidth: 275,
        // backgroundColor: offer.is_best ? 'success.light' : 'background.paper',
        borderColor: offer.is_best ? 'success.main' : 'border.paper',
        borderWidth: 2,
        borderStyle: 'solid',
      }}
        variant="outlined"
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {offer.is_best ? "Best subscription" : "Alternative"}
          </Typography>
          <Typography variant="h5" component="div">
            {offer.name}
            <br />
            {`€ ${total_price.toFixed(2)}`}
          </Typography>
          <Divider />
          <Typography variant="body2">
            {`Subsciption price: € ${offer.base_price.toFixed(2)}`}
            <br />
            {`Travel costs: € ${trip_prices.toFixed(2)}`}
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

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

function App() {
  const [trips, setTrips] = useState(initialTrips);
  const [schedule, setSchedule] = useState('once');
  const [stations, setStations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [prices, setPrices] = useState({});
  useEffect(() => {
    axios.get('http://localhost:8000/get_stations')
      .then(response => {
        setStations(response.data.stations);
      })
      .catch(error => {
        console.error('Error fetching stations:', error);
      });
  }, []);

  const handleChange = (id, field, value) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === id ? { ...trip, [field]: value } : trip
      )
    );
  };

  const handleDelete = (id) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  const addTrip = () => {
    const newTrip = {
      id: trips.length ? trips[trips.length - 1].id + 1 : 0,
      start: null,
      end: null,
      moment: 1,
    };
    setTrips((prevTrips) => [...prevTrips, newTrip]);
  };

  const validateTrips = () => {
    for (let trip of trips) {
      if (!trip.start || !trip.end || !trip.moment) {
        return false;
      }
    }
    return true;
  };

  const submitTrips = () => {
    if (validateTrips()) {
      const payload = { trips: trips, schedule: schedule };
      axios.post('http://localhost:8000/get_prices', payload)
        .then(response => {
          setOffers(response.data)
          const offeredPrices = response.data[0]["per_trip_prices"];
          setPrices(offeredPrices);
          console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    } else {
      alert('Please complete all fields in each trip.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>NS Subscription picker</h1>
        <Itinerary trips={trips}
          handleChange={handleChange}
          handleDelete={handleDelete}
          stations={stations}
          prices={prices}
        />
        <Box sx={{ '& > :not(style)': { m: 1 } }}>

          <Fab color="primary" aria-label="add" onClick={addTrip}>
            <AddIcon />
          </Fab>
          <Fab variant="extended" onClick={submitTrips}>
            <NavigationIcon sx={{ mr: 1 }} />
            Submit
          </Fab>
        </Box>
        <div>
          {/* <Select
            labelId="repeat-label"
            id="repeat-select"
            value={schedule}
            // label="Repeat schedule"
            onChange={(event => { (setSchedule(event.target.value)) })}
          >
            <MenuItem value={"once"}>Only once</MenuItem>
            <MenuItem value={"weekly"}>Every week</MenuItem>
            <MenuItem value={"monthly"}>Every month</MenuItem>
          </Select> */}
        </div>
        <div>
          <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
            {offers.map((offer, index) => (
              <Grid item key={index}>
                <OfferCard offer={offer} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
