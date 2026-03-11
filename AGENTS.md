# AGENTS.md

## 1. 项目目标

本项目是基于 `vite-plugin-monkey` 的油猴脚本，用于替换 `weibo.com` 侧边栏热搜内容。

核心目标：

1. 复用微博现有热搜 API（5 个来源）
2. 基于用户偏好（关键词、开关）进行过滤
3. 渲染自定义热搜侧栏，隐藏原侧栏
4. 在 `document-start` 场景下保证启动安全与降级可用

## 2. 当前技术栈

- Vue 3 + TypeScript + Vueuse
- Pinia + @pinia/colada
- Axios
- Tailwind CSS
- openapi-typescript
- vite-plugin-monkey

## 3. 启动流程（必须遵守）

`src/main.ts` 采用如下顺序，不可颠倒：

1. **立即开始异步获取数据**（激进启动，不等待 DOM）
2. **`head` 出现后立刻注入自定义 CSS**（`style` 节点与 `head/body` 同级，挂在 `document.documentElement`）
3. **`body` 出现后再 mount Vue App**
4. **注册油猴菜单（后续接入）**

说明：

- `waitForHead` / `waitForBody` 由 `src/utils/init.ts` 提供
- 任何改动不得破坏上述启动顺序

## 4. API 与类型分层约定

### 4.1 OpenAPI 生成文件

- 生成文件位置：`src/api/schema.d.ts`
- 该文件为生成产物，**禁止手改**

### 4.2 分层职责

- `src/api/schema.d.ts`：外部契约类型（OpenAPI 原始类型）
- `src/api/*.ts`：每个 API 一个文件，负责请求实现
- `src/types/*.ts`：领域模型（归一化后的内部类型）
- `src/composables/*.ts`：组合多个 API 数据并做过滤/计算

结论：`openapi-typescript` 用于约束接口边界，业务逻辑使用手写领域类型，不直接依赖原始响应结构。

## 5. 热搜数据源

共 5 个接口：

- `/ajax/statuses/mineBand`（我的热搜）
- `/ajax/side/hotSearch`（默认热搜）
- `/ajax/statuses/entertainment`（文娱热搜）
- `/ajax/statuses/life`（生活热搜）
- `/ajax/statuses/social`（社会热搜）

## 6. 数据处理管线（目标实现）

推荐固定顺序：

1. fetch（并行请求）
2. normalize（映射成统一 `NormalizedHotItem`）
3. validate（运行时最小结构校验）
4. source filter（来源过滤）
5. keyword filter（关键词过滤）
6. dedupe（去重）
7. sort + limit（排序与截断）
8. render（渲染）

## 7. 存储策略

- `localStorage`：存每个 API 的历史快照缓存（滚动/限额）
- `GM_*`：存用户设置（关键词、开关、更新间隔等）

关键原则：

- 缓存尽量存“归一化后的源数据”，而不是最终派生结果
- 用户设置变化时应重新计算最终列表，而不是复用旧派生结果

## 8. Pinia / Colada / Axios 协作约定

- Axios：请求层（超时、拦截器、错误标准化）
- Pinia Colada：查询缓存层（响应式 `data/error/status`、失效、刷新）
- Pinia：应用级状态编排（设置与 UI 状态）

不冲突，推荐组合使用。

## 9. 代码组织建议

建议目录：

- `src/api/`：`client.ts`、`schema.d.ts`、各接口文件
- `src/composables/`：`useHotQueries.ts`、`useHotPipeline.ts`
- `src/types/`：`hot.ts`、`settings.ts`
- `src/stores/`：`settings.ts`、`hot.ts`
- `src/utils/`：`init.ts`、后续 storage 封装

## 10. 工程约束

1. TypeScript 严格模式已开启，禁止 `as any`、`@ts-ignore`
2. 生成文件与手写文件职责要清晰
3. 不在 `main.ts` 堆积业务逻辑，`main.ts` 只做启动编排
4. 任何新功能优先先补类型，再补 API，再补 composable，最后接 UI

## 11. 验证要求

每次关键改动后至少执行：

```bash
pnpm build
```

该命令包含 `vue-tsc -b` 与 `vite build`，用于类型与构建双重校验。

## 12. 近期开发优先级

1. 完成 Axios client 与 5 个 API 文件
2. 完成 normalize 与统一领域类型
3. 接入 Pinia Colada 查询与缓存策略
4. 完成过滤管线 composable
5. 最后完善侧栏 UI 与菜单交互
