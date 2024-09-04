import HelloWorld from "./components/HelloWorld";
import ListGroup from "./components/ListGroup";
import DefaultNoteFile from "./components/DefaultNoteFile";
import EditNote from "./components/EditNote";
import AIChatBot from "./components/AIChatBot";
import "./styling/rowStyle.css";

function App() {
  return (
    <>
      <div>
        <HelloWorld></HelloWorld>
        <ListGroup></ListGroup>
        <DefaultNoteFile></DefaultNoteFile>
      </div>

      <div>
        <div className="rowStyle">
          <EditNote />
          <AIChatBot />
        </div>
      </div>
    </>
  );
}

export default App;
