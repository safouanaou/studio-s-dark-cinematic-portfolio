"""Generate the editable collateral shown in the Studio S. portfolio."""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "output" / "pdf"
FOS_DIR = ROOT / "collateral" / "fos"
KINU_DIR = ROOT / "collateral" / "kinu"

PAPER = HexColor("#F1EADC")
BLUE = HexColor("#1E48D7")
ORANGE = HexColor("#EF5C32")
ROAST = HexColor("#1D211C")
WASHI = HexColor("#F3F1EB")
SUMI = HexColor("#11110F")
SEAL = HexColor("#BD3D2B")
STONE = HexColor("#77766F")


def register_fonts():
    bodoni = "/System/Library/Fonts/Supplemental/Bodoni 72 Smallcaps Book.ttf"
    if Path(bodoni).exists():
        pdfmetrics.registerFont(TTFont("StudioDisplay", bodoni))
    else:
        pdfmetrics.registerFont(TTFont("StudioDisplay", "/System/Library/Fonts/Supplemental/Georgia.ttf"))
    pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))


def setup_dirs():
    for directory in (PDF_DIR, FOS_DIR, KINU_DIR):
        directory.mkdir(parents=True, exist_ok=True)


def draw_text(c, text, x, y, font="Helvetica", size=9, color=ROAST, align="left"):
    c.setFillColor(color)
    c.setFont(font, size)
    if align == "center":
        c.drawCentredString(x, y, text)
    elif align == "right":
        c.drawRightString(x, y, text)
    else:
        c.drawString(x, y, text)


def draw_rule(c, x1, y, x2, color, width=0.45):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y, x2, y)


def menu_item(c, y, name, detail, price, x=24 * mm, right=186 * mm, ink=ROAST):
    draw_text(c, name, x, y, "StudioDisplay", 11.5, ink)
    draw_text(c, price, right, y, "Helvetica", 8, ink, "right")
    draw_text(c, detail, x, y - 4.2 * mm, "Helvetica", 6.6, ink)
    return y - 11.5 * mm


