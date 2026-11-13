/**
 * Obscura Omni-Nexus v1.4 - Zero-Cache Edge-Smart Cloudflare Worker Router
 * ========================================================================
 * Permanent Gemini Connected Apps URL:
 *   https://obscura-mcp-forever.forested-lung.workers.dev/mcp
 * Reads LIVE_MCP_URL.json via the 0-cache GitHub Contents API and executes catalog
 * lookups in 0ms at the Cloudflare Edge while routing V8/CDP/MCP calls to the Cloud VM!
 */
const GITHUB_API_LIVE_JSON_URL = "https://api.github.com/repos/alisyyed/obscura-mcp-omni-cloud/contents/LIVE_MCP_URL.json?ref=main";
const GITHUB_RAW_LIVE_JSON_URL = "https://raw.githubusercontent.com/alisyyed/obscura-mcp-omni-cloud/main/LIVE_MCP_URL.json";
const GITHUB_DISPATCH_URL = "https://api.github.com/repos/alisyyed/obscura-mcp-omni-cloud/actions/workflows/obscura_mcp_cloud.yml/dispatches";
const AUTO_WAKE_GH_TOKEN = "";
const EDGE_CURATED_TOOLS = [{"name": "obscura_doctor_and_status", "description": "[Obscura Omni-Nexus] Check health of the 24/7 Obscura Cloud MCP Relay, Zero-Cache Edge Router, installed `obscura` and `obscura-worker` Rust/V8 binaries, and CDP/MCP readiness.", "inputSchema": {"type": "object", "properties": {}}}, {"name": "obscura_list_37_mcp_and_cdp_tools", "description": "[Obscura Omni-Nexus] Browse or search all `h4ckf0r0day/obscura` capabilities (`cli_modes`, `mcp_37_browser_tools`, `cdp_10_domains`, `performance_and_privacy`).", "inputSchema": {"type": "object", "properties": {"category": {"type": "string", "description": "Optional category filter (`cli_modes`, `mcp_37_browser_tools`, `cdp_10_domains`, `performance_and_privacy`)."}, "search": {"type": "string", "description": "Optional keyword filter (e.g. 'screenshot', 'pdf', 'forms', 'scrape', 'cdp')."}}}}, {"name": "obscura_fetch_and_eval", "description": "[Obscura Omni-Nexus] Fetch and render a URL using `obscura fetch <url>` (V8 JavaScript execution) and either evaluate a JS expression (`--eval`), dump `links` / `html` / `text` / `assets`, or extract clean Markdown.", "inputSchema": {"type": "object", "properties": {"url": {"type": "string", "description": "Target HTTP/HTTPS URL to fetch and render in Obscura V8."}, "dump_mode": {"type": "string", "description": "Dump mode: 'text' (default), 'links', 'html', 'assets', or 'eval'."}, "eval_js": {"type": "string", "description": "Optional JavaScript expression to evaluate in V8 (e.g. 'document.title' or 'Array.from(document.querySelectorAll(\"h1,h2\")).map(e=>e.textContent)')."}, "stealth": {"type": "boolean", "description": "Enable Obscura `--stealth` tracker-blocking mode (default: false)."}}, "required": ["url"]}}, {"name": "obscura_parallel_scrape", "description": "[Obscura Omni-Nexus] Scrape multiple URLs in parallel using `obscura scrape` (`obscura-worker` pool) with optional V8 `--eval` extraction and structured JSON output.", "inputSchema": {"type": "object", "properties": {"urls": {"type": "array", "items": {"type": "string"}, "description": "List of URLs to scrape concurrently."}, "eval_js": {"type": "string", "description": "JavaScript expression to evaluate on each page (default: 'document.title')."}, "concurrency": {"type": "integer", "description": "Number of parallel worker processes (default: 5, max: 25)."}}, "required": ["urls"]}}, {"name": "obscura_render_screenshot_or_pdf", "description": "[Obscura Omni-Nexus] Render a webpage using Obscura's native Rust layout/paint engine (`obscura fetch --screenshot`) and return capture metadata, dimensions, SHA-256, and base64 preview.", "inputSchema": {"type": "object", "properties": {"url": {"type": "string", "description": "Target URL to render."}}, "required": ["url"]}}, {"name": "obscura_call_native_mcp_tool", "description": "[Obscura Omni-Nexus] Invoke any of Obscura's 37 built-in `obscura mcp` tools (`browser_navigate`, `browser_snapshot`, `browser_extract`, `browser_detect_forms`, `browser_evaluate`, etc.) via the stateful `obscura mcp` bridge.", "inputSchema": {"type": "object", "properties": {"tool_name": {"type": "string", "description": "Obscura MCP tool name (e.g. 'browser_navigate', 'browser_snapshot', 'browser_extract', 'browser_detect_forms', 'browser_evaluate')."}, "arguments": {"type": "object", "description": "Arguments dictionary for the selected `browser_*` tool."}}, "required": ["tool_name"]}}, {"name": "obscura_cdp_script_generator", "description": "[Obscura Omni-Nexus] Generate ready-to-run Playwright (`connectOverCDP`), Puppeteer (`browserWSEndpoint`), or Docker Compose scripts wired to `obscura serve --port 9222`.", "inputSchema": {"type": "object", "properties": {"framework": {"type": "string", "description": "'playwright', 'puppeteer', 'docker_compose', or 'mcp_config'."}, "target_url": {"type": "string", "description": "Target URL for the generated automation script."}}, "required": ["framework"]}}, {"name": "obscura_hexa_engine_bridge", "description": "[Obscura Omni-Nexus] Coordinate a 6-way pipeline combining `Obscura` (`obscura-omni-nexus`), `Craft-Anything` (`craft-anything-omni-foundry`), `Radare2` (`radare2-omni-nexus`), `Ghidra` (`ghidra-omni-nexus`), `Hex-Rays IDA` (`ida-hexrays-omni-nexus`), and `LLM4Decompile` (`llm4decompile-omni-nexus`).", "inputSchema": {"type": "object", "properties": {"workflow_goal": {"type": "string", "description": "Goal to execute across all 6 connected 24/7 Cloud MCP engines."}}, "required": ["workflow_goal"]}}];
const EDGE_CATALOG = {"cli_modes": {"title": "Obscura 4 Core CLI Modes (`obscura` + `obscura-worker` Rust/V8 Engine)", "repo_url": "https://github.com/h4ckf0r0day/obscura", "site_url": "https://www.obscura.sh/", "items": ["obscura fetch <url> [--eval <js>] [--dump links|html|text|assets|original] [--screenshot out.png] [--wait-until networkidle0] [--timeout <sec>]", "obscura scrape <url1> <url2> ... [--concurrency 25] [--eval <js>] [--format json] [--quiet]", "obscura serve [--port 9222] [--stealth] [--workers N] [--worker-max-connections N] [--worker-max-rss MB]", "obscura mcp [--http --host 0.0.0.0 --port 8080] [--stealth] [--storage-dir <dir>] (Exposes 37 Playwright-compatible MCP tools)"]}, "mcp_37_browser_tools": {"title": "Obscura Built-In 37 MCP Browser Tools (`obscura mcp`)", "repo_url": "https://github.com/h4ckf0r0day/obscura/tree/main/skills/obscura", "items": ["browser_navigate (Navigate active tab to URL with optional waitUntil)", "browser_navigate_back / browser_navigate_forward / browser_reload (History navigation)", "browser_snapshot (Capture structured accessibility/DOM snapshot of current page)", "browser_extract (Extract structured text, links, tables, or CSS-selected elements)", "browser_detect_forms (Automatically discover all forms, inputs, selects, and submit buttons)", "browser_fill_form (Batch-fill multiple form fields by selector or label)", "browser_click / browser_dblclick / browser_hover (Dispatch trusted mouse events `event.isTrusted = true`)", "browser_type / browser_press_key / browser_select_option / browser_check / browser_uncheck (Input interaction)", "browser_evaluate (Execute arbitrary JavaScript in V8 context and return serialized result)", "browser_wait_for_selector / browser_wait_for_load_state / browser_wait_for_timeout (Synchronization)", "browser_take_screenshot (Render viewport or full-page PNG via Obscura native Rust renderer)", "browser_pdf (Export A4/Letter raster PDF directly without Chromium)", "browser_get_markdown (Convert live DOM to clean Markdown via LP.getMarkdown)", "browser_network_requests / browser_console_messages (Inspect captured XHR/fetch traffic and console logs)", "browser_get_cookies / browser_set_cookies / browser_clear_cookies (Cookie jar management)", "browser_storage_state / browser_set_storage_state (Export/import Cookie + localStorage auth state JSON)", "browser_tab_list / browser_tab_new / browser_tab_switch / browser_tab_close (Multi-tab orchestration)", "browser_set_viewport / browser_set_extra_headers / browser_close (Session configuration)"]}, "cdp_10_domains": {"title": "Obscura Chrome DevTools Protocol (CDP) Surface (Puppeteer & Playwright Drop-In)", "repo_url": "https://github.com/h4ckf0r0day/obscura", "items": ["Target (createTarget, closeTarget, attachToTarget, createBrowserContext, disposeBrowserContext)", "Page (navigate, getFrameTree, lifecycleEvents, captureScreenshot, startScreencast, stopScreencast, printToPDF)", "Runtime (evaluate, callFunctionOn, getProperties, addBinding)", "DOM (getDocument, querySelector, querySelectorAll, getOuterHTML, resolveNode)", "Network (enable, setCookies, getCookies, setExtraHTTPHeaders, setUserAgentOverride)", "Fetch (enable, continueRequest, fulfillRequest, failRequest, takeResponseBodyAsStream)", "IO (read, close - chunked streaming for large response bodies)", "Storage (getCookies, setCookies, deleteCookies)", "Input (dispatchMouseEvent, dispatchKeyEvent with native isTrusted=true)", "LP (getMarkdown - native fast DOM-to-Markdown conversion)"]}, "performance_and_privacy": {"title": "Obscura Architecture Benchmarks & Privacy Features", "repo_url": "https://github.com/h4ckf0r0day/obscura-benchmark", "items": ["Memory Footprint: ~26-30 MB peak RSS (vs 200+ MB for Headless Chrome)", "Page Load Latency: 51 ms static HTML / 84 ms JS+XHR / 78 ms dynamic scripts", "Binary Size: ~70 MiB self-contained Rust + V8 binary (`obscura` + `obscura-worker`)", "Tracker Blocking: 3,520 analytics/telemetry domains blocked automatically in `--stealth` mode", "SSRF Guard: Blocks private/internal network IPs by default (override with `--allow-private-network` for local dev)"]}};

