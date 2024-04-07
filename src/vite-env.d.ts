/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly m_version: string;

  // 更多环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
