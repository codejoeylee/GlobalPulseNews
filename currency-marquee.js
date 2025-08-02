document.addEventListener('DOMContentLoaded', () => {
    const fetchAndDisplayCurrency = async () => {
        const marqueeContainer = document.getElementById('currency-marquee');
        const url = 'https://open.er-api.com/v6/latest/USD';

        marqueeContainer.innerHTML = '<span style="padding: 3px 5px;">Loading currency data...</span>';
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.result === 'success' && data.rates) {
                const selectedCurrencies = ['EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'];
                let currencyText = '';

                //scrolling text string
                selectedCurrencies.forEach(currency => {
                    const rate = data.rates[currency];
                    if (rate) {
                        currencyText += `<span>${currency}: ${rate.toFixed(2)}</span>`;
                    }
                });

                marqueeContainer.innerHTML = `
                    <div class="marquee-content-wrapper">
                        <div class="marquee-content">${currencyText}</div>
                        <div class="marquee-content">${currencyText}</div>
                    </div>
                `;
            } else {
                marqueeContainer.innerHTML = '<span>Failed to load currency data.</span>';
            }
        } catch (error) {
            console.error('Currency API fetch error:', error);
            marqueeContainer.innerHTML = '<span>An error occurred.</span>';
        }
    };

    fetchAndDisplayCurrency();
});

