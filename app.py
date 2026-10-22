from flask import Flask, requesr,jsonify
from flask_cors import CORS
import sqlite3
from pathlib import Path
from datatime import datetime 

app=Flask(__name__)
CORS(app)

DB_PATH=