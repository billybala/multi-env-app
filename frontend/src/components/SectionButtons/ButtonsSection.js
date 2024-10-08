import React, { useContext, useEffect } from 'react';
import { 
    Container,
    Button, 
    Paper,
    Stack,
} from '@mui/material';
import { Global } from '../../helpers/Global';
import { MoviesContext } from '../../Context/ContextProvider';
import AddModal from './components/AddModal';

const ButtonsSection = () => {
    const {
        moviesDB,
        setMoviesDB,
        setListToShow,
        setOpenModalAdd,
        environment,
        DBConnectionState,
        cacheConnectionState
    } = useContext(MoviesContext);

    useEffect(() => {
        const getMoviesFromDB = async () => {
            const request = await fetch(Global.url + "movies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
    
            const data = await request.json();
    
            if (data.status === "Success") {
                setMoviesDB(data?.movies);
            }
        };
        getMoviesFromDB();
    });

    const addMovie = () => {
        setOpenModalAdd(true);
    };

    const showAllMovies = async () => {
        const request = await fetch(Global.url + "movies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await request.json();

        if (data.status === "Success") {
            setMoviesDB(data?.movies);
            setListToShow("db");
        }
    };

    const showMoviesInCache = () => {

    };

    const emptyCache = () => {

    };

    return (
        <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 2, width: '100%', backgroundColor: '#333', color: 'white' }}>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={addMovie}
                            disabled={DBConnectionState === "Disconnected"}
                        >
                            Add Movie
                        </Button>
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={showAllMovies}
                            disabled={moviesDB.length === 0 || DBConnectionState === "Disconnected"}
                        >
                            Show All Movies In Database
                        </Button>
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={showMoviesInCache}
                            disabled={environment !== 'production' || cacheConnectionState !== 'Disconnected'}
                        >
                            Show Movies In Cache
                        </Button>
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={emptyCache}
                            disabled={environment !== 'production' || cacheConnectionState !== 'Connected'}
                        >
                            Empty Cache
                        </Button>
                    </Stack>
                    <AddModal />
                </Paper>
        </Container>
    );
};

export default ButtonsSection;