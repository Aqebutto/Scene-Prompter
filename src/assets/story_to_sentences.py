import re

# Define the target scene length in seconds
target_scene_length = 10

# Define the average reading speed in words per minute
average_reading_speed = 225

# Load the text of the story from a file
with open("story_e03p4.txt", "r") as f:
    text = f.read()

# Remove any extra whitespace from the text
text = re.sub(r"\s+", " ", text)

# Split the text into sentences using a regular expression
sentences = re.split("(?<=[.!?]) +", text)

# Create an empty list to hold the scenes
scenes = []

# Loop over the sentences and group them into scenes
current_scene = ""
current_scene_length = 0
for sentence in sentences:
    # Calculate the reading time for the current sentence
    sentence_length = len(re.findall(r"\w+", sentence))
    sentence_reading_time = sentence_length / average_reading_speed * 60

    # If adding the current sentence to the scene would put it over the target length,
    # add the current scene to the list of scenes and start a new scene
    if current_scene_length + sentence_reading_time > target_scene_length:
        scenes.append(current_scene.strip())
        current_scene = ""
        current_scene_length = 0

    # Add the current sentence to the current scene
    current_scene += sentence + " "
    current_scene_length += sentence_reading_time

    # If the last sentence in the current scene is not a complete sentence,
    # remove it and add the scene to the list of scenes
    if not re.match(r".+[.!?]$", sentence):
        scenes.append(current_scene.strip())
        current_scene = ""
        current_scene_length = 0

# If there is a scene that hasn't been added to the list yet, add it now
if current_scene:
    scenes.append(current_scene.strip())

# Export the scenes to a text file
with open("scenes_e03p04_10.txt", "w") as f:
    for i, scene in enumerate(scenes):
        f.write(f"Time: {i*10}:\n")
        f.write("Find a subject(s) and activity in this text:\n")
        f.write(f"{scene}\n")
        f.write("Now use that subject(s) and activity to make a prompt\n")
        f.write("=" * 80 + "\n")
