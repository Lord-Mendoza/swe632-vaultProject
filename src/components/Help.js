import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Icon} from "semantic-ui-react";

const Help = ({show, hide}) => {
    return (
        <Modal show={show} onHide={hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Help</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    VAULT (Virtual Archive for Users Learning Things) is developed to help keep track of knowledge
                    accumulated overtime, and eases the process of retrieving them either with our robust search
                    feature, or with our Chatbot that assists with answering any questions!
                </p>

                <p>
                    Below are some tips for use of the application:
                    <ul>
                        <li>To get started, select <b>Create New Entry</b> and fill in the mandatory fields such as
                            Title and Description for your entry. For developers who wish to view the description in
                            code format, select the <b>Format as Code</b> option.
                        </li>
                        <li>Selecting an entry from the left sidebar views its contents on the right. You also have the
                            following options for managing that entry:
                            <ul>
                                <li>To revise the entry select the <Icon name="edit"/> (Edit) icon.</li>
                                <li>To create a copy of the entry, select the <Icon name="copy"/> (Clone) icon.</li>
                                <li>To delete the entry, select the <Icon name="trash alternate"/> (Trash) icon. Note:
                                    see instruction below if you wish to recover it later.
                                </li>
                            </ul>
                        </li>
                        <li>You can use the arrow keys <Icon name={"caret square up outline"}/> or <Icon
                            name={"caret square down outline"}/> to navigate between entries.
                        </li>
                        <li>Mistakenly deleted an entry? No problem. Simply open the <b>Recycle Bin</b> to recover it.
                        </li>
                        <li>The <b>Manage VAULT</b> option offers several capabilities for managing all your entries:
                            <ul>
                                <li>If you wish to export all of your entries to another browser or computer, use <b>Backup
                                    VAULT to File</b></li>
                                <li>For importing all of your previous entries, use <b>Restore VAULT from File</b></li>
                                <li>To start all over, use <b>Delete All</b>. Note: You cannot recover the entries after
                                    this point.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Help;
