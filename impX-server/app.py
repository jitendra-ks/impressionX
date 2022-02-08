from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# todo: read from config or .env file
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'dooh'

mysql = MySQL(app)

@app.route("/")
def hello_world():
    return '<p>impressionX</p>'

@app.route("/api/screens/getall", methods=["GET"])
@cross_origin()
def get_all_screens():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT ext_screen_id as screenId, name as name, publisher_id as publisherId, venue_type as venueType, geo_location as geoLocation, status as status FROM screens WHERE status != 2''')
        row_headers = [x[0] for x in cursor.description]
        rows = cursor.fetchall()
        result = []
        for row in rows:
            result.append(dict(zip(row_headers, row)))
        for res in result:
            res['geoLocation'] = json.loads(res['geoLocation'])
            res['publisherName'] = ""
        resp = jsonify(result)
        resp.status_code = 200
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route("/api/screens/get/<string:screenId>", methods=["GET"])
@cross_origin()
def get_screen(screenId):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('''SELECT ext_screen_id as screenId, name, venue_id as venueId, 
        publisher_id as publisherId, timezone, utc_offset as utcOffset, cms_name as cmsName, geo_location as geoLocation, address, 
        position, latitude, longitude, venue_type as venueType, direction, manufacturer, side, dimension_width as dimensionWidth,
        dimension_height as dimensionHeight, resolution_width as resolutionWidth, resolution_height as resolutionHeight, orientation, 
        audience_data_provider as audienceDataProvider, breakdown_unit as breakdownUnit, impression_multiplier as impressionMultiplier,
        default_ad_duration as defaultAdDuration, impression_multiplier_per_second as impressionMultiplierPerSecond,
        direct_deals as directDeals, exchange_deals as exchangeDeals, static_support as staticSupport, video_support as videoSupport, 
        blocked_cat, blocked_adv, blocked_demand_channel, currency, cpm, status 
        FROM screens WHERE ext_screen_id = '{0}' and status != 2'''.format(screenId))
        row_headers = [x[0] for x in cursor.description]
        row = cursor.fetchone()
        result = []
        result.append(dict(zip(row_headers, row)))
        res = result[0]
        res['address'] = json.loads(res['address'])
        res['geoLocation'] = json.loads(res['geoLocation'])
        res['brandSafetyConfig'] = {
            'blockedCategories': res['blocked_cat'],
            'blockedAdvertisersDomains': res['blocked_adv'],
            'blockedDemandChannels': res['blocked_demand_channel']
        }
        res.pop("blocked_cat")
        res.pop('blocked_adv')
        res.pop('blocked_demand_channel')
        res['floorPrice'] = {
            'cpm': res['cpm'],
            'currency': res['currency']
        }
        res.pop('cpm')
        res.pop('currency')
        res['adUnits'] = []
       
        resp = jsonify(res)
        resp.status_code = 200
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.errorhandler(404)
def error_handler(error=None):
    message = {
        'status': 404,
        'message': 'Not found: ' + request.path
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp

