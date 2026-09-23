"""Renders link-preview (Open Graph) images and PNG icons with headless Chrome.

Run: python3 scripts/generate-og.py      (needs Google Chrome; standard library only)

Writes:
  public/og/default.png          1200x630, used by every non-project page
  public/og/<slug>.png           1200x630, one per project (title, tagline, cover art)
  public/apple-touch-icon.png    180x180
  public/favicon-48.png          48x48 (PNG fallback for the SVG favicon)

Project data is read from src/content/projects.ts with a small regex parser, so re-run this
after adding or renaming a project.
"""
import html, os, re, shutil, subprocess, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC = os.path.join(ROOT, 'public')
CHROME_CANDIDATES = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    shutil.which('google-chrome') or '',
    shutil.which('chromium') or '',
]
CHROME = next((c for c in CHROME_CANDIDATES if c and os.path.exists(c)), None)

FONTS = f'''
@font-face {{ font-family: Inter; font-weight: 100 900;
  src: url(file://{ROOT}/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2) format('woff2'); }}
@font-face {{ font-family: Mono; font-weight: 100 800;
  src: url(file://{ROOT}/node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2) format('woff2'); }}
'''

BASE_CSS = FONTS + '''
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: #09090b; color: #fafafa; font-family: Inter, sans-serif; position: relative; -webkit-font-smoothing: antialiased; }
.dots { position: absolute; inset: 0; background-image: radial-gradient(#27272a 1.3px, transparent 1.3px); background-size: 24px 24px; opacity: .8;
        mask-image: radial-gradient(ellipse at 30% 30%, black 20%, transparent 75%); }
.glow { position: absolute; width: 900px; height: 600px; left: -200px; top: -320px; border-radius: 50%;
        background: radial-gradient(closest-side, rgba(52,211,153,.28), transparent); }
.eyebrow { font-family: Mono; font-size: 22px; letter-spacing: .16em; text-transform: uppercase; color: #a1a1aa; }
.eyebrow b { color: #34d399; font-weight: 400; }
.foot { position: absolute; left: 80px; bottom: 64px; display: flex; align-items: center; gap: 18px; font-size: 24px; color: #a1a1aa; }
.mark { width: 52px; height: 52px; border-radius: 12px; background: #fafafa; color: #09090b; display: grid; place-items: center;
        font-family: Mono; font-weight: 700; font-size: 20px; }
'''


def page(body: str, css: str = '') -> str:
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}{css}</style></head><body>{body}</body></html>'


def default_og(name: str, role: str, headline: str) -> str:
    return page(f'''
<div class="glow"></div><div class="dots"></div>
<div style="position:absolute;left:80px;top:96px;right:80px">
  <p class="eyebrow"><b>/</b> {html.escape(role)} · Windsor, ON</p>
  <h1 style="font-size:112px;font-weight:600;letter-spacing:-.04em;line-height:1;margin-top:28px">{html.escape(name)}<span style="color:#34d399">.</span></h1>
  <p style="font-size:34px;line-height:1.4;color:#a1a1aa;margin-top:32px;max-width:900px">{html.escape(headline)}</p>
</div>
<div class="foot"><div class="mark">ST</div>Projects · Experience · Contact</div>
''')


def project_og(title: str, tagline: str, kind: str, cover: str, name: str) -> str:
    return page(f'''
<div class="glow"></div><div class="dots"></div>
<div style="position:absolute;left:80px;top:88px;width:520px">
  <p class="eyebrow"><b>/</b> {html.escape(kind)} project</p>
  <h1 style="font-size:72px;font-weight:600;letter-spacing:-.035em;line-height:1.02;margin-top:26px">{html.escape(title)}</h1>
  <p style="font-size:28px;line-height:1.45;color:#a1a1aa;margin-top:26px">{html.escape(tagline)}</p>
</div>
<img src="file://{cover}" style="position:absolute;left:650px;top:120px;width:640px;border-radius:20px;border:1.5px solid #27272a;
     box-shadow:0 30px 80px rgba(0,0,0,.6)">
<div class="foot"><div class="mark">ST</div>{html.escape(name)}</div>
''')


def icon(size: int) -> str:
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}
* {{ margin:0 }} html, body {{ width:{size}px; height:{size}px; overflow:hidden; background:#09090b; }}
body {{ display:grid; place-items:center; font-family:Mono; font-weight:700; font-size:{round(size*0.42)}px; color:#34d399; letter-spacing:-.02em; }}
</style></head><body>ST</body></html>'''


def render(markup: str, out: str, width: int, height: int):
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False) as f:
        f.write(markup)
        src = f.name
    try:
        subprocess.run(
            [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
             '--allow-file-access-from-files', f'--window-size={width},{height}', '--virtual-time-budget=2000',
             f'--screenshot={out}', f'file://{src}'],
            check=True, capture_output=True, timeout=60,
        )
    finally:
        os.unlink(src)
    print('wrote', os.path.relpath(out, ROOT), f'({os.path.getsize(out) // 1024} KB)')


def read_content():
    site = open(os.path.join(ROOT, 'src/content/site.ts')).read()
    field = lambda src, key: re.search(rf"\b{key}:\s*'((?:[^'\\]|\\.)*)'", src).group(1).replace("\\'", "'")
    projects_src = open(os.path.join(ROOT, 'src/content/projects.ts')).read()
    projects = []
    for block in re.split(r'\n  \{\n', projects_src)[1:]:
        projects.append({
            'slug': field(block, 'slug'), 'title': field(block, 'title'), 'type': field(block, 'type'),
            'tagline': field(block, 'tagline'), 'src': field(block, 'src'),
        })
    return field(site, 'name'), field(site, 'role'), field(site, 'headline'), projects


def main():
    if not CHROME:
        raise SystemExit('Google Chrome or Chromium is required.')
    name, role, headline, projects = read_content()
    os.makedirs(os.path.join(PUBLIC, 'og'), exist_ok=True)
    render(default_og(name, role, headline), os.path.join(PUBLIC, 'og/default.png'), 1200, 630)
    for p in projects:
        cover = os.path.join(PUBLIC, p['src'].lstrip('/'))
        kind = 'Hackathon' if p['type'] == 'hackathon' else 'Personal'
        render(project_og(p['title'], p['tagline'], kind, cover, name), os.path.join(PUBLIC, f"og/{p['slug']}.png"), 1200, 630)
    render(icon(180), os.path.join(PUBLIC, 'apple-touch-icon.png'), 180, 180)
    render(icon(48), os.path.join(PUBLIC, 'favicon-48.png'), 48, 48)


if __name__ == '__main__':
    main()
