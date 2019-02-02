import React from "react";
import styled from "styled-components";
import ContentEditable from "react-contenteditable";

const Container = styled.ul`
  flex: 1;
  display: block;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: scroll;
`;

const Item = styled.li`
  display: ${props => (props.show ? "flex" : "none")};
  margin: 0;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  ${props => props.done && "text-decoration: line-through;"}
  color: ${props => (props.done ? "#ddd" : "#000")};
`;

const ItemTitle = styled.div`
  flex: 1;
  text-align: left;
`;

const Options = styled.div`
  flex: none;
  width: auto;
  text-align: right;

  button {
    margin-left: 5px;
  }
`;

export default ({
  tasks,
  deleteTask,
  changeStatus,
  showOnlyIncomplete,
  editTask
}) => {
  return (
    <Container>
      {tasks.map(task => (
        <Item
          key={task.id}
          done={task.done}
          show={showOnlyIncomplete && task.done ? false : true}
        >
          <input
            type="checkbox"
            name="markCompleted"
            checked={task.done}
            data-id={task.id}
            onChange={changeStatus}
          />
          <ItemTitle>
            <ContentEditable
              html={task.title}
              id={task.id}
              onChange={e => editTask(e)}
              disabled={task.done}
            />
          </ItemTitle>
          <Options>
            <button onClick={deleteTask} value={task.id}>
              Delete
            </button>
          </Options>
        </Item>
      ))}
    </Container>
  );
};
