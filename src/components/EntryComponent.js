import {Form, Modal} from "react-bootstrap";
import {ConstantStrings} from "../utilities/constants/ConstantStrings";
import {Button} from "semantic-ui-react";
import {Component} from "react";
import {copyObject, isNotAnEmptyObject,} from "../utilities/helpers/ObjectVariableFunctions";
import {isNotEmptyString} from "../utilities/helpers/StringVariableValidators";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/SuccessToast.css";
import "../styling/EntryComponentStyling.css";

class EntryComponent extends Component {
    constructor(props) {
        super(props);

        let entry = {};
        if (isNotAnEmptyObject(this.props["entry"])) {
            Object.keys(this.props["entry"]).forEach((prop) => {
                if (prop === "isCode") entry["isCode"] = this.props["entry"][prop];
                else entry[prop] = this.props["entry"][prop];
            });
        }

        this.state = {
            entry,
            originalEntry: copyObject(entry),
        };

        this.handleFormInput = this.handleFormInput.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.showRefreshConfirmation = this.showRefreshConfirmation.bind(this);
    }

    componentDidMount() {
        // Add event listener when the modal is open
        window.addEventListener("beforeunload", this.showRefreshConfirmation);

        // Needed for Ctrl+S
        // Bind the global keydown event
        document.addEventListener("keydown", this.handleSaveShortcut);
    }

    componentWillUnmount() {
        // Remove event listener when the modal is closed
        window.removeEventListener("beforeunload", this.showRefreshConfirmation);

        // Needed for Ctrl+S
        // Unbind the global keydown event
        document.removeEventListener("keydown", this.handleSaveShortcut);
    }

    showRefreshConfirmation(event) {
        // Custom confirmation message (browsers may not display it directly)
        const message = "";
        event.returnValue =
            "Are you sure you want to refresh? Any unsaved data may be lost.";
        return message; // For some browsers like older versions of Firefox
    }

    handleFormInput(e) {
        const {entry} = this.state;
        const {name, value, checked} = e.target;

        let newEntry = copyObject(entry);
        if (name === "isCode") newEntry[name] = checked;
        else newEntry[name] = value;

        this.setState({entry: newEntry});
    }

    validateFields() {
        const {entry} = this.state;
        const {title, description} = entry;

        if (isNotEmptyString(title) && isNotEmptyString(description)) {
            this.props["changeEntries"](entry);

        } else {
            alert("Please fill in all required fields before submitting.");
        }
    }

    // Needed for Ctrl+S
    // Must invoke here, since in the return, it will invoke the browser's shorcut
    handleSaveShortcut = (e) => {
        if (e.key === "s" && e.ctrlKey) {
            e.preventDefault(); // Prevent the browser's Ctrl+S default action
            this.validateFields(); // Trigger the save action
        }
    };


    render() {
        const {entry, originalEntry} = this.state;

        return (
            <Modal
                show={true}
                onHide={this.props["closePopup"]}
                backdrop={"static"}
                className={"entryPopup"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <b>
                            {this.props["entryType"] === ConstantStrings.editStr
                                ? "Edit Entry"
                                : "Create New Entry"}
                        </b>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>
                                <b>
                                    <span style={{color: "#db2828"}}>*</span>
                                </b>{" "}
                                Title
                            </Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                placeholder="Title"
                                onChange={this.handleFormInput}
                                value={entry["title"]}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>
                                <b>
                                    <span style={{color: "#db2828"}}>*</span>
                                </b>{" "}
                                Description
                            </Form.Label>
                            <Form.Control
                                name="description"
                                as="textarea"
                                placeholder="Description"
                                onChange={this.handleFormInput}
                                value={entry["description"]}
                                style={{minHeight: "150px"}}
                            />
                            <Form.Check
                                name="isCode"
                                type="checkbox"
                                label="Format as code?"
                                onChange={this.handleFormInput}
                                checked={entry["isCode"]}
                                style={{paddingTop: "10px"}}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        color="red"
                        onClick={this.props["closePopup"]}
                        style={{float: "left"}}
                    >
                        Cancel
                    </Button>

                    {this.props["entryType"] === ConstantStrings.editStr && (
                        <Button
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Are you sure you want to revert your changes? This cannot be undone."
                                    )
                                )
                                    this.setState({entry: originalEntry});
                            }}
                        >
                            Undo Changes
                        </Button>
                    )}

                    <Button color="green" onClick={this.validateFields}>
                        {/* For Ctrl+S save implementation, see "handleSaveShorcut function*/}
                        Save Changes
                    </Button>

                </Modal.Footer>
            </Modal>
        );
    }
}

export default EntryComponent;
