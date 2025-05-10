import React, { useState } from 'react';
import axios from 'axios';

function FileUploadForm() {
    const [file, setFile] = useState(null);
    const [chart, setChart] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload-file/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setChart(response.data.chart);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                <button type="submit">Upload and Generate Chart</button>
            </form>
            {chart && <img src={chart} alt="Generated Chart" style={{ marginTop: '20px', maxWidth: '100%' }} />}
        </div>
    );
}

export default FileUploadForm;
