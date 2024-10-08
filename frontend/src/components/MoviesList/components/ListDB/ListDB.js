import React, { useContext } from "react";
import { 
    Box,
    Typography,
    Button, 
    Paper,
    Stack,
} from '@mui/material';
import { MoviesContext } from '../../../../Context/ContextProvider';
import { Global } from "../../../../helpers/Global";
import ModifyModal from "./components/ModifyModal";

const ListDB = () => {
    const { moviesDB } = useContext(MoviesContext);

    const deleteMovie = async (movieId) => {
        console.log(movieId);
        
        const request = await fetch(Global.url + "movie/" + movieId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await request.json();

        if (data.status === "Success") {
            
        }
    };

    return (
        moviesDB?.map(movie => {
            return (
                <Paper key={movie?._id} elevation={3} sx={{ p: 2, flex: 1, maxWidth: 400, width: '30%', backgroundColor: '#333', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Stack direction="column" textAlign="center" paddingBottom={2}>
                            <Typography variant="h5">{movie?.title}</Typography>
                            <Typography variant="body1">{movie?.content}</Typography>
                        </Stack>
                    </Box>
                    <Stack spacing={2} direction="column">
                        <Stack direction="row" spacing={2}>
                            <Button 
                                variant="contained" 
                                fullWidth
                                onClick={() => deleteMovie(movie?._id)}
                            >
                                Delete Movie
                            </Button>
                        </Stack>
                    </Stack>
                    <ModifyModal movieId={movie._id} title={movie?.title} content={movie?.content} />
                </Paper>
            )
        })
    );
};

export default ListDB;
