import re

# Define the target scene length in seconds
target_scene_length = 10

# Load the text of the story from a file
with open("TGSe3.txt", "r") as f:
    text = f.read()

# Remove any extra whitespace from the text
text = re.sub(r"\s+", " ", text)

# Create an empty list to hold the scenes
scenes = []

# Loop over the characters and group them into scenes
current_scene = ""
idx = 0

while idx < len(text):
    # Capture a chunk of text with 190 characters
    end_idx = idx + 190
    if end_idx > len(text):
        end_idx = len(text)
    else:
        # Ensure the scene ends with a whole word
        while end_idx < len(text) and text[end_idx] != " ":
            end_idx -= 1

    # Add the chunk to the current scene
    current_scene = text[idx:end_idx].strip()

    # Add the scene to the list of scenes
    scenes.append(current_scene)

    # Move the index
    idx = end_idx

# Export the scenes to a text file
with open("TGSe3_10.txt", "w") as f:
    for i, scene in enumerate(scenes):
        f.write(f"Time: {i*10}:\n")
        f.write("Find a subject(s) and activity in this text:\n")
        f.write(f"{scene}\n")
        f.write("Now use that subject(s) and activity to make a prompt\n")
        f.write("=" * 4 + "\n")
