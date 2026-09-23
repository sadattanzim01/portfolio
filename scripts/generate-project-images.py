"""Builds the project images in public/images/projects/ (used by cards, detail pages and OG images).

Run: python3 scripts/generate-project-images.py        (needs Google Chrome and cwebp: `brew install webp`)
     python3 scripts/generate-project-images.py devlens  (only some slugs)

For every project in src/content/projects.ts:
  1. If assets/screenshots/<slug>.(png|jpg|jpeg|webp) exists, the screenshot is framed in a window
     on a branded 16:9 canvas (settings per project in FRAMES below).
  2. Otherwise, if a drawn placeholder exists in PLACEHOLDERS, that illustration is used.
Each project gets <slug>.webp (1600x900) and <slug>-800.webp (800x450).

To use a new screenshot: drop it in assets/screenshots/<slug>.png and re-run this script, then
scripts/generate-og.py so the link-preview image matches.
"""
import html, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'assets', 'screenshots')
OUT = os.path.join(ROOT, 'public', 'images', 'projects')
W, H = 1600, 900

CHROME = next((c for c in ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                           shutil.which('google-chrome') or '', shutil.which('chromium') or ''] if c and os.path.exists(c)), None)
CWEBP = shutil.which('cwebp')

# Per-project framing. `title` goes in the window bar (None = the screenshot already has one).
# `caption` (eyebrow, headline) is used for very wide screenshots so the canvas isn't mostly empty;
# keep captions to facts visible in the screenshot itself. `crop_width` trims empty space on the right (source px).
FRAMES = {
    'pr-pilot': {'title': 'pr-pilot · logs', 'caption': ('Production logs', 'PR opened → review posted in 20 seconds'),
                 'crop_width': 1540},
    'classifyflow': {'title': 'n8n · ClassifyFlow', 'caption': ('n8n workflow', '51 requests triaged by Claude, end to end')},
    'booknotes': {'title': 'localhost:3000 · BookNOTES'},
    'devlens': {'title': 'DevLENS · dashboard'},
    'myadvice': {'title': None},
    'intersteller-highway': {'title': 'Intersteller Highway · Plan Trade Route'},
}

FONTS = f'''
@font-face {{ font-family: Inter; font-weight: 100 900;
  src: url(file://{ROOT}/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2) format('woff2'); }}
@font-face {{ font-family: Mono; font-weight: 100 800;
  src: url(file://{ROOT}/node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2) format('woff2'); }}
'''

CANVAS_CSS = FONTS + f'''
* {{ margin: 0; box-sizing: border-box; }}
html, body {{ width: {W}px; height: {H}px; overflow: hidden; background: #08090a; color: #f4f4f5; font-family: Inter, sans-serif;
             -webkit-font-smoothing: antialiased; }}
.bg {{ position: absolute; inset: 0; background:
        radial-gradient(closest-side at 28% 18%, rgba(52,211,153,.24), transparent),
        radial-gradient(closest-side at 82% 92%, rgba(45,212,191,.12), transparent); }}
.dots {{ position: absolute; inset: 0; background-image: radial-gradient(#25292b 1.4px, transparent 1.4px); background-size: 28px 28px;
         mask-image: radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%); }}
.stage {{ position: absolute; inset: 0; display: grid; place-items: center; }}
.col {{ display: flex; flex-direction: column; gap: 44px; }}
.eyebrow {{ font-family: Mono; font-size: 22px; letter-spacing: .16em; text-transform: uppercase; color: #a1a1aa; }}
.eyebrow b {{ color: #34d399; font-weight: 400; }}
.headline {{ font-size: 54px; font-weight: 600; letter-spacing: -.03em; margin-top: 14px; }}
.win {{ border-radius: 18px; overflow: hidden; background: #111314; border: 1px solid rgba(255,255,255,.09);
        box-shadow: 0 60px 140px -40px rgba(0,0,0,.85), 0 0 0 1px rgba(0,0,0,.5); }}
.bar {{ height: 46px; display: flex; align-items: center; gap: 9px; padding: 0 18px; background: #16191a;
        border-bottom: 1px solid rgba(255,255,255,.07); }}
.bar i {{ width: 12px; height: 12px; border-radius: 50%; background: #3a3f42; }}
.bar span {{ margin-left: 12px; font-family: Mono; font-size: 16px; color: #8b9096; }}
.win img {{ display: block; }}
'''


def image_size(path):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path], capture_output=True, text=True, check=True).stdout
    return int(re.search(r'pixelWidth: (\d+)', out).group(1)), int(re.search(r'pixelHeight: (\d+)', out).group(1))


def framed(shot, cfg):
    full_w, h = image_size(shot)
    w = min(cfg.get('crop_width', full_w), full_w)
    bar = 46 if cfg.get('title') else 0
    caption = cfg.get('caption')
    cap_h = 44 + 30 + 14 + 66 if caption else 0  # gap + eyebrow + spacing + headline
    max_w, max_h = W * 0.86, H - 2 * 70 - bar - cap_h
    scale = min(max_w / w, max_h / h)
    iw, ih = round(w * scale), round(h * scale)
    bar_html = (f'<div class="bar"><i></i><i></i><i></i><span>{html.escape(cfg["title"])}</span></div>' if cfg.get('title') else '')
    cap_html = (f'<div><p class="eyebrow"><b>/</b> {html.escape(caption[0])}</p><p class="headline">{html.escape(caption[1])}</p></div>'
                if caption else '')
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CANVAS_CSS}</style></head><body>
<div class="bg"></div><div class="dots"></div>
<div class="stage"><div class="col" style="width:{iw}px">{cap_html}
  <div class="win">{bar_html}<div style="width:{iw}px;height:{ih}px;overflow:hidden">
    <img src="file://{shot}" width="{round(full_w * scale)}" height="{ih}"></div></div>
