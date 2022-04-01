import {renderB} from './b'
import './css/a.css'
// import(/*webpackChunkName: "aaaaaa"*/'@/a'); // 动态导入的也会加入到vendor中，魔法注释不能有空格
// import "core-js/stable";
// import "regenerator-runtime/runtime"
import '@/jsx/index';
// import(/*webpackChunkName: "bbbbbb"*/'js-fun-bywhj')
import './xx';

import _ from 'lodash'

import "./c";

renderB()
// console.log(_)
if ((module as any).hot) {
  (module as any).hot.accept(['./b'], () => {
    console.log("change")
  })
}
const button = document.createElement('button');
button.innerText = "OK";
document.body.appendChild(button)
console.log(89)
button.onclick = () => {
  // const a: string = 22;
  // console.log("===d00=>",window.xxad)
  // import(/*webpackPrefetch:true*/'./c').then(data => console.log(data.default))
  // import(/*webpackPreload:true*/'./c').then(data => console.log(data.default))
  // export default ele = 100; data.default就是100
  // export const ele = 100; data.ele就是100
  // module.exports = 100; data.default就是100
}


