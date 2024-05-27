import React, { useState } from "react";

function useSidebar() {
  const [usersOpen, setUsersOpen] = useState(0);

  const sidebar1 = () => {
    usersOpen === 1 ? setUsersOpen(0) : setUsersOpen(1);
  };
  const sidebar2 = () => {
    usersOpen === 2 ? setUsersOpen(0) : setUsersOpen(2);
  };
  const sidebar3 = () => {
    usersOpen === 3 ? setUsersOpen(0) : setUsersOpen(3);
  };
  const sidebar4 = () => {
    usersOpen === 4 ? setUsersOpen(0) : setUsersOpen(4);
  };
  const sidebar5 = () => {
    usersOpen === 5 ? setUsersOpen(0) : setUsersOpen(5);
  };
  const sidebar6 = () => {
    usersOpen === 6 ? setUsersOpen(0) : setUsersOpen(6);
  };

  return {
    // retornar el estado
    usersOpen,
    sidebar1, sidebar2,sidebar3,sidebar4, sidebar5, sidebar6
  };
}

export default useSidebar;
