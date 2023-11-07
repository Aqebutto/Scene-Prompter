import os
import json
from fuzzywuzzy import fuzz


def load_json_prompts(json_file):
    with open(json_file, "r") as f:
        data = json.load(f)
    return [
        {
            "prompt": item["prompt"],
            "time": item["time"],
            "original_text": item.get("original_text", ""),
        }
        for item in data
    ]


def list_png_files(folder_path):
    return [f for f in os.listdir(folder_path) if f.endswith(".png")]


def find_similarities_and_save(prompts_info, file_names, folder_path, output_file):
    results = []

    for prompt_info in prompts_info:
        prompt = prompt_info["prompt"]
        time = prompt_info["time"]
        original_text = prompt_info.get("original_text", "")

        best_match = None
        best_match_score = 0

        for file_name in file_names:
            score = fuzz.token_set_ratio(prompt, file_name)
            if score > best_match_score:
                best_match = file_name
                best_match_score = score

        if best_match_score >= 77:
            old_file_path = os.path.join(folder_path, best_match)
            new_file_name = f"{time}.png"
            new_file_path = os.path.join(folder_path, new_file_name)

            print("Old File Path:", old_file_path)
            print("New File Path:", new_file_path)

            if os.path.exists(old_file_path):
                if not os.path.exists(new_file_path):
                    os.rename(old_file_path, new_file_path)
                    best_match = (
                        new_file_name  # Update best_match to reflect the new file name
                    )
                else:
                    print("File already exists:", new_file_path)
            else:
                print("File not found:", old_file_path)

        results.append(
            {
                "time": time,
                "prompt": prompt,
                "best_match_file": best_match,
                "similarity_score": best_match_score,
                "original_text": original_text,
            }
        )

    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)


if __name__ == "__main__":
    folder_path = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/allPics"
    json_file = "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/scenes.json"
    output_file = (
        "/Users/alex/Documents/CS/Angular/scene-prompter/src/assets/scenes_target.json"
    )

    prompts_info = load_json_prompts(json_file)
    file_names = list_png_files(folder_path)

    find_similarities_and_save(prompts_info, file_names, folder_path, output_file)
