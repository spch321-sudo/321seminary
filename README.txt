321學神院 App v1.1.3 部署說明
1. 把本資料夾內全部檔案上傳到 GitHub 儲存庫 spch321-sudo/321seminary 的根目錄（覆蓋舊檔）。
2. Settings → Pages → 選 main 分支 → 儲存，網址為 https://spch321-sudo.github.io/321seminary/
3. 預設身分碼（不分大小寫）：組長 LEAD321、助教 TA321、負責人 HEAD321。
   更換方式：以負責人身分進入「資料中心 → 身分碼雜湊產生器」，把雜湊值貼到 index.html 的 CONFIG.codes。
4. 學期開始日：index.html 的 CONFIG.termStart（第1週的星期一），目前為 2026-10-05。
5. 課程 App 清單：index.html 開頭的 APPS 陣列，新增 App 時加一行（id、cat、name、url、desc）；課程的 link 填該 id，課程頁就會出現「開啟課程 App」按鈕。
6. 每次改版請同時修改 CONFIG.version 與 sw.js 第一行的 CACHE 版本號，使用者才會拿到新版。
