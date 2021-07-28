import React, { useState }from 'react';
import './Form.css';

const Form = ({ handleAddTip }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mod, setMod] = useState(1);

    // const handleTitle = (e) => {
    //     setTitle(e.target.value);
    // }

    // const handleDescription = (e) => {
    //     setDescription(e.target.value);
    // }

    // const handleMod = (e) => {
    //     setMod(e.target.value);
    //     console.log(mod, "THIS IS OUR MOD");
    // }

    const onAddTip = (e) => {
        e.preventDefault();

        const date = new Date(Date.now()).toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
        // const formattedDate = date.toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

        handleAddTip({ title: title, description: description, mod: mod, upvotes: 0, date: date, id: Math.random() });
        // validateInputValues(title, description);
        clearInputs();
    }

    const clearInputs = () => {
        setTitle('');
        setDescription('');
        setMod(1);
    }

    return(
        <form>
            <input onChange={event => setTitle(event.target.value)} type="text" placeholder="Tip Title" value={title}/>
            <input onChange={event => setDescription(event.target.value)} type="text" placeholder="Description" value={description}/>
            <select   
                value={mod} 
                onChange={event => setMod(event.target.value)} >
                <option value="1">Mod 1</option>
                <option value="2">Mod 2</option>
                <option value="3">Mod 3</option>
                <option value="4">Mod 4</option>
            </select>
            <button onClick={onAddTip}>Submit</button>
        </form>
    )
}

export default Form;