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
import { Global } from '../../../helpers/Global';
import { MoviesContext } from '../../../Context/ContextProvider';

const AddModal = () => {
    const { openModalAdd, setOpenModalAdd } = useContext(MoviesContext);

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleClose = () => {
        setOpenModalAdd(false);
    }

    const handleAddMovie = async (e) => {
        e.preventDefault();

        // Recoger datos del formulario
        let newData = {
            title: newTitle,
            content: newContent
        };
        
        const request = await fetch(Global.url + "create", {
            method: "POST",
            body: JSON.stringify(newData),
            headers: {
                "Content-Type": "application/json",
            }
        });
    
        const data = await request.json();
    
        if (data.status === "Success") {
            
        }

        setOpenModalAdd(false);
    }

    return (
        <Dialog open={openModalAdd} onClose={handleClose}>
            <DialogTitle>Add Movie</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the details of the movie you want to add.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Movie Title"
                    type="text"
                    fullWidth
                    variant="standard"
                    // value={title}
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
                    // value={content}
                    onChange={(e) => setNewContent(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddMovie}>Add</Button>
            </DialogActions>
        </Dialog>
    )
};

export default AddModal;
