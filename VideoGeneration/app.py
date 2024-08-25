import argparse
import csv
import os
import shutil
import threading
import time
import webbrowser

from flask import Flask, jsonify, render_template, request, send_from_directory

from utils.util import read_csv, write_csv

app = Flask(__name__)

CSV_FILE = ""
VIDEO_DATA = {}
VIDEO_FOLDER = "videos"


def save_data():
    """
    Save the data to the csv file
    """
    datas = []
    for data in VIDEO_DATA.values():
        datas.append(data)
    write_csv(CSV_FILE, datas)


@app.route("/")
def index():
    return render_template("index.html", time=time)


@app.route("/api/video_ids")
def get_videos_ids():
    return jsonify(list(VIDEO_DATA.keys()))


@app.route("/api/video_data/<video_id>")
def get_videos_data(video_id):
    return jsonify(VIDEO_DATA[video_id])


@app.route("/videos/<path:filename>")
def serve_video(filename):
    return send_from_directory(VIDEO_FOLDER, filename)


@app.route("/api/save_label", methods=["POST"])
def save_label():
    data = request.json
    video_id = data.get("video_id")
    label = data.get("label")
    print(f"Save label {label} for video {video_id}")
    if video_id in VIDEO_DATA:
        VIDEO_DATA[video_id]["label"] = label
        save_data()
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "error", "message": "Video ID not found"}), 404


def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Video Annotator")
    parser.add_argument(
        "--csv_file",
        default="metadata.csv",
        type=str,
        help="Path to the csv file",
        required=False,
    )
    args = parser.parse_args()
    CSV_FILE = args.csv_file
    for data in read_csv(CSV_FILE):
        if "label" not in data:
            data["label"] = ""
        VIDEO_DATA[data["uuid"]] = data
    # Sort the data by the key
    VIDEO_DATA = dict(sorted(VIDEO_DATA.items()))
    threading.Timer(1, open_browser).start()
    app.run(debug=True)
