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
    12.540000000000001,
    9.9,
    14.784,
    13.662,
    12.342,
    7.524,
    12.738000000000001,
    14.652000000000001,
    9.57,
    11.352,
    6.6000000000000005,
    12.408000000000001,
    13.134,
    10.23,
    9.768,
    10.296000000000001,
    10.56,
    8.91,
    9.768,
    11.748000000000001,
    7.590000000000001,
    17.82,
    14.520000000000001,
    13.596,
    7.128,
    8.184000000000001,
    19.866,
    13.200000000000001,
    19.008000000000003,
    14.454,
    12.012,
    16.368000000000002,
    12.276,
    23.1,
    12.804,
    14.388,
    5.478000000000001,
    15.378,
    8.91,
    8.712,
    19.338,
    14.982000000000001,
    4.488,
    11.352,
    10.164,
    11.022,
    15.180000000000001,
    5.412,
    8.448,
    6.996,
    9.768,
    9.108,
    11.286000000000001,
    14.520000000000001,
    12.936,
    8.646,
    13.794,
    13.926,
    5.214,
    13.662,
    6.072,
    10.494,
    18.48,
    12.408000000000001,
    8.712,
    13.992,
    16.830000000000002,
    13.332,
    10.164,
    11.814,
    13.134,
    8.712,
    14.520000000000001,
    6.930000000000001,
    9.702,
    7.194,
    13.398000000000001,
    9.306000000000001,
    13.134,
    8.514000000000001,
    32.472,
    15.84,
    10.626000000000001,
    9.636000000000001,
    6.402,
    10.56,
    14.124,
    9.174000000000001,
    6.666,
    11.022,
    10.164,
    8.184000000000001,
    12.012,
    6.996,
    12.078000000000001,
    5.61,
    15.378,
    9.438,
    12.606,
    11.154,
    13.926,
    9.042,
    14.520000000000001,
    12.21,
    7.854,
]  # Your array of durations for each image, left empty for now
make_video(images_folder, video_folder, durations)
