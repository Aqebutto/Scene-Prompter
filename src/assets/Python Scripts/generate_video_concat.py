import os

os.environ["IMAGEIO_FFMPEG_EXE"] = "/opt/homebrew/bin/ffmpeg"
from PIL import Image, ImageEnhance
from moviepy.editor import *
import numpy as np


# Array of durations for each image
picsLengthArray = [
   
]


def sort_key(filename):
    num = int(filename.split("_")[1].split(".")[0])
    return num


def adjust_lighting(image, t, duration):
    midpoint = duration / 2
    factor = 1 + 0.5 * (1 - abs(2 * (t - midpoint) / duration))  # Adjusted formula
    factor = max(factor, 1)  # Ensure factor is never less than 1
    enhancer = ImageEnhance.Brightness(Image.fromarray(image))
    return np.array(enhancer.enhance(factor))


def custom_zoom(t, duration):
    return 1.3


def make_video(images_folder, video_path, durations, fps=30):
    # Get and sort the list of files in the specified folder
    files = sorted(
        [
            f
            for f in os.listdir(images_folder)
            if f.startswith("Whitespike_") and f.endswith(".png")
        ],
        key=sort_key,  # Add this line
    )

    # Create ImageClip objects with specified or default durations
    clips = []
    for i, filename in enumerate(files):
        file_path = os.path.join(images_folder, filename)
        duration = durations[i] if i < len(durations) else 2
        clip = ImageClip(file_path, duration=duration)
        clip = clip.fl(lambda gf, t: adjust_lighting(gf(t), t, duration))
        clip = clip.resize(lambda t: 1 + 0.3 * (t / duration))
        clips.append(clip)

    # Concatenate clips and write the output video file
    if clips:
        concat_clip = concatenate_videoclips(clips, method="compose")
        concat_clip.write_videofile(video_path, fps=fps)
    else:
        print("No video clips were found. Video not created.")


# Call the function
images_folder = "Pics"
video_path = "output_video.mp4"
make_video(images_folder, video_path, picsLengthArray)
