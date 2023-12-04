import os
import random


# Function to generate a list of unique random numbers between 1 and 500
def generate_unique_random_numbers(count):
    if count > 500:
        raise ValueError("Cannot generate more than 500 unique random numbers.")
    unique_numbers = random.sample(range(1, 501), count)
    return unique_numbers


# Function to rename files in a folder with random unique numbers
def rename_files_with_random_numbers(directory):
    # Get a list of file paths in the directory
    files = [
        os.path.join(directory, f)
        for f in os.listdir(directory)
        if os.path.isfile(os.path.join(directory, f))
    ]

    # Get the count of files
    file_count = len(files)

    if file_count > 500:
        print("There are more than 500 files in the folder. Aborting.")
        return

    # Generate a list of unique random numbers for renaming
    unique_random_numbers = generate_unique_random_numbers(file_count)

    # Rename files with random unique numbers
    for i in range(file_count):
        _, ext = os.path.splitext(files[i])
        new_name = f"{unique_random_numbers[i]}{ext}"
        new_path = os.path.join(directory, new_name)
        os.rename(files[i], new_path)

    print(f"Renamed {file_count} files with random unique numbers between 1 and 500.")


# Specify the directory
directory = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/Music"

# Rename files with random unique numbers
rename_files_with_random_numbers(directory)
