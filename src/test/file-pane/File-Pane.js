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
                <div onClick={handleGoToUserInfo} className="files-user-info-link"><span>&#171;</span> Back</div>
                {(currentUser.id === userId || currentUser.role === 'SCHEDULER' || currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN' || (currentUser.role === 'DEPARTMENT_ADMIN' && currentUser.department !== null && currentUser.department.id === userId)) &&
                <div className="add-file-button">
                    <input onChange={(e)=>{handleFileUpload(userId, e)}}type="file" id="upload-file"></input>
                    <label htmlFor="upload-file" className="upload-file-label">Add File</label>
                </div>
                }
                {files.map((file, i) => (
                    <div key={i} className="file-pane-item">
                        {(currentUser.id === userId || currentUser.role === 'SCHEDULER' || currentUser.role === 'DEPARTMENT_ADMIN') &&
                        <button onClick={()=>handleFileDelete(file.id)} className="file-delete">Delete</button>
                        }
                        <a href={`${host}/user/downloadFile/${file.id}`} download className="file-link">Download {file.filename}</a>
                    </div>
                ))}
                
            </div>
            {files.length === 0 &&
                    <div className="file-pane-nothing">This user has no files uploaded...</div>
            }
        </div>
        </div>
    )
}

export default FilePane