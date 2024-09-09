import React from "react";
import { Col, Nav, Navbar, NavDropdown, Row, Modal } from "react-bootstrap";
import { Button, Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
import "aos/dist/aos.css";
import AOS from "aos";
import Prism from "prismjs";
import "../styling/prism.css";
import { Switch } from "antd";
import ScrollToTop from "react-scroll-to-top";
import { copyObject, isNotAnEmptyObject, isNotNullNorUndefined } from "../utilities/helpers/ObjectVariableFunctions";
import { copyArrayOfObjects, isNotAnEmptyArray } from "../utilities/helpers/ArrayVariableValidators";
import "../styling/HomePageComponent.css";
import "../styling/ComponentStyling.css";
import EntryComponent from "./EntryComponent";
import { ConstantStrings } from "../utilities/constants/ConstantStrings";
import AIChatBot from "./AIChatBot.tsx";
import "../styling/BotToggle.css"
import "../styling/DeleteButtonStyling.css"
import RecycleBin from "./RecycleBin.js"

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
      entry: {},

      //Andy's Variables
      isEditing: false,
      isChatBotVisible: false,
      // Define the trash state here
      trash: {
        "entryTrashOne": {
          "insertDate": "2024-01-02",
          "title": "First Trash",
          "sections": [
            {
              "sectionTitle": "Description",
              "content": "first trash"
            }
          ]
        }
      },
      showRecycleBinModal: false, // Control Recycle Bin Visibility
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

  // Andy"s Implementation for Edit
  handleContentChange = (sectionIndex, value) => {
    const { activeKey, entries } = this.state;
    const updatedSections = entries[activeKey].sections.map((section, index) => {
      if (index === sectionIndex) {
        return { ...section, content: value };
      }
      return section;
    });

    this.setState({
      entries: {
        ...entries,
        [activeKey]: {
          ...entries[activeKey],
          sections: updatedSections
        }
      }
    });
  };

  // Andy's Implementation for Edit Titles
  handleTitleChange = (value) => {
    const { activeKey, entries } = this.state;

    this.setState({
      entries: {
        ...entries,
        [activeKey]: {
          ...entries[activeKey],
          title: value
        }
      }
    });
  };

  // Used to Hide or show AI ChatBot window
  toggleChatBot = () => {
    this.setState((prevState) => ({
      isChatBotVisible: !prevState.isChatBotVisible,
    }));
  };

  // Method to move an entry to the trash
  moveToTrash = (entryKey) => {
    const { entries, trash } = this.state;

    // Move entry from entries to trash
    this.setState({
      entries: Object.fromEntries(Object.entries(entries).filter(([key]) => key !== entryKey)),
      trash: { ...trash, [entryKey]: entries[entryKey] },
    });

  };

  // Method to restore an entry from the trash
  restoreFromTrash = (entryKey) => {
    const { entries, trash } = this.state;

    // Move entry from trash back to entries
    this.setState({
      trash: Object.fromEntries(Object.entries(trash).filter(([key]) => key !== entryKey)),
      entries: { ...entries, [entryKey]: trash[entryKey] },
    });
  };

  // Handle delete and move to recycle
  handleDeleteEntry = (entryKey) => {
    const { entries, trash } = this.state; // Get both entries and trash from state

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
  };

  // Method to show the Recycle Bin modal
  showRecycleBinModal = () => {
    this.setState({ showRecycleBinModal: true });
  };

  // Method to hide the Recycle Bin modal
  hideRecycleBinModal = () => {
    this.setState({ showRecycleBinModal: false });
  };

  handleDuplicateEntry = (key) => {
    const { entries } = this.state;
  
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
    this.setState({ entries: newEntries });
  
    console.log(`Entry duplicated as ${newTitle}`);
  }
  

  render() {
    const {
      entries,
      activeKey, darkMode, showSidebar,
      showCreateEditEntryPopup, entry, entryType, isEditing, trash
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

      let { title, insertDate, sections } = entries[activeKey];

      let entryContents = [];

      // If there is data, Build Content to show in view
      if (isNotAnEmptyArray(sections)) {
        // Break down each section into individual const SectionTitle, content, isCode
        // Note, this code treats each section individually.
        // IDK how index is working here
        entryContents = sections.map((section, index) => {
          const { sectionTitle, content, isCode } = section;

          // if a section isCode, just display
          //if !isCode, then display a text area


          let renderedContent = isCode ? (
            <section className={"codeSample"}>
              <pre className="language-javascript">
                <code>
                  {content}
                </code>
              </pre>
            </section>
          ) : (

            // this segment styling is not applying?
            <Segment raised inverted={darkMode}>
              {/* Can be `textarea` or `input`, which is better? */}
              <input
                value={content}
                // Change handler for text areas???
                // updates when user types
                onChange={(e) => this.handleContentChange(index, e.target.value)}
                // Disable editing when not in editing mode
                disabled={!isEditing}
                style={{ width: "100%", minHeight: "100px" }}
              />
            </Segment>
          );

          // Display title and content to screen
          // should this be here? I see another return() below
          return (
            <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "2em" }} key={index}>
              <Col xs={1}>{sectionTitle}</Col>
              <Col xs={11}>{renderedContent}</Col>
            </Row>
          );
        });
      }

      // why is content defined here, shouldn"t it be defined before it is used in line 263?
      content = (
        <Segment raised inverted={darkMode} style={{ marginTop: "10px" }}>
          <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "1em" }}>
            {/* is isEditing is true, the title becomes a editable text field */}
            {isEditing ? (
              <input
                type="text"
                value={title}
                // Change handler for text areas???
                // updates when user types
                onChange={(e) => this.handleTitleChange(e.target.value)}
                style={{ width: "100%" }}
              />
            ) : (
              // otherwise, just shows the title
              <h4>{title}</h4>
            )}
          </Row>
          {/* Shows Date on view*/}
          {isNotNullNorUndefined(insertDate) && (
            <Row noGutters style={{ paddingBottom: ".5em", paddingLeft: "1em" }}>
              <h6>Added: {insertDate}</h6>
            </Row>
          )}
          {/* Show contents of all Sections */}
          {entryContents}


          {/* Show Edit/Save and Delete */}
          <Row noGutters style={{ paddingBottom: '.5em', paddingLeft: '1em', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            {/* if not editing, show an edit button */}
            {/* if editing, show a save button */}
            {isEditing ? (
              <Button
                onClick={() => this.setState({ isEditing: false })}
                style={{ width: '80px' }} // Adjust width as needed
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={() => this.setState({ isEditing: true })}
                style={{ width: '80px' }} // Adjust width as needed
              >
                Edit
              </Button>
            )}
            {/* Delete Button next to Edit */}
            <Button
              color="red"
              onClick={() => this.handleDeleteEntry(activeKey)}
              style={{ width: '80px', marginLeft: '10px' }} // Adjust width as needed
            >
              Delete
            </Button>
            {/* Duplicate Button next to Delete */}
            <Button
              onClick={() => this.handleDuplicateEntry(activeKey)}
              style={{ width: '100px', marginLeft: '10px' }} // Adjust width as needed
            >
              Duplicate
            </Button>
          </Row>



        </Segment>
      );
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
              {/* Add Recycle Bin Tab */}
              <Nav.Link onClick={this.showRecycleBinModal}>
                Recycle Bin
              </Nav.Link>
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


        {/* ChatBot Button */}
        <button className="chatbot-toggle-button" onClick={this.toggleChatBot}>
          Chat
        </button>

        {/* ChatBot Component, pass entries as props */}
        {this.state.isChatBotVisible && (
          <div className="chatbot-container">
            <AIChatBot entries={entries} darkMode={darkMode} />
          </div>
        )}

        {/* Recycle Bin Modal */}
        <RecycleBin
          show={this.state.showRecycleBinModal}
          trash={this.state.trash}
          hideRecycleBinModal={this.hideRecycleBinModal}
          restoreFromTrash={this.restoreFromTrash}
        />

        <ScrollToTop smooth />

      </div>
    )
  }
}

export default HomePageComponent;