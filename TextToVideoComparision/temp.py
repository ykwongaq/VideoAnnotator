import json
import ast
import os

text_file = "C://Users//WYK//OneDrive - HKUST Connect//Mphil//Research//VideoGeneration//data//david//winvideos"

files = os.listdir(text_file)
files.sort()

for i, file in enumerate(files):
    number = int(file.split(".")[0])
    if i != number:
        print(i, number)
        break