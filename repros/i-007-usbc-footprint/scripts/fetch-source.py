"""Archive the EasyEDA API result used for C37616412, without 3D enrichment."""
import json
import urllib.request

# Exact component UUID from the captured C37616412 search result.
fixture = json.load(open("evidence/easyeda-C37616412.json"))
uuid = fixture["uuid"]
url = f"https://easyeda.com/api/components/{uuid}?version=6.4.7&uuid={uuid}&datastrid="
request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://easyeda.com/editor"})
with urllib.request.urlopen(request, timeout=60) as response:
    result = json.load(response)["result"]
assert result["lcsc"]["number"] == "C37616412"
with open("evidence/easyeda-C37616412.json", "w") as output:
    json.dump(result, output, indent=2)
    output.write("\n")
print(url)
