import os


def find_mismatched_pictures(folder_path):
    # Extract numbers from filenames
    numbers = [
        int(filename.replace(".png", ""))
        for filename in os.listdir(folder_path)
        if filename.endswith(".png") and filename.replace(".png", "").isdigit()
    ]

    # Sort the numbers and find missing increments
    numbers.sort()
    for i in range(len(numbers) - 1):
        if numbers[i + 1] - numbers[i] != 10:
            print(f"Missing increment from {numbers[i]} to {numbers[i+1]}")


# Use the function
folder_path = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"
find_mismatched_pictures(folder_path)
