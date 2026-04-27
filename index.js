export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页保持不变
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>推特/X专属代理</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000}
#inp{width:80%;max-width:500px;padding:15px;font-size:16px;border:1px solid #333;border-radius:8px;margin-bottom:15px;background:#111;color:#fff}
#go{padding:15px 40px;background:#1d9bf0;color:white;border:0;border-radius:8px;font-size:16px}
</style>
</head>
<body>
<input id=inp value="x.com" style="text-align:center">
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

    // 【推特/X终极破解核心】
    if (url.pathname === "/proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return new Response("参数错误", { status:400 });

      // 1. 强制伪装成苹果Safari浏览器（推特最信任的浏览器）
      const safariUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

      // 2. 深度复刻浏览器安全环境，带上所有必须头
      const proxyHeaders = new Headers(request.headers);
      proxyHeaders.set("User-Agent", safariUA);
      proxyHeaders.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
      proxyHeaders.set("Accept-Language", "en-US,en;q=0.9");
      proxyHeaders.set("Sec-Fetch-Mode", "navigate");
      proxyHeaders.set("Sec-Fetch-Dest", "document");
      proxyHeaders.set("Upgrade-Insecure-Requests", "1");
      proxyHeaders.delete("Origin");
      proxyHeaders.delete("Referer");

      // 3. 强制开启Cookie跟随、自动跳转、关闭所有安全校验
      try {
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: proxyHeaders,
          body: request.body,
          redirect: "follow",
          credentials: "include",
          mode: "cors"
        });

        // 4. 返回给浏览器时，彻底放开跨域限制，解决前端JS报错
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Access-Control-Allow-Origin", "*");
        newHeaders.set("Access-Control-Allow-Credentials", "true");

        return new Response(response.body, {
          status: response.status,
          headers: newHeaders
        });
      } catch (e) {
        return new Response("加载失败", { status:500 });
      }
    }

    return new Response("404", { status:404 });
  }
};
