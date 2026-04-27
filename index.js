  addEventListener('fetch', e => e.respondWith(main(e.request)))

async function main(r) {
  let u = new URL(r.url)

  if(u.pathname === '/') {
    return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>网页搜索代理</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column}
#top{padding:20px;display:flex;gap:10px}
#inp{flex:1;padding:12px;border:1px solid #ccc;border-radius:6px}
#go{padding:12px 20px;background:#007bff;color:#fff;border:0;border-radius:6px}
#frm{flex:1;border:0}
</style>
</head>
<body>
  <div id=top>
    <input id=inp placeholder="输入网址，如 google.com">
    <button id=go>访问</button>
  </div>
  <iframe id=frm></iframe>

<script>
let inp=document.getElementById('inp')
let go=document.getElementById('go')
let frm=document.getElementById('frm')

go.onclick=()=>{
  let v=inp.value.trim()
  if(!v)return
  if(!v.startsWith('http'))v='https://'+v
  frm.src='/p/'+btoa(v)
}
</script>
</body>
</html>
`,{headers:{"content-type":"text/html;charset=utf-8"}})
  }

  if(u.pathname.startsWith('/p/')){
    let t = atob(u.pathname.slice(3))
    return fetch(new Request(t, r))
  }

  return new Response('404',{status:404})
}
