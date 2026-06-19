"""诊断支持 - 允许用户下载集成诊断信息"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_URL, CONF_MODE, CONF_ICON, CONF_REQUIRE_ADMIN, CONF_PROXY_ACCESS


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """返回配置项的诊断信息"""
    options = dict(entry.options)

    # 脱敏：隐藏 URL 中的用户名密码（如 http://user:pass@host）
    url = options.get(CONF_URL, "")
    if "@" in url and "://" in url:
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            if parsed.username:
                options[CONF_URL] = url.replace(
                    f"{parsed.username}:{parsed.password or ''}@",
                    "***@",
                )
        except Exception:
            options[CONF_URL] = "***"

    return {
        "entry": {
            "title": entry.title,
            "version": entry.version,
            "entry_id": entry.entry_id,
        },
        "options": options,
        "mode_labels": {
            "0": "默认",
            "1": "全屏",
            "2": "新页面",
            "3": "内置页面",
        },
    }
