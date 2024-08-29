function ListGroup() {
  let groupMembers = ["Trent", "Lord", "Andy"];
  // groupMembers = [];

  let selectedIndex = 0;

  if (groupMembers.length === 0)
    return (
      <>
        <h1>List of Group Members</h1>
        <p>No Group Members</p>;
      </>
    );
  else
    return (
      <>
        <h1>List of Group Members</h1>
        <ul className="list-group">
          {groupMembers.map((item, index) => (
            <li
              className={
                selectedIndex === index
                  ? "list-group-item active"
                  : "list-group-item"
              }
              key={item}
              onClick={(event) =>
                console.log("Clicked", { item }, { index }, event)
              }
            >
              {item}
            </li>
          ))}
        </ul>
      </>
    );
}

export default ListGroup;
