import os, json, sys, re, time
import treq
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, select
from sqlalchemy.orm import sessionmaker
from twisted.web.server import Site, NOT_DONE_YET
from twisted.web.static import File
from twisted.web.resource import Resource
from twisted.internet import reactor
from twisted.internet.defer import inlineCallbacks
from twisted.python import log


from authsys_common.scripts import get_config

eng = create_engine("sqlite:///progress.db")
Session = sessionmaker(bind=eng)

meta = MetaData()

log.startLogging(sys.stderr, setStdout=0)

payments = Table('payments', meta,
    Column('id', Integer, primary_key=True),
    Column('timestamp', Integer),
    Column('credit_card_id', String),
    Column('name', String),
    Column('outcome', String),
)

total = Table('total', meta,
    Column('id', Integer, primary_key=True), 
    Column('total', Float))

class Progress(Resource):
    isLeaf = True
    def render_GET(self, request):
        s = Session()
        t = list(s.execute(select([total])))[0][1]
        s.commit()
        return json.dumps({"total": t})

class Donation(Resource):
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
        price = request.args['sum'][0]
        conf = get_config()
        s = Session()
        t = list(s.execute(select([total])))[0][0]
        s.commit()
        url = conf.get('payment', 'base') + '/v1/checkouts'
        data = {
            'authentication.userId' : conf.get('payment', 'userId'),
            'authentication.password' : conf.get('payment', 'password'),
            'authentication.entityId' : conf.get('payment', 'recurringEntityId'),
            'amount' : price + ".00",
            'currency' : 'ZAR',
            'paymentType' : 'DB',
            'merchantTransactionId': "foobarbaz" + str(t),
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
            s = Session()
            t = list(s.execute(select([total])))[0][1]
            t += float(amount)
            s.execute(total.update().values({'total': t}).where(total.c.id == 0))
            s.execute(payments.insert().values({'timestamp': time.time(), 'credit_card_id': r['id'], 
                'name': r['card']['holder'], 'outcome': r['result']['description']}))
            s.commit()
            #payments.insert
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
         ('authentication.entityId', conf.get('payment', 'recurringEntityId')),
        ]])
        d = treq.get(url + "?" + params)
        d.addCallback(self.continue_checking, request)
        return NOT_DONE_YET

if len(sys.argv) > 1 and sys.argv[1] == '--create':
    meta.create_all(eng)
    s = Session()
    s.execute(total.insert({'id': 0, 'total': 0.0}))
    s.commit()
    sys.exit(0)

resource = File(os.getcwd())
resource.putChild("get_progress", Progress())
resource.putChild("donation", Donation())
resource.putChild("finish_check", Finish())
factory = Site(resource)
reactor.listenTCP(8888, factory)
reactor.run()
