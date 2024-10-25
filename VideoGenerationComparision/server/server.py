import json
import os
import random
import shutil
from typing import Dict, List


class Server:
    def __init__(self) -> None:
        self.project_folder = None
        self.project_filename = "project.json"

    def save_json(self, data: Dict, output_path: str) -> None:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=4)

    def copy_folder(self, files: str, output_folder: str) -> None:
        for file in files:
            shutil.copy(file, output_folder)

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

        # output_lose_foldername = "losevideos"
        # output_lose_folder = os.path.join(output_folder, output_lose_foldername)
        # os.makedirs(output_lose_folder, exist_ok=True)
        # self.copy_folder(lose_files, output_lose_folder)

        # output_win_foldername = "winvideos"
        # output_win_folder = os.path.join(output_folder, output_win_foldername)
        # os.makedirs(output_win_folder, exist_ok=True)
        # self.copy_folder(win_files, output_win_folder)

        data_list = []
        for i in range(len(lose_files)):
            data = {}
            # The data contain the key video_1 and video_2
            # Randomly assign one video from either lose or
            # win folder to video_1 and video_2
            if random.choice([True, False]):
                data["video_1"] = os.path.join(
                    "losevideos", os.path.basename(lose_files[i])
                )
                data["video_2"] = os.path.join(
                    "winvideos", os.path.basename(win_files[i])
                )
                data["video_1_label"] = "lose"
                data["video_2_label"] = "win"
            else:
                data["video_1"] = os.path.join(
                    "winvideos", os.path.basename(win_files[i])
                )
                data["video_2"] = os.path.join(
                    "losevideos", os.path.basename(lose_files[i])
                )
                data["video_1_label"] = "win"
                data["video_2_label"] = "lose"
            data["file_name"] = os.path.basename(lose_files[i])
            data_list.append(data)

        project_json = {}
        project_json["data"] = data_list
        project_json["last_index"] = 0

        output_jsonfile = os.path.join(output_folder, self.project_filename)
        print(f"Saving project to {output_jsonfile}")
        self.save_json(project_json, output_jsonfile)

        self.set_project_folder(output_folder)

        return project_json

    def set_project_folder(self, project_folder: str) -> None:
        self.project_folder = project_folder

    def load_project(self, project_folder: str) -> Dict:
        project_file = os.path.join(project_folder, self.project_filename)
        assert os.path.exists(
            project_file
        ), f"Project file {project_file} does not exist"

        with open(project_file, "r") as f:
            project_json = json.load(f)

        self.set_project_folder(project_folder)

        return project_json

    def save_project_data(self, project_data: Dict) -> None:
        output_jsonfile = os.path.join(self.project_folder, self.project_filename)
        self.save_json(project_data, output_jsonfile)

    def export_result(self, result: Dict, output_folder: str) -> None:
        output_jsonfile = os.path.join(output_folder, "result.json")
        print(f"Saving result to {output_jsonfile}")
        self.save_json(result, output_jsonfile)
