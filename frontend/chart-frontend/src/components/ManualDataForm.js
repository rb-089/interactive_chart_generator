import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManualDataForm() {
    const [data, setData] = useState([{ Category: '', Value: '' }]);
    const [chart, setChart] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token from cookie
        const token = getCookie('csrftoken');  // Ensure you have a function to get the CSRF token from cookies
        setCsrfToken(token);
    }, []);

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleChange = (index, field, value) => {
        const newData = [...data];
        // Convert Value to a number
        newData[index][field] = field === 'Value' ? Number(value) : value;
        setData(newData);
    };

    const addRow = () => {
        setData([...data, { Category: '', Value: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/manual-data/', {
                data,
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,  // Include the CSRF token in the headers
                },
            });
            setChart(response.data.chart_url); // Expecting the backend to return a chart URL
        } catch (error) {
            console.error('Error generating chart:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h2>Enter Data Manually</h2>
            <form onSubmit={handleSubmit}>
                {data.map((row, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Category"
                            value={row.Category}
                            onChange={(e) => handleChange(index, 'Category', e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="number"
                            placeholder="Value"
                            value={row.Value}
                            onChange={(e) => handleChange(index, 'Value', e.target.value)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addRow}>
                    Add Row
                </button>
                <button type="submit">Generate Chart</button>
            </form>
            {chart && (
                <div>
                    <h3>Generated Chart:</h3>
                    <img src={`http://127.0.0.1:8000${chart}`} alt="Generated Chart" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>
    );
}

export default ManualDataForm;
