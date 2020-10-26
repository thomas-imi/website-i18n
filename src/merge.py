import json
# orig.json: source that may contain more keys than merge.json
# merge.json: overwrites keys in orig.json if present

def merge(a, b):
    "merges b into a"
    for key, val in b.items():
        print(key)
        a[key] = val
    print(len(a.keys()))
    return a


with open('./orig.json') as fp1:
    with open('./merge.json') as fp2:
        jsondata1 = json.load(fp1)
        jsondata2 = json.load(fp2)
        with open('./out.json', 'w') as f:
            json.dump(merge(jsondata1, jsondata2), f, sort_keys=True)
