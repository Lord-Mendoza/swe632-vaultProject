import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
// I think this is unused 

const EditNote = ({ entry, saveNote, closeEditor }) => {
    const [editedEntry, setEditedEntry] = useState({ ...entry });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEntry({
            ...editedEntry,
            [name]: value
        });
    };

    const handleSave = () => {
        saveNote(editedEntry);
        closeEditor();
    };

    return (
        <div style={{ padding: '20px' }}>
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        value={editedEntry.title || ""}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                {editedEntry.sections && editedEntry.sections.map((section, index) => (
                    <Form.Group key={index} controlId={`section-${index}`}>
                        <Form.Label>{section.sectionTitle}</Form.Label>
                        <Form.Control
                            as={section.isCode ? 'textarea' : 'input'}
                            name={section.sectionTitle}
                            value={section.content || ""}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                ))}
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="secondary" onClick={closeEditor} style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </Form>
        </div>
    );
};

export default EditNote;
