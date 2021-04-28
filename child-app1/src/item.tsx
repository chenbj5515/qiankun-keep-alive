import React, {useState} from 'react';

const Item = () => {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <>
            <div onClick={handleClick}>click me to amend state in app0-item</div>
            <div>Item State: {count}</div>
        </>
    )
}

export default Item;

