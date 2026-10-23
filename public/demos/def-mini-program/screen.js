const screens={home:{title:'Home',page:'home',active:0},catalog:{title:'Catalog',page:'catalog',active:1},product:{title:'Product',page:'product-detail',query:'?id=demo-product-0',back:true},cart:{title:'Cart',page:'cart',active:2},signin:{title:'Sign in',page:'account',guest:true,active:3},account:{title:'Account',page:'account',active:3},bind:{title:'Link account',page:'bind',back:true},order:{title:'Order details',page:'order-detail',query:'?id=demo-order',back:true}};
const key=new URLSearchParams(location.search).get('screen')||'home',screen=screens[key]||screens.home;
document.title='DEF — '+screen.title;document.getElementById('title').textContent=screen.title;document.body.classList.toggle('is-back',!!screen.back);
const tabs=document.querySelector('.tabs');tabs.hidden=!!screen.back;
const names=['首页','分类','购物车','我的'],icons=['home','catalog','cart','account'];
icons.forEach((icon,index)=>{const item=document.createElement('span');item.className='tab';if(index===screen.active)item.setAttribute('aria-current','page');const image=document.createElement('img');image.src='tab-icons/'+icon+(index===screen.active?'-active':'')+'.svg';image.alt='';const label=document.createElement('span');label.textContent=names[index];item.append(image,label);tabs.append(item);});
const frame=document.getElementById('screen');frame.title='DEF '+screen.title+' content';
if(key==='home'){
  fetch('home-content.json').then(r=>{if(!r.ok)throw Error('Home content unavailable');return r.json()}).then(content=>{
    const send=()=>{frame.contentWindow.postMessage({source:'def-portfolio-storefront',type:'content',payload:content},location.origin);frame.contentWindow.postMessage({source:'def-erp-storefront',type:'state',payload:{layout:content.home.layout,selectedId:'carousel',editable:false}},location.origin);};
    addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.origin===location.origin&&['def-portfolio-preview','def-storefront-preview'].includes(event.data?.source)&&event.data.type==='ready')send();});
    frame.addEventListener('load',send);frame.src='portfolio/storefront-runtime/index.html?preview=1&parentOrigin='+encodeURIComponent(location.origin)+'#/pages/home/index';
  });
}else frame.src='portfolio/customer-runtime/index.html'+(screen.guest?'?guest=1':'')+'#/pages/'+screen.page+'/index'+(screen.query||'');