import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `data/reports/` é lido em runtime com um caminho computado
  // (`fs.readdir(REPORTS_DIR)`), não importado estaticamente — o
  // rastreador de arquivos do Next não o descobre sozinho. Sem isto,
  // o build local funciona mas a função serverless na Vercel sobe sem
  // os relatórios e toda leitura falha em produção.
  outputFileTracingIncludes: {
    "/": ["./data/reports/**"],
    "/api/reports": ["./data/reports/**"],
  },
};

export default nextConfig;
