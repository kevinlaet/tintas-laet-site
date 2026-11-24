# Pincelada amarela "de verdade" feita por código (sem IA): faixa contínua que atravessa os 5 slides.
# Gera faixa.png (5400x1350, fundo transparente). Cerdas = ruído 1D no sentido transversal; bordas e final
# "secos" = cerdas acabando em comprimentos diferentes; relevo da tinta iluminado (difusa + brilho) pra parecer
# tinta molhada e lisa, sem falha nem descascado.
import numpy as np
from PIL import Image
import os, sys

rng = np.random.default_rng(27)
S = 2                       # supersampling
W, H = 5400, 1350
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "faixa.png")
AM = np.array([0xF5, 0xB8, 0x00], float) / 255

def ease(a, b, x0, x1, x):
    t = np.clip((x - x0) / (x1 - x0), 0, 1); t = t * t * (3 - 2 * t); return a + (b - a) * t

def ruido1d(n, periodo):
    k = max(2, int(n / periodo) + 3); pts = rng.standard_normal(k)
    xs = np.linspace(0, k - 1, n); i = np.floor(xs).astype(int); f = xs - i; f = f * f * (3 - 2 * f)
    i2 = np.minimum(i + 1, k - 1); return pts[i] * (1 - f) + pts[i2] * f

def blur(a, r):
    # 3 passadas de média móvel ≈ gaussiana
    for ax in (0, 1):
        for _ in range(3):
            c = np.cumsum(np.pad(a, [(r + 1, r) if d == ax else (0, 0) for d in range(2)], mode="edge"), axis=ax)
            a = (np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax) - np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)) / (2 * r + 1)
    return a

def traco(x0, x1, centro, espessura, seco_ini=0.03, seco_fim=0.16, dy=0):
    """Desenha um traço de x0 a x1 (px do panorama). Devolve (rgb, alfa) do panorama inteiro em 1x."""
    xa, xb = max(0, x0 - 40), min(W, x1 + 40)
    X = np.arange(xa * S, xb * S) / S
    c = centro(X) + dy; t = espessura(X)
    ys = np.arange(0, H * S) / S
    Y, CX = np.meshgrid(ys, c, indexing="ij"); T = np.broadcast_to(t, Y.shape)
    u = np.broadcast_to((X - x0) / (x1 - x0), Y.shape)
    v = (Y - CX) / (T / 2)                        # -1..1 dentro do traço
    vp = (Y - CX) + 2.5 * np.sin(u * 9)            # posição transversal em px (cerdas ondulam de leve)
    # cerdas: ruído transversal em 3 escalas
    L = int(1200 * S); base = np.arange(L) / S - 600
    def amostra(periodo, amp):
        n = ruido1d(L, periodo * S); return amp * np.interp(vp, base, n)
    cerda = amostra(1.4, .4) + amostra(4.5, .35) + amostra(20, .3) + amostra(70, .2)
    cerda = (cerda - cerda.min()) / (np.ptp(cerda) + 1e-9)
    # borda irregular (topo e base com ruídos diferentes)
    nt = np.interp(X, X, ruido1d(len(X), 90 * S) * .03 + ruido1d(len(X), 23 * S) * .012 + ruido1d(len(X), 4 * S) * .006)
    nb = np.interp(X, X, ruido1d(len(X), 90 * S) * .03 + ruido1d(len(X), 23 * S) * .012 + ruido1d(len(X), 4 * S) * .006)
    borda = np.where(v < 0, 1 + nt[None, :], 1 + nb[None, :])
    av = np.abs(v) / borda
    # limiar: 0 no miolo; sobe na borda e nas pontas -> cerdas acabam em comprimentos diferentes (pincel seco)
    thr = np.clip((av - .80) / .24, 0, 1) ** 1.6
    thr = np.maximum(thr, np.clip((seco_ini - u) / max(seco_ini, 1e-6), 0, 1) ** .8)
    thr = np.maximum(thr, np.clip((u - (1 - seco_fim)) / seco_fim, 0, 1) ** 1.6)
    m = np.clip((cerda + .04 - thr) * 14, 0, 1) * (av < 1.08)
    # relevo: tinta lisa com estrias suaves + cordão de tinta na borda
    alt = m * (.65 + .3 * cerda) + .16 * m * np.exp(-((1 - np.minimum(av, 1)) / .05) ** 2)
    alt = blur(alt, 1)
    gy, gx = np.gradient(alt * 4)
    n = np.stack([-gx, -gy, np.ones_like(gx)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    Lz = np.array([-.4, -.6, .7]); Lz /= np.linalg.norm(Lz)
    hv = Lz + np.array([0, 0, 1.]); hv /= np.linalg.norm(hv)
    dif = np.clip(n @ Lz, 0, 1); esp = np.clip(n @ hv, 0, 1) ** 46
    cor = AM / .93 * (.52 + .55 * dif)[..., None] + (.55 * esp)[..., None]
    # leve variação de tom (tinta real não é chapada)
    tom = 1 + .025 * np.interp(np.broadcast_to(X, Y.shape), X, ruido1d(len(X), 300 * S))
    cor = np.clip(cor * tom[..., None] if tom.ndim == 2 else cor, 0, 1)
    # reduz pra 1x
    def red(a): return a.reshape(H, S, -1, S, *a.shape[2:]).mean(axis=(1, 3))
    rgb, al = red(cor), red(m)
    full_rgb = np.zeros((H, W, 3)); full_a = np.zeros((H, W))
    full_rgb[:, xa:xb] = rgb; full_a[:, xa:xb] = al
    return full_rgb, full_a

# Trajeto: capa grossa e baixa (atrás das latas) -> desce pra faixa de vitrine dos slides 2–5 -> acaba seca no 6.
def centro(x): return ease(880, 598, 760, 1170, x) + 10 * np.sin(x / 520)
def esp(x): return ease(380, 232, 760, 1170, x)

camadas = [traco(-120, 2700, centro, esp, seco_ini=.0, seco_fim=.07),
           traco(2560, 5330, centro, lambda x: esp(x) * .97, seco_ini=.02, seco_fim=.13, dy=6)]
rgb = np.zeros((H, W, 3)); a = np.zeros((H, W))
for c, al in camadas:                     # "por cima": o segundo traço cobre o fim do primeiro
    rgb = c * al[..., None] + rgb * (1 - al[..., None]); a = al + a * (1 - al)
out = np.dstack([np.clip(rgb / np.maximum(a, 1e-6)[..., None], 0, 1) * 255, a * 255]).astype(np.uint8)
Image.fromarray(out, "RGBA").save(OUT); print("ok", OUT)
