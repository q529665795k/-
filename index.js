export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页（新标签打开模式不变）
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>终极代理</title>
<style>
body{margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f5f5f5}
#inp{width:80%;max-width:500px;padding:15px;font-size:16px;border:1px solid #ddd;border-radius:8px;margin-bottom:15px}
#go{padding:15px 40px;background:#007bff;color:white;border:0;border-radius:8px;font-size:16px}
</style>
</head>
<body>
<input id=inp placeholder="输入 x.com / bbc.com">
<button id=go>新标签打开</button>
<script>
let inp=document.getElementById('inp');
let go=document.getElementById('go');
go.onclick=()=>{
  let v=inp.value.trim();
  if(!v)return;
  if(!v.startsWith('http'))v='https://'+v;
  window.open('/proxy?url='+encodeURIComponent(v), '_blank');
}
</script>
</body>
</html>
`, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // 【终极套娃版】代理核心
    if (url.pathname === "/proxy") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl) return new Response("参数错误", { status:400 });

      // 1. 随机切换浏览器指纹，不固定UA
      const uaList = [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Android 14; Mobile) Chrome/125.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0 Safari/537.36"
      ];
      const randomUA = uaList[Math.floor(Math.random() * uaList.length)];

      // 2. 强制超时、强制跟随跳转、禁用跨域限制
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 20000);

      // 3. 复刻所有请求细节，连Referer、Cookie、缓存全带上
      const newHeaders = new Headers(request.headers);
      newHeaders.set("User-Agent", randomUA);
      newHeaders.set("Accept", "*/*");
      newHeaders.set("Accept-Language", "en-US,en;q=0.5");
      newHeaders.set("Cache-Control", "no-cache");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.delete("Origin");
      newHeaders.delete("Referer");

      try {
        return await fetch(targetUrl, {
          method: request.method,
          headers: newHeaders,
          body: request.body,
          redirect: "follow",
          signal: controller.signal,
          mode: "no-cors"
        });
      } catch (e) {
        return new Response("连接失败", { status:500 });
      }
    }

    return new Response("404", { status:404 });
  }
};
