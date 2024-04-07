import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import envPlugin from 'vite-plugin-environment';
import dayjs from 'dayjs';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
    ]
  },
  plugins: [
    react(),
    envPlugin({
      // 版本号 (自动生成版本号,显示到页面上)
      "m_version": dayjs().tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm:ss")
    }),
    VitePWA({
      workbox: {
        // 扩充筛选的规则 (默认是 js,css,html)
        globPatterns: ["**/*.{js,css,html,ico,jpg,png,svg}"],
      },
      // 关闭自动注入 Manifest使用到的 icons, 
      //(否则会和 globPatterns 重复, 注入了两遍图片)
      includeManifestIcons: false,
      registerType: 'autoUpdate',
      manifest: {
        name:"my-timer",
        short_name:"my-timer",
        lang: 'zh-cn',
        icons: [
          {
            "src": "favicon.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
          },
          {
            "src": "logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "logo512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        background_color: "#000000",
        theme_color: "#000000"
      }
    }),
    //

  ],
})
