# Video Text Comparison

## 1. Data Preparation

You need to first prepare the data in the following format:

```
video_dataset
|- losevideos
	|- video1.mp4
	|- video2.mp4
	|- ...
|- winvideos
	|- video1.mp4
	|- video2.mp4
	|- ...
|- vidpro-10k-1-cn.txt
```

Note that the video name should be the same for corresponding videos.

## 2. Prepare Python Environment

Install needed package:

```bash
pip install Eel
```

## 3. Launch Annotation Tool

In `VideoGenerationComparision`, execute the following script

```bash
python main.py
```

## 4. Annotation Tool

At the top left corner, click the `File` button, we support three actions:

### Action 1: Create Project: 

It will ask you to input two folder

1. For the first folder, you need to input your dataset folder prepared in Step 1
2. For the second folder, you need to input the path for output folder

You annotation record will be stored to the selected output folder

 ### Action 2: Load Project:

In case you leave the project without finishing, you can load the project to resume your process.

Input the output folder you specified in Action 1

### Action 3: Export Result

After you annotated all the video, click this to export the result to desired position. The result will be stored in `result.json`

### 5. Result

The format of the result is a `List` of `Dictionary`:

```json
[
	{
		"video_1": absolute path to the video 1,
		"video_2": absolute path to the video 2,
		"video_1_label": Label of the video 1. Value: ["win", "lose"],
		"video_2_label": Label of the video 2. Value: ["win", "lose"],
		"file_name": Name of the video file, with extension,
		"description" Description of the video,
		"better_video": Id of the better video selected by the user. Value: [1, 2],
	},
]
```



