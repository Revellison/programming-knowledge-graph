// Структура с данными о темах
const topics = {
    frontend: [
        { id: 'html', title: 'HTML', description: 'Язык разметки для создания веб-страниц', position: 10, progress: 85 },
        { id: 'css', title: 'CSS', description: 'Язык стилей для оформления веб-страниц', position: 25, progress: 70 },
        { id: 'javascript', title: 'JavaScript', description: 'Язык программирования для веб-разработки', position: 40, progress: 60 },
        { id: 'react', title: 'React', description: 'Библиотека для создания пользовательских интерфейсов', position: 55, progress: 50 },
        { id: 'vue', title: 'Vue.js', description: 'Прогрессивный JavaScript-фреймворк', position: 70, progress: 30 }
    ],
    backend: [
        { id: 'nodejs', title: 'Node.js', description: 'Среда выполнения JavaScript', position: 10, progress: 75 },
        { id: 'express', title: 'Express', description: 'Веб-фреймворк для Node.js', position: 30, progress: 60 },
        { id: 'python', title: 'Python', description: 'Язык программирования высокого уровня', position: 50, progress: 40 },
        { id: 'java', title: 'Java', description: 'Объектно-ориентированный язык программирования', position: 70, progress: 20 }
    ],
    cs: [
        { id: 'algorithms', title: 'Алгоритмы', description: 'Основные алгоритмы и структуры данных', position: 15, progress: 65 },
        { id: 'paradigms', title: 'Парадигмы программирования', description: 'Различные подходы к программированию', position: 40, progress: 50 },
        { id: 'patterns', title: 'Паттерны проектирования', description: 'Типовые решения частых проблем', position: 65, progress: 35 }
    ],
    database: [
        { id: 'sql', title: 'SQL', description: 'Язык запросов к реляционным базам данных', position: 20, progress: 70 },
        { id: 'mongodb', title: 'MongoDB', description: 'NoSQL база данных', position: 50, progress: 55 },
        { id: 'redis', title: 'Redis', description: 'In-memory хранилище данных', position: 80, progress: 30 }
    ]
};

// Текущая выбранная категория
let currentCategory = 'frontend';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики клика по категориям
    const categoryLinks = document.querySelectorAll('nav a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            currentCategory = category;
            renderTimeline(category);
        });
    });

    // Отрисовка timeline по умолчанию
    renderTimeline(currentCategory);

    // Добавляем один обработчик клика для всего timeline
    const timeline = document.getElementById('timeline');
    timeline.addEventListener('click', handleNodeClick);
    
    // Обработка касаний для тач-устройств
    if ('ontouchstart' in window) {
        timeline.addEventListener('touchstart', handleTouchStart, false);
        timeline.addEventListener('touchend', handleTouchEnd, false);
    }
    
    // Добавляем обработчик для кнопки переключения оглавления на мобильных
    document.getElementById('toc-toggle').addEventListener('click', toggleTableOfContents);
    
    // Отслеживаем скролл для подсветки активного пункта оглавления
    window.addEventListener('scroll', throttle(highlightActiveSection, 100));
    
    // Обрабатываем изменение размера окна
    window.addEventListener('resize', throttle(handleResize, 250));
    
    // Инициализируем режим мобильного/настольного устройства
    checkMobileView();
});

// Переменные для обработки касаний
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchTarget = null;

// Обработчик начала касания
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchTarget = e.target.closest('.node');
}

// Обработчик окончания касания
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    // Проверяем, что это был тап, а не свайп
    const diffX = Math.abs(touchEndX - touchStartX);
    const diffY = Math.abs(touchEndY - touchStartY);
    
    if (diffX < 10 && diffY < 10 && touchTarget) {
        const id = touchTarget.getAttribute('data-id');
        const category = touchTarget.getAttribute('data-category');
        loadTopicContent(category, id);
    }
}

// Проверка и установка режима представления (мобильный/настольный)
function checkMobileView() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
        
        // На мобильных устройствах скрываем оглавление по умолчанию
        const tocContent = document.getElementById('toc');
        if (tocContent) {
            tocContent.classList.remove('expanded');
        }
    } else {
        document.body.classList.remove('mobile-view');
        
        // На десктопе показываем оглавление сразу
        const tocContent = document.getElementById('toc');
        if (tocContent) {
            tocContent.classList.add('expanded');
        }
    }
}

// Обработчик изменения размера окна
function handleResize() {
    checkMobileView();
    
    // Перерисовываем линию времени для адаптации к новой ширине
    renderTimeline(currentCategory);
}

// Функция для ограничения частоты вызова функции (throttle)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Функция отрисовки timeline
function renderTimeline(category) {
    const timelineEl = document.getElementById('timeline');
    timelineEl.innerHTML = '';

    if (!topics[category]) return;

    topics[category].forEach(topic => {
        const node = document.createElement('div');
        node.className = `node node-${category}`;
        node.style.left = `${topic.position}%`;
        node.setAttribute('data-id', topic.id);
        node.setAttribute('data-title', topic.title);
        node.setAttribute('data-description', topic.description);
        node.setAttribute('data-category', category);

        // Добавляем надпись под точкой
        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = topic.title;
        node.appendChild(label);

        // Добавляем индикатор прогресса
        if (topic.progress > 0) {
            const progress = document.createElement('div');
            progress.className = 'node-progress';
            progress.style.transform = `rotate(${3.6 * topic.progress}deg)`;
            node.appendChild(progress);
        }

        timelineEl.appendChild(node);
    });
}

