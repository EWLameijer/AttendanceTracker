import axios from 'axios';
import { useState, useEffect } from 'react';
import GroupEditComponent from './GroupEditComponent';
import { Group } from './Group';
import { BASE_URL } from '../utils';

const AdminView = () => {
    const [groups, setGroups] = useState<Group[]>([])
    useEffect(() => {
        axios.get(`${BASE_URL}/admin-view/chantal/groups`).then(response => {
            setGroups(response.data);
        });
    }, []);

    return <>
        <h2>Hallo Chantal!</h2>
        <ol>{groups.sort((a, b) => a.name.localeCompare(b.name)).map(group => <GroupEditComponent key={group.name} group={group} />)}</ol>
    </>
}

export default AdminView;