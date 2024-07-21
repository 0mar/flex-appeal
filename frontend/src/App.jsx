import React, { useState, useEffect } from 'react';
import './App.css';
import OfferCard from './OfferCard';
import Itinerary from './Itinerary';
import axios from 'axios';
import { Fab, Grid } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import NavigationIcon from '@mui/icons-material/Navigation';
import Box from '@mui/material/Box';
import api from './api';

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


function App() {
  const [trips, setTrips] = useState(initialTrips);
  const [schedule, setSchedule] = useState('once');
  const [stations, setStations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [prices, setPrices] = useState({});
  const api_url = import.meta.env.VITE_API_URL
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('/get_stations/');
        setStations(response.data.stations);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };
  
    fetchStations();
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

  const submitTrips = async () => {
    if (validateTrips()) {
      try {
        const response = await api.post('/get_prices/', payload);
        console.log(payload, "cot")
        setOffers(response.data);
        const offeredPrices = response.data[0]["per_trip_prices"];
        setPrices(offeredPrices);
        console.log('Data sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending data:', error);
        // Optionally, you could set an error state here
        // setError('Failed to get prices');
      }
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
