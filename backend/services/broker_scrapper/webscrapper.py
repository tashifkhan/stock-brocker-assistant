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


def scrape_articles(
    websites: list | None = None, count: int = 5, max_articles: int = 1500
) -> dict:
    """
    Scrapes articles from a list of websites and returns structured data.

    Args:
        websites (list): A list of website URLs to scrape. If None, uses default websites.
        count (int): Maximum number of articles to fetch per website.
        max_articles (int): Maximum number of articles to return after filtering.

    Returns:
        dict: A dictionary containing the scraped articles and metadata.
    """
    if websites is None:
        websites = [
            "http://finance.yahoo.com/",
            "https://www.bloomberg.com/asia",
            "https://www.marketwatch.com/",
            "https://www.reuters.com/business/finance/",
        ]

    # Scrape articles
    results = scrape(websites, count=count)
    valid_results = [r for r in results if r.get("title") and r.get("text")]

    if not valid_results:
        return {
            "status": "success",
            "message": "No valid articles found",
            "total_articles": 0,
            "articles": [],
        }

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

    # Limit to max_articles most recent articles by publish_date (if available)
    def get_date(article):
        return article.get("publish_date") or "0000-00-00"

    filtered_results.sort(key=get_date)
    if len(filtered_results) > max_articles:
        filtered_results = filtered_results[-max_articles:]

    return {
        "status": "success",
        "message": f"Successfully scraped {len(filtered_results)} articles",
        "total_articles": len(filtered_results),
        "articles": filtered_results,
    }


def main():
    """
    Main function for backwards compatibility and testing.
    Now uses scrape_articles and optionally saves to JSON.
    """
    result = scrape_articles(count=5000)

    if result["status"] == "success" and result["total_articles"] > 0:
        # Optionally save to JSON file for backwards compatibility
        output_file = os.path.join(os.path.dirname(__file__), "articles.json")
        with open(output_file, "w", encoding="utf-8") as json_file:
            json.dump(result["articles"], json_file, ensure_ascii=False, indent=4)
        print(f"Scraping completed! Articles saved: {result['total_articles']}")
    else:
        print(result["message"])


if __name__ == "__main__":
    main()
