export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页：搜索框（新开标签版）
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>全网代理入口</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f5f5f5}
#inp{width:80%;max-width:500px;padding:15px;font-size:16px;border:1px solid #ddd;border-radius:8px;margin-bottom:15px}
#go{padding:15px 40px;background:#007bff;color:white;border:0;border-radius:8px;font-size:16px}
</style>
</head>
<body>
<input id=inp placeholder="输入网址，如 google.com">
<button id=go>新标签打开</button>

<script>
let inp=document.getElementById('inp');
let go=document.getElementById('go');
go.onclick=()=>{
  let v=inp.value.trim();
  if(!v)return;
  if(!v.startsWith('http'))v='https://'+v;
  // 核心：新标签页打开代理链接
  window.open('/proxy?url='+encodeURIComponent(v), '_blank');
}
</script>
</body>
</html>
      `, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // 核心代理逻辑（完美适配新标签）
    if (url.pathname === "/proxy") {
      const target = url.searchParams.get("url");
      if (!target) return new Response("错误", { status:400 });
      return fetch(new Request(target, request));
    }

    return new Response("404", { status:404 });
  }
};
