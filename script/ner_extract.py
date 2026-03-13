import json
from collections import defaultdict
from pathlib import Path

import hanlp

BASE_DIR = Path(__file__).parent
INPUT_FILE = BASE_DIR / "hotsearch.txt"
OUTPUT_DIR = BASE_DIR / "ner_output"
OUTPUT_DIR.mkdir(exist_ok=True)

BATCH_SIZE = 128
MAX_LINES = 9999999
NO_NER_KEY = "_NO_NER"

lines = INPUT_FILE.read_text(encoding="utf-8").splitlines()[:MAX_LINES]
lines = [line.strip() for line in lines if line.strip()]
print(f"共读取 {len(lines)} 行文本")

print("正在加载 HanLP MTL 模型...")
HanLP = hanlp.load(hanlp.pretrained.mtl.CLOSE_TOK_POS_NER_SRL_DEP_SDP_CON_ERNIE_GRAM_ZH)
print("模型加载完成")

tag_dict: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
total_nr = 0

for batch_start in range(0, len(lines), BATCH_SIZE):
    batch = lines[batch_start : batch_start + BATCH_SIZE]
    doc = HanLP(batch, tasks=["tok/fine", "pos/ctb", "ner/ontonotes"])

    tokens_batch: list[list[str]] = doc["tok/fine"]
    pos_batch: list[list[str]] = doc["pos/ctb"]
    ner_batch: list[list[tuple]] = doc["ner/ontonotes"]

    for sent_idx in range(len(batch)):
        tokens = tokens_batch[sent_idx]
        pos_tags = pos_batch[sent_idx]
        ner_spans = ner_batch[sent_idx]

        idx_to_ner: dict[int, str] = {}
        for word, tag, start, end in ner_spans:
            for i in range(start, end):
                idx_to_ner[i] = tag

        for tok_idx, (tok, pos) in enumerate(zip(tokens, pos_tags)):
            if pos == "NR":
                total_nr += 1
                ner_tag = idx_to_ner.get(tok_idx, NO_NER_KEY)
                tag_dict[ner_tag][tok] += 1

    processed = min(batch_start + BATCH_SIZE, len(lines))
    print(f"  已处理 {processed}/{len(lines)} 行")

print(f"\n共发现 {total_nr} 个 NR 词汇")
print(f"涉及 NER 标签: {sorted(tag_dict.keys())}")

for ner_tag, word_counts in sorted(tag_dict.items()):
    sorted_counts = dict(sorted(word_counts.items(), key=lambda x: x[1], reverse=True))
    filename = f"nr_{ner_tag.lower()}.json"
    out_path = OUTPUT_DIR / filename
    out_path.write_text(
        json.dumps(sorted_counts, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"  {ner_tag}: {len(sorted_counts)} 个词汇 → {out_path}")

print("\n完成！")