async function triggerGithubAutoWake() {
  if (!AUTO_WAKE_GH_TOKEN) return false;
  try {
    const r = await fetch(GITHUB_DISPATCH_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + AUTO_WAKE_GH_TOKEN,
        "Accept": "application/vnd.github+json",
        "User-Agent": "Obscura-Permanent-Router/1.4",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ref: "main" })
    });
    return r.status === 204 || r.status === 200;
  } catch (_) {
    return false;
  }
}

async function getLatestTunnelUrl() {
  if (AUTO_WAKE_GH_TOKEN) {
    try {
      const apiRes = await fetch(GITHUB_API_LIVE_JSON_URL + "&t=" + Date.now(), {
        headers: {
          "Authorization": "Bearer " + AUTO_WAKE_GH_TOKEN,
          "Accept": "application/vnd.github.raw+json",
          "User-Agent": "Obscura-Permanent-Router/1.4",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      });
      if (apiRes.ok) {
        return await apiRes.json();
      }
    } catch (_) {}
  }
  const res = await fetch(GITHUB_RAW_LIVE_JSON_URL + "?t=" + Date.now(), {
    headers: { "User-Agent": "Obscura-Permanent-Router/1.4" }
  });
  if (!res.ok) throw new Error("Could not fetch LIVE_MCP_URL.json: HTTP " + res.status);
  return await res.json();
}

async function handleEdgeFallbackJsonRpc(body, upstreamErr, liveData) {
  const rpcId = body && body.id !== undefined ? body.id : 1;
  const method = (body && body.method) || "";
  const params = (body && body.params) || {};

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: rpcId,
      result: {
        protocolVersion: "2025-03-26",
        capabilities: { tools: { listChanged: true } },
        serverInfo: { name: "Obscura-OmniNexus", version: "1.4.0" }
      }
    };
  }

  if (method === "notifications/initialized" || method.startsWith("notifications/")) {
    return { jsonrpc: "2.0", id: rpcId, result: {} };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: rpcId,
      result: { tools: EDGE_CURATED_TOOLS }
    };
  }

  if (method === "tools/call") {
    const tName = params.name || "";
    const tArgs = params.arguments || {};

    if (tName === "obscura_list_37_mcp_and_cdp_tools") {
      const catFilter = String(tArgs.category || "").trim().toLowerCase();
      const qFilter = String(tArgs.search || "").trim().toLowerCase();
      const out = {};
      for (const [k, v] of Object.entries(EDGE_CATALOG)) {
        if (catFilter && catFilter !== k) continue;
        const matched = v.items.filter((item) => !qFilter || item.toLowerCase().includes(qFilter) || v.title.toLowerCase().includes(qFilter));
        if (matched.length > 0) {
          out[k] = { title: v.title, repo_url: v.repo_url, count: matched.length, items: matched };
        }
      }
      return {
        jsonrpc: "2.0",
        id: rpcId,
        result: { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] }
      };
    }

    if (tName === "obscura_doctor_and_status") {
      return {
        jsonrpc: "2.0",
        id: rpcId,
        result: {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "LIVE_EDGE_AND_CLOUD_HYBRID",
              router_version: "Obscura Omni-Nexus v1.4 Zero-Cache Edge-Smart Router",
              repository: "https://github.com/h4ckf0r0day/obscura",
              website: "https://www.obscura.sh/",
              backend_relay_state: liveData || { status: "ROTATING_OR_WAKING", detail: String(upstreamErr || "") }
            }, null, 2)
          }]
        }
      };
    }

    return {
      jsonrpc: "2.0",
      id: rpcId,
      result: {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "CLOUD_RELAY_BOOTING_OR_WAKING",
            tool_requested: tName,
            message: "Your 24/7 GitHub Cloud Relay for h4ckf0r0day/obscura is waking (~25s). Repeat this tool call shortly!",
            detail: String(upstreamErr || "")
          }, null, 2)
        }]
      }
    };
  }

  return { jsonrpc: "2.0", id: rpcId, result: {} };
}

