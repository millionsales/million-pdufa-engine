import yfinance as yf
import json
import re
from datetime import datetime, date

# ─── TICKERS TO UPDATE ───
TICKERS = ["AXSM", "VRDN", "VERA", "RVMD", "GRCE", "ARGX", "BIIB", "CING", "LNTH", "NUVL", "BPMC"]

def get_prices():
    prices = {}
    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")
            if not hist.empty:
                price = round(hist["Close"].iloc[-1], 2)
                prices[ticker] = price
                print(f"  {ticker}: ${price}")
            else:
                print(f"  {ticker}: No data")
        except Exception as e:
            print(f"  {ticker}: Error — {e}")
    return prices

def update_dashboard(prices):
    with open("Million_PDUFA_Engine.html", "r") as f:
        html = f.read()

    # Update each ticker's currentPrice in the CATALYSTS array
    for ticker, price in prices.items():
        # Pattern matches currentPrice for this ticker in the data object
        pattern = rf'(ticker:"{ticker}"[^}}]*?currentPrice:)\d+\.?\d*'
        replacement = rf'\g<1>{price}'
        html = re.sub(pattern, replacement, html, flags=re.DOTALL)

    # Update the "last updated" date
    today = datetime.now().strftime("%B %-d, %Y")
    html = re.sub(
        r'Updated [A-Za-z]+ \d+, \d{4}',
        f'Updated {today}',
        html
    )

    with open("Million_PDUFA_Engine.html", "w") as f:
        f.write(html)

    print(f"\nDashboard updated: {today}")

def main():
    print("Million PDUFA Engine — Price Update")
    print(f"Running: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}")
    print("─" * 40)
    print("Fetching prices...")
    prices = get_prices()

    if not prices:
        print("No prices fetched. Aborting.")
        return

    print("\nUpdating dashboard...")
    update_dashboard(prices)
    print("Done.")

if __name__ == "__main__":
    main()
