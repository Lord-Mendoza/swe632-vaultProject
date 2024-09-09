import {Form, Modal} from "react-bootstrap";
import {ConstantStrings} from "../utilities/constants/ConstantStrings";
import {Button} from "semantic-ui-react";
import {Component} from "react";
import {copyObject} from "../utilities/helpers/ObjectVariableFunctions";

class EntryComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: this.props["entry"] !== null ? this.props["entry"] : {}
        }

        this.handleFormInput = this.handleFormInput.bind(this);
    }

    handleFormInput(e){
        const {entry} = this.state;
        const {name, value, checked} = e.target;

        let newEntry = copyObject(entry);
        if (name === "isCode")
            newEntry[name] = checked;
        else
            newEntry[name] = value;

        this.setState({entry: newEntry});
    }

    render() {
        const {entry} = this.state;

        return <Modal show={true} onHide={this.props["closePopup"]}
                      backdrop={"static"} keyboard={false}
                      aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title><b>{this.props["entryType"] === ConstantStrings.editStr ? "Edit Entry" : "Create New Entry"}</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Title"
                                      onChange={this.handleFormInput}
                                      value={entry["title"]}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" as="textarea" placeholder="Description"
                                      onChange={this.handleFormInput}
                                      value={entry["description"]}
                        />
                        <Form.Check name="isCode" type="checkbox" label="Format as code?"
                                    onChange={this.handleFormInput}
                                    value={entry["isCode"]}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={this.props["closePopup"]}>
                    Close
                </Button>

                <Button variant="primary" onClick={() => this.props["changeEntries"](entry)}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default EntryComponent;