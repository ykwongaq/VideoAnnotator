import argparse
import csv


def read_csv(csv_file:str):
    """
    Read the csv file and return a list of dictionary that store the data.

    The keys of the dictionary are the headers names. The value of the dictionary are the value.

    The first line of the csv file is the headers
    """
    datas = []
    with open(csv_file, "r", encoding="utf-8") as file:
        reader = csv.reader(file)
        headers = next(reader)
        for row in reader:
            row = [item.strip().replace('\n', '').replace('\r', '') for item in row]
            data = dict(zip(headers, row))
            datas.append(data)
    return datas

def write_csv(csv_file:str, datas:list):
    """
    Write the datas to the csv file.

    The datas is a list of dictionary that store the data.

    The keys of the dictionary are the headers names. The value of the dictionary are the value.

    The first line of the csv file is the headers
    """
    with open(csv_file, "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        headers = datas[0].keys()
        writer.writerow(headers)
        for data in datas:
            row = [data[header] for header in headers]
            writer.writerow(row)

def main(csv_file:str):
    datas = read_csv(csv_file)
    for idx, data in enumerate(datas):
        # Convert idx into 6 digits string
        idx_str = f"{idx:06d}"
        # Change the uuid to the idx_str
        data["uuid"] = idx_str
    output_path = f"{csv_file.split('.')[0]}_output.csv"
    write_csv(output_path, datas)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Video Annotator')
    parser.add_argument('--csv_file', default="metadata.csv", type=str, help='Path to the csv file', required=False)
    args = parser.parse_args()
    main(args.csv_file)