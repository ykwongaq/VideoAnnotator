import os
import eel

from tkinter import Tk, filedialog, messagebox
from server.server import Server
from typing import List, Dict


@eel.expose
def select_folder(message: str) -> str:
    root = Tk()
    root.withdraw()
    root.wm_attributes("-topmost", 1)
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
def export_result(output_folder: str) -> None:
    server.export_result(output_folder)


if __name__ == "__main__":
    print("Please wait for the tool to be ready ...")
    eel.init("web")
    print(f"About to start the server ...")
    server = Server()
    print(f"Server initialized ...")
    eel.start("main.html", size=(1200, 800))
    print(f"Server started ...")
