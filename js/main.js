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

let currentCategory = 'frontend';

document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('nav a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            currentCategory = category;
            renderTimeline(category);
        });
    });

    renderTimeline(currentCategory);

    const timeline = document.getElementById('timeline');
    timeline.addEventListener('click', handleNodeClick);
    
    if ('ontouchstart' in window) {
        timeline.addEventListener('touchstart', handleTouchStart, false);
        timeline.addEventListener('touchend', handleTouchEnd, false);
    }
    
    document.getElementById('toc-toggle').addEventListener('click', toggleTableOfContents);
    
    window.addEventListener('resize', throttle(handleResize, 250));
    
    checkMobileView();
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchTarget = null;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchTarget = e.target.closest('.node');
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const diffX = Math.abs(touchEndX - touchStartX);
    const diffY = Math.abs(touchEndY - touchStartY);
    
    if (diffX < 10 && diffY < 10 && touchTarget) {
        const id = touchTarget.getAttribute('data-id');
        const category = touchTarget.getAttribute('data-category');
        loadTopicContent(category, id);
    }
}

function checkMobileView() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
        
        const tocContent = document.getElementById('toc');
        if (tocContent) {
            tocContent.classList.remove('expanded');
        }
    } else {
        document.body.classList.remove('mobile-view');
        
        const tocContent = document.getElementById('toc');
        if (tocContent) {
            tocContent.classList.add('expanded');
        }
    }
}

function handleResize() {
    checkMobileView();
    renderTimeline(currentCategory);
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

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

        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = topic.title;
        node.appendChild(label);

        if (topic.progress > 0) {
            const progress = document.createElement('div');
            progress.className = 'node-progress';
            progress.style.transform = `rotate(${3.6 * topic.progress}deg)`;
            node.appendChild(progress);
        }

        timelineEl.appendChild(node);
    });
}

function handleNodeClick(e) {
    const node = e.target.closest('.node');
    if (!node) return;

    const id = node.getAttribute('data-id');
    const category = node.getAttribute('data-category');
    
    loadTopicContent(category, id);
}

async function loadTopicContent(category, id) {
    try {
        const response = await fetch(`nodes/${category}/${id}.md`);
        if (!response.ok) {
            throw new Error('Файл не найден');
        }
        
        const mdContent = await response.text();
        const contentEl = document.getElementById('content');
        
        contentEl.innerHTML = marked.parse(mdContent);
        
        addHeaderIds();
        
        createTableOfContents();
        
        document.getElementById('toc-container').style.display = 'block';
        
        contentEl.scrollIntoView({ behavior: 'smooth' });
        
        if (window.innerWidth <= 768) {
            document.getElementById('toc').classList.remove('expanded');
        } else {
            document.getElementById('toc').classList.add('expanded');
        }
        
        makeImagesResponsive();
    } catch (error) {
        console.error('Ошибка загрузки содержимого:', error);
        document.getElementById('content').innerHTML = `
            <h2>Содержимое не найдено</h2>
            <p>К сожалению, содержимое для темы "${id}" в категории "${category}" отсутствует или находится в разработке.</p>
        `;
        document.getElementById('toc-container').style.display = 'none';
    }
}

function makeImagesResponsive() {
    const images = document.querySelectorAll('.content img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        img.onerror = function() {
            this.style.display = 'none';
        };
        
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

function createTableOfContents() {
    const contentEl = document.getElementById('content');
    const tocEl = document.getElementById('toc');
    
    tocEl.innerHTML = '';
    
    const headers = contentEl.querySelectorAll('h1, h2, h3');
    const tocList = document.createElement('ul');
    
    headers.forEach((header, index) => {
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
            
            const allLinks = document.querySelectorAll('.toc a');
            allLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            requestAnimationFrame(() => {
                document.getElementById(headerId).scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    if (tocList.children.length > 0) {
        tocEl.appendChild(tocList);
        document.getElementById('toc-container').style.display = 'block';
    } else {
        document.getElementById('toc-container').style.display = 'none';
    }
}

function toggleTableOfContents() {
    const tocContent = document.getElementById('toc');
    const tocToggle = document.getElementById('toc-toggle');
    
    tocContent.classList.toggle('expanded');
    tocToggle.classList.toggle('collapsed');
}

function addHeaderIds() {
    const contentEl = document.getElementById('content');
    const headers = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headers.forEach((header, index) => {
        if (!header.id) {
            header.id = `header-${index}`;
        }
    });
}