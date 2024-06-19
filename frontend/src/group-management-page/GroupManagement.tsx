import axios from "axios";
import { useState, useEffect, useContext } from "react";
import GroupEditComponent from "./GroupEditComponent";
import { Group } from "../-shared/Group";
import { BASE_URL } from "../-shared/utils";
import AddGroup from "./AddGroup";
import UserContext from "../-shared/UserContext";

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
        setGroups(groups.filter((group) => group.id !== groupId));
      });
  };

  const changeName = (id: string, newName: string) => {
    if (groups.map((group) => group.name).includes(newName)) {
      alert(`De naam ${newName} wordt al gebruikt!`);
    } else {
      const confirmChange = confirm(
        `Verander de naam van deze groep in ${newName}?`
      );
      if (confirmChange) {
        axios
          .patch<Group>(
            groupUrl + `/${id}`,
            { name: newName },
            {
              auth: {
                username: user.username,
                password: user.password,
              },
            }
          )
          .then((response) => {
            const newGroup = response.data;
            setGroups([...groups.filter((group) => group.id !== id), newGroup]);
          });
      }
    }
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
              changeName={changeName}
            />
          ))}
      </ol>
    </>
  );
};

export default AdminView;
