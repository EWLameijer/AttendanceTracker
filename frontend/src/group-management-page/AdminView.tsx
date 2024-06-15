import axios from "axios";
import { useState, useEffect, useContext } from "react";
import GroupEditComponent from "./GroupEditComponent";
import { Group } from "../shared/Group";
import { BASE_URL } from "../utils";
import AddGroup from "./AddGroup";
import UserContext from "../login-page/UserContext";

const groupUrl = `${BASE_URL}/groups`;

const AdminView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const user = useContext(UserContext);
  useEffect(() => {
    axios
      .get(groupUrl, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setGroups(response.data);
      });
  }, []);

  const addGroup = (groupName: string) => {
    axios
      .post<Group>(
        groupUrl,
        { name: groupName },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        const newGroup = response.data;
        setGroups([...groups, newGroup]);
      });
  };

  const removeGroup = (groupId: string) => {
    axios
      .delete(`${groupUrl}/${groupId}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then(() => {
        setGroups(groups.filter((group) => group.id != groupId));
      });
  };

  return (
    <>
      <h2>Hallo {user.username}!</h2>
      <AddGroup add={addGroup} />
      <ol>
        {groups
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((group) => (
            <GroupEditComponent
              key={group.name}
              group={group}
              remove={removeGroup}
            />
          ))}
      </ol>
    </>
  );
};

export default AdminView;
