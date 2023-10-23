import os
from PIL import Image, ImageEnhance
from moviepy.editor import *
import numpy as np

os.environ["IMAGEIO_FFMPEG_EXE"] = "/opt/homebrew/bin/ffmpeg"


# Adjusted sorting function
def sort_key(filename):
    num = int(
        filename.split(".")[0]
    )  # Now considering the number before the .png directly
    return num


def adjust_lighting(image, t, duration):
    midpoint = duration / 2
    factor = 1 + 0.5 * (1 - abs(2 * (t - midpoint) / duration))
    factor = max(factor, 1)
    enhancer = ImageEnhance.Brightness(Image.fromarray(image))
    return np.array(enhancer.enhance(factor))


def make_video(images_folder, video_folder, durations, fps=30):
    if not os.path.exists(video_folder):
        os.makedirs(video_folder)

    files = sorted(
        [f for f in os.listdir(images_folder) if f.endswith(".png")], key=sort_key
    )

    for i, filename in enumerate(files):
        file_path = os.path.join(images_folder, filename)
        video_path = os.path.join(video_folder, f"{filename.split('.')[0]}.mp4")
        duration = durations[i] if i < len(durations) else 2

        clip = ImageClip(file_path, duration=duration)
        # clip = clip.fl(lambda gf, t: adjust_lighting(gf(t), t, duration))
        # clip = clip.resize(lambda t: 1 + 0.3 * (t / duration))
        clip.write_videofile(video_path, fps=fps)


# Call the function
images_folder = "allPics"
video_folder = "allVids"
durations = [
    12.078000000000001,
    12.276,
    12.276,
    12.342,
    11.946,
    12.276,
    12.078000000000001,
    11.88,
    12.276,
    12.474,
    11.748000000000001,
    12.408000000000001,
    12.276,
    12.21,
    12.144,
    12.012,
    12.408000000000001,
    12.144,
    12.474,
    12.408000000000001,
    12.408000000000001,
    12.342,
    12.474,
    12.342,
    12.342,
    12.144,
    12.474,
    12.144,
    12.408000000000001,
    12.078000000000001,
    12.276,
    12.21,
    12.21,
    12.078000000000001,
    12.21,
    12.276,
    12.276,
    12.144,
    12.276,
    12.474,
    12.342,
    12.342,
    12.408000000000001,
    12.408000000000001,
    12.276,
    12.276,
    12.276,
    12.408000000000001,
    12.408000000000001,
    12.474,
    12.408000000000001,
    12.276,
    12.342,
    12.408000000000001,
    12.408000000000001,
    12.276,
    12.276,
    12.012,
    11.748000000000001,
    11.946,
    12.276,
    11.946,
    12.276,
    12.408000000000001,
    12.012,
    12.012,
    12.342,
    12.21,
    12.408000000000001,
    12.21,
    11.946,
    12.144,
    11.88,
    12.408000000000001,
    12.408000000000001,
    12.276,
    12.408000000000001,
    12.342,
    12.408000000000001,
    12.408000000000001,
    12.276,
    12.342,
    12.342,
    12.21,
    12.408000000000001,
    12.342,
    12.408000000000001,
    12.474,
    12.144,
    12.012,
    12.276,
    12.276,
    12.342,
    12.408000000000001,
    12.408000000000001,
    12.342,
    11.748000000000001,
    12.342,
    12.342,
    12.474,
    12.144,
    12.342,
    12.342,
    12.474,
    12.342,
    12.276,
    12.144,
    12.342,
    12.342,
    12.276,
    12.408000000000001,
    12.408000000000001,
    11.946,
    12.474,
    12.342,
    12.276,
    11.748000000000001,
    12.474,
    12.408000000000001,
    12.342,
    12.144,
    12.408000000000001,
    12.078000000000001,
    11.88,
    12.408000000000001,
    12.408000000000001,
    12.408000000000001,
    12.012,
    12.408000000000001,
    12.342,
    12.342,
    12.078000000000001,
    12.144,
    12.342,
    12.078000000000001,
    12.276,
    12.408000000000001,
    12.012,
    12.474,
    12.408000000000001,
    12.144,
    11.88,
    12.276,
    12.276,
    12.408000000000001,
    12.342,
    12.474,
    12.474,
    12.408000000000001,
    12.474,
    12.474,
    12.276,
    11.88,
    12.408000000000001,
    12.474,
    12.408000000000001,
    12.342,
    12.342,
    12.342,
    12.342,
    12.474,
    12.144,
    12.276,
    12.342,
    12.474,
    12.144,
    12.474,
    12.144,
    12.474,
    11.946,
    12.276,
    12.21,
    8.58,
]  # Your array of durations for each image, left empty for now
make_video(images_folder, video_folder, durations)
