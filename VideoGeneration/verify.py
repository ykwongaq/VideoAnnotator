import argparse
import csv
import os

from utils.util import read_csv


def main(csv_file:str):
    """
    Verify the csv file.

    The uuid should be unique, and match with the filenames in the videos folder.
    """

    # Read the csv file
    datas = read_csv(csv_file)

    # Get the list of video files
    video_files = os.listdir("videos")
    filenames = [os.path.splitext(video_file)[0] for video_file in video_files]

    # Check if the uuid is unique
    uuids = set()
    for data in datas:
        uuid = data.get("uuid")
        if uuid in uuids:
            print(f"Duplicate uuid: {uuid}")
        else:
            uuids.add(uuid)

    # Check if there are missing files
    for data in datas:
        uuid = data.get("uuid")
        if uuid not in filenames:
            print(f"File not found: {uuid}")
    

    print(f"All {len(datas)} videos are verified.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verify the csv file")
    parser.add_argument("--csv_file", type=str, default="./metadata.csv", required=False, help="The csv file to verify. Default: ./metadata.csv")
    args = parser.parse_args()
    main(args.csv_file)