from flask import Flask, jsonify, request
from flask_mysqldb import MySQL

app = Flask(__name__)

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
def get_all_screens():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT ext_screen_id, name, publisher_id, venue_type, geo_location, status, activation_date FROM screens WHERE status != 2''')
        rows = cursor.fetchall()
        resp = jsonify(rows)
        resp.status_code = 200
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route("/api/screens/get/<string:screenId>", methods=["GET"])
def get_screen(screenId):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM screens WHERE ext_screen_id = '{0}' and status != 2".format(screenId))
        rows = cursor.fetchone()
        resp = jsonify(rows)
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