export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Session-Id, Last-Event-ID"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    let parsedBody = null;
    let rawBodyBuffer = undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      rawBodyBuffer = await request.arrayBuffer();
      try {
        parsedBody = JSON.parse(new TextDecoder().decode(rawBodyBuffer));
      } catch (_) {}
    }

    if (parsedBody && (
      parsedBody.method === "initialize" ||
      parsedBody.method === "notifications/initialized" ||
      parsedBody.method === "tools/list" ||
      (parsedBody.method === "tools/call" && parsedBody.params && parsedBody.params.name === "obscura_list_37_mcp_and_cdp_tools")
    )) {
      return new Response(JSON.stringify(await handleEdgeFallbackJsonRpc(parsedBody, null, null)), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    let live = null;
    try {
      live = await getLatestTunnelUrl();
      const mcpUrl = String((live && live.mcp_url) || "").trim();
      if (!mcpUrl.startsWith("https://")) {
        throw new Error("LIVE_MCP_URL.json mcp_url is not a full https:// URL yet: " + JSON.stringify(mcpUrl));
      }
      const targetBase = (live.gui_url && String(live.gui_url).startsWith("https://") ? live.gui_url : mcpUrl.replace(/\/mcp$/, "")).replace(/\/$/, "");
      const targetUrl = targetBase + url.pathname + url.search;

      if (request.method === "GET" && (url.pathname === "/status" || url.pathname === "/router-status")) {
        return new Response(JSON.stringify({
          router: "Obscura Omni-Nexus v1.4 Zero-Cache Edge-Smart Router",
          active_backend_mcp_url: live.mcp_url,
          active_backend_gui_url: live.gui_url,
          updated_at: live.updated_at
        }, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      const proxyReq = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: rawBodyBuffer,
      });
      const resp = await fetch(proxyReq);
      if (resp.status === 530 || resp.status === 502) {
        await triggerGithubAutoWake();
        throw new Error("Upstream tunnel rotated (HTTP " + resp.status + ") - triggered Auto-Wake!");
      }
      const newHeaders = new Headers(resp.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      return new Response(resp.body, { status: resp.status, headers: newHeaders });
    } catch (err) {
      await triggerGithubAutoWake();
      if (parsedBody) {
        return new Response(JSON.stringify(await handleEdgeFallbackJsonRpc(parsedBody, err, live)), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({
        status: "AUTO_WAKING_CLOUD_RELAY",
        router: "Obscura Omni-Nexus v1.4 Zero-Cache Edge-Smart Router",
        repository: "https://github.com/h4ckf0r0day/obscura",
        live_json_state: live,
        message: "Signaled your 24/7 Obscura GitHub Cloud Relay to wake (~25s).",
        error: String(err)
      }, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
