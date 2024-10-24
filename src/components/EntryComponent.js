import {Form, Modal} from "react-bootstrap";
import {ConstantStrings} from "../utilities/constants/ConstantStrings";
import {Button} from "semantic-ui-react";
import {Component} from "react";
import {copyObject, isNotAnEmptyObject} from "../utilities/helpers/ObjectVariableFunctions";
import {isNotEmptyString} from "../utilities/helpers/StringVariableValidators";

class EntryComponent extends Component {
    constructor(props) {
        super(props);

        let entry = {};
        if (isNotAnEmptyObject(this.props["entry"])) {
            Object.keys(this.props["entry"]).forEach(prop => {
                if (prop === "isCode")
                    entry["isCode"] = this.props["entry"][prop];
                else
                    entry[prop] = this.props["entry"][prop];
            })
        }

        this.state = {
            entry,
            originalEntry: copyObject(entry)
        }

        this.handleFormInput = this.handleFormInput.bind(this);
        this.validateFields = this.validateFields.bind(this);
    }

    handleFormInput(e) {
        const {entry} = this.state;
        const {name, value, checked} = e.target;

        let newEntry = copyObject(entry);
        if (name === "isCode")
            newEntry[name] = checked;
        else
            newEntry[name] = value;

        this.setState({entry: newEntry});
    }

    validateFields() {
        const {entry} = this.state;
        const {title, description} = entry;

        if (isNotEmptyString(title) && isNotEmptyString(description)) {
            this.props["changeEntries"](entry)
        } else {
            alert("Please fill in all required fields before submitting.")
        }
    }

    render() {
        const {entry, originalEntry} = this.state;

        return <Modal show={true} onHide={this.props["closePopup"]}
                      backdrop={"static"} className={"entryPopup"}
                      aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title><b>{this.props["entryType"] === ConstantStrings.editStr ? "Edit Entry" : "Create New Entry"}</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label><b><span style={{color: '#db2828'}}>*</span></b> Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Title"
                                      onChange={this.handleFormInput}
                                      value={entry["title"]}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label><b><span style={{color: '#db2828'}}>*</span></b> Description</Form.Label>
                        <Form.Control name="description" as="textarea" placeholder="Description"
                                      onChange={this.handleFormInput}
                                      value={entry["description"]}
                                      style={{minHeight: "150px"}}
                        />
                        <Form.Check name="isCode" type="checkbox" label="Format as code?"
                                    onChange={this.handleFormInput}
                                    checked={entry["isCode"]}
                                    style={{paddingTop: "10px"}}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button color="red" onClick={this.props["closePopup"]} style={{float: "left"}}>
                    Cancel
                </Button>

                {
                    this.props["entryType"] === ConstantStrings.editStr &&
                    <Button onClick={() => this.setState({entry: originalEntry})}>
                        Undo Changes
                    </Button>
                }

                <Button color="green" onClick={this.validateFields}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default EntryComponent;