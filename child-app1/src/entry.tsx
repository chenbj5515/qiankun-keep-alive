import React from 'react';
import {useHistory} from 'react-router-dom';

const List = () => {
    const history = useHistory();

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        const targetRoute = e.currentTarget.getAttribute('data-target-route');
        history.push(targetRoute);
    }

    return (
        <>
            <div onClick={handleClick} data-target-route="list">点我切换到app1的list路由</div>
            <div onClick={handleClick} data-target-route="item">点我切换到app1的item路由</div>
        </>
    )
}

export default List;