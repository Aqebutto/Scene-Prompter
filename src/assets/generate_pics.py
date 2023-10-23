# create.py

import os
import openai

PROMPT = "proclamation heralds the descent of Babylon. The appellation Babylon encompasses not just paganism and the Roman Catholic Church but also religious sects that separated from this church,"

openai.api_key = "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"

response = openai.Image.create(
    prompt=PROMPT,
    n=1,
    size="1024x1024",
)

print(response["data"][0]["url"])
