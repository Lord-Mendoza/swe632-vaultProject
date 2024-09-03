import {Col, Nav, Navbar, NavDropdown, Row} from 'react-bootstrap';
import {Button, Icon, Menu, Segment, Sidebar} from "semantic-ui-react";
import 'aos/dist/aos.css';
import AOS from "aos";
import Prism from "prismjs";
import "../styling/prism.css"
import {Switch} from "antd";
import ScrollToTop from "react-scroll-to-top";
import React from "react";
import {isNotAnEmptyObject, isNotNullNorUndefined} from "../utilities/helpers/ObjectVariableFunctions";
import {isNotAnEmptyArray} from "../utilities/helpers/ArrayVariableValidators";
import '../styling/HomePageComponent.css';
import '../styling/ComponentStyling.css';
import database from "../sample_data/database.json"

class HomePageComponent extends React.Component {

    constructor(props) {
        super(props);

        let darkMode;
        if (localStorage.getItem("isDarkMode") === "true")
            darkMode = true;

        this.state = {
            darkMode,
            activeKey: "",
            copySuccess: "",
            showSidebar: true
        };

        this.handleSelection = this.handleSelection.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.setDarkModeToLocalStorage = this.setDarkModeToLocalStorage.bind(this);
        this.changeActiveKey = (e, {name}) => this.setState({activeKey: name});
        this.toggleSidebar = openSidebar => {
            if (isNotNullNorUndefined(openSidebar))
                this.setState({showSidebar: openSidebar});
            else
                this.setState({showSidebar: !this.state.showSidebar});
        }
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
        document.execCommand('copy');
        e.target.focus();
        this.setState({
            copySuccess: "Copied!"
        })
    };

    setDarkModeToLocalStorage() {
        const {darkMode} = this.state;
        localStorage.setItem('isDarkMode', darkMode === true ? "true" : "false");
    }

    render() {
        const {activeKey, darkMode, showSidebar} = this.state;

        AOS.init();

        let style = {};
        if (darkMode === true)
            style = {backgroundColor: "#222222", color: "white"};

        let sidebarButton, sidebarVisibility, sidebarAnimation, sidebarPusherFunc, contentDim, sidebarClassName;
        if (window.screen.width <= 1250) {
            sidebarButton = !showSidebar && <Button icon onClick={this.toggleSidebar} className={'sideMenuToggleBtn'}>
                <Icon name={'chevron right'}/>
            </Button>;
            sidebarAnimation = 'overlay';
            sidebarVisibility = showSidebar;
            sidebarPusherFunc = () => this.toggleSidebar(false);
            contentDim = sidebarVisibility;
        } else if (window.screen.width > 1250) {
            sidebarVisibility = true;
            sidebarAnimation = 'slide along'
            sidebarClassName = 'desktop';
        }

        let menuOptions = [];
        if (database.hasOwnProperty("entries") && isNotAnEmptyObject(database["entries"])) {
            Object.keys(database["entries"])
                .sort((a, b) => {
                    a = database["entries"][a]
                    b = database["entries"][b]

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
                    let item = database["entries"][entry];

                    menuOptions.push(<Menu.Item name={entry}
                                                active={activeKey === entry}
                                                onClick={this.changeActiveKey}>
                        <Menu.Header>{item["title"]}</Menu.Header>
                    </Menu.Item>);
                })
        }

        let content;
        if (isNotAnEmptyObject(database)
            && database.hasOwnProperty("entries")
            && database["entries"].hasOwnProperty(activeKey)
            && isNotAnEmptyObject(database["entries"][activeKey])) {

            let {title, insertDate, sections} = database["entries"][activeKey];

            let entryContents = [];

            if (isNotAnEmptyArray(sections)) {
                Object.values(sections).forEach(section => {
                    const {sectionTitle, content, isCode} = section;

                    let renderedContent = isCode ? <section className={"codeSample"}>
                            <pre className="language-javascript">
                                <code>
                                    {content}
                                </code>
                            </pre>
                    </section> : content;

                    entryContents.push(
                        <Row noGutters style={{paddingBottom: '.5em', paddingLeft: "2em"}}>
                            <Col xs={1}>{sectionTitle}</Col>
                            <Col xs={11}>{renderedContent}</Col>
                        </Row>
                    )
                })
            }

            content = <Segment raised inverted={darkMode} style={{marginTop: '10px'}}>
                {isNotNullNorUndefined(title) &&
                    <Row noGutters style={{paddingBottom: '.5em', paddingLeft: "1em"}}>
                        <h4>{title}</h4>
                    </Row>}

                {isNotNullNorUndefined(insertDate) &&
                    <Row noGutters style={{paddingBottom: '.5em', paddingLeft: "1em"}}>
                        <h6>Added: {insertDate}</h6>
                    </Row>}

                {entryContents}
            </Segment>
        } else {
            content = <Segment raised inverted={darkMode} style={{marginTop: '10px'}}>
                <div className="center-screen">
                    <h2>Select one of your entries to the left to start viewing its information here.</h2>
                </div>
            </Segment>
        }

        return (
            <div>
                <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{padding: "10px"}}>
                    <Navbar.Brand>
                        <img src={"logo.png"} style={{height: '24px', width: '24px', marginRight: "5px"}}
                             alt={'vault logo'}/>
                        <span style={{verticalAlign: "text-bottom"}}>Vault</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown id="nav-dropdown" title="Manage Vault">
                                <NavDropdown.Item onClick={this.handleSelection}>Backup Vault to File</NavDropdown.Item>
                                <NavDropdown.Item onClick={this.handleSelection}>Restore Vault from
                                    File</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link onClick={() => alert("clicked")}>Create New Entry</Nav.Link>
                        </Nav>

                        <div style={{padding: ".5rem 1rem"}}>
                            <span className={"darkModeLabel"}> Dark Mode: &nbsp;</span>
                            <Switch
                                checkedChildren={<Icon name='moon'/>}
                                unCheckedChildren={<Icon name='sun' inverted/>}
                                checked={darkMode}
                                onChange={() => this.setState({
                                    darkMode: !darkMode
                                }, this.setDarkModeToLocalStorage)}
                            />
                        </div>
                    </Navbar.Collapse>
                </Navbar>

                <div style={{marginTop: '-10px', paddingBottom: "15px", ...style}}
                     className={darkMode === true ? "darkMode" : ""}>
                    <div style={{margin: 0}} className={"homePageComponent " + sidebarClassName}>
                        <Sidebar.Pushable as={Segment} className={'sidebarBody'}>
                            {sidebarButton}

                            <Sidebar as={Menu}
                                     animation={sidebarAnimation}
                                     direction={'left'}
                                     inverted={darkMode}
                                     vertical
                                     visible={sidebarVisibility}
                                     className={sidebarClassName}
                            >
                                {menuOptions}
                            </Sidebar>

                            <Sidebar.Pusher dimmed={contentDim}
                                            onClick={sidebarPusherFunc}
                                            className={'sidebarContent'}>
                                <div style={{minHeight: "100vh"}}>
                                    {content}
                                </div>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </div>
                </div>

                <ScrollToTop smooth/>
            </div>
        )
    }
}

export default HomePageComponent;