import React, { Component, useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {beginSettingUserPosition} from '../../actions.js'


function errorCallback(){
    return;
}

export function PositionWatcher(props) {
    const dispatch = useDispatch();
    let currentUser = useSelector(state => state.currentUser);

    useEffect(()=>{
        // let interval;
        // if(currentUser !== null && currentUser !== undefined){
        //     interval = setInterval(()=>{
        //         console.log(navigator.geolocation);
        //         navigator.geolocation.getCurrentPosition((position) => {
        //             console.log(new Date());
        //             dispatch(beginSettingUserPosition(currentUser.id, position.coords.latitude, position.coords.longitude));
        //         }, null, {timeout: 1000});
        //     }, 2000);
        //     return () => clearInterval(interval);
        // }
        let id = navigator.geolocation.watchPosition((position) => {
            dispatch(beginSettingUserPosition(currentUser.id, position.coords.latitude, position.coords.longitude));
            
        });

        return () => navigator.geolocation.clearWatch(id);
    }, [currentUser]);


    // navigator.geolocation.watchPosition(function(position) {
    //         console.log(position);
    //         dispatch(beginSettingUserPosition(currentUser.id, position.coords.latitude, position.coords.longitude));
    // });


    return null;
}


export default PositionWatcher;