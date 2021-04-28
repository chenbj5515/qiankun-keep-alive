import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import CacheRoute, {CacheSwitch} from 'react-router-cache-route';

import List from './list';
import Item from './item';
import Entry from './entry';

const App = () => (
  <>
    <BrowserRouter basename="/app1">
      <Entry />
      <CacheSwitch>
        <CacheRoute exact path="/list" component={List} />
        <CacheRoute exact path="/item" component={Item} />
      </CacheSwitch>
    </BrowserRouter>
  </>
);

interface IQiankunProps {
  container: HTMLElement;
}

// ReactDOM.render(<App />, document.querySelector('#root'));

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props: IQiankunProps) {
  ReactDOM.render(<App />, props.container.querySelector('#root'));
}

export async function unmount(params: IQiankunProps) {
  // do nothing
}

