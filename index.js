export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 首页：百度/谷歌风格搜索框
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>搜索代理</title>
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
let inp=document.getElementById('inp');
let go=document.getElementById('go');
let frm=document.getElementById('frm');
go.onclick=()=>{
  let v=inp.value.trim();
  if(!v)return;
  if(!v.startsWith('http'))v='https://'+v;
  frm.src='/p/'+btoa(v);
}
</script>
</body>
</html>
      `, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // 代理转发
    if (url.pathname.startsWith("/p/")) {
      try {
        const target = atob(url.pathname.slice(3));
        return fetch(new Request(target, request));
      } catch {
        return new Response("网址错误", { status: 400 });
      }
    }

    return new Response("404 Not Found", { status: 404 });
  }
};
