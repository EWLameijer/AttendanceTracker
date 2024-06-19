import { ChangeEvent, useState } from "react";

const AddGroup = (props: { add: (groupName: string) => void }) => {
  const [groupName, setGroupName] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (groupName.trim() === "") {
      alert("Een groep heeft een naam nodig!");
      return;
    }
    props.add(groupName);
    setGroupName("");
  };

  const updateGroupName = (event: ChangeEvent<HTMLInputElement>) =>
    setGroupName(event.currentTarget.value);

  return (
    <form onSubmit={submit}>
      <input value={groupName} onChange={updateGroupName}></input>
      <input
        type="submit"
        value="Maak groep aan"
        disabled={!groupName.trim()}
      ></input>
    </form>
  );
};

export default AddGroup;
