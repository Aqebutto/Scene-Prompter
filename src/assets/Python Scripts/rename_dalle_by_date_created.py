import os
import datetime


# Function to get the creation date and time of a file
def get_creation_time(filename):
    stat = os.stat(filename)
    return datetime.datetime.fromtimestamp(stat.st_birthtime)


# Function to rename files with incrementing numbers by 10, sorted by creation time
def rename_files_with_numbers_sorted_by_creation_time(directory):
    # Get all file paths
    files = [
        os.path.join(directory, f)
        for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
    ]

    # Sort files by creation time
    sorted_files = sorted(files, key=get_creation_time)

    print("Sorted Files:")
    for file in sorted_files:
        print(os.path.basename(file), get_creation_time(file))

    increment = 0
    for file in sorted_files:
        _, ext = os.path.splitext(file)
        new_name = f"{increment}{ext}"
        new_path = os.path.join(directory, new_name)
        os.rename(file, new_path)
        increment += 10


# Specify the directory
directory = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"

# Rename files
rename_files_with_numbers_sorted_by_creation_time(directory)

print("File renaming completed.")
