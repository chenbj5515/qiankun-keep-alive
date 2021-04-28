import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, useLocation, useHistory} from 'react-router-dom';
import CacheRoute, {CacheSwitch} from 'react-router-cache-route';

import List from './list';
import Item from './item';
import Entry from './entry';

const App = () => {
  // console.log('app render');
  
  const {pathname} = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (pathname === '/') {
      history.push('/item');
    }
  }, [pathname]);

  return (
    <>
      <Entry />
      <CacheSwitch>
        <CacheRoute when="always" exact path="/list" component={List} />
        <CacheRoute when="always" exact path="/item" component={Item} />
      </CacheSwitch>
    </>
  );
}

const App1 = () => (
  <div>App1</div>
)

interface IQiankunProps {
  container: HTMLElement;
}

// ReactDOM.render(<App />, document.querySelector('#root'));

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props: IQiankunProps) {
  // console.log('app0 mount', props.container);
  ReactDOM.render(
    <BrowserRouter basename="app0">
      <App />
    </BrowserRouter>,
    props.container.querySelector('#root')
  );
}

export async function unmount(params: IQiankunProps) {
  console.log('app unmount');
}

