# Prepara as embalagens reais pro catálogo impresso: recorta pela transparência, tira a franja branca
# do recorte (sangra a cor da borda pra dentro da área transparente e fecha 1 px do alfa) e amplia as fotos
# pequenas (Esmalte) com reamostragem de qualidade. Saída: emb/<nome>.png
import numpy as np, sys
from PIL import Image, ImageFilter
SRC = "/home/user/tintas-laet-site/identidade/embalagens/"
EMB = {"emborrachada": "emborrachada-remove-bg-io.png", "lavavel": "premiumlavavel-remove-bg-io.png", "pisos": "pisos efachadas-remove-bg-io.png",
       "epoxi": "epoxibaseagua.png", "standard": "standard-remove-bg-io.png", "profissional": "profissional-remove-bg-io.png",
       "gesso": "direto no gesso-remove-bg-io.png", "vinil": "vinil-remove-bg-io.png", "esmalte": "esmalteecologico-removebg-preview.png",
       "verniz": "verniz-premium-remove-bg-io.png", "barrica": "barrica-remove-bg-io.png", "saco": "massaplastico.png",
       "seladora": "seladora-removebg-preview.png", "fundo": "fundo_preparador-removebg-preview.png"}
def sangrar(rgb, a, passes=6):
    rgb = rgb.copy(); ok = a > 200
    for _ in range(passes):
        soma = np.zeros_like(rgb); n = np.zeros(a.shape)
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)):
            m = np.roll(np.roll(ok, dy, 0), dx, 1); c = np.roll(np.roll(rgb, dy, 0), dx, 1)
            soma += c * m[..., None]; n += m
        novo = (~ok) & (n > 0); rgb[novo] = soma[novo] / n[novo][:, None]; ok = ok | novo
    return rgb
for k, f in EMB.items():
    im = Image.open(SRC + f).convert("RGBA")
    a = np.array(im.split()[3]); bb = Image.fromarray(((a > 12) * 255).astype(np.uint8)).getbbox(); im = im.crop(bb)
    if im.height < 1000:                                     # foto pequena: amplia em 2 etapas
        for _ in range(2): im = im.resize((im.width * 3 // 2, im.height * 3 // 2), Image.LANCZOS)
        rgb, al = im.convert("RGB"), im.split()[3]
        rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2)); im = Image.merge("RGBA", (*rgb.split(), al))
    arr = np.array(im).astype(float); rgb, a = arr[..., :3], arr[..., 3]
    rgb = sangrar(rgb, a)
    al = Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.array(al)]).astype(np.uint8), "RGBA")
    out = out.crop(Image.fromarray(((np.array(al) > 12) * 255).astype(np.uint8)).getbbox())
    out.save("emb/" + k + ".png", optimize=True); print(k, out.size)
