# mf-dashboard-tests

[English](README.md) | [Русский](README.ru.md)

Репозиторий для проверки [mf-dashboard](https://github.com/megahoma/mf-dashboard).

Шелл, меню, три виджета и общий remote `shared`. React 19, TypeScript, Rsbuild, Module Federation 2. Экраны показывают статический текст и пропы. Внешних запросов нет.

![Шелл на localhost: меню, shared и виджеты 1–3](media/mf-dashboard-tests.png)

## Схема

Браузер открывает `shell` на порту 3000. Стрелка означает загрузку в рантайме. Хост читает `mf-manifest.json` на порту remote, затем `remoteEntry.js`, на который указывает манифест, и рендерит expose `./Widget`. Каждый такой рендер обёрнут в свой `Suspense` и `RemoteBoundary`. Проп `className` необязателен. Подпись на стрелке показывает второй проп, который передаёт родитель.

```mermaid
flowchart TB
  shell["shell · :3000<br/>host only, no expose<br/>consumeTypes"]
  menu["menu · :3004<br/>expose ./Widget"]
  widget1["widget1 · :3001<br/>expose ./Widget"]
  widget2["widget2 · :3002<br/>expose ./Widget"]
  widget3["widget3 · :3003<br/>expose ./Widget"]
  shared["shared · :3005<br/>expose ./Widget<br/>no remotes"]

  shell -->|"menu/Widget<br/>items"| menu
  shell -->|"shared/Widget<br/>label"| shared
  shell -->|"widget1/Widget<br/>title"| widget1
  shell -->|"widget2/Widget<br/>title"| widget2
  shell -->|"widget3/Widget<br/>title"| widget3
  menu -->|"shared/Widget<br/>label"| shared
  widget1 -->|"shared/Widget<br/>label"| shared
  widget1 -->|"widget3/Widget<br/>title"| widget3
  widget2 -->|"shared/Widget<br/>label"| shared
  widget3 -->|"shared/Widget<br/>label"| shared
```

На странице шелла `shared` рисуется шесть раз: из шелла, из меню, из каждого из трёх виджетов и ещё раз из `widget3`, который загружает `widget1`. Это отдельные рендеры одного remote.

Продюсер с `generateTypes` публикует `@mf-types.zip`. Потребитель с `consumeTypes` копирует архив в свой каталог `@mf-types/<remote>`. После правки `shared` копии обновляются, когда `shared` заново собирает архив, а потребители его скачивают. В собственном архиве потребителя описаны его пропы. Пропы `shared` туда не попадают. Шелл архив не публикует.

```mermaid
flowchart LR
  sharedZip["shared<br/>@mf-types.zip"]
  widget3Zip["widget3<br/>@mf-types.zip"]
  widget1Zip["widget1<br/>@mf-types.zip"]
  widget2Zip["widget2<br/>@mf-types.zip"]
  menuZip["menu<br/>@mf-types.zip"]

  sharedZip --> menuTypes["menu/@mf-types/shared"]
  sharedZip --> widget1Shared["widget1/@mf-types/shared"]
  sharedZip --> widget2Shared["widget2/@mf-types/shared"]
  sharedZip --> widget3Shared["widget3/@mf-types/shared"]
  sharedZip --> shellShared["shell/@mf-types/shared"]
  widget3Zip --> widget1Widget3["widget1/@mf-types/widget3"]
  widget3Zip --> shellWidget3["shell/@mf-types/widget3"]
  widget1Zip --> shellWidget1["shell/@mf-types/widget1"]
  widget2Zip --> shellWidget2["shell/@mf-types/widget2"]
  menuZip --> shellMenu["shell/@mf-types/menu"]
```

## Требования

- Node.js 20.19 или новее
- pnpm 10.34.5

```bash
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install
```

## Запуск

```bash
pnpm dev
```

`pnpm dev` поднимает все шесть серверов. Порты фиксированы. В `remotes` указан `http://127.0.0.1:<port>/mf-manifest.json`. Страницы открываются и по `localhost`.

| Приложение | URL | Роль |
|---|---|---|
| shell | http://localhost:3000 | Хост |
| widget-1 | http://localhost:3001 | Грузит shared и widget-3 |
| widget-2 | http://localhost:3002 | Грузит shared |
| widget-3 | http://localhost:3003 | Грузит shared |
| menu | http://localhost:3004 | Грузит shared |
| shared | http://localhost:3005 | Remote нет |

На http://localhost:3000 видны Menu, Shared from shell, Widget 1 from shell, Widget 2 from shell и Widget 3 from shell. У Widget 1 также есть Widget 3 from widget 1 и Shared from widget 1. Меню показывает Shared from menu и пункты Overview, Widgets, Settings. Widget 2 показывает Shared from widget 2. Оба экземпляра Widget 3 показывают Shared from widget 3. Этих строк нет в HTML, который отдаёт `curl`: они появляются после загрузки remote.

В `.vscode/settings.json` уже записаны шесть приложений для MF Dashboard. Ключ записи совпадает с именем контейнера. `path` указывает каталог приложения, `manifestPath` равен `/mf-manifest.json`, скрипт запуска равен `dev`.

Проверка типов:

```bash
pnpm typecheck
```

Сборка:

```bash
pnpm build
```
