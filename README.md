# League Akari Pages

League Akari 的静态站点。

## Dev

使用 `http://localhost:3000` 访问。

主页的最新版本、下载地址、Star 数与交流渠道会在浏览器中从 Akari API 动态加载。本地联调时先启动 API 的 `8788` 端口；如需改用其他地址，可在 `.env.local` 中设置：

```bash
NEXT_PUBLIC_AKARI_API_BASE_URL=http://localhost:8788
```
