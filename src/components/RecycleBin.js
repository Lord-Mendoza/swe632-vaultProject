import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RecycleBin = ({ show, trash, hideRecycleBinModal, restoreFromTrash }) => {
    return (
        <Modal show={show} onHide={hideRecycleBinModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recycle Bin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(trash).length === 0 ? (
                    <p>No entries in the trash.</p>
                ) : (
                    Object.entries(trash).map(([key, entry]) => (
                        <div key={key} className="trash-item">
                            <h3>{entry.title}</h3>
                            <button onClick={() => restoreFromTrash(key)}>Restore</button>
                        </div>
                    ))
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideRecycleBinModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecycleBin;
