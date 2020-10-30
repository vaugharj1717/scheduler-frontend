import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {beginGettingMessages} from '../actions.js';

export default function MessageChecker(){
    let currentUser = useSelector(state => state.currentUser);
    let isViewingMessages = useSelector(state => state.isViewingMessages);
    let dispatch = useDispatch();

    useEffect(() => {
        let interval;
        if(currentUser != null){
            dispatch(beginGettingMessages(currentUser.id, isViewingMessages));
            interval = setInterval(() => {
                dispatch(beginGettingMessages(currentUser.id, isViewingMessages));
              }, 3000);
            return () => clearInterval(interval);
        }        
      }, [currentUser, isViewingMessages]);

      return null;
}