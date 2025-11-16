from typing import Optional
import os
import re
import base64
from pathlib import Path
from docx import Document  # type: ignore

try:
    import pymupdf4llm as fitz  # type: ignore

except ImportError:  # pragma: no cover - fallback when pymupdf4llm not available
    import fitz  # type: ignore



"""

Utility to convert PDFs to Markdown using PyMuPDF (pymupdf / pymupdf4llm).
Creates simple heading detection via font-size heuristics, preserves basic
inline bold/italic from font names, detects bullets, and can extract images.
"""


def _sanitize_md(text: str) -> str:
    # minimal escaping for Markdown-sensitive characters at line starts
    text = text.replace("\r", "")
    text = re.sub(r"\t", "    ", text)
    return text


def _wrap_emphasis(text: str, is_bold: bool, is_italic: bool) -> str:
    if not text:
        return text
    if is_bold and is_italic:
        return f"***{text}***"
    if is_bold:
        return f"**{text}**"
    if is_italic:
        return f"*{text}*"
    return text


def convert_pdf_to_md(pdf_path: str, images_dir: Optional[str] = None, include_images: bool = True) -> str:
    """
    Convert a PDF to a Markdown string.

    Args:
        pdf_path: path to the PDF file.
        images_dir: directory where extracted images will be saved (if included).
        include_images: whether to extract and include images in the Markdown.

    Returns:
        Markdown text as a single string.
    """
    doc = fitz.open(pdf_path) # type: ignore

    # Gather font sizes to build heading heuristics
    sizes = {}
    for page in doc:
        page_dict = page.get_text("dict")
        for block in page_dict.get("blocks", []): # type: ignore
            if block.get("type") != 0:
                continue
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    sz = round(float(span.get("size", 0)), 2)
                    sizes[sz] = sizes.get(sz, 0) + 1

    # sort sizes by frequency * size to prefer commonly used large fonts as headings
    unique_sizes = sorted(sizes.keys(), reverse=True)
    # map the top sizes to heading levels (largest -> h1, next -> h2, next -> h3)
    size_to_heading = {}
    for idx, sz in enumerate(unique_sizes[:3]):  # only top 3 sizes become headings
        size_to_heading[sz] = idx + 1

    md_lines = []
    total_pages = doc.page_count
    for pno in range(total_pages):
        page = doc.load_page(pno)
        page_dict = page.get_text("dict")

        # Extract blocks in reading order
        for block in page_dict.get("blocks", []): # type: ignore
            btype = block.get("type")
            if btype == 0:  # text block
                for line in block.get("lines", []):
                    # determine dominant font size in the line
                    line_sizes = [round(float(s.get("size", 0)), 2) for s in line.get("spans", []) if s.get("text")]
                    dominant_size = max(line_sizes) if line_sizes else 0
                    heading_level = size_to_heading.get(dominant_size, 0)

                    # build line text by spans, preserving bold/italic heuristics
                    span_texts = []
                    
                    for span in line.get("spans", []):
                        txt = span.get("text", "")
                        if not txt.strip():
                            span_texts.append(txt)
                            continue
                        fontname = span.get("font", "") or ""
                        fontname_lower = fontname.lower()
                        is_bold = "bold" in fontname_lower or "black" in fontname_lower
                        is_italic = "italic" in fontname_lower or "oblique" in fontname_lower
                        wrapped = _wrap_emphasis(txt, is_bold, is_italic)
                        span_texts.append(wrapped)
                    
                    raw_line = "".join(span_texts).strip()
                    raw_line = _sanitize_md(raw_line)

                    if not raw_line:
                        continue

                    # bullet detection: common bullet characters or leading dash/star
                    if re.match(r"^[\u2022\u2023\u25E6\u2043\-\*\o]\s+", raw_line):
                        md_lines.append(f"- {re.sub(r'^[\u2022\u2023\u25E6\u2043\-\*\o]\s+', '', raw_line)}")
                        continue

                    if heading_level:
                        # heading_level 1..3 mapped to '#', '##', '###'
                        md_lines.append(f"{'#' * heading_level} {raw_line}")
                    else:
                        md_lines.append(raw_line)

            elif btype == 1 and include_images:  # image block
                # block['image'] is a dict with xref on PyMuPDF outputs
                imginfo = block.get("image", {})
                xref = imginfo.get("xref")
                
                if xref:
                    try:
                        img_dict = doc.extract_image(xref)
                        img_bytes = img_dict.get("image")
                        img_ext = img_dict.get("ext", "png")
                        if images_dir:
                            os.makedirs(images_dir, exist_ok=True)
                            img_name = f"page{pno+1}_img{xref}.{img_ext}"
                            img_path = os.path.join(images_dir, img_name)
                            with open(img_path, "wb") as f:
                                f.write(img_bytes) # type: ignore
                            md_lines.append(f"![image]({img_path})")
                        else:
                            # embed as data URI (note: large PDFs -> large MD)
                            b64 = base64.b64encode(img_bytes).decode("ascii") # type: ignore
                            md_lines.append(f"![image](data:image/{img_ext};base64,{b64})")
                    
                    except Exception:
                        # fallback: skip image on errors
                        continue
            else:
                # other block types (e.g., drawings) are ignored
                continue

        # page break marker
        if pno != total_pages - 1:
            md_lines.append("\n---\n")

    return "\n".join(md_lines).strip()


def convert_docx_to_md(docx_path: str) -> str:

    doc = Document(docx_path)  # type: ignore[misc]
    md_lines = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            md_lines.append("")
            continue

        style_name = para.style.name if para.style else ""
        if style_name.lower().startswith("heading"):
            # Extract heading level digits, default to 1 if missing
            digits = "".join(ch for ch in style_name if ch.isdigit())
            level = max(1, min(int(digits or "1"), 6))
            md_lines.append(f"{'#' * level} {text}")
        
        elif "list" in style_name.lower():
            md_lines.append(f"- {text}")
        
        else:
            md_lines.append(text)

    return "\n\n".join(line for line in md_lines if line is not None).strip()


def convert_document_to_md(path: str, **kwargs) -> str:
    ext = Path(path).suffix.lower()
    
    if ext == ".pdf":
        return convert_pdf_to_md(path, **kwargs)
    
    if ext == ".docx":
        return convert_docx_to_md(path)
    
    raise ValueError("Unsupported file type. Only PDF and DOCX files are supported.")


__all__ = [
    "convert_pdf_to_md",
    "convert_docx_to_md",
    "convert_document_to_md",
]