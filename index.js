document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const placeholderImage = 'https://via.placeholder.com/150x150.png?text=Image+Not+Found';
    const logoFallbackImage = 'images/newspaper.png';


    // Global state variables for country and category
    let currentCountry = sessionStorage.getItem('currentCountry') || 'us';
    let currentCategory = sessionStorage.getItem('currentCategory') || 'general';

    const countryNames = {
        'us': 'USA',
        'gb': 'UK',
        'fr': 'France',
        'ru': 'Russia',
        'ca': 'Canada',
        'in': 'India',
        'au': 'Australia'
    };


    const fetchNews = async (countryCode, category) => {
        const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/${countryCode}.json`;

        try {
            //loading message
            newsContainer.innerHTML = '<p class="text-center text-muted">Loading news...</p>';

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'ok' && data.articles.length > 0) {
                // This part is to store the last fetched articles in session storage
                sessionStorage.setItem('lastFetchedArticles', JSON.stringify(data.articles));

                newsContainer.innerHTML = '';

                data.articles.slice(0, 40).forEach((article, index) => {
                    const col = document.createElement('div');
                    col.className = 'col-lg-4 col-md-6 col-12';

                    const card = `
                        <div class="card h-100 news-card" data-index="${index}">
                            <img src="${article.urlToImage || logoFallbackImage}" class="card-img-desktop d-none d-lg-block" alt="${article.title}">
                            
                            <div class="card-body d-flex flex-column">
                                <div class="d-none d-lg-block">
                                    <h5 class="card-title-desktop mb-0">${article.source.name}</h5>
                                    <p class="card-text-desktop">${article.description || 'No description available.'}</p>
                                    <a href="${article.url}" class="read-more-link-desktop mt-auto"  target="_blank">read more</a>
                                </div>

                                <div class="d-lg-none mobile-card-body-content">
                                    <img src="${article.urlToImage || logoFallbackImage}" class="card-img-mobile" alt="${article.title }">
                                    <div class="mobile-card-text-content">
                                        <div class="d-flex align-items-center mb-2">
                                            <h5 class="mobile-card-title mb-0">${article.title}</h5>
                                            <div class="mobile-card-red-dot ms-auto"></div>
                                        </div>
                                        <p class="mobile-card-text">${article.description || 'No description available.'}</p>
                                        <a href="${article.url}" class="mobile-read-more-btn" target="_blank">Read More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    col.innerHTML = card;
                    newsContainer.appendChild(col);
                });

                // Add event listeners to the newly created cards
                const newsCards = document.querySelectorAll('.news-card');
                newsCards.forEach((card, index) => {
                    card.addEventListener('click', () => {
                        const fetchedArticles = JSON.parse(sessionStorage.getItem('lastFetchedArticles'));
                        const article = fetchedArticles[index];
                        sessionStorage.setItem('currentArticle', JSON.stringify(article));
                        window.location.href = 'full-article.html';
                    });
                });

            } else {
                newsContainer.innerHTML = '<p class="text-danger text-center">No news found for this selection.</p>';
            }
        } catch (error) {
            console.error('Fetch error:', error);
            newsContainer.innerHTML = '<p class="text-danger text-center">An error occurred while fetching news.</p>';
        }
    };

    // Helper function to set the active state for countries and save to session storage
    const setActiveCountry = (countryCode) => {
        currentCountry = countryCode;
        sessionStorage.setItem('currentCountry', countryCode);

        // Desktop flags
        document.querySelectorAll('.nav-flags .flag-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.nav-flags .flag-item[data-country-code="${countryCode}"]`)?.classList.add('active');

        // Mobile dropdown
        document.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.dropdown-item[data-country-code="${countryCode}"]`)?.classList.add('active');

        const mobileFlag = document.querySelector('.nav-flags .dropdown-toggle img');
        const mobileCountryName = document.getElementById('mobile-country-name');
        if (mobileFlag) {
            mobileFlag.src = `https://flagcdn.com/${countryCode}.svg`;
            mobileCountryName.textContent = countryNames[countryCode] || countryCode.toUpperCase();
        }
    };

    // Helper function to set the active state for categories and save to session storage
    const setActiveCategory = (category) => {
        currentCategory = category;
        sessionStorage.setItem('currentCategory', category);

        // Desktop tabs
        document.querySelectorAll('.navbar-nav .nav-link').forEach(el => el.classList.remove('active'));
        document.querySelector(`.navbar-nav .nav-link[data-category="${category}"]`)?.classList.add('active');

        const btnDanger = document.querySelector('.btn-danger[data-category="general"]');
        if (btnDanger) {
            if (category === 'general') {
                btnDanger.classList.add('active');
            } else {
                btnDanger.classList.remove('active');
            }
        }

        // Mobile tabs
        document.querySelectorAll('.mobile-tabs .nav-link').forEach(el => el.classList.remove('active'));
        document.querySelector(`.mobile-tabs .nav-link[data-category="${category}"]`)?.classList.add('active');
    };

    //Event listeners for country flags (desktop & mobile)
    document.querySelectorAll('.nav-flags').forEach(parent => {
        parent.addEventListener('click', (e) => {
            const target = e.target.closest('[data-country-code]');
            if (target) {
                e.preventDefault();
                const countryCode = target.dataset.countryCode;
                if (countryCode && currentCountry !== countryCode) {
                    setActiveCountry(countryCode);
                    fetchNews(currentCountry, currentCategory);
                }
            }
        });
    });


    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-category]');
        if (target) {
            e.preventDefault();
            const category = target.dataset.category;
            if (category && currentCategory !== category) {
                setActiveCategory(category);
                fetchNews(currentCountry, currentCategory);
            }
        }
    });


    setActiveCountry(currentCountry);
    setActiveCategory(currentCategory);
    fetchNews(currentCountry, currentCategory);
});

