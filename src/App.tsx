import HelloWorld from "./components/HelloWorld";
import ListGroup from "./components/ListGroup";
import DefaultNoteFile from "./components/DefaultNoteFile";
import EditNote from "./components/EditNote";
import AIChatBot from "./components/AIChatBot";

function App() {
  return (
    <div>
      <HelloWorld></HelloWorld>
      <ListGroup></ListGroup>
      <DefaultNoteFile></DefaultNoteFile>
      <EditNote></EditNote>
      <AIChatBot></AIChatBot>
    </div>
  );
}

export default App;
