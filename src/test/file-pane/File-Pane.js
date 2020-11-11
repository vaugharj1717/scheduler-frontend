import React, {useEffect, useState} from 'react';
import './File-Pane.css';
import {useSelector, useDispatch} from 'react-redux';
import {host, setIsViewingFiles, setIsViewingUser, beginGettingFiles, beginDeletingFile, beginUploadingFile} from '../../actions.js';




function FilePane(props) {
    const dispatch = useDispatch();
    let files = useSelector(state => state.files);
    let currentUser = useSelector(state => state.currentUser);
    let userId = props.userIdOfViewedFiles;

    useEffect(()=>{
        dispatch(beginGettingFiles(userId))
    }, []);

    function handleFileDelete(fileId){
        dispatch(beginDeletingFile(fileId));
    }

    function handleFileUpload(userId, event){
        const files = event.target.files;
        const formData = new FormData();
        formData.append("file", files[0]);
        dispatch(beginUploadingFile(userId, formData));
    }

    function handleGoToUserInfo(){
        dispatch(setIsViewingUser(true, userId));
    }

    return(
        <div id="file-pane-darken-background">
        <div id="file-pane-root">
            <div id="file-pane-header">Files</div>
            <div onClick={()=> dispatch(setIsViewingFiles(false))} id="file-pane-exit">X</div>
            <div id="file-pane-container">
                <div onClick={handleGoToUserInfo} className="user-info-link">See user info</div>
                {(currentUser.id === userId || currentUser.role === 'SCHEDULER') &&
                <div>
                    <input onChange={(e)=>{handleFileUpload(userId, e)}}type="file" id="upload-file"></input>
                    <label htmlFor="upload-file" className="upload-file-label">Add File</label>
                </div>
                }
                {files.map((file, i) => (
                    <div key={i} className="file-pane-item">
                        {(currentUser.id === userId || currentUser.role === 'SCHEDULER') &&
                        <button onClick={()=>handleFileDelete(file.id)} className="file-delete">Delete</button>
                        }
                        <a href={`${host}/user/downloadFile/${file.id}`} download className="file-link">Download {file.filename}</a>
                    </div>
                ))}
            </div>
        </div>
        </div>
    )
}

export default FilePane