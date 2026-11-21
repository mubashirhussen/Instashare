import json
import re

def enrich():
    with open('socialshield_backend/data/reels_db.json', 'r', encoding='utf-8') as f:
        reels = json.load(f)

    for i, r in enumerate(reels):
        user_name = r.get('user_name', 'creator')
        r['creator_id'] = f'creator_{user_name}'
        r['subcategory'] = r.get('topic', 'General')
        caption = r.get('caption', '')
        extracted_tags = re.findall(r'#\w+', caption)
        cat_tag = '#' + re.sub(r'[^a-zA-Z0-9]', '', r.get('category', 'reels'))
        all_tags = list(dict.fromkeys(extracted_tags + [cat_tag]))
        r['hashtags'] = all_tags
        r['duration'] = 25 + (i * 7) % 35  # between 25 and 59 seconds
        likes = r.get('likes_count', 100)
        r['shares_count'] = max(10, int(likes * 0.08) + (i * 13) % 150)
        r['saves_count'] = max(15, int(likes * 0.14) + (i * 19) % 200)
        r['content_source'] = 'verified_partner' if r.get('is_verified') else 'creator_community'
        r['content_visibility'] = 'public'
        r['status'] = 'active'

    with open('socialshield_backend/data/reels_db.json', 'w', encoding='utf-8') as f:
        json.dump(reels, f, indent=2, ensure_ascii=False)

    with open('src/data/reelsData.json', 'w', encoding='utf-8') as f:
        json.dump(reels, f, indent=2, ensure_ascii=False)

    print(f'Successfully enriched {len(reels)} reels with comprehensive recommendation metadata.')

if __name__ == '__main__':
    enrich()
