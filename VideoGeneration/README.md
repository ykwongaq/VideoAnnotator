# VideoAnnotator

A tool for video annotation.

## Environment

We use Python 3.8.

Install the Flask package with:

```
pip install flask
```

## Setup

1. Save all your videos in the `./videos` folder.

2. Prepare the metadata CSV file. The default file is located at `./metadata.csv`.

3. Ensure the `uuid` in the CSV file matches the filenames in the `./videos` folder. For example, `000000` for `./videos/000000.mp4`. Use the following script to verify this:

   ```
   python verify.py --csv_file <path to your csv file>
   ```

## Usage

1. Run the following command:

   ```
   python app.py --csv_file <path to your csv file>
   ```

2. Open `http://127.0.0.1:5000` in your browser.

## Shortcuts

- `A` for the previous image
- `D` for the next image
- `J` for "Left is Better"
- `K` for "Both are Bad"
- `L` for "Right is Better"