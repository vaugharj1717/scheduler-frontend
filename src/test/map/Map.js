import React, { Component, useEffect, useState, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {setMap, beginGettingUserCoords} from '../../actions.js';
import './Map.css'
import moment from 'moment';


const mapStyles = {
  width: '100%',
  height: '100%'
};


function testIsStaleLocation(updateTime){
  if(updateTime == null || updateTime == undefined) return true;
  let nowTime = new moment();
  let lastUpdateTime = new moment(updateTime);
  const diff = moment.duration(nowTime.diff(lastUpdateTime));
  console.log(diff.minutes());
  if(diff.minutes() > 30){
    return true;
  }
  return false;
  // if(nowTime > startTime && nowTime < endTime){
  //       const diff = endTime.diff(nowTime);
  //       const diffDuration = moment.duration(diff);
  //       const diffHours = Math.floor(diffDuration / 60);
  //       const diffMinutes = diffDuration % 60;
  //       const hours = diffDuration.hours() === 0 ? '' : diffDuration.hours() + ' hours';
  //       const minutes = diffDuration.minutes() === 0 ? '' : diffDuration.minutes() + ' minutes';
  //       return "In progress. " + hours + ' ' + minutes + ' remaining.';
}
function MapContainer(props) {
    const dispatch = useDispatch();
    let userLat = useSelector(state => state.currentUserLat);
    let userLng = useSelector(state => state.currentUserLng);
    let currentUser = useSelector(state => state.currentUser);
    let selectedUser = useSelector(state => state.viewedUser);
    let viewingSelf = useSelector(state => state.isViewingSelfMap);
    let userIsSelected = selectedUser !== null && selectedUser !== undefined && selectedUser.id && selectedUser.id !== currentUser.id;
    
    let isStaleLocation = false;
    if(userIsSelected && testIsStaleLocation(selectedUser.coordsLastUpdate)){
      isStaleLocation = true;
    }    

    useEffect(()=>{
        if(userIsSelected){
            let interval = setInterval(()=>{
                dispatch(beginGettingUserCoords(selectedUser.id))
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [userIsSelected])

    return (
    <div id="file-pane-darken-background">
    <div className="map-root">
      <div className="map-exit" onClick={()=>dispatch(setMap(false, true))}>EXIT MAP
      {(userIsSelected && isStaleLocation) && !viewingSelf &&
      <div className="map-disclaimer">
          This user's location date is outdated or unavailable.
      </div>
      }
      {(userIsSelected && !isStaleLocation) && !viewingSelf &&
      <div className="map-disclaimer">
          {selectedUser.name}'s location last updated: <div>{new moment(selectedUser.coordsLastUpdate).utcOffset('+1800').format('MM/DD h:mma')}</div>
      </div>
      }

      </div>
      <Map
        google={props.google}
        zoom={17}
        style={mapStyles}
        initialCenter={
          {
            lat: 44.79806,
            lng: -91.50011
          }
        }
        // mapTypeId="SATELLITE"
        // mapOptions= {[{mapTypeId: this.props.google.maps.MapTypeId.SATELLITE}] }
        yesIWantToUseGoogleMapApiInternals
      >
          {navigator.geolocation && 
          <Marker
          position={{lat: userLat, lng: userLng}}
        //   lat={userLat}
        //   lng={userLng}
          title="Your Position"
          // animation= {props.google.maps.Animation.DROP}
          label={{text:"YOU", fontSize:'14px', fontWeight:"bold",className:"marker-label"}}
          />
          }
          {userIsSelected &&
          <Marker
          position={{lat: selectedUser.lat, lng: selectedUser.lng}}
        //   lat={userLat}
        //   lng={userLng}
          title="Last updated at:"
          // animation= {props.google.maps.Animation.BOUNCE}
          label={{text: selectedUser.name, fontSize:'20px', fontWeight:"bold",className:"marker-label"}}
          />
          }
      </Map>
    </div>
    </div>
    );
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyDZ_iLxzyx5UO1RhW1o-1RyzcUXJ2J_fms'
})(MapContainer);