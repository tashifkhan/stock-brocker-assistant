import os
import shutil
from nltk.data import find
import nltk
import newspaper
import json


def ensure_nltk_resource(resource_name):
    nltk_data_dir = os.path.join(
        os.path.dirname(
            os.path.abspath(
                __file__,
            )
        ),
        "nltk_data",
    )
    os.makedirs(nltk_data_dir, exist_ok=True)

    if nltk_data_dir not in nltk.data.path:
        nltk.data.path.append(nltk_data_dir)

    try:
        find(resource_name)

    except LookupError:
        print(
            f"NLTK resource not found: {resource_name}. Attempting download into {nltk_data_dir}"
        )
        # Try to download the requested resource; if that fails, try sensible fallbacks
        downloaded = False
        try:
            downloaded = nltk.download(resource_name, download_dir=nltk_data_dir)
        except Exception as e:
            print(f"nltk.download() raised an exception for {resource_name}: {e}")

        if not downloaded:
            # Common fallback: 'punkt' is the base tokenizer package
            if resource_name != "punkt":
                try:
                    print("Attempting fallback download: 'punkt'")
                    nltk.download("punkt", download_dir=nltk_data_dir)
                except Exception as e:
                    print(f"Fallback download failed: {e}")

        # final attempt to locate the resource (no exception raised here intentionally)
        try:
            find(resource_name)
        except LookupError:
            print(
                f"Warning: NLTK resource '{resource_name}' still not found after download attempts."
            )


ensure_nltk_resource("punkt")
ensure_nltk_resource("punkt_tab")
ensure_nltk_resource("stopwords")

# Path to the cache folder
CACHE_FOLDER = os.path.join(
    os.path.dirname(__file__),
    ".newspaper_scraper",
)


def clear_cache():
    """
    Clears the newspaper cache folder to force fresh scraping of all articles.
    """
    if os.path.exists(CACHE_FOLDER):
        try:
            shutil.rmtree(CACHE_FOLDER)  # Delete the cache folder
            print("Cache cleared successfully.")

        except Exception as e:
            print(f"Failed to clear cache: {e}")

    else:
        print("No cache to clear.")


def scrape(websites: list, count: int = 5) -> list:
    """
    Scrapes articles from a list of websites and extracts metadata, including thumbnails.

    Args:
        websites (list): A list of website URLs to scrape.
        count (int): Maximum number of articles to fetch per website.

    Returns:
        list: A list of dictionaries, each containing metadata and content for an article.
    """
    articles_data = []
    temp = count

    for website in websites:
        temp = count
        try:
            site = newspaper.build(
                website,
                language="en",
                memorize=False,
            )
            print(f"Links from {website} = {len(site.articles)}")

            for article in site.articles:
                try:
                    if temp == 0:
                        break
                    article.download()
                    article.parse()
                    article.nlp()

                    articles_data.append(
                        {
                            "link": article.url,
                            "title": article.title,
                            "text": article.text,
                            "author": article.authors,
                            "publish_date": (
                                article.publish_date.strftime("%Y-%m-%d")
                                if article.publish_date
                                else None
                            ),
                            "keywords": article.keywords,
                            "tags": list(article.tags),
                            "thumbnail": article.top_image,
                        }
                    )
                    temp -= 1

                except Exception as e:
                    print(f"Failed to parse article: {article.url}. Error: {e}")
                    continue

        except Exception as e:
            print(f"Failed to process website: {website}. Error: {e}")
            continue

    print("**Finished Parsing**")
    print(f"Total Articles - {len(articles_data)}")
    return articles_data


def save_to_json(data, output_file):
    """
    Prepends the given data to an existing JSON file or creates a new file if none exists.

    Args:
        data (list): The data to save (list of dictionaries).
        output_file (str): The filename to save the data into.
    """
    try:

        if os.path.exists(output_file):
            with open(
                output_file,
                "r",
                encoding="utf-8",
            ) as json_file:
                existing_data = json.load(json_file)

        else:
            existing_data = []

        # Prepend new data to existing data
        combined_data = data + existing_data

        # Save updated data back to the file
        with open(output_file, "w", encoding="utf-8") as json_file:
            json.dump(combined_data, json_file, ensure_ascii=False, indent=4)

        print(f"Data saved to {output_file}")

    except Exception as e:
        print(f"Failed to save data to JSON. Error: {e}")


def main():
    import os

    # Scrape articles from websites
    websites = [
        "http://finance.yahoo.com/",
        "https://www.bloomberg.com/asia",
        "https://www.marketwatch.com/,",
        "https://www.reuters.com/business/finance/",
    ]

    results = scrape(websites, count=5000)
    valid_results = [r for r in results if r.get("title") and r.get("text")]

    if not valid_results:
        print("No valid results to save")
        return

    # Remove unwanted articles by title and text
    unwanted_texts = [
        "",
        "Get App for Better Experience",
        "Log onto movie.ndtv.com for more celebrity pictures",
        "No description available.",
    ]
    filtered_results = [
        r
        for r in valid_results
        if not (
            r["title"]
            and any(
                brand in r["title"].lower()
                for brand in ["dell", "hp", "acer", "lenovo"]
            )
            or r["text"] in unwanted_texts
        )
    ]

    # Limit to 1500 most recent articles by publish_date (if available)
    def get_date(article):
        return article.get("publish_date") or "0000-00-00"

    filtered_results.sort(key=get_date)
    if len(filtered_results) > 1500:
        filtered_results = filtered_results[-1500:]

    # Save to JSON file
    output_file = os.path.join(os.path.dirname(__file__), "articles.json")
    save_to_json(filtered_results, output_file)
    print(f"Scraping completed! Articles saved: {len(filtered_results)}")


if __name__ == "__main__":
    main()
