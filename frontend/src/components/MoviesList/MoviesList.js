import React, { useContext, useState } from "react";
import { 
    Container,
    Box,
} from '@mui/material';
import { MoviesContext } from '../../Context/ContextProvider';
import ListDB from "./components/ListDB/ListDB";
import ListCache from "./components/ListCache/ListCache";

const MoviesList = () => {
    const { moviesDB, moviesCache, listToShow } = useContext(MoviesContext);

    useState(() => {
        console.log(moviesDB.length);
        
    }, [moviesDB])

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', color: 'white', p: "3%", gap: '15px'}}>
                {listToShow && (
                    listToShow === "db" ? 
                        (moviesDB.length !== 0 ? <ListDB /> : <div>No movies set</div>) 
                        : (moviesCache ? <ListCache /> 
                            : <div>No movies set</div>))}
            </Box>
        </Container>
    );
};

export default MoviesList;
