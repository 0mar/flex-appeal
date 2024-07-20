import Typography from '@mui/material/Typography';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

function OfferCard({ offer }) {
    const trip_prices = Object.values(offer.per_trip_prices).reduce((a, b) => a + b, 0);
    const total_price = trip_prices + offer.base_price;
    return (
        <React.Fragment>
            <Card sx={{
                maxWidth: 275,
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
export default OfferCard;