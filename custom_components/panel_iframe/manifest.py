import json
import os

CURRENT_PATH = os.path.dirname(__file__)

class Manifest():

    def __init__(self):
        self.manifest_path = os.path.join(CURRENT_PATH, 'manifest.json')
        self.update()

    def update(self):
        with open(self.manifest_path, encoding='utf-8') as f:
            data = json.load(f)
        self.domain = data.get('domain')
        self.name = data.get('name')
        self.version = data.get('version')
        self.documentation = data.get('documentation')

manifest = Manifest()