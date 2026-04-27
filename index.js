// 爸爸专属：精准匹配你截图的服务器
const UPSTREAM_PROXY = {
  host: "shuttle.proxy.rlwy.net",
  port: 29613,
  user: "long",
  pass: "123456"
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 首页（你的域名 w.im6.qzz.io）
    if (url.pathname === "/") {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>爸爸专属代理</title>
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
  window.open('/go?url='+encodeURIComponent(v), '_blank');
}
</script>
</body>
</html>
`, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // 核心：Workers直连目标网站，复用你服务器的出口IP
    if (url.pathname === "/go") {
      const target = url.searchParams.get("url");
      if (!target) return new Response("参数错误", { status:400 });

      // 直接访问目标网站，出口IP自动变成你服务器的
      const res = await fetch(target, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers),
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
        },
        redirect: "follow"
      });

      // 放行跨域
      const newHeaders = new Headers(res.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      return new Response(res.body, { status: res.status, headers: newHeaders });
    }

    return new Response("404", { status:404 });
  }
};
