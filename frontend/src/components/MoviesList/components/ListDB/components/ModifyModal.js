import React, { useState, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { Global } from '../../../../../helpers/Global';
import { MoviesContext } from '../../../../../Context/ContextProvider';

const ModifyModal = (movieId, title, content) => {
    const { openModalModify, setOpenModalModify } = useContext(MoviesContext);

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleClose = () => {
        setOpenModalModify(false);
    }

    const handleModifyMovie = async (e) => {
        e.preventDefault();

        // Recoger datos del formulario
        let newData = {
            title: newTitle,
            content: newContent
        };

        console.log(newData);
        
        // const request = await fetch(Global.url + "movie/" + movieId, {
        //     method: "PUT",
        //     body: JSON.stringify(newData),
        //     headers: {
        //         "Content-Type": "application/json",
        //     }
        // });
    
        // const data = await request.json();
    
        // if (data.status === "Success") {
            
        // }

        setOpenModalModify(false);
    }

    return (
        <Dialog open={openModalModify} onClose={handleClose}>
            <DialogTitle>Modify Movie</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the details of the movie you want to modify.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Movie Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="description"
                    label="Movie Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setNewContent(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleModifyMovie}>Modify</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ModifyModal;
