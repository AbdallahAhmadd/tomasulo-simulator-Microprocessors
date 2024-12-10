import React from 'react';

interface FileUploaderProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function FileUploader({ onChange }: FileUploaderProps) {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Upload and Parse Text File</h1>
            <input type="file" accept=".txt" onChange={onChange} style={styles.input} />
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '20px auto',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#333',
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
    },
};