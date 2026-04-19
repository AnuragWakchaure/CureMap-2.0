import csv

file_path = './output/aligned_gdsc.csv'  # Update this path to your actual file location

with open(file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.reader(file)
    # next() fetches the first row and advances the iterator
    header = next(reader)

print(header)