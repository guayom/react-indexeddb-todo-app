import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  padding: 20px;
`;

export default () => (
  <Container>
    <p>Create some tasks!</p>
    <p>
      All tasks are stored in your browser with indexedDB, so you can come back
      later and your tasks will still be here.
    </p>
    <p>
      Just in case, that also means that tasks cannot be synced to other devices
      or browsers
    </p>
  </Container>
);
