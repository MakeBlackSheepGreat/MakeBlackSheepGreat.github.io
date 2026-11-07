"""按站点实际用字生成 MiSans webfont 子集。

用法（需要先 pnpm build，脚本从构建产物里取字符集）：
    python scripts/build-fonts.py

字重：Regular(400) 与 DemiBold（在 CSS 里声明覆盖 500-700）。
华文厂商字体（HarmonyOS Sans / OPPO Sans / vivo Sans）在对应设备上已预装，
不生成 webfont，仅在字体栈里按设备匹配。
"""

import glob
import html
import os
import re

from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "docs", ".vitepress", "dist")
OUT_DIR = os.path.join(ROOT, "docs", "public", "fonts")

# 本机安装的 MiSans（WPS 附带）
SRC_FONTS = {
    "misans-regular.woff2": r"C:\Users\876762330\AppData\Roaming\kingsoft\office6\docerFonts\MiSans.ttf",
    "misans-demibold.woff2": r"C:\Users\876762330\AppData\Roaming\kingsoft\office6\docerFonts\MiSans DemiBold.ttf",
}

EXTRA_CHARS = (
    "　、。，．？！；：（）〔〕【】《》〈〉「」『』“”‘’—…·～＋－×÷=%¥$@#&*+/\\|<>[]{}"
    "0123456789"
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ".,:;!?()[]{}<>\"'`~^_-=+*/\\|@#$%&"
)


def collect_chars() -> set:
    chars = set(EXTRA_CHARS)
    pages = glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True)
    for path in pages:
        text = open(path, encoding="utf-8", errors="ignore").read()
        text = re.sub(r"<script.*?</script>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<style.*?</style>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        chars |= set(html.unescape(text))
    for ch in ("\n", "\t", "\r", "\u00a0"):
        chars.discard(ch)
    return chars


def make_subset(src: str, dst: str, chars: set) -> tuple:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.drop_tables += ["DSIG"]

    font = subset.load_font(src, options)
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[ord(c) for c in chars if ord(c) > 0x1F])
    subsetter.subset(font)
    subset.save_font(font, dst, options)
    font.close()
    return os.path.getsize(src), os.path.getsize(dst)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    chars = collect_chars()
    print(f"站点用字去重后：{len(chars)} 个字符")
    for name, src in SRC_FONTS.items():
        if not os.path.isfile(src):
            print(f"跳过 {name}：找不到源字体 {src}")
            continue
        dst = os.path.join(OUT_DIR, name)
        before, after = make_subset(src, dst, chars)
        print(f"{name}: {before / 1024 / 1024:.1f} MB -> {after / 1024:.0f} KB")


if __name__ == "__main__":
    main()
