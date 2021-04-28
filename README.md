# qiankun语境下子应用keep-alive的方案与原理

先说下keep-alive的效果，首次在某个容器内渲染一个子应用，然后路由切换，容器渲染其他子应用。路由再次切回，容器渲染之前的子应用并且保留之前子应用的状态。

![https://media.giphy.com/media/jkwjhRlvM4LQIOK3UP/giphy.gif](https://media.giphy.com/media/jkwjhRlvM4LQIOK3UP/giphy.gif)

这种听起来很简单就能实现，Vue中用内置的keep-alive就好，React的话react-router-cache-route这个库也可以实现同样的功能。原理其实也很简单，不用管具体细节，反正路由切换不销毁重新并创建组件实例就可以了。

但是实际上在qiankun中，仅仅keep-alive整个子应用也是无法实现这个效果的。[Why??](https://www.notion.so/qiankun-keep-alive-4f8d90f938d041f7a98d37c1bb277e9e)

qiankun有两种运作模式：

1.使用registerMicroApps+start，这是挂自动档，路由改变，重新load子应用.

2.使用loadMicroApp，每次路由匹配上，手动load子应用.

自动档下，是这样运作的：

1.首次load应用，创建子应用实例，渲染。

2.切到其他子应用后切回，会重新创建新的子应用实例并渲染。是的，之前的子应用实例qiankun直接不要了，即使你没有手动销毁实例。所以说，采用这种模式的话一定要在子应用暴露的unmount钩子里手动销毁实例，不然就内存泄漏了。

qiankun并没有提供配置项来修正这种行为，旧的实例直接被弃置不用了，而你keep-alive的仅仅是子应用下的某个组件实例，而整个子应用实例都被弃之不用了，keep-alive某个组件自然是没有任何用处的。

而loadMicroApp则不然，loadMicroApp的策略是每个子应用都有一个唯一的实例ID，reload时会复用之前的实例。剔除我们不关心的细节，抽象出来的代码是这样的：

[https://codesandbox.io/s/great-leakey-rv03i?file=/src/index.js](https://codesandbox.io/s/great-leakey-rv03i?file=/src/index.js)

当然这个例子中没有路由切换，所以可以没有keep-alive也成功存住状态了。

看这段代码要关注的是ReactDOM.render的行为，现在是往wrapper0里render了两次App0，这种case下App0的状态是保留了首次的。

但是如果往wrapper里render null或者其他App之后再次render App0，那么App0第一次渲染时的状态是不会被保留的。

而我阅读了qiankun的源码，得出的结论是qiankun中的行为就是我例子中这样的，所以App0的状态可以被保留。

那么有人会问，子应用很可能是Vue的啊，那么情况是什么样的呢？如果有这个疑问，说明可能这对你而言是一个很好的动手机会，真实的用qiankun作为基座，切换子应用时keep-alive的代码已经在这个仓库了，你可以自行增加一个Vue子应用

下面总结下最简实现子应用keep-alive的操作，其实只需两步：

1.基座中监听路由变化，变化后通过loadMicroApp加载对应子应用

2.子应用中keep-alive

React中可以这样来keep-alive：

```tsx
import CacheRoute, {CacheSwitch} from 'react-router-cache-route';

// 在路由配置处使用CacheRoute缓存希望keep-alive的组件，注意when要配置为always
<CacheSwitch>
  <CacheRoute when="always" exact path="/list" component={List} />
  <CacheRoute when="always" exact path="/item" component={Item} />
</CacheSwitch>
```

更进一步

我们的基座中展示子应用和浏览器展示标签页是的表现是一样的、但是最简方案下，关闭标签页也没有卸载子应用实例，仍然占据着内存，并且下次重新打开也不是全新的子应用，这理论上是不符合预期的行为。

所以我们的解决方案是：

1.在子应用暴露的unmount钩子中写好卸载子应用的逻辑，如调用ReactDOM.unmountComponentAtNode

2.在基座中，关闭标签页时，手动调用app的unmount钩子