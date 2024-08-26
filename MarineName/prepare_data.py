import argparse
import json
import os

import cv2
import matplotlib.pyplot as plt
import numpy as np
from pycocotools import mask as coco_mask
from tqdm import tqdm


def extract_masks(json_file: str):
    with open(json_file, "r") as file:
        data = json.load(file)
    masks = []
    for annotation in data["annotations"]:
        mask_str = annotation["segmentation"]
        binary_mask = coco_mask.decode(mask_str)
        mask_array = np.array(binary_mask)
        masks.append(mask_array)
    return masks


def mask_to_xyxy(mask):
    # Ensure the mask is a binary NumPy array
    mask = np.asarray(mask, dtype=np.bool_)

    # Find the indices of the non-zero elements
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)

    # Get the bounding box coordinates
    y_min, y_max = np.where(rows)[0][[0, -1]]
    x_min, x_max = np.where(cols)[0][[0, -1]]

    x_min, y_min, x_max, y_max = int(x_min), int(y_min), int(x_max), int(y_max)
    return [x_min, y_min, x_max, y_max]


def add_masks_to_frame(frame, mask, alpha=0.5):
    colored_frame = cv2.addWeighted(frame, 1 - alpha, mask, alpha, 0)
    return colored_frame


def convert_masked_frame_to_video(frame_files, mask_files, output_path, fps=30):
    frames = []
    for frame_file, mask_file in zip(frame_files, mask_files):
        frame = cv2.imread(frame_file)
        mask = cv2.imread(mask_file, cv2.IMREAD_UNCHANGED)
        colored_frame = add_masks_to_frame(frame, mask)
        frames.append(colored_frame)
    return convert_frames_to_video(frames, output_path, fps)


def convert_frame_files_to_video(frame_files, output_path, fps=30):
    frames = []
    for frame_file in frame_files:
        frame = cv2.imread(frame_file)
        frames.append(frame)
    convert_frames_to_video(frames, output_path, fps)


def convert_frames_to_video(frames, output_path, fps=30):
    first_frame = frames[0]
    height, width, _ = first_frame.shape

    fourcc = cv2.VideoWriter_fourcc(*"avc1")  # You can also use 'XVID', 'MJPG', etc.
    video_writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    for frame in frames:
        video_writer.write(frame)

    video_writer.release()


def main(args):

    data_dir = args.data_dir
    json_items = {}

    for data_foldername in tqdm(os.listdir(data_dir)):
        data_folder = os.path.join(data_dir, data_foldername)
        if not os.path.isdir(data_folder):
            continue

        # Collect all the frame files
        frame_files = []
        for filename in os.listdir(data_folder):
            if filename.endswith(".jpg"):
                frame_files.append(os.path.join(data_folder, filename))
        frame_files.sort()

        # Collect all the annotation files for generating masks
        annotation_files = []
        annotation_fodler = os.path.join(data_folder, "samv2_json")
        for filename in os.listdir(annotation_fodler):
            if filename.endswith(".json"):
                annotation_files.append(os.path.join(annotation_fodler, filename))
        annotation_files.sort()

        # Collect all the mask files for visualization
        mask_files = []
        mask_folder = os.path.join(data_folder, "samv2")
        for filename in os.listdir(mask_folder):
            if filename.endswith(".png"):
                mask_files.append(os.path.join(mask_folder, filename))
        mask_files.sort()

        # Create video with two version, one with mask, one  without mask
        video_folder = os.path.join(data_folder, "videos")
        os.makedirs(video_folder, exist_ok=True)

        video_path = os.path.join(video_folder, "video.mp4")
        convert_frame_files_to_video(frame_files, video_path)

        video_with_mask_path = os.path.join(video_folder, "video_with_mask.mp4")
        convert_masked_frame_to_video(frame_files, mask_files, video_with_mask_path)

        # Generate the first frame with mask
        first_frame_path = frame_files[0]
        first_annotation_path = annotation_files[0]
        first_mask_path = mask_files[0]

        first_frame = cv2.imread(first_frame_path)
        first_mask = cv2.imread(first_mask_path, cv2.IMREAD_UNCHANGED)
        colored_frame = add_masks_to_frame(first_frame, first_mask)
        colored_frame_path = os.path.join(video_folder, "first_frame_with_mask.jpg")
        cv2.imwrite(colored_frame_path, colored_frame)

        # Crop every instance in the first frame, with two version, one with mask, one without mask
        instance_folder = os.path.join(data_folder, "instances")
        os.makedirs(instance_folder, exist_ok=True)
        instance_with_mask_folder = os.path.join(data_folder, "instances_with_mask")
        os.makedirs(instance_with_mask_folder, exist_ok=True)

        masks = extract_masks(first_annotation_path)
        instance_paths = []
        instance_with_mask_paths = []
        for idx, mask in enumerate(masks):
            xyxy = mask_to_xyxy(mask)

            # Crop the instance based on the xyxy coordinates
            x_min, y_min, x_max, y_max = xyxy
            instance = first_frame[y_min:y_max, x_min:x_max]
            instance_with_mask = colored_frame[y_min:y_max, x_min:x_max]

            instance_path = os.path.join(instance_folder, f"instance_{idx}.jpg")
            instance_with_mask_path = os.path.join(
                instance_with_mask_folder, f"instance_{idx}.jpg"
            )

            cv2.imwrite(instance_path, instance)
            cv2.imwrite(instance_with_mask_path, instance_with_mask)

            instance_paths.append(instance_path)
            instance_with_mask_paths.append(instance_with_mask_path)

        json_item = {}
        json_item["first_frame_path"] = first_frame_path
        json_item["first_colored_frame_path"] = colored_frame_path
        json_item["video_path"] = video_path
        json_item["video_with_mask_path"] = video_with_mask_path
        json_item["instance_paths"] = instance_paths
        json_item["instance_with_mask_paths"] = instance_with_mask_paths

        json_items[data_foldername] = json_item

    output_path = "dataset.json"
    print(f"Saving dataset json file to {output_path}")
    with open(output_path, "w") as f:
        json.dump(json_items, f, indent=4)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate dataset json file")
    parser.add_argument("--data_dir", type=str, default="data", help="data directory")
    args = parser.parse_args()
    main(args)