def fos_menu_pdf(path):
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    c.setTitle("FOS Cafe - Print Menu")
    c.setAuthor("Studio S.")
    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.rect(0, height - 24 * mm, width, 24 * mm, stroke=0, fill=1)
    draw_text(c, "FOS.", 18 * mm, height - 16 * mm, "StudioDisplay", 24, PAPER)
    draw_text(c, "COFFEE - BAKES - ALL-DAY PLATES", width - 18 * mm, height - 15 * mm, "Helvetica-Bold", 6.2, PAPER, "right")
    draw_text(c, "VOLDERSTRAAT 12 - GENT", width - 18 * mm, height - 19 * mm, "Helvetica", 5.6, PAPER, "right")

    draw_text(c, "A short menu,", 20 * mm, height - 46 * mm, "StudioDisplay", 32, ROAST)
    draw_text(c, "done properly.", 20 * mm, height - 58 * mm, "StudioDisplay", 32, ORANGE)
    draw_text(c, "Morning to afternoon - dine in or take away", width - 20 * mm, height - 57 * mm, "Helvetica", 6.4, ROAST, "right")
    draw_rule(c, 20 * mm, height - 67 * mm, width - 20 * mm, ROAST)

    columns = [20 * mm, 108 * mm]
    section_y = height - 79 * mm
    for col, title, number in [(columns[0], "COFFEE", "01"), (columns[1], "KITCHEN", "02")]:
        draw_text(c, number, col, section_y, "Helvetica-Bold", 6.5, BLUE)
        draw_text(c, title, col + 12 * mm, section_y, "Helvetica-Bold", 7, ROAST)
        draw_rule(c, col, section_y - 4 * mm, col + 78 * mm, ROAST)

    y = section_y - 12 * mm
    for name, detail, price in [
        ("Espresso", "House roast - chocolate - hazelnut", "3.20"),
        ("Flat white", "Double espresso - silky milk", "4.20"),
        ("Filter", "Single origin - brewed fresh", "4.50"),
        ("Seasonal latte", "Ask us what is pouring", "5.20"),
        ("Tea", "Black - green - herbal", "4.00"),
    ]:
        y = menu_item(c, y, name, detail, price, columns[0], columns[0] + 78 * mm)

    y = section_y - 12 * mm
    for name, detail, price in [
        ("Ricotta toast", "Sourdough - lemon ricotta - fruit - hot honey", "12.50"),
        ("Soft eggs", "Brown butter - herbs - rye toast", "11.00"),
        ("Market focaccia", "Roast vegetables - stracciatella - leaves", "13.50"),
        ("Granola bowl", "Cultured yoghurt - grains - seasonal compote", "9.50"),
        ("Soup + bread", "The day's vegetables - sourdough", "10.00"),
    ]:
        y = menu_item(c, y, name, detail, price, columns[1], columns[1] + 78 * mm)

    lower_y = 107 * mm
    draw_rule(c, 20 * mm, lower_y + 11 * mm, width - 20 * mm, ROAST)
    draw_text(c, "03", 20 * mm, lower_y + 2 * mm, "Helvetica-Bold", 6.5, BLUE)
    draw_text(c, "COUNTER + COLD", 32 * mm, lower_y + 2 * mm, "Helvetica-Bold", 7, ROAST)
    items = [
        ("Morning bun", "Cardamom - orange sugar", "4.80"),
        ("Daily cake", "Ask at the counter", "5.20"),
        ("House lemonade", "Lemon verbena - sparkling", "4.50"),
        ("Local apple juice", "Cloudy - gently sweet", "4.00"),
    ]
    y = lower_y - 9 * mm
    for index, (name, detail, price) in enumerate(items):
        col = columns[index % 2]
        row_y = y - (index // 2) * 19 * mm
        menu_item(c, row_y, name, detail, price, col, col + 78 * mm)

    c.setFillColor(ROAST)
    c.rect(0, 0, width, 28 * mm, stroke=0, fill=1)
    draw_text(c, "GOOD COFFEE. NO RUSH.", 20 * mm, 16 * mm, "StudioDisplay", 18, PAPER)
    draw_text(c, "Plant milk +0.50  -  Ask us about allergens", width - 20 * mm, 17 * mm, "Helvetica", 6, PAPER, "right")
    draw_text(c, "foscafe.be  -  @foscafe", width - 20 * mm, 12 * mm, "Helvetica-Bold", 6, ORANGE, "right")
    c.showPage()
    c.save()


def kinu_menu_pdf(path):
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    c.setTitle("KINU - Seasonal Print Menu")
    c.setAuthor("Studio S.")
    c.setFillColor(WASHI)
    c.rect(0, 0, width, height, stroke=0, fill=1)
    draw_text(c, "KINU", 18 * mm, height - 22 * mm, "StudioDisplay", 24, SUMI)
    draw_text(c, "季縫", 52 * mm, height - 21 * mm, "HeiseiMin-W3", 9, SUMI)
    draw_text(c, "HARU - SPRING 2026", width - 18 * mm, height - 20 * mm, "Helvetica-Bold", 6, SUMI, "right")
    draw_rule(c, 18 * mm, height - 29 * mm, width - 18 * mm, SUMI)

    draw_text(c, "Seasonality,", width / 2, height - 56 * mm, "StudioDisplay", 34, SUMI, "center")
    draw_text(c, "quietly expressed.", width / 2, height - 69 * mm, "StudioDisplay", 34, SUMI, "center")
    draw_text(c, "季節を、一皿に。", width / 2, height - 79 * mm, "HeiseiMin-W3", 8, STONE, "center")

    section_y = height - 99 * mm
    sections = [
        ("I", "TO BEGIN", "先付", [
            ("Hamaguri", "Clam - white asparagus - mitsuba", "16"),
            ("Chawanmushi", "Egg custard - North Sea crab - sansho", "18"),
            ("Hotaru ika", "Firefly squid - spring onion - mustard miso", "17"),
        ]),
        ("II", "FROM THE FIRE", "焼物", [
            ("Gindara", "Black cod - saikyo miso - young greens", "28"),
            ("Kamo", "Duck - Tokyo turnip - ume", "31"),
            ("Takenoko", "Bamboo shoot - barley koji - wild garlic", "24"),
        ]),
        ("III", "TO FINISH", "甘味", [
            ("Sakura mochi", "Strawberry - salted blossom - rice", "13"),
            ("Hojicha", "Roasted tea - buckwheat - pear", "12"),
        ]),
    ]
    y = section_y
    for roman, title, jp, items in sections:
        draw_text(c, roman, 24 * mm, y, "StudioDisplay", 9, SEAL)
        draw_text(c, title, 39 * mm, y, "Helvetica-Bold", 6.5, SUMI)
        draw_text(c, jp, width - 24 * mm, y, "HeiseiMin-W3", 6.8, STONE, "right")
        draw_rule(c, 24 * mm, y - 4 * mm, width - 24 * mm, SUMI)
        y -= 12 * mm
        for name, detail, price in items:
            y = menu_item(c, y, name, detail, price, 31 * mm, width - 31 * mm, SUMI)
        y -= 4 * mm

    c.setFillColor(SUMI)
    c.rect(18 * mm, 19 * mm, width - 36 * mm, 22 * mm, stroke=0, fill=1)
    draw_text(c, "OMAKASE", 25 * mm, 30 * mm, "StudioDisplay", 14, WASHI)
    draw_text(c, "Seven seasonal moments selected by the kitchen", 76 * mm, 31 * mm, "Helvetica", 5.8, WASHI)
    draw_text(c, "89", width - 25 * mm, 29 * mm, "StudioDisplay", 15, WASHI, "right")
    draw_text(c, "Dietary requirements with 48 hours notice  -  Prices in euro", width / 2, 11 * mm, "Helvetica", 5.5, STONE, "center")
    c.showPage()
    c.save()


def trim_marks(c, width, height, color):
    c.setStrokeColor(color)
    c.setLineWidth(0.25)
    bleed = 3 * mm
    mark = 2 * mm
    for x in (bleed, width - bleed):
        c.line(x, 0, x, mark)
        c.line(x, height - mark, x, height)
    for y in (bleed, height - bleed):
        c.line(0, y, mark, y)
        c.line(width - mark, y, width, y)


def business_cards_pdf(path, brand):
    width, height = 91 * mm, 61 * mm
    c = canvas.Canvas(str(path), pagesize=(width, height))
    c.setTitle(f"{brand} - Business Cards")
    if brand == "FOS":
        c.setFillColor(BLUE); c.rect(0, 0, width, height, stroke=0, fill=1)
        draw_text(c, "FOS.", 8 * mm, 25 * mm, "StudioDisplay", 32, PAPER)
        draw_text(c, "GOOD COFFEE. NO RUSH.", 8 * mm, 14 * mm, "Helvetica-Bold", 5.5, PAPER)
        draw_text(c, "01", width - 8 * mm, height - 10 * mm, "Helvetica-Bold", 5.5, ORANGE, "right")
        trim_marks(c, width, height, PAPER)
        c.showPage()
        c.setFillColor(PAPER); c.rect(0, 0, width, height, stroke=0, fill=1)
        draw_text(c, "MILA DE SMET", 8 * mm, height - 15 * mm, "StudioDisplay", 13, ROAST)
        draw_text(c, "FOUNDER - HOST", 8 * mm, height - 21 * mm, "Helvetica-Bold", 5.3, BLUE)
        draw_text(c, "+32 470 00 00 00", 8 * mm, 20 * mm, "Helvetica", 6.2, ROAST)
        draw_text(c, "HELLO@FOSCAFE.BE", 8 * mm, 15 * mm, "Helvetica", 6.2, ROAST)
        draw_text(c, "VOLDERSTRAAT 12 - GENT", 8 * mm, 10 * mm, "Helvetica", 6.2, ROAST)
        draw_text(c, "F.", width - 8 * mm, 10 * mm, "StudioDisplay", 18, ORANGE, "right")
        trim_marks(c, width, height, ROAST)
    else:
        c.setFillColor(SUMI); c.rect(0, 0, width, height, stroke=0, fill=1)
        draw_text(c, "KINU", width / 2, 28 * mm, "StudioDisplay", 29, WASHI, "center")
        draw_text(c, "季縫", width / 2, 19 * mm, "HeiseiMin-W3", 7, WASHI, "center")
        c.setFillColor(SEAL); c.rect(width - 15 * mm, height - 15 * mm, 7 * mm, 7 * mm, stroke=0, fill=1)
        trim_marks(c, width, height, WASHI)
        c.showPage()
        c.setFillColor(WASHI); c.rect(0, 0, width, height, stroke=0, fill=1)
        draw_text(c, "AKIRA MORI", 8 * mm, height - 15 * mm, "StudioDisplay", 13, SUMI)
        draw_text(c, "CHEF - OWNER", 8 * mm, height - 21 * mm, "Helvetica-Bold", 5.3, SEAL)
        draw_text(c, "+32 470 00 00 00", 8 * mm, 20 * mm, "Helvetica", 6.2, SUMI)
        draw_text(c, "HELLO@KINU-GENT.BE", 8 * mm, 15 * mm, "Helvetica", 6.2, SUMI)
        draw_text(c, "ONDERBERGEN 18 - GENT", 8 * mm, 10 * mm, "Helvetica", 6.2, SUMI)
        draw_text(c, "絹", width - 9 * mm, 10 * mm, "HeiseiMin-W3", 12, SEAL, "right")
        trim_marks(c, width, height, SUMI)
    c.showPage()
    c.save()


def svg_document(width, height, body, background, label):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{escape(label)}</title><desc id="desc">Editable vector collateral designed by Studio S.</desc>
  <rect width="{width}" height="{height}" fill="{background}"/>{body}
</svg>'''


def write_svg(path, width, height, body, background, label):
    path.write_text(svg_document(width, height, body, background, label), encoding="utf-8")


def generate_fos_svgs():
    board = '''
  <rect x="70" y="70" width="1780" height="940" fill="none" stroke="#1D211C" stroke-width="2"/>
  <text x="115" y="185" fill="#1D211C" font-family="Georgia,serif" font-size="118">FOS<tspan fill="#EF5C32">.</tspan></text>
  <text x="1795" y="135" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="20" letter-spacing="3">TODAY AT THE COUNTER</text>
  <line x1="115" y1="230" x2="1795" y2="230" stroke="#1D211C" stroke-width="2"/>
  <text x="115" y="355" fill="#1E48D7" font-family="Georgia,serif" font-size="62">COFFEE</text>
  <text x="115" y="430" fill="#1D211C" font-family="Georgia,serif" font-size="40">Espresso</text><text x="690" y="430" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">3.20</text>
  <text x="115" y="500" fill="#1D211C" font-family="Georgia,serif" font-size="40">Flat white</text><text x="690" y="500" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">4.20</text>
  <text x="115" y="570" fill="#1D211C" font-family="Georgia,serif" font-size="40">Filter</text><text x="690" y="570" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">4.50</text>
  <text x="800" y="355" fill="#1E48D7" font-family="Georgia,serif" font-size="62">KITCHEN</text>
  <text x="800" y="430" fill="#1D211C" font-family="Georgia,serif" font-size="40">Ricotta toast</text><text x="1450" y="430" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">12.50</text>
  <text x="800" y="500" fill="#1D211C" font-family="Georgia,serif" font-size="40">Soft eggs</text><text x="1450" y="500" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">11.00</text>
  <text x="800" y="570" fill="#1D211C" font-family="Georgia,serif" font-size="40">Market focaccia</text><text x="1450" y="570" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="26">13.50</text>
  <circle cx="1645" cy="480" r="125" fill="#EF5C32"/><text x="1645" y="465" text-anchor="middle" fill="#F1EADC" font-family="monospace" font-size="21" letter-spacing="2">OPEN TODAY</text><text x="1645" y="510" text-anchor="middle" fill="#F1EADC" font-family="Georgia,serif" font-size="35">08-17</text>
  <line x1="115" y1="700" x2="1795" y2="700" stroke="#1D211C" stroke-width="2"/>
  <text x="115" y="845" fill="#1D211C" font-family="Georgia,serif" font-size="82">GOOD COFFEE.</text><text x="700" y="845" fill="#EF5C32" font-family="Georgia,serif" font-size="82">NO RUSH.</text>
  <text x="1795" y="865" text-anchor="end" fill="#1D211C" font-family="monospace" font-size="18">VOLDERSTRAAT 12 - GENT</text>'''
    write_svg(FOS_DIR / "digital-menu-board.svg", 1920, 1080, board, "#F1EADC", "FOS digital menu board")

    poster = '''
  <rect x="90" y="90" width="900" height="1740" fill="none" stroke="#F1EADC" stroke-width="3"/>
  <text x="125" y="255" fill="#F1EADC" font-family="Georgia,serif" font-size="145">FOS<tspan fill="#EF5C32">.</tspan></text>
  <text x="125" y="535" fill="#F1EADC" font-family="Georgia,serif" font-size="142">ONE</text><text x="125" y="675" fill="#F1EADC" font-family="Georgia,serif" font-size="142">MORE</text><text x="125" y="815" fill="#F1EADC" font-family="Georgia,serif" font-size="142">COFFEE?</text>
  <circle cx="760" cy="1180" r="245" fill="#EF5C32"/><circle cx="760" cy="1180" r="185" fill="none" stroke="#F1EADC" stroke-width="3"/>
  <text x="760" y="1160" text-anchor="middle" fill="#F1EADC" font-family="Georgia,serif" font-size="62">SATURDAY</text><text x="760" y="1235" text-anchor="middle" fill="#F1EADC" font-family="monospace" font-size="32">09:00-18:00</text>
  <text x="125" y="1625" fill="#F1EADC" font-family="monospace" font-size="28" letter-spacing="3">COFFEE - BAKES - GOOD COMPANY</text><text x="125" y="1700" fill="#F1EADC" font-family="monospace" font-size="24">VOLDERSTRAAT 12 - GENT</text>'''
    write_svg(FOS_DIR / "social-story.svg", 1080, 1920, poster, "#1E48D7", "FOS social story campaign")

    card_front = '''<text x="80" y="300" fill="#F1EADC" font-family="Georgia,serif" font-size="210">FOS<tspan fill="#EF5C32">.</tspan></text><text x="82" y="405" fill="#F1EADC" font-family="monospace" font-size="28" letter-spacing="4">GOOD COFFEE. NO RUSH.</text><text x="920" y="90" text-anchor="end" fill="#EF5C32" font-family="monospace" font-size="22">01</text>'''
    card_back = '''<text x="75" y="140" fill="#1D211C" font-family="Georgia,serif" font-size="62">Mila De Smet</text><text x="75" y="195" fill="#1E48D7" font-family="monospace" font-size="22" letter-spacing="3">FOUNDER - HOST</text><text x="75" y="370" fill="#1D211C" font-family="monospace" font-size="23">+32 470 00 00 00</text><text x="75" y="415" fill="#1D211C" font-family="monospace" font-size="23">HELLO@FOSCAFE.BE</text><text x="75" y="460" fill="#1D211C" font-family="monospace" font-size="23">VOLDERSTRAAT 12 - GENT</text><text x="930" y="480" text-anchor="end" fill="#EF5C32" font-family="Georgia,serif" font-size="95">F.</text>'''
    write_svg(FOS_DIR / "business-card-front.svg", 1000, 647, card_front, "#1E48D7", "FOS business card front")
    write_svg(FOS_DIR / "business-card-back.svg", 1000, 647, card_back, "#F1EADC", "FOS business card back")


def generate_kinu_svgs():
    board = '''
  <text x="95" y="155" fill="#11110F" font-family="Didot,Georgia,serif" font-size="105" letter-spacing="4">KINU</text><text x="390" y="142" fill="#11110F" font-family="serif" font-size="30">季縫</text>
  <text x="1825" y="120" text-anchor="end" fill="#11110F" font-family="monospace" font-size="20" letter-spacing="4">HARU - SPRING 2026</text>
  <line x1="95" y1="205" x2="1825" y2="205" stroke="#11110F" stroke-width="2"/>
  <text x="95" y="340" fill="#BD3D2B" font-family="Didot,Georgia,serif" font-size="34">I</text><text x="160" y="340" fill="#11110F" font-family="monospace" font-size="21" letter-spacing="3">TO BEGIN</text>
  <text x="160" y="430" fill="#11110F" font-family="Didot,Georgia,serif" font-size="46">Hamaguri</text><text x="675" y="430" text-anchor="end" fill="#11110F" font-family="monospace" font-size="24">16</text><text x="160" y="470" fill="#77766F" font-family="monospace" font-size="17">clam - asparagus - mitsuba</text>
  <text x="160" y="560" fill="#11110F" font-family="Didot,Georgia,serif" font-size="46">Chawanmushi</text><text x="675" y="560" text-anchor="end" fill="#11110F" font-family="monospace" font-size="24">18</text><text x="160" y="600" fill="#77766F" font-family="monospace" font-size="17">crab - egg custard - sansho</text>
  <line x1="755" y1="280" x2="755" y2="840" stroke="#11110F" stroke-width="1"/>
  <text x="835" y="340" fill="#BD3D2B" font-family="Didot,Georgia,serif" font-size="34">II</text><text x="910" y="340" fill="#11110F" font-family="monospace" font-size="21" letter-spacing="3">FROM THE FIRE</text>
  <text x="910" y="430" fill="#11110F" font-family="Didot,Georgia,serif" font-size="46">Gindara</text><text x="1480" y="430" text-anchor="end" fill="#11110F" font-family="monospace" font-size="24">28</text><text x="910" y="470" fill="#77766F" font-family="monospace" font-size="17">black cod - miso - young greens</text>
  <text x="910" y="560" fill="#11110F" font-family="Didot,Georgia,serif" font-size="46">Kamo</text><text x="1480" y="560" text-anchor="end" fill="#11110F" font-family="monospace" font-size="24">31</text><text x="910" y="600" fill="#77766F" font-family="monospace" font-size="17">duck - Tokyo turnip - ume</text>
  <rect x="1585" y="315" width="190" height="190" fill="#BD3D2B"/><text x="1680" y="400" text-anchor="middle" fill="#F3F1EB" font-family="serif" font-size="38">旬</text><text x="1680" y="450" text-anchor="middle" fill="#F3F1EB" font-family="monospace" font-size="16" letter-spacing="2">SEASONAL</text>
  <line x1="95" y1="870" x2="1825" y2="870" stroke="#11110F" stroke-width="2"/><text x="95" y="965" fill="#11110F" font-family="Didot,Georgia,serif" font-size="55">Omakase</text><text x="430" y="958" fill="#77766F" font-family="monospace" font-size="18">SEVEN SEASONAL MOMENTS</text><text x="1825" y="965" text-anchor="end" fill="#11110F" font-family="Didot,Georgia,serif" font-size="55">89</text>'''
    write_svg(KINU_DIR / "digital-menu-board.svg", 1920, 1080, board, "#F3F1EB", "KINU digital menu board")

    poster = '''
  <line x1="90" y1="105" x2="990" y2="105" stroke="#11110F" stroke-width="3"/><text x="90" y="215" fill="#11110F" font-family="Didot,Georgia,serif" font-size="100" letter-spacing="6">KINU</text><text x="365" y="200" fill="#11110F" font-family="serif" font-size="27">季縫</text><text x="990" y="185" text-anchor="end" fill="#11110F" font-family="monospace" font-size="22" letter-spacing="3">HARU - 2026</text>
  <text x="90" y="555" fill="#11110F" font-family="Didot,Georgia,serif" font-size="134">A quiet</text><text x="90" y="690" fill="#11110F" font-family="Didot,Georgia,serif" font-size="134">expression</text><text x="90" y="825" fill="#11110F" font-family="Didot,Georgia,serif" font-size="134">of spring.</text>
  <rect x="90" y="1020" width="900" height="520" fill="#11110F"/><text x="540" y="1200" text-anchor="middle" fill="#F3F1EB" font-family="serif" font-size="66">季節を、一皿に。</text><text x="540" y="1300" text-anchor="middle" fill="#77766F" font-family="monospace" font-size="22" letter-spacing="4">SEASONAL PLATES - CHARCOAL COOKING</text><rect x="480" y="1370" width="120" height="120" fill="#BD3D2B"/><text x="540" y="1448" text-anchor="middle" fill="#F3F1EB" font-family="serif" font-size="48">旬</text>
  <text x="90" y="1700" fill="#11110F" font-family="monospace" font-size="23">WEDNESDAY-SATURDAY - FROM 18:00</text><text x="90" y="1770" fill="#11110F" font-family="monospace" font-size="23">ONDERBERGEN 18 - GENT</text><text x="990" y="1770" text-anchor="end" fill="#BD3D2B" font-family="monospace" font-size="23">RESERVE - KINU-GENT.BE</text>'''
    write_svg(KINU_DIR / "social-story.svg", 1080, 1920, poster, "#F3F1EB", "KINU seasonal social story")

    card_front = '''<text x="500" y="300" text-anchor="middle" fill="#F3F1EB" font-family="Didot,Georgia,serif" font-size="165" letter-spacing="8">KINU</text><text x="500" y="395" text-anchor="middle" fill="#F3F1EB" font-family="serif" font-size="32">季縫</text><rect x="850" y="65" width="80" height="80" fill="#BD3D2B"/><text x="890" y="118" text-anchor="middle" fill="#F3F1EB" font-family="serif" font-size="34">絹</text>'''
    card_back = '''<text x="75" y="140" fill="#11110F" font-family="Didot,Georgia,serif" font-size="62">Akira Mori</text><text x="75" y="195" fill="#BD3D2B" font-family="monospace" font-size="22" letter-spacing="3">CHEF - OWNER</text><text x="75" y="370" fill="#11110F" font-family="monospace" font-size="23">+32 470 00 00 00</text><text x="75" y="415" fill="#11110F" font-family="monospace" font-size="23">HELLO@KINU-GENT.BE</text><text x="75" y="460" fill="#11110F" font-family="monospace" font-size="23">ONDERBERGEN 18 - GENT</text><text x="930" y="475" text-anchor="end" fill="#BD3D2B" font-family="serif" font-size="70">絹</text>'''
    write_svg(KINU_DIR / "business-card-front.svg", 1000, 647, card_front, "#11110F", "KINU business card front")
    write_svg(KINU_DIR / "business-card-back.svg", 1000, 647, card_back, "#F3F1EB", "KINU business card back")


def main():
    setup_dirs()
    register_fonts()
    fos_menu_pdf(PDF_DIR / "fos-print-menu.pdf")
    kinu_menu_pdf(PDF_DIR / "kinu-print-menu.pdf")
    business_cards_pdf(PDF_DIR / "fos-business-cards.pdf", "FOS")
    business_cards_pdf(PDF_DIR / "kinu-business-cards.pdf", "KINU")
    generate_fos_svgs()
    generate_kinu_svgs()
    print("Generated FOS and KINU print and digital collateral.")


if __name__ == "__main__":
    main()
