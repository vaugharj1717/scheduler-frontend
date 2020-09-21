import React from 'react';
import './Meeting-Scheduler-Page.css';
import ExampleComponent from './components/Example-Component.js'

function MeetingSchedulerPage() {
    return (
        <div className="meeting-scheduler-page-root">
            {/*ExampleComponents will be generated. Copying and pasting three examples for now*/}
            <ExampleComponent></ExampleComponent>
            <ExampleComponent></ExampleComponent>
            <ExampleComponent></ExampleComponent>
        </div>
    )
}

export default MeetingSchedulerPage