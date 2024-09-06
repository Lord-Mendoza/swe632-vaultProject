import { Col, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Button, Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
import "aos/dist/aos.css";
import AOS from "aos";
import Prism from "prismjs";
import "../styling/prism.css"
import { Switch } from "antd";
import ScrollToTop from "react-scroll-to-top";
import React from "react";
import { copyObject, isNotAnEmptyObject, isNotNullNorUndefined } from "../utilities/helpers/ObjectVariableFunctions";
import { copyArrayOfObjects, isNotAnEmptyArray } from "../utilities/helpers/ArrayVariableValidators";
import "../styling/HomePageComponent.css";
import "../styling/ComponentStyling.css";
import EntryComponent from "./EntryComponent";
import { ConstantStrings } from "../utilities/constants/ConstantStrings";

class HomePageComponent extends React.Component {

    constructor(props) {
        super(props);

        let darkMode;
        if (localStorage.getItem("isDarkMode") === "true")
            darkMode = true;

        this.state = {
            //TODO: Clear the dummy data and set entries to empty object
            // entries: {},
            entries: {
                "entryOne": {
                    "insertDate": "2024-09-02",
                    "title": "First Entry",
                    "sections": [
                        {
                            "sectionTitle": "Description",
                            "content": "first entry"
                        },
                        {
                            "sectionTitle": "Sample Code",
                            "content": "public static void main(String[] args){}",
                            "isCode": true
                        }
                    ]
                },
                "entryTwo": {
                    "insertDate": "2024-08-01",
                    "title": "Second Entry",
                    "sections": [
                        {
                            "sectionTitle": "Description",
                            "content": "second entry"
                        },
                        {
                            "sectionTitle": "Sample Code",
                            "content": "public static void main(String[] args){}",
                            "isCode": true
                        }
                    ]
                }
            },

            darkMode,
            activeKey: "",
            copySuccess: "",
            showSidebar: true,

            showCreateEditEntryPopup: false,
            entryType: "",
            entry: {}
        };

        this.handleSelection = this.handleSelection.bind(this);
        this.changeEntries = this.changeEntries.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.setDarkModeToLocalStorage = this.setDarkModeToLocalStorage.bind(this);
        this.changeActiveKey = (e, { name }) => this.setState({ activeKey: name });
        this.toggleSidebar = openSidebar => {
            if (isNotNullNorUndefined(openSidebar))
                this.setState({ showSidebar: openSidebar });
            else
                this.setState({ showSidebar: !this.state.showSidebar });
        }
        this.showCreateEditEntryPopup = entryType => this.setState({ showCreateEditEntryPopup: true, entryType })
        this.closeCreateEditEntryPopup = () => this.setState({ showCreateEditEntryPopup: false, entryType: "" })
    }

    componentDidMount() {
        Prism.highlightAll();
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
    };

    setDarkModeToLocalStorage() {
        const { darkMode } = this.state;
        localStorage.setItem("isDarkMode", darkMode === true ? "true" : "false");
    }

    changeEntries(entry) {
        const { entries } = this.state;
        let newEntries = copyObject(entries);

        let refactoredEntry = {};
        refactoredEntry["title"] = entry["title"];

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        refactoredEntry["insertDate"] = `${year}-${month}-${day}`;

        refactoredEntry["sections"] = [];
        Object.keys(entry)
            .filter(v => v !== "title")
            .forEach(section => {
                refactoredEntry["sections"].push({
                    "sectionTitle": section,
                    "content": entry[section]
                })
            })

        newEntries[entry["title"]] = refactoredEntry;

        this.setState({ entries: newEntries }, this.closeCreateEditEntryPopup);
    };

    render() {
        const {
            entries,
            activeKey, darkMode, showSidebar,
            showCreateEditEntryPopup, entry, entryType
        } = this.state;

        AOS.init();

        let style = {};
        if (darkMode === true)
            style = { backgroundColor: "#222222", color: "white" };

        let sidebarButton, sidebarVisibility, sidebarAnimation, sidebarPusherFunc, contentDim, sidebarClassName;
        if (window.screen.width <= 1250) {
            sidebarButton = !showSidebar && <Button icon onClick={this.toggleSidebar} className={"sideMenuToggleBtn"}>
                <Icon name={"chevron right"} />
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

            let { title, insertDate, sections } = entries[activeKey];

            let entryContents = [];

            if (isNotAnEmptyArray(sections)) {
                Object.values(sections).forEach(section => {
                    const { sectionTitle, content, isCode } = section;

                    let renderedContent = isCode ? <section className={"codeSample"}>
                        <pre className="language-javascript">
                            <code>
                                {content}
                            </code>
                        </pre>
                    </section> : content;

                    entryContents.push(
                        <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "2em" }}>
                            <Col xs={1}>{sectionTitle}</Col>
                            <Col xs={11}>{renderedContent}</Col>
                        </Row>
                    )
                })
            }

            content = <Segment raised inverted={darkMode} style={{ marginTop: "10px" }}>
                {isNotNullNorUndefined(title) &&
                    <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "1em" }}>
                        <h4>{title}</h4>
                    </Row>}

                {isNotNullNorUndefined(insertDate) &&
                    <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "1em" }}>
                        <h6>Added: {insertDate}</h6>
                    </Row>}

                {entryContents}
            </Segment>
        }
        //else, show default selection screen
        else {
            content = <Segment raised inverted={darkMode} style={{ marginTop: "10px" }}>
                <div className="center-screen">
                    <h2>Select one of your entries to the left to start viewing its information here.</h2>
                </div>
            </Segment>
        }

        return (
            <div>
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ padding: "10px" }}>
                    <Navbar.Brand>
                        <img src={"logo.png"} style={{ height: "24px", width: "24px", marginRight: "5px" }}
                            alt={"vault logo"} />
                        <span style={{ verticalAlign: "text-bottom" }}>Vault</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown id="nav-dropdown" title="Manage Vault">
                                <NavDropdown.Item onClick={this.handleSelection}>Backup Vault to File</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.handleSelection}>Restore Vault from
                                    File</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link onClick={() => this.showCreateEditEntryPopup(ConstantStrings.createStr)}>Create
                                New Entry</Nav.Link>
                        </Nav>

                        <div style={{ padding: ".5rem 1rem" }}>
                            <span className={"darkModeLabel"}> Dark Mode: &nbsp;</span>
                            <Switch
                                checkedChildren={<Icon name="moon" />}
                                unCheckedChildren={<Icon name="sun" inverted />}
                                checked={darkMode}
                                onChange={() => this.setState({
                                    darkMode: !darkMode
                                }, this.setDarkModeToLocalStorage)}
                            />
                        </div>
                    </Navbar.Collapse>
                </Navbar>

                <div style={{ marginTop: "-10px", paddingBottom: "15px", ...style }}
                    className={darkMode === true ? "darkMode" : ""}>
                    <div style={{ margin: 0 }} className={"homePageComponent " + sidebarClassName}>
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
                                <div style={{ minHeight: "100vh" }}>
                                    {content}
                                </div>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </div>
                </div>

                {showCreateEditEntryPopup && <EntryComponent entry={entry}
                    changeEntries={this.changeEntries}
                    entryType={entryType}
                    closePopup={this.closeCreateEditEntryPopup} />}

                <ScrollToTop smooth />
            </div>
        )
    }
}

export default HomePageComponent;