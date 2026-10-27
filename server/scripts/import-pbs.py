"""Rebuild the checked-in PBS 2023 urban locality catalogue. Requires openpyxl.
Names retain the source spelling; optional reviewed Urdu labels are preserved.
"""
import io, json, re, urllib.request, pathlib, concurrent.futures
from openpyxl import load_workbook
root = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'data'
root.mkdir(exist_ok=True)
labels_path = root / 'urdu-labels.json'
labels = json.loads(labels_path.read_text(encoding='utf-8')) if labels_path.exists() else {}
def slug(value): return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
def fetch(pair):
    region, filename = pair
    url = 'https://www.pbs.gov.pk/wp-content/uploads/2020/07/table_2_' + filename + '.xlsx'
    request = urllib.request.Request(url, headers={'User-Agent':'TJP catalogue import'})
    raw = urllib.request.urlopen(request, timeout=90).read()
    workbook = load_workbook(io.BytesIO(raw), read_only=True, data_only=True)
    districts, cities = {}, {}
    for sheet in workbook:
        district = None
        for row in sheet.values:
            name = str(row[0] or '').strip()
            if name.endswith(' DISTRICT') or name == 'ISLAMABAD':
                en = name.removesuffix(' DISTRICT').title()
                district = region + ':' + slug(en)
                districts[district] = dict(id=district, region=region, en=en, ur=labels.get(en,en))
            elif district and len(row)>2 and isinstance(row[2], (int,float)) and isinstance(row[1],str) and not name.startswith(('TOTAL','URBAN')):
                en = re.sub(r'\s+', ' ', name).title()
                id = district + ':' + slug(en)
                cities[id] = dict(id=id, region=region, district=district, en=en, ur=labels.get(en,en))
    if not districts or not cities: raise RuntimeError('No data parsed for '+region)
    return dict(region=region, url=url, districts=list(districts.values()), localities=list(cities.values()))
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(fetch, [('punjab','punjab_districts'),('sindh','sindh_districts'),('kp','kp_districts'),('balochistan','balochistan_districts'),('ict','islamabad')]))
catalogue = dict(version='pbs-2023-v1', source='https://www.pbs.gov.pk/result-excel/', districts=[], localities=[])
for result in results:
    print(result['region'], len(result['districts']), len(result['localities']))
    catalogue['districts'].extend(result['districts'])
    catalogue['localities'].extend(result['localities'])
catalogue['sources']=[r['url'] for r in results]
(root/'locations.json').write_text(json.dumps(catalogue,ensure_ascii=False,indent=2),encoding='utf-8')

