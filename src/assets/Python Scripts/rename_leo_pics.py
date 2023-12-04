import os
import re


def rename_files_in_directory(directory):
    # Pattern to match "leonardo_diffusion_xl_" followed by a number
    # pattern = re.compile(r"leonardo_diffusion_xl_(\d+)")
    pattern = re.compile(r"albedobase_xl_(\d+)")

    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        # Search for the pattern in the filename
        match = pattern.search(filename)
        if match:
            # Extract the number
            number = match.group(1)
            # Create new filename with just the number and the file extension
            new_filename = f"{number}{os.path.splitext(filename)[1]}"
            # Full path for old and new filenames
            old_file = os.path.join(directory, filename)
            new_file = os.path.join(directory, new_filename)
            # Rename the file
            os.rename(old_file, new_file)
            print(f"Renamed '{filename}' to '{new_filename}'")


# Replace 'your_directory_path' with the path to the directory containing your files
rename_files_in_directory(
    "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"
)
