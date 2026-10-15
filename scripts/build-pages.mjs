import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const result = spawnSync(process.execPath, [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), "build"], {
  stdio: "inherit",
  windowsHide: true,
  env: {
    ...process.env,
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    NEXT_PUBLIC_BASE_PATH: "/artem-shuvalov-portfolio",
    NEXT_PUBLIC_SITE_URL: "https://tem0key.github.io/artem-shuvalov-portfolio/",
    NEXT_TELEMETRY_DISABLED: "1",
  },
});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync(new URL("../out/.nojekyll", import.meta.url), "");
