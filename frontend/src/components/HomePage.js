import React, { useEffect, useState } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import {Grid, Button, ButtonGroup, Typography} from "@material-ui/core";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

const Home = () => {
    return (
        <Grid container spacing={3} align="center">
            <Grid item xs={12}>
                <Typography variant="h3" compact="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/create" component={Link}>
                        Create A Room
                    </Button>
                    <Button color="secondary" to="/join" component={Link}>
                        Join A Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}

export default function HomePage(props) {
    const [roomCode, setRoomCode] = useState(null);

    const clearRoomCode = () => {
        setRoomCode(null);
    }
    
    useEffect(() => {
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                setRoomCode(data.code);
            });
    }, []);

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={
                    (roomCode ? <Navigate to={`/room/${roomCode}`}/> : <Home />)
                } />
                <Route path='/create' element={<CreateRoomPage/>} />
                <Route path='/join' element={<RoomJoinPage/>} />
                <Route path='/room/:roomCode' element={<Room leaveRoomCallback={clearRoomCode}/>}/>
            </Routes>
        </Router>
    );
}