import argparse
import csv
import os
import shutil
import time

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__)

CSV_FILE = ""
VIDEO_DATA = {}
VIDEO_FOLDER = "videos"

def read_csv(csv_file:str):
    """
    Read the csv file and return a list of dictionary that store the data.

    The keys of the dictionary are the headers names. The value of the dictionary are the value.

    The first line of the csv file is the headers
    """
    datas = []
    with open(csv_file, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        headers = next(reader)
        for row in reader:
            row = [item.strip().replace('\n', '').replace('\r', '') for item in row]
            data = dict(zip(headers, row))

            if "label" not in data:
                data["label"] = ""
            datas.append(data)
    return datas

def write_csv(csv_file:str, datas:list):
    """
    Write the datas to the csv file.

    The datas is a list of dictionary that store the data.

    The keys of the dictionary are the headers names. The value of the dictionary are the value.

    The first line of the csv file is the headers
    """
    with open(csv_file, "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        headers = datas[0].keys()
        writer.writerow(headers)
        for data in datas:
            row = [data[header] for header in headers]
            writer.writerow(row)

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

@app.route('/videos/<path:filename>')
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Video Annotator')
    parser.add_argument('--csv_file', default="metadata.csv", type=str, help='Path to the csv file', required=False)
    args = parser.parse_args()
    CSV_FILE = args.csv_file
    for data in read_csv(CSV_FILE):
        VIDEO_DATA[data["uuid"]] = data
    # Sort the data by the key
    VIDEO_DATA = dict(sorted(VIDEO_DATA.items()))
    app.run(debug=True)
