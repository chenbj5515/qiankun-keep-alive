import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {registerMicroApps, start, loadMicroApp} from 'qiankun';
import {BrowserRouter} from 'react-router-dom';
import {useHistory, useLocation, Redirect, Link} from 'react-router-dom';

const apps = [
    {name: 'app0', activeRule: '/app0', entry: '//localhost:7700', container: '#micro-app'},
    {name: 'app1', activeRule: '/app1', entry: '//localhost:7701', container: '#micro-app'}
];

const Aside = () => {
    const {pathname} = useLocation();
    const activeAppPath = pathname.match(/(\w+)/) ? pathname.match(/(\w+)/)[0] : null;

    useEffect(() => {
        if (activeAppPath) {
            const aciveApp = apps.filter(app => app.name === activeAppPath)[0];
            loadMicroApp(aciveApp);
        }
    }, [activeAppPath]);

    // useEffect(() => {
    //     registerMicroApps(apps);
    //     start();
    // }, []);

    return (
        <>
            <div>菜单栏</div>
            <div>
                {apps.map(app => (<Link to={app.activeRule}>{app.name}</Link>))}
            </div>
        </>
    )
};

const Content = () => {
    return (
        <>
            挂载点：
            <div id="micro-app"></div>
        </>
    )
}

const App = () => {
    return (
        <BrowserRouter>
            <Redirect from="/" to="/app0" />
            <Aside />
            <Content />
        </BrowserRouter>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);

