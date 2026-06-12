# 高度人才 1 号转 2 号材料清单

一个纯静态网页工具，用来按条件生成日本高度专业职 1 号转 2 号的材料准备清单。

## 推荐上线方式

### 方案 A：Cloudflare Pages

适合想要免费、稳定、自动 HTTPS 的发布。上线后会得到一个免费的 `项目名.pages.dev` 域名。

1. 把 `hsp2-checklist` 放到 GitHub 仓库。
2. Cloudflare Dashboard 里进入 Pages，连接 GitHub 仓库。
3. Build command 留空。
4. Build output directory 填 `/`。
5. 保存后部署。

### 方案 B：GitHub Pages

适合最少操作。上线后会得到 `用户名.github.io/仓库名`。

1. 把本目录作为仓库根目录推到 GitHub。
2. 仓库 Settings -> Pages。
3. Source 选择 GitHub Actions。
4. 推送到 `main` 后自动发布。

### 方案 C：Docker

适合自己的服务器、NAS、VPS，或先本地试跑。

```bash
docker compose up -d --build
```

打开：

```text
http://localhost:8080
```

### 方案 D：Jenkins

适合你已经有 Jenkins 和 Docker 的机器。

1. 新建 Pipeline Job。
2. 指向这个仓库。
3. Jenkinsfile 路径填 `Jenkinsfile`。
4. 运行后会把站点发布到 Jenkins 机器的 `8080` 端口。

## 域名建议

真正免费的独立顶级域名不建议作为正式入口，容易回收、限制多、信誉不稳定。推荐先用平台免费子域名：

- Cloudflare Pages: `项目名.pages.dev`
- GitHub Pages: `用户名.github.io/仓库名`
- Vercel: `项目名.vercel.app`
- Netlify: `项目名.netlify.app`

后续需要正式品牌感时，再买一个便宜域名并绑定到 Cloudflare Pages。
