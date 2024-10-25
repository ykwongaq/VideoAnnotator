from typing import List, Dict

import os
import random
import json


class Server:
    def __init__(self) -> None:
        pass

    def save_json(self, data: Dict, output_path: str) -> None:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=4)

    def create_project(self, data_folder: str, output_folder: str) -> Dict:
        data_list = []

        lose_folder = os.path.join(data_folder, "losevideos")
        win_folder = os.path.join(data_folder, "winvideos")

        lose_files = []
        for file in os.listdir(lose_folder):
            if file.endswith(".mp4"):
                lose_files.append(os.path.join(lose_folder, file))
        lose_files.sort()

        win_files = []
        for file in os.listdir(win_folder):
            if file.endswith(".mp4"):
                win_files.append(os.path.join(win_folder, file))
        win_files.sort()

        # Make sure that each video has a corresponding video
        assert len(lose_files) == len(win_files)
        for i in range(len(lose_files)):
            lose_file_name = os.path.basename(lose_files[i])
            win_file_name = os.path.basename(win_files[i])
            assert lose_file_name == win_file_name

        data_list = []
        for i in range(len(lose_files)):
            data = {}
            # The data contain the key video_1 and video_2
            # Randomly assign one video from either lose or
            # win folder to video_1 and video_2
            if random.choice([True, False]):
                data["video_1"] = lose_files[i]
                data["video_2"] = win_files[i]
                data["video_1_label"] = "lose"
                data["video_2_label"] = "win"
            else:
                data["video_1"] = win_files[i]
                data["video_2"] = lose_files[i]
                data["video_1_label"] = "win"
                data["video_2_label"] = "lose"
            data["file_name"] = os.path.basename(lose_files[i])
            data_list.append(data)

        project_json = {}
        project_json["data"] = data_list
        project_json["last_index"] = 0

        output_jsonfile = os.path.join(output_folder, "project.json")
        print(f"Saving project to {output_jsonfile}")
        self.save_json(project_json, output_jsonfile)

        return project_json

    def load_project(project_folder: str) -> Dict:
        project_file = os.path.join(project_folder, "project.json")
        assert os.path.exists(
            project_file
        ), f"Project file {project_file} does not exist"

        with open(project_file, "r") as f:
            project_json = json.load(f)

        return project_json

    def export_result(self, result: Dict, output_folder: str) -> None:
        pass
