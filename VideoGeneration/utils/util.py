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

