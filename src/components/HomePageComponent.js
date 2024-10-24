import React from "react";
import {Container, Form, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {Button, Icon, Menu, Segment, Sidebar} from "semantic-ui-react";
import "aos/dist/aos.css";
import AOS from "aos";
import Prism from "prismjs";
import "../styling/prism.css";
import {Switch, Tooltip} from "antd";
import ScrollToTop from "react-scroll-to-top";
import {copyObject, isNotAnEmptyObject, isNotNullNorUndefined} from "../utilities/helpers/ObjectVariableFunctions";
import "../styling/HomePageComponent.css";
import "../styling/ComponentStyling.css";
import EntryComponent from "./EntryComponent";
import {ConstantStrings} from "../utilities/constants/ConstantStrings";
import AIChatBot from "./AIChatBot.tsx";
import "../styling/BotToggle.css"
import "../styling/DeleteButtonStyling.css"
import RecycleBin from "./RecycleBin.js"
import FileUploadPopup from "./FileUploadPopup.js"
import SearchBox from "./SearchBox";
import Moment from "moment";

class HomePageComponent extends React.Component {

    constructor(props) {
        super(props);

        let darkMode;
        if (localStorage.getItem("isDarkMode") === "true")
            darkMode = true;

        let entries = {};
        let entriesFromCache = JSON.parse(localStorage.getItem("entries"));
        if (isNotAnEmptyObject(entriesFromCache))
            entries = copyObject(entriesFromCache);

        this.state = {
            entries,

            darkMode,
            activeKey: "",
            copySuccess: "",
            showSidebar: true,

            showCreateEditEntryPopup: false,
            entryType: "",
            entry: {},

            isEditing: false,
            isChatBotVisible: false,
            trash: {},
            showRecycleBinModal: false,
            showUploadPopup: false
        };

        this.handleSelection = this.handleSelection.bind(this);
        this.changeEntries = this.changeEntries.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.setDarkModeToLocalStorage = this.setDarkModeToLocalStorage.bind(this);
        this.changeActiveKey = (e, {name}) => this.setState({activeKey: name});
        this.getCurrentDate = () => {
            return Moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
        }
        this.toggleSidebar = openSidebar => {
            if (isNotNullNorUndefined(openSidebar))
                this.setState({showSidebar: openSidebar});
            else
                this.setState({showSidebar: !this.state.showSidebar});
        }
        this.showCreateEditEntryPopup = (entryType, entry = {}) => {
            this.setState({showCreateEditEntryPopup: true, entryType, entry})
        }
        this.closeCreateEditEntryPopup = () => {
            this.setState({showCreateEditEntryPopup: false, entryType: ""}, this.saveEntriesToLocalStorage)
        }
        this.saveEntriesToLocalStorage = () => {
            const {entries} = this.state;

            localStorage.setItem("entries", JSON.stringify(entries));
        }
    }

    componentDidMount() {
        Prism.highlightAll();
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleSelection(e) {
        this.setState({
            selection: e.target.id
        })
    }

    copyToClipboard = (e) => {
        this.textArea.select();
        document.execCommand("copy");
        e.target.focus();
        this.setState({
            copySuccess: "Copied!"
        })
    }

    setDarkModeToLocalStorage() {
        const {darkMode} = this.state;
        localStorage.setItem("isDarkMode", darkMode === true ? "true" : "false");
    }

    changeEntries(newEntry) {
        const {entries, entry, entryType} = this.state;

        let newEntries = {};

        // If editing an entry, then when copying list of previous entries skip the one being edited
        // so that if it's title changes then it is overwritten. Otherwise, copy everything.
        Object.keys(entries).forEach(v => {
            if (v !== entry["title"])
                newEntries[v] = entries[v];
        })

        // When creating a new entry if its title corresponds to an existing one, prevent it from being
        // created by displaying an alert warning for the duplicate title.
        let duplicateEntryName = false;
        Object.keys(entries).forEach(entryTitle => {
            if (entryTitle === newEntry["title"] && entry["title"] !== newEntry["title"]) {
                duplicateEntryName = true;
            }
        })

        if (duplicateEntryName) {
            alert("The title for this new entry already exists. Please input another title.")
        } else {
            let refactoredEntry = {};
            refactoredEntry["title"] = newEntry["title"];
            refactoredEntry["description"] = newEntry["description"];
            refactoredEntry["isCode"] = newEntry["isCode"];

            if (entryType === ConstantStrings.createStr) {
                refactoredEntry["insertDate"] = this.getCurrentDate();
            } else {
                refactoredEntry["insertDate"] = newEntry["insertDate"];
                refactoredEntry["updateDate"] = this.getCurrentDate();
            }
            newEntries[newEntry["title"]] = refactoredEntry;

            this.setState({entries: newEntries}, this.closeCreateEditEntryPopup);
        }
    }

    // Used to Hide or show AI ChatBot window
    toggleChatBot = () => {
        this.setState((prevState) => ({
            isChatBotVisible: !prevState.isChatBotVisible,
        }));
    }

    // Method to move an entry to the trash
    moveToTrash = (entryKey) => {
        const {entries, trash} = this.state;

        // Move entry from entries to trash
        this.setState({
            entries: Object.fromEntries(Object.entries(entries).filter(([key]) => key !== entryKey)),
            trash: {...trash, [entryKey]: entries[entryKey]},
        });

    }

    // Method to restore an entry from the trash
    restoreFromTrash = (entryKey) => {
        const {entries, trash} = this.state;

        // Move entry from trash back to entries
        this.setState({
            trash: Object.fromEntries(Object.entries(trash).filter(([key]) => key !== entryKey)),
            entries: {...entries, [entryKey]: trash[entryKey]},
        });
    }

    // Handle delete and move to recycle
    handleDeleteEntry = (entryKey) => {
        const {entries, trash} = this.state; // Get both entries and trash from state

        if (window.confirm("Are you sure you want to delete this entry? You can retrieve it under Recycle Bin later.")) {
            // Move the entry to trash
            const movedEntry = entries[entryKey];
            this.setState({
                trash: {
                    ...trash, // Keep the previous trash entries
                    [entryKey]: movedEntry, // Add the deleted entry to the trash
                },
                entries: Object.keys(entries).reduce((result, key) => {
                    if (key !== entryKey) {
                        result[key] = entries[key]; // Keep only the non-deleted entries
                    }
                    return result;
                }, {}),
            });
        }
    }

    // Method to show the Recycle Bin modal
    showRecycleBinModal = () => {
        this.setState({showRecycleBinModal: true});
    }

    // Method to hide the Recycle Bin modal
    hideRecycleBinModal = () => {
        this.setState({showRecycleBinModal: false});
    }

    handleDuplicateEntry = (key) => {
        const {entries} = this.state;

        // Ensure the entry exists
        if (!entries[key]) {
            console.error("Entry not found");
            return;
        }

        const entryToDuplicate = entries[key];

        // Create a new title by appending " (copy)" to the original title
        const newTitle = entryToDuplicate.title + " (copy)";

        // Generate a new unique key for the duplicated entry
        const newKey = key + " (copy)";

        // Create a new entry with the same content but a new title
        const newEntries = {
            ...entries,
            [newKey]: {
                ...entryToDuplicate,
                title: newTitle // Set the new title for the duplicated entry
            }
        };

        // Update the state with the new entries
        this.setState({entries: newEntries});

        // Make the new entry active
        this.changeActiveKey(new MouseEvent(''), {name: newKey});

        console.log(`Entry duplicated as ${newTitle}`);
    }

    handleBackupVault = () => {
        const {entries} = this.state;

        // Prompt the user for a backup file name
        const fileName = prompt("Enter the backup file name:", "vault-backup");

        // Use default if no file name is provided or if canceled
        const backupFileName = fileName ? `${fileName}.json` : 'vault-backup.json';

        const blob = new Blob([JSON.stringify(entries, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = backupFileName; // Use the provided or default file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`Vault backed up to ${backupFileName}`);
    }


    handleRestoreVault = (data) => {
        this.setState({entries: data});
        console.log("Vault restored from file");
    }

    toggleUploadPopup = () => {
        this.setState(prevState => ({showUploadPopup: !prevState.showUploadPopup}));
    }

    handleDeleteAllNotes = () => {
        // Confirm the action with the user
        if (window.confirm("Are you sure you want to delete all entries? This action cannot be undone.")) {
            // Clear all entries
            this.setState({entries: {}, trash: {}});
            console.log("All notes have been deleted.");
        }
    }


    // Up/Down Arrow Key navigates to previous/next notes list
    handleKeyDown = (e) => {
        const {entries, activeKey} = this.state;
        const entryKeys = Object.keys(entries);
        const currentIndex = entryKeys.indexOf(activeKey);

        if (e.key === 'ArrowDown') {
            const nextIndex = currentIndex + 1 < entryKeys.length ? currentIndex + 1 : currentIndex;
            this.setState({activeKey: entryKeys[nextIndex]});
        } else if (e.key === 'ArrowUp') {
            const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex;
            this.setState({activeKey: entryKeys[prevIndex]});
        }
    }

    render() {
        const {
            entries,
            activeKey, darkMode, showSidebar,
            showCreateEditEntryPopup, entry, entryType, isEditing,
            showRecycleBinModal, trash,
            isChatBotVisible, showUploadPopup
        } = this.state;

        AOS.init();

        let style = {};
        if (darkMode === true)
            style = {backgroundColor: "#222222", color: "white"};

        let sidebarButton, sidebarVisibility, sidebarAnimation, sidebarPusherFunc, contentDim, sidebarClassName;
        if (window.screen.width <= 1250) {
            sidebarButton = !showSidebar && <Button icon onClick={this.toggleSidebar} className={"sideMenuToggleBtn"}>
                <Icon name={"chevron right"}/>
            </Button>;
            sidebarAnimation = "overlay";
            sidebarVisibility = showSidebar;
            sidebarPusherFunc = () => this.toggleSidebar(false);
            contentDim = sidebarVisibility;
        } else if (window.screen.width > 1250) {
            sidebarVisibility = true;
            sidebarAnimation = "slide along"
            sidebarClassName = "desktop";
        }
        // populates side menu
        let menuOptions = [];
        if (isNotAnEmptyObject(entries)) {
            Object.keys(entries)
                .sort((a, b) => {
                    a = entries[a]
                    b = entries[b]

                    if ((a["insertDate"] === null && b["insertDate"] === null) || (a["insertDate"] === undefined && b["insertDate"] === undefined))
                        return 1;
                    else if (a["insertDate"] === null || a === undefined)
                        return -1;
                    else if (b["insertDate"] === null || b["insertDate"] === undefined)
                        return 1;
                    else {
                        const dateA = Date.parse(a["insertDate"])
                        const dateB = Date.parse(b["insertDate"])

                        if (dateA === dateB)
                            return 0;
                        return (dateA < dateB) ? 1 : -1;
                    }
                })
                .forEach(entry => {
                    let item = entries[entry];

                    menuOptions.push(<Menu.Item name={entry}
                                                active={activeKey === entry}
                                                onClick={this.changeActiveKey}>
                        <Menu.Header>{item["title"]}</Menu.Header>
                        <p1>{item["insertDate"]}</p1>
                    </Menu.Item>);
                })
        }

        let content;
        // If activeKey has selected a valid entry
        if (entries.hasOwnProperty(activeKey)
            && isNotAnEmptyObject(entries[activeKey])) {

            let {title, insertDate, updateDate, description, isCode} = entries[activeKey];

            // why is content defined here, shouldn't it be defined before it is used in line 263?
            content = (
                <Segment raised inverted={darkMode} style={{marginTop: "10px"}}>
                    <Container fluid>
                        <Row noGutters style={{paddingBottom: ".5em", paddingLeft: "1em"}}>
                            <h4>{title}</h4>
                        </Row>

                        {/* Shows Date on view*/}
                        {!isEditing && isNotNullNorUndefined(insertDate) &&
                            <Row noGutters style={{paddingLeft: "1em"}}>
                                <h6>Last Updated: {isNotNullNorUndefined(updateDate) ? updateDate : insertDate}</h6>
                            </Row>}

                        {!isEditing && isNotNullNorUndefined(insertDate) &&
                            <Row noGutters style={{paddingBottom: ".5em", paddingLeft: "1em"}}>
                                <h6>Added: {insertDate}</h6>
                            </Row>
                        }

                        {/* Description field */}
                        <Row noGutters style={{padding: "0 2em .5em 2em"}}>
                            {isCode ? (
                                <section className={"codeSample"}>
                                    <pre className="language-javascript">
                                        <code>{description}</code>
                                    </pre>
                                </section>
                            ) : (
                                <Segment raised inverted={darkMode}>
                                    <Form.Control
                                        plaintext readOnly
                                        name="description" as="textarea"
                                        value={description}
                                        className={darkMode ? "darkMode description" : ""}
                                    />
                                </Segment>
                            )}
                        </Row>

                        {/* Show Edit/Save and Delete */}
                        <div style={{paddingTop: "10px"}}>
                            {/* Edit Button */}
                            <Tooltip placement="bottom" title={'Edit'} arrow={true}>
                                <Button icon
                                        onClick={() => this.showCreateEditEntryPopup(ConstantStrings.editStr, entries[activeKey])}>
                                    <Icon name="edit"/>
                                </Button>
                            </Tooltip>

                            {/* Duplicate Button next to Delete */}
                            <Tooltip placement="bottom" title={'Clone'} arrow={true}>
                                <Button icon onClick={() => this.handleDuplicateEntry(activeKey)}>
                                    <Icon name="copy"/>
                                </Button>
                            </Tooltip>

                            {/* Delete Button next to Edit */}
                            <Tooltip placement="bottom" title={'Delete'} arrow={true}>
                                <Button icon color="red" onClick={() => this.handleDeleteEntry(activeKey)}>
                                    <Icon name="trash alternate"/>
                                </Button>
                            </Tooltip>
                        </div>
                    </Container>
                </Segment>
            );
        }
        //else, show default selection screen
        else {
            content = <Segment raised inverted={darkMode} style={{marginTop: "10px"}}>
                <div className="center-screen">
                    <h2>Select an entry on the left to start viewing its information here.</h2>
                </div>
            </Segment>
        }

        return (
            <div>
                {/* This is the navbar at the top of the page */}
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{padding: "10px"}}>
                    <Navbar.Brand>
                        <img src={"logo.png"} style={{height: "24px", width: "24px", marginRight: "5px"}}
                             alt={"vault logo"}/>
                        <span style={{verticalAlign: "text-bottom"}}>Vault</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox
                            entries={this.state.entries}
                            onClickResult={this.changeActiveKey}
                        />

                        <Nav className="mr-auto">
                            <Nav.Link onClick={() => this.showCreateEditEntryPopup(ConstantStrings.createStr)}>
                                Create New Entry
                            </Nav.Link>

                            {/* This is the "Manage Vault" Dropdown */}
                            <NavDropdown id="nav-dropdown" title="Manage Vault">

                                <NavDropdown.Item onClick={this.handleBackupVault}>Backup Vault to
                                    File</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.toggleUploadPopup}>Restore Vault from
                                    File</NavDropdown.Item>

                                <NavDropdown.Item onClick={this.handleDeleteAllNotes}>Delete All</NavDropdown.Item>
                            </NavDropdown>

                            {/* Add Recycle Bin Tab */}
                            <Nav.Link onClick={this.showRecycleBinModal}>
                                Recycle Bin
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <div style={{padding: ".5rem 1rem"}}>
                        <span className={"darkModeLabel"}> Dark Mode: &nbsp;</span>
                        <Switch
                            checkedChildren={<Icon name="moon"/>}
                            unCheckedChildren={<Icon name="sun" inverted/>}
                            checked={darkMode}
                            onChange={() => this.setState({
                                darkMode: !darkMode
                            }, this.setDarkModeToLocalStorage)}
                        />
                    </div>
                </Navbar>

                <div style={{marginTop: "-10px", paddingBottom: "15px", ...style}}
                     className={darkMode === true ? "darkMode" : ""}>
                    <div style={{margin: 0}} className={"homePageComponent " + sidebarClassName}>
                        <Sidebar.Pushable as={Segment} className={"sidebarBody"}>
                            {sidebarButton}

                            <Sidebar as={Menu}
                                     animation={sidebarAnimation}
                                     direction={"left"}
                                     inverted={darkMode}
                                     vertical
                                     visible={sidebarVisibility}
                                     className={sidebarClassName}
                            >
                                {menuOptions}
                            </Sidebar>

                            <Sidebar.Pusher dimmed={contentDim}
                                            onClick={sidebarPusherFunc}
                                            className={"sidebarContent"}>
                                <div style={{minHeight: "100vh"}}>
                                    {content}
                                </div>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </div>
                </div>

                {showCreateEditEntryPopup && <EntryComponent entry={entry}
                                                             changeEntries={this.changeEntries}
                                                             entryType={entryType}
                                                             closePopup={this.closeCreateEditEntryPopup}/>}

                {/* ChatBot Button */}
                <button className="chatbot-toggle-button" onClick={this.toggleChatBot}>
                    {isChatBotVisible ? 'Close' : 'Chat'}
                </button>

                {/* ChatBot Component, pass entries as props */}
                {isChatBotVisible && (
                    <div className="chatbot-container">
                        <AIChatBot entries={entries} darkMode={darkMode}/>
                    </div>
                )}

                {/* Recycle Bin Modal */}
                <RecycleBin
                    show={showRecycleBinModal}
                    trash={trash}
                    hideRecycleBinModal={this.hideRecycleBinModal}
                    restoreFromTrash={this.restoreFromTrash}
                />

                {/* Render the file upload popup */}
                <FileUploadPopup
                    show={showUploadPopup}
                    onClose={this.toggleUploadPopup}
                    onRestore={this.handleRestoreVault}
                />

                <ScrollToTop smooth/>

            </div>
        )
    }
}

export default HomePageComponent;