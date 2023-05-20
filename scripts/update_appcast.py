import yaml
import json
import sys
from pathlib import Path


def update_appcast(message):
    with open('main.yml', 'r') as file:
        yaml_file = yaml.safe_load(file)
        version = yaml_file['version']
    version_info = {
        "version": version,
        "desc": message,
        "url": f"https://github.com/ysnows/enconvo-azure-tts/releases/download/v{version}/enconvo-azure-tts.enconvoplugin",
        "minAppVersion": "0.5.0"
    }
    appcast_file = Path("appcast.json")
    if appcast_file.is_file():
        with open(appcast_file, "r") as f:
            appcast = json.load(f)
    else:
        appcast = dict(identifier="com.akl.bob-plugin-akl-caiyunxiaoyi-free-translate", versions=[])
    appcast["versions"].insert(0, version_info)
    with open(appcast_file, "w") as f:
        json.dump(appcast, f, ensure_ascii=False, indent=2)
    print(f"v{version}")


if __name__ == "__main__":
    message = sys.argv[1]
    update_appcast(message)
