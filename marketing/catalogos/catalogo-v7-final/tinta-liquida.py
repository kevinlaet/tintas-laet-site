# Tinta líquida brilhante (faixas de tinta escorrendo, com volume e reflexo), feita por código — sem IA e sem
# imagem de banco. Cores da paleta oficial. Uso: python3 -I tinta-liquida.py <largura_px> <altura_px> <saida.png> [semente] [topo]
#  topo = "onda": borda de cima ondulada (a tinta "chega" de baixo) | "cheio": ocupa tudo
import sys, json, numpy as np
from PIL import Image

W, H, OUT = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
SEED = int(sys.argv[4]) if len(sys.argv) > 4 else 7
TOPO = sys.argv[5] if len(sys.argv) > 5 else "onda"
rng = np.random.default_rng(SEED)
PAL = {c["nome"]: c["hex"] for c in json.load(open("/home/user/tintas-laet-site/identidade/cores/paleta-oficial.json"))["linhas"]["paleta-grande"]["cores"]}
NOMES = ["Lícor de Laranja", "Amarelo Dourado", "Paraíso do Mar", "Flamingo Real", "Fogo Violeta", "Romã", "Céu Sagrado", "Tangerina"]
CORES = np.array([[int(PAL[n][i:i + 2], 16) / 255 for i in (1, 3, 5)] for n in NOMES], np.float32)
FUNDO = np.array([0x07, 0x1A, 0x3D], np.float32) / 255     # vão entre as faixas: azul-marinho bem escuro

s = W / 2550                                                # escala (2550 px = página inteira a 300 dpi)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
def ondas(px, py, n, amp, esc):
    t = np.zeros_like(px)
    for _ in range(n):
        a = rng.uniform(0, np.pi); k = rng.uniform(.6, 1.6) / (esc * s); f = rng.uniform(0, 6.28)
        t += amp * s * rng.uniform(.5, 1) * np.sin((px * np.cos(a) + py * np.sin(a)) * k + f)
    return t
# campo de fluxo com dupla distorção (dá o "redemoinho" de tinta)
wx = ondas(x, y, 5, 160, 900); wy = ondas(x, y, 5, 160, 900)
qx, qy = x + wx, y + wy
f = qx * 0.55 + qy * 0.83 + ondas(qx, qy, 6, 210, 520) + ondas(qx, qy, 5, 70, 210)
LARG = 230 * s                                              # largura média de cada faixa
b = f / LARG; idx = np.floor(b).astype(np.int64); t = b - idx
G = 0.055                                                    # fração do vão
u = np.clip((t - G / 2) / (1 - G), 0, 1)
dentro = (t > G / 2) & (t < 1 - G / 2)
e = np.clip(np.minimum(t - G / 2, 1 - G / 2 - t), 0, None) * LARG
h = np.where(dentro, 1 - np.exp(-e / (16 * s)), 0).astype(np.float32)   # camada de tinta: topo liso, borda arredondada (menisco)
# borda suave da faixa (sem serrilhado): mistura com o vão
borda = np.clip(np.minimum(t - G / 2, 1 - G / 2 - t) * LARG / 2.2, 0, 1)
cor = CORES[(idx * 5 + 3) % len(CORES)]
# gotas soltas nos vãos
gh = np.zeros_like(h); gc = np.zeros((H, W, 3), np.float32); gm = np.zeros_like(h)
for _ in range(int(26 * (W * H) / (2550 * 1300))):
    cx, cy = rng.uniform(0, W), rng.uniform(H * .12, H); r = rng.uniform(7, 22) * s
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / r
    dome = 1 - np.exp(-np.clip(1 - d, 0, None) * r / (6 * s)); m = (dome > 0) & (h < 0.05)
    gh = np.where(m, np.maximum(gh, dome * .9), gh); gc[m] = CORES[rng.integers(len(CORES))]; gm = np.maximum(gm, np.clip((1 - d) * r / 1.6, 0, 1) * m)
h = np.maximum(h, gh); cor = np.where(gm[..., None] > 0, gc, cor); borda = np.maximum(borda, gm)
# borda de cima ondulada (a "frente" da tinta), com lábio arredondado
if TOPO == "onda":
    ye = H * .10 + ondas(x[0:1], np.zeros_like(x[0:1]), 4, 55, 700)
    d = (y - ye) / (26 * s)
    lip = 1 - np.exp(-np.clip(y - ye, 0, None) / (16 * s)); h = np.minimum(np.maximum(h, .0), lip) * (y > ye)
    borda = np.where(y > ye + 2 * s, borda, np.clip(borda, 0, 1))
    alfa = np.clip((y - ye) / 1.5 + .5, 0, 1)
else:
    alfa = np.ones_like(h)
# ondulação leve na superfície da tinta (o reflexo "corre" como em tinta molhada)
rip = ondas(qx, qy, 5, 1, 150) + .6 * ondas(qx, qy, 4, 1, 60)
h = h + .045 * rip * np.clip(h, 0, 1) ** 2
# luz: difusa + reflexo de estúdio (softbox) pelo vetor refletido + brilho pontual
k = 34 * s
gy, gx = np.gradient(h * k)
n = np.dstack([-gx, -gy, np.ones_like(h)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
def nrm(v): v = np.array(v, np.float32); return v / np.linalg.norm(v)
L1 = nrm([-.45, -.65, .62]); Hh1 = nrm(L1 + [0, 0, 1])
dif = np.clip(n @ L1, 0, 1)
nz = n[..., 2]; Rx, Ry = 2 * nz * n[..., 0], 2 * nz * n[..., 1]
env = (np.exp(-((Ry + .42) / .07) ** 2) * 1.05 + np.exp(-((Rx - .48) / .05) ** 2) * .45 + np.exp(-((Ry - .55) / .12) ** 2) * .18)
spec = np.clip(n @ Hh1, 0, 1) ** 160 * 1.2 + env
ao = .30 + .70 * np.clip(h, 0, 1) ** .35
base = cor * borda[..., None] + FUNDO * (1 - borda[..., None])
fres = .06 + .10 * (1 - nz)                                  # bordas refletem mais
rgb = base * (.40 + .72 * dif[..., None]) * ao[..., None] + (spec * (.55 + fres))[..., None] * borda[..., None]
rgb = np.clip(rgb, 0, 1)
Image.fromarray(np.dstack([rgb * 255, alfa * 255]).astype(np.uint8), "RGBA").save(OUT, optimize=True)
print("ok", OUT, W, H)
