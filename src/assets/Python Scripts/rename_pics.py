# import os
# import re

# # Path to the directory containing the images
# image_directory = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"

# # Iterate over all files in the directory
# for filename in os.listdir(image_directory):
#     # Check if the file matches the pattern 'whitespike77${time}_*.png'
#     match = re.match(r"whitespike77_(\d+)_.*\.png", filename)
#     if match:
#         # Extract the time from the filename
#         time = match.group(1)
#         # Rename the file to '${time}.png'
#         new_filename = f"{time}.png"
#         old_path = os.path.join(image_directory, filename)
#         new_path = os.path.join(image_directory, new_filename)
#         os.rename(old_path, new_path)
#         print(f"Renamed {filename} to {new_filename}")
#     else:
#         print(f"No match found for file: {filename}")  # Debug print
import os
import re

# Path to the directory containing the images
image_directory = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"

# Initialize a counter starting from 0
counter = 0

# Iterate over all files in the directory
for filename in sorted(os.listdir(image_directory)):
    # Check if the file is a PNG file
    if filename.endswith(".png"):
        # Rename the file to a number based on the counter, preserving the '.png' extension
        new_filename = f"{counter}.png"
        old_path = os.path.join(image_directory, filename)
        new_path = os.path.join(image_directory, new_filename)
        os.rename(old_path, new_path)
        print(f"Renamed {filename} to {new_filename}")
        # Increment the counter by 10
        counter += 10
