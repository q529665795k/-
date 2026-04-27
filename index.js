// ✅ 精准匹配你的 Railway 代理：shuttle.proxy.rlwy.net:29613 long/123456
const PROXY_HOST = "shuttle.proxy.rlwy.net";
const PROXY_PORT = 29613;
const PROXY_USER = "long";
const PROXY_PASS = "123456";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页入口：w.im6.qzz.io（不变）
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>免费服务器专属加速代理</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0a0e17}
#inp{width:80%;max-width:500px;padding:18px;font-size:16px;border:1px solid #223047;border-radius:12px;margin-bottom:20px;background:#111827;color:#e2e8f0;outline:none}
#go{padding:18px 50px;background:#1d4ed8;color:white;border:0;border-radius:12px;font-size:16px;font-weight:bold}
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

    // ✅ 核心：Workers 直接请求你的 Railway 代理
    if (url.pathname === "/proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return new Response("参数错误", { status:400 });

      // 拼接 Railway HTTP代理完整地址（带认证）
      const proxyAuth = btoa(`${PROXY_USER}:${PROXY_PASS}`);
      const fullProxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}/${targetUrl}`;

      // 直接请求Railway代理，完美适配Cloudflare
      const response = await fetch(fullProxyUrl, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers),
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
        },
        redirect: "follow"
      });

      // 放行跨域，解决加载不全问题
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      return new Response(response.body, { status: response.status, headers: newHeaders });
    }

    return new Response("404 Not Found", { status:404 });
  }
};
