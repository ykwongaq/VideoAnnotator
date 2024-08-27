# How to Use

## 1. Install Python Environment

Please install the following packages:

```bash
pip install numpy opencv-python tqdm pycocotools
```

## 2. Prepare Data

Create the `data` folder and place all the data there. The folder structure should be

```
data
|- scene_1
	|- samv2_json
		|- 00000.json
		|- 00001.json
		|- 00002.json
		|- ...
    |- samv2
    	|- 00000.png
    	|- 00001.png
    	|- 00002.png
    	|- ...
    |- 00000.jpg
    |- 00001.jpg
    |- 00002.jpg
    |- ...
|- scene_2
	|- ...
```

After the data is ready, run `prepare_data.py`

```bash
python prepare_data.py
```

The program will generate a `dataset.json` file for later use.

## 3. Annotation

Double click `index.html` to launch annotation and upload the `dataset.json`

Please specify the `common name` and `scientific name` of the target creature, and its behavior by filling corresponding boxes.

![annotator](img\annotator.png)

The result will be automatically saved and downloaded as `json` file, when you click the `Next` button.