// Обработчик клика по точке
function handleNodeClick(e) {
    // Находим ближайший элемент .node к месту клика
    const node = e.target.closest('.node');
    if (!node) return;

    const id = node.getAttribute('data-id');
    const category = node.getAttribute('data-category');
    
    // Загружаем контент из MD файла
    loadTopicContent(category, id);
}

// Загрузка контента из MD файла
async function loadTopicContent(category, id) {
    try {
        const response = await fetch(`nodes/${category}/${id}.md`);
        if (!response.ok) {
            throw new Error('Файл не найден');
        }
        
        const mdContent = await response.text();
        const contentEl = document.getElementById('content');
        
        // Используем библиотеку marked для преобразования MD в HTML
        contentEl.innerHTML = marked.parse(mdContent);
        
        // Добавляем id ко всем заголовкам для навигации
        addHeaderIds();
        
        // Создаем оглавление из заголовков
        createTableOfContents();
        
        // Показываем контейнер оглавления
        document.getElementById('toc-container').style.display = 'block';
        
        // Плавная прокрутка к контенту
        contentEl.scrollIntoView({ behavior: 'smooth' });
        
        // Проверяем режим отображения
        if (window.innerWidth <= 768) {
            // На мобильных скрываем содержимое оглавления по умолчанию
            document.getElementById('toc').classList.remove('expanded');
        } else {
            // На десктопе показываем оглавление сразу
            document.getElementById('toc').classList.add('expanded');
        }
        
        // Добавляем обработчик для адаптивных изображений
        makeImagesResponsive();
    } catch (error) {
        console.error('Ошибка загрузки содержимого:', error);
        document.getElementById('content').innerHTML = `
            <h2>Содержимое не найдено</h2>
            <p>К сожалению, содержимое для темы "${id}" в категории "${category}" отсутствует или находится в разработке.</p>
        `;
        // Скрываем контейнер оглавления
        document.getElementById('toc-container').style.display = 'none';
    }
}

// Делаем все изображения в контенте адаптивными
function makeImagesResponsive() {
    const images = document.querySelectorAll('.content img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy'); // Ленивая загрузка для оптимизации
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        // Добавляем обработчик ошибки загрузки
        img.onerror = function() {
            this.style.display = 'none';
        };
        
        // Добавляем обертку для изображений с возможностью горизонтальной прокрутки
        // если изображение слишком широкое
        const parent = img.parentNode;
        if (parent.nodeName !== 'DIV' || !parent.classList.contains('img-container')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('img-container');
            wrapper.style.overflowX = 'auto';
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }
    });
}

// Функция для создания оглавления из заголовков
function createTableOfContents() {
    const contentEl = document.getElementById('content');
    const tocEl = document.getElementById('toc');
    
    // Очищаем предыдущее оглавление
    tocEl.innerHTML = '';
    
    // Получаем все заголовки из содержимого (h1, h2, h3)
    const headers = contentEl.querySelectorAll('h1, h2, h3');
    const tocList = document.createElement('ul');
    
    headers.forEach((header, index) => {
        // Пропускаем самый первый h1, так как он обычно название темы
        if (index === 0 && header.tagName === 'H1') return;
        
        const headerText = header.textContent;
        const headerId = `header-${index}`;
        header.id = headerId;
        
        const listItem = document.createElement('li');
        listItem.className = header.tagName.toLowerCase() === 'h1' ? 'toc-title' : 
                            header.tagName.toLowerCase() === 'h3' ? 'toc-subitem' : '';
        
        const link = document.createElement('a');
        link.href = `#${headerId}`;
        link.textContent = headerText;
        link.setAttribute('data-target', headerId);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(headerId).scrollIntoView({ behavior: 'smooth' });
            
            // Подсвечиваем активный пункт
            const allLinks = document.querySelectorAll('.toc a');
            allLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    // Если есть заголовки, добавляем список в оглавление
    if (tocList.children.length > 0) {
        tocEl.appendChild(tocList);
        document.getElementById('toc-container').style.display = 'block';
    } else {
        // Если заголовков нет, скрываем оглавление
        document.getElementById('toc-container').style.display = 'none';
    }
}

// Функция для переключения видимости оглавления на мобильных
function toggleTableOfContents() {
    const tocContent = document.getElementById('toc');
    const tocToggle = document.getElementById('toc-toggle');
    
    tocContent.classList.toggle('expanded');
    tocToggle.classList.toggle('collapsed');
}

// Функция для подсветки активного раздела в оглавлении
function highlightActiveSection() {
    const headers = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
    
    if (headers.length === 0) return;
    
    // Находим ближайший заголовок к верхней части окна
    let activeHeader = null;
    const scrollPos = window.scrollY + 100; // Небольшой отступ для лучшего определения
    
    for (let i = 0; i < headers.length; i++) {
        const headerPos = headers[i].getBoundingClientRect().top + window.scrollY;
        
        if (headerPos <= scrollPos) {
            activeHeader = headers[i];
        } else {
            break;
        }
    }
    
    if (activeHeader) {
        // Подсвечиваем соответствующий пункт оглавления
        const tocLinks = document.querySelectorAll('.toc a');
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === activeHeader.id) {
                link.classList.add('active');
            }
        });
    }
}

// Функция для добавления id ко всем заголовкам
function addHeaderIds() {
    const contentEl = document.getElementById('content');
    const headers = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headers.forEach((header, index) => {
        if (!header.id) {
            header.id = `header-${index}`;
        }
    });
} 