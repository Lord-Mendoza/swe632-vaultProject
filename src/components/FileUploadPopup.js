// src/components/FileUploadPopup.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class FileUploadPopup extends React.Component {
    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.props.onRestore(data);
                    this.props.onClose();
                } catch (error) {
                    alert("Failed to parse JSON file. Please ensure it is a valid backup.");
                }
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid JSON file.");
        }
    }

    handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.props.onRestore(data);
                    this.props.onClose();
                } catch (error) {
                    alert("Failed to parse JSON file. Please ensure it is a valid backup.");
                }
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid JSON file.");
        }
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    render() {
        const { show, onClose } = this.props;

        return (
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Backup File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center'
                        }}
                        onDrop={this.handleDrop}
                        onDragOver={this.handleDragOver}
                    >
                        <p>Drag and drop a JSON file here or click to select a file</p>
                        <input
                            type="file"
                            accept=".json"
                            style={{ display: 'none' }}
                            id="file-input"
                            onChange={this.handleFileChange}
                        />
                        <label htmlFor="file-input" style={{ cursor: 'pointer', color: 'blue' }}>
                            Browse files
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FileUploadPopup;
