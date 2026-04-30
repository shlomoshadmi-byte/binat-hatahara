import { describe, expect, it } from "vitest";
import { DEFAULT_APP_CONFIG } from "@/lib/config/defaults";
import { safeParseAppConfig } from "@/lib/config/schema";

describe("app config schema", () => {
  it("accepts the bundled default config", () => {
    expect(safeParseAppConfig(DEFAULT_APP_CONFIG).success).toBe(true);
  });

  it("rejects configs whose active preset is missing", () => {
    const result = safeParseAppConfig({
      ...DEFAULT_APP_CONFIG,
      activePresetId: "missing",
    });

    expect(result.success).toBe(false);
  });
});
