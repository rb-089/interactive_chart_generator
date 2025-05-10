import React from 'react';
import ManualDataForm from './components/ManualDataForm';
import FileUploadForm from './components/FileUploadForm';

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Chart Visualization</h1>
            <ManualDataForm />
            <FileUploadForm />
        </div>
    );
}

export default App;
