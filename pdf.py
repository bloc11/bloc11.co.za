from fpdf import FPDF
from flask import Flask, request, Response

MAX_X = 210
MAX_Y = 297

app = Flask('bloc 11 voucher gen')

HTML = open('voucher_query.html').read()

@app.route('/')
def index():
    return HTML

@app.route("/bloc11voucher", methods=['POST'])
def gen():
    f = FPDF('P', 'mm', 'A4')
    f.add_page()
    f.image('voucher_template.png', 0, 0, MAX_X, MAX_Y)
    f.set_font('Arial', '', 20)
    f.text(70, 165, request.form['name'])
    f.text(70, 201, request.form['reason'])
    f.text(70, 236, request.form['extra'])
    return Response(f.output(dest='S'), mimetype='application/pdf')

if __name__ == '__main__':
    app.run()
