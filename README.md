# Wanderlust
Explore the world on foot.

### 部署
#### 前置条件
- 数据在 [Strava](https://www.strava.com/dashboard)。
- 已注册 [Cloudflare](https://dash.cloudflare.com/)。
- 已注册 [Mapbox](https://account.mapbox.com/)。
 
#### 部署 Cloudflare Pages
- [Fork](https://github.com/ichibown/wanderlust/fork) 本项目。
- 在 Cloudflare [Dashboard](https://dash.cloudflare.com/) 左侧找到 **Workers & Pages** 打开，点击 **Create Application** 创建 Pages 项目，使用 **Connect to Git** 的方式选择上一步 Fork 的项目创建
- 部署完成，Cloudflare 会分配一个 `https://your-domain.pages.dev` 二级域名，即可访问。

#### 配置 Cloudflare Pages 
- 在 Cloudflare [Dashboard](https://dash.cloudflare.com/) 左侧找到 **Workers & Pages - KV** 打开，点击 **Create a namespace** 创建一个 KV 存储域。
- 在 **Workers & Pages** 页面找到上一步部署的项目点击进入配置页：
  - 在 **Settings - Environment variables** 中添加两个环境变量：
    - `BASE_URL`：上一步分配的二级域名 `https://your-domain.pages.dev`。
    - `PASSWORD`：自定义的访问密码。
    - `MAPBOX_TOKEN`：[Mapbox](https://account.mapbox.com/) 中的 Access Token。
  - 在 **Settings - Functions** 中找到 **KV namespace bindings**，名称填 `KV`，并选择上一步创建的 KV 存储域绑定。
  - 在 **Settings - Builds & Deployments** 中找到 **Build configurations**，确保 **Build command** 为 `VITE_MAPBOX_TOKEN=$MAPBOX_TOKEN npm run build`，**Build output directory** 为 `dist`。
  - 在 **Deployments** 找到最近一次部署，点击 `···` 中的 `Retry Deployment` 重新部署使配置生效。

#### 用户信息自定义 & 绑定 Strava
打开重新部署完成的 `https://your-domain.pages.dev`，点击头像弹出对话框：
- 这里可以修改头像、名称、签名。密码使用前面配置的 `PASSWORD`。
- 点击 **Strava Config** 会提示 Strava 未绑定：
  - 进入 [Strava API](https://www.strava.com/settings/api) 的管理页，点击 **Create an App** 创建一个 API 应用，其中 `Category` 选 `Data Importer`，`Authorization Callback Domain` 填自己的 `your-domain.pages.dev`（注意不带 https）。
  - 创建完成得到 `Client ID` 和 `Client Secret`，回到前面 **Strava Config** 对话框中填入，会跳转 Strava OAuth 认证，授权即可。
  - 绑定 Strava 完成后刷新页面，重新点头像进入 **Strava Config** 对话框，应当看到 Strava 配置成功。此时只输入密码，点击 `UPDATE OR SYNC` 即可同步 Strava 所有历史数据（首次同步等半分钟至少）。

#### 配置自动同步
- 回到 Cloudflare [Dashboard](https://dash.cloudflare.com/) 的 **Workers & Pages**，点击 **Create Application** 创建 Workers 项目，点击 **Create Worker** 然后部署。
- 回到  **Workers & Pages** 找到部署完成的 Worker 点击进入配置页：
  - 点击右上角 **Edit Code**，把项目代码中的 [sync.js](https://github.com/ichibown/wanderlust/blob/main/workers/sync.js) 粘贴进来，修改其中 `BASE_URL` 和 `PASSWORD` 为自己的值，保存并部署。
  - 点击 **Settings - Triggers**，找到 **Cron Triggers** 增加一个 Cron 触发器，建议频率为两小时同步一次。

***

### TODOs
- Backend
    - Data
        - [x] ~~CF D1: Database tables design.~~ Use KV instead.
        - [x] ~~CF D1 / R2: Fetch from Strava and import to D1.~~ Use KV instead.
    - API
        - [x] CF Pages Function: /strava/auth
        - [x] CF Pages Function: /strava/sync
        - [x] CF Pages Function: /config
        - [x] CF Pages Function: /home
        - [ ] CF pages Function: /query
- Frontend
    - Project
        - [x] Init: React + Tailwind + ReactMapGL
    - Components / Pages
        - [x] Map: Routes + Heatmap + Animating Route + Markers.
        - [x] Config: Auth + Sync + Config Editor.
        - [ ] Dashboard: Custom query.
        - [ ] Dashboard: User info.
        - [ ] Dashboard: Summary data chart.
        - [ ] Dashboard: Recent activites.
        - [ ] Dashboard: Personal bests.
        - [ ] Dashboard: Aerobic analytics.
        - [ ] Dashboard: Anaerobic analytics.
        - [ ] Dashboard: Custom query.
        - [ ] Detail: Detail info page. (Depends on .fit file from R2)
    - Nice To Have
        - [ ] Performace Opt: cache-control, create geojson in R2, etc.
        - [ ] Configurable dashboard card templates.
        - [ ] I18N.
        - [ ] Dark Mode.
        - [ ] Privacy mode.
        - [ ] PWA.
        - [ ] AIGC.
- Deployment
    - Serverless
        - [x] CF Pages & Functions & Workers.

