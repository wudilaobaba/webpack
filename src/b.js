import './css/c.less'
import './public/font/iconfont.css'

console.log(2099909)
export const renderB = ()=>{
  const dom = document.createElement('h1');
  const dom1 = document.createElement('h2');
  dom1.innerText = "CCC";
  dom1.className = "x"
  dom.innerText = "BBB";
  dom.className = "bg"
  document.body.appendChild(dom)
  document.body.appendChild(dom1)
  const span= document.createElement('span')
  span.className = 'iconfont icon-a-05nvxingjiaose'
  span.style.color="black"
  document.body.appendChild(span)

  console.log(90)
}