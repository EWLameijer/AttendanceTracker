import axios from 'axios';
import { useState, useEffect } from 'react';
import GroupEditComponent from './GroupEditComponent';
import { Group } from './Group';
import { BASE_URL } from '../utils';
import AddGroup from './AddGroup';

const AdminView = () => {
    const [groups, setGroups] = useState<Group[]>([])
    useEffect(() => {
        axios.get(`${BASE_URL}/admin-view/chantal/groups`).then(response => {
            setGroups(response.data);
        });
    }, []);

    const addGroup = (groupName: string) => {
        axios.post<Group>(`${BASE_URL}/admin-view/chantal/groups`, { name: groupName }).then(response => {
            const newGroup = response.data;
            setGroups([...groups, newGroup])
        });
    }

    const removeGroup = (groupId: string) => {
        axios.delete(`${BASE_URL}/admin-view/chantal/groups/${groupId}`,).then(() => {
            setGroups(groups.filter(group => group.id != groupId))
        });
    }

    return <>
        <h2>Hallo Chantal!</h2>
        <AddGroup add={addGroup} />
        <ol>{groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => <GroupEditComponent key={group.name} group={group} remove={removeGroup} />)}</ol>
    </>
}

export default AdminView;