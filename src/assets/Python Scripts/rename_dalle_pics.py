import os
from datetime import datetime

# Directory where the files are located (replace with the actual path to your files)
directory = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"

# List all files in the directory and sort them based on the timestamp in the filename
files = os.listdir(directory)


# Define a function to extract the datetime object from the filename
def extract_datetime(filename):
    try:
        # Extract the date and time part from the filename using the known format
        # which starts after "DALL·E " and ends before the third space
        parts = filename.split(" ")
        datetime_str = " ".join(parts[1:3])
        # Parse the date and time string into a datetime object
        return datetime.strptime(datetime_str, "%Y-%m-%d %H.%M.%S")
    except ValueError as e:
        print(f"Error parsing datetime from filename '{filename}': {e}")
        return None


# Filter out any files that do not have a valid date and time
filtered_files = [f for f in files if extract_datetime(f) is not None]

# Sort the files based on the extracted datetime
filtered_files.sort(key=extract_datetime)

# Rename files
counter = 0
for filename in filtered_files:
    # Split the extension from the file name
    file_base, file_extension = os.path.splitext(filename)

    # Construct the new filename using the counter
    new_filename = f"{counter}{file_extension}"

    # Create the full file paths
    old_file = os.path.join(directory, filename)
    new_file = os.path.join(directory, new_filename)

    # Rename the file
    os.rename(old_file, new_file)
    print(f"Renamed '{filename}' to '{new_filename}'")

    # Increment the counter for the next file
    counter += 10
