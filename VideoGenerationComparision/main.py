import base64
import os
from tkinter import Tk, filedialog, messagebox
from typing import Dict, List

import eel
from server.server import Server


@eel.expose
def select_folder(message: str) -> str:
    root = Tk()
    root.withdraw()
    root.wm_attributes("-topmost", 1)
    if message is not None:
        messagebox.showinfo("Select Folder", message)

    folder = filedialog.askdirectory()
    return folder


@eel.expose
def create_project(data_folder: str, output_folder: str) -> Dict:
    return server.create_project(data_folder, output_folder)


@eel.expose
def load_project(project_folder: str) -> Dict:
    return server.load_project(project_folder)


@eel.expose
def load_video(video_path: str) -> str:
    with open(video_path, "rb") as f:
        video = f.read()
    return base64.b64encode(video).decode("utf-8")


@eel.expose
def export_result(data: Dict, output_folder: str) -> None:
    server.export_result(data, output_folder)


@eel.expose
def save(project_data: Dict) -> None:
    server.save_project_data(project_data)


if __name__ == "__main__":
    print("Please wait for the tool to be ready ...")
    eel.init("web")
    print(f"About to start the server ...")
    server = Server()
    print(f"Server initialized ...")
    eel.start("main.html", size=(1200, 800))
    print(f"Server started ...")
