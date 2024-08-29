import HelloWorld from "./components/HelloWorld";
import ListGroup from "./components/ListGroup";
import DefaultNoteFile from "./components/DefaultNoteFile";
import EditNote from "./components/EditNote";

function App() {
  return (
    <div>
      <HelloWorld></HelloWorld>
      <ListGroup></ListGroup>
      <DefaultNoteFile></DefaultNoteFile>
      <EditNote></EditNote>
    </div>
  );
}

export default App;