</div></div></body></html>'''


# ---------- Drawn placeholders for projects without a screenshot yet ----------

def snaprag():
    docs = [('PDF', '#34d399'), ('PNG', '#a1a1aa'), ('DOCX', '#a1a1aa')]
    doc_html = ''.join(f'''
      <div style="position:absolute;left:{i*26}px;top:{i*34}px;width:250px;height:310px;border-radius:14px;background:#151819;
                  border:1px solid rgba(255,255,255,.09);box-shadow:0 30px 60px -30px rgba(0,0,0,.8);padding:26px">
        <span style="font-family:Mono;font-size:15px;padding:5px 10px;border-radius:8px;background:rgba(255,255,255,.05);color:{c}">{t}</span>
        {''.join(f'<div style="height:10px;border-radius:5px;background:#24282a;margin-top:{26 if j == 0 else 14}px;width:{[190,160,200,120,175,140][j]}px"></div>' for j in range(6))}
      </div>''' for i, (t, c) in enumerate(reversed(docs)))
    dots = ''.join(f'<i style="width:10px;height:10px;border-radius:50%;background:{"#34d399" if (k * 7) % 5 == 0 else "#2c3134"}"></i>'
                   for k in range(20))
    bubble = lambda side, inner, bg, fg: (f'<div style="align-self:{side};max-width:420px;padding:18px 22px;border-radius:18px;'
                                          f'background:{bg};color:{fg};font-size:21px;line-height:1.45">{inner}</div>')
    chips = ''.join(f'<span style="font-family:Mono;font-size:14px;padding:4px 10px;border-radius:8px;background:rgba(52,211,153,.12);'
                    f'color:#34d399;margin-right:8px">{c}</span>' for c in ['[1] report.pdf', '[2] scan.png'])
    answer = ('<div style="display:grid;gap:10px">'
              + ''.join(f'<div style="height:10px;border-radius:5px;background:#3a3f42;width:{w}px"></div>' for w in [330, 300, 250])
              + f'<div style="margin-top:8px">{chips}</div></div>')
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CANVAS_CSS}</style></head><body>
<div class="bg"></div><div class="dots"></div>
<div style="position:absolute;left:170px;top:250px;width:320px;height:400px">{doc_html}</div>
<div style="position:absolute;left:600px;top:390px;display:grid;grid-template-columns:repeat(5,10px);gap:12px">{dots}</div>
<svg style="position:absolute;left:520px;top:300px" width="620" height="300" fill="none" stroke-width="2.5">
  <path d="M0 150 C 40 150, 50 150, 70 150" stroke="#34d399" stroke-dasharray="6 7"/>
  <path d="M170 150 C 230 150, 250 150, 310 150" stroke="#34d399" stroke-dasharray="6 7"/>
</svg>
<div class="win" style="position:absolute;left:840px;top:190px;width:600px">
  <div class="bar"><i></i><i></i><i></i><span>snaprag · chat</span></div>
  <div style="display:flex;flex-direction:column;gap:18px;padding:30px 28px 34px">
    {bubble('flex-end', 'Summarize the key points across these files.', '#34d399', '#022c22')}
    {bubble('flex-start', answer, '#1b1f20', '#f4f4f5')}
  </div>
</div>
</body></html>'''


PLACEHOLDERS = {'snaprag': snaprag}


def render(markup, out_png):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False) as f:
        f.write(markup)
        page = f.name
    try:
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        '--allow-file-access-from-files', f'--window-size={W},{H}', '--virtual-time-budget=2000',
                        f'--screenshot={out_png}', f'file://{page}'], check=True, capture_output=True, timeout=90)
    finally:
        os.unlink(page)


def to_webp(png, slug):
    big = os.path.join(OUT, f'{slug}.webp')
    small = os.path.join(OUT, f'{slug}-800.webp')
    subprocess.run([CWEBP, '-quiet', '-q', '88', '-m', '6', png, '-o', big], check=True)
    with tempfile.TemporaryDirectory() as tmp:
        small_png = os.path.join(tmp, 'small.png')
        subprocess.run(['sips', '-Z', '800', png, '--out', small_png], check=True, capture_output=True)
        subprocess.run([CWEBP, '-quiet', '-q', '88', '-m', '6', small_png, '-o', small], check=True)
    return os.path.getsize(big) // 1024, os.path.getsize(small) // 1024


def project_slugs():
    src = open(os.path.join(ROOT, 'src/content/projects.ts')).read()
    return re.findall(r"^\s{4}slug: '([\w-]+)'", src, flags=re.M)


def main():
    if not (CHROME and CWEBP):
        raise SystemExit('Needs Google Chrome and cwebp (brew install webp).')
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    for slug in project_slugs():
        if only and slug not in only:
            continue
        shot = next((os.path.join(SHOTS, f'{slug}.{ext}') for ext in ('png', 'jpg', 'jpeg', 'webp')
                     if os.path.exists(os.path.join(SHOTS, f'{slug}.{ext}'))), None)
        if shot:
            markup, source = framed(shot, FRAMES.get(slug, {'title': slug})), 'screenshot'
        elif slug in PLACEHOLDERS:
            markup, source = PLACEHOLDERS[slug](), 'placeholder'
        else:
            print(f'{slug:22} SKIPPED: add assets/screenshots/{slug}.png or a PLACEHOLDERS entry')
            continue
        with tempfile.TemporaryDirectory() as tmp:
            png = os.path.join(tmp, 'full.png')
            render(markup, png)
            big, small = to_webp(png, slug)
        print(f'{slug:22} {source:11} 1600w {big} KB · 800w {small} KB')


if __name__ == '__main__':
    main()
