import os, json, sys, re, time
import treq
from twisted.web.server import Site, NOT_DONE_YET
from twisted.web.static import File
from twisted.web.resource import Resource
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
from twisted.python import log

from fpdf import FPDF

from authsys_common.scripts import get_config

log.startLogging(sys.stderr, setStdout=0)

HTML = """
<html>
<head>
</head>
<body>
  <form action="bloc11voucher" method="post">
    <h1>Voucher generator</h1>
    <div>
      Name and surname: <input type="text" name="name">
    </div>
    <div>
      Voucher reason: <input type="text" name="reason">
    </div>
    <div>
      Extra info: <input type="text" name="extra">
    </div>
    <input type="submit" value="Generate">
  </form>
</body>
</html>
"""

class GenPdf(Resource):
    isLeaf = True

    def render_GET(self, request):
        return HTML

class Bloc11Voucher(Resource):
    isLeaf = True

    def render_POST(self, request):
        MAX_X = 210
        MAX_Y = 297


        f = FPDF('P', 'mm', 'A4')
        f.add_page()
        f.image('voucher_template.png', 0, 0, MAX_X, MAX_Y)
        f.set_font('Arial', '', 20)
        f.text(70, 165, request.args['name'][0])
        f.text(70, 201, request.args['reason'][0])
        f.text(70, 236, request.args['extra'][0])
        request.setHeader('Content-Type', "application/pdf")
        return f.output(dest='S')


class Pay(Resource):
    isLeaf = True

    @inlineCallbacks
    def payment_gateway_continue(self, res, request):
        r = yield res.json()
        conf = get_config()
        url = conf.get('payment', 'base') + "/v1/paymentWidgets.js?checkoutId=" + r['id']
        r = yield treq.get(url)
        r = yield r.text("utf-8")
        request.write(json.dumps({'form': r}))
        request.finish()

    def render_GET(self, request):
        ref = request.args['reference'][0]
        price = request.args['value'][0]
        conf = get_config()
        url = conf.get('payment', 'base') + '/v1/checkouts'
        data = {
            'authentication.userId' : conf.get('payment', 'userId'),
            'authentication.password' : conf.get('payment', 'password'),
            'authentication.entityId' : conf.get('payment', 'entityId'),
            'amount' : price + ".00",
            'currency' : 'ZAR',
            'paymentType' : 'DB',
            'merchantTransactionId': "gravitybowl" + str(int(time.time())) + "-" + ref,
            }
        d = treq.post(url, data)
        d.addCallback(self.payment_gateway_continue, request)
        return NOT_DONE_YET

class Donate(Resource):
    isLeaf = True

    @inlineCallbacks
    def payment_gateway_continue(self, res, request):
        r = yield res.json()
        conf = get_config()
        url = conf.get('payment', 'base') + "/v1/paymentWidgets.js?checkoutId=" + r['id']
        r = yield treq.get(url)
        r = yield r.text("utf-8")
        request.write(json.dumps({'form': r}))
        request.finish()

    def render_GET(self, request):
        price = request.args['price'][0]
        ref = request.args['reference'][0]
        conf = get_config()
        url = conf.get('payment', 'base') + '/v1/checkouts'
        data = {
            'authentication.userId' : conf.get('payment', 'userId'),
            'authentication.password' : conf.get('payment', 'password'),
            'authentication.entityId' : conf.get('payment', 'entityId'),
            'amount' : price + ".00",
            'currency' : 'ZAR',
            'paymentType' : 'DB',
            'merchantTransactionId': "dreamhigher" + str(int(time.time())) + "-" + ref,
            }
        d = treq.post(url, data)
        d.addCallback(self.payment_gateway_continue, request)
        return NOT_DONE_YET

class Finish(Resource):
    isLeaf = True

    @inlineCallbacks
    def continue_checking(self, res, request):
        r = yield res.text()
        r = json.loads(r)
        print r
        try:
            amount = r['amount']
        except KeyError:
            d = {'success': False, 'error': 'internal problem'}
        else:
            if re.search("^(000\.000\.|000\.100\.1|000\.[36])", r['result']['code']):
                d = {'success': True}
            else:
                d = {'success': False, 'error': r['result']['description']}
        request.write(json.dumps(d))
        request.finish()

    def render_GET(self, request):
        conf = get_config()
        print request.args
        url = conf.get('payment', 'base') + request.args['resourcePath'][0]
        params = "&".join(["%s=%s" % (k, v) for (k, v) in [
         ('authentication.userId', conf.get('payment', 'userId')),
         ('authentication.password', conf.get('payment', 'password')),
         ('authentication.entityId', conf.get('payment', 'entityId')),
        ]])
        d = treq.get(url + "?" + params)
        d.addCallback(self.continue_checking, request)
        return NOT_DONE_YET

if len(sys.argv) > 1 and sys.argv[1] == '--create':
    sys.exit(0)

resource = File(os.getcwd())
resource.putChild("pay", Pay())
resource.putChild("voucher_generator", GenPdf())
resource.putChild("bloc11voucher", Bloc11Voucher())
resource.putChild("donate", Donate())
resource.putChild("finish_check", Finish())
factory = Site(resource)
reactor.listenTCP(8887, factory)
reactor.run()
