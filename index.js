// 已精准配置：shuttle.proxy.rlwy.net:2961
const YOUR_PROXY_SERVER = "http://shuttle.proxy.rlwy.net:2961";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页入口（你访问w.im6.qzz.io就是这个页面）
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>爸爸专属中转代理</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a}
#inp{width:80%;max-width:500px;padding:16px;font-size:16px;border:1px solid #334155;border-radius:10px;margin-bottom:18px;background:#1e293b;color:#f8fafc;outline:none}
#go{padding:16px 45px;background:#2563eb;color:white;border:0;border-radius:10px;font-size:16px;font-weight:bold}
</style>
</head>
<body>
<input id=inp placeholder="输入 x.com / bbc.com" style="text-align:center">
<button id=go>新标签打开</button>
<script>
let inp=document.getElementById('inp');
let go=document.getElementById('go');
go.onclick=()=>{
  let v=inp.value.trim();
  if(!v.startsWith('http'))v='https://'+v;
  window.open('/proxy?url='+encodeURIComponent(v), '_blank');
}
</script>
</body>
</html>
`, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // 核心中转：自动转发到你的服务器 shuttle.proxy.rlwy.net:2961
    if (url.pathname === "/proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return new Response("参数错误", { status:400 });

      // 完整转发请求到你的代理服务器
      const proxyReq = new Request(`${YOUR_PROXY_SERVER}?url=${encodeURIComponent(targetUrl)}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow"
      });

      return fetch(proxyReq);
    }

    return new Response("404 Not Found", { status:404 });
  }
};
