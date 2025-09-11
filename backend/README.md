steps

step 1 - mac/linux only (if windows google how to install uv)

```
brew install uv
```

step 2

```
cd backend
```

step 3

```
uv sync
```

step 4

```
cd broker-scrapper
```

step 5

```
uv run webscrapper.py
```

output will be save in a file called

`articles.json`

the website links are stored in a list
here ->

```
def main():
    import os

    # Scrape articles from websites
    websites = [
        "http://finance.yahoo.com/",
        "https://www.bloomberg.com/asia",
        "https://www.marketwatch.com/,",
        "https://www.reuters.com/business/finance/",
    ]

```
