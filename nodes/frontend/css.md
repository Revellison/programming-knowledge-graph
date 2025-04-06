# CSS

CSS (Cascading Style Sheets) — это язык таблиц стилей, используемый для описания внешнего вида документа, написанного на HTML.

## Основы CSS

CSS позволяет разделить содержимое и представление веб-страницы. Это позволяет легко изменять внешний вид страницы без изменения ее структуры.

### Синтаксис CSS

```css
селектор {
    свойство: значение;
    другое-свойство: другое-значение;
}
```

### Подключение CSS к HTML

**Встроенные стили:**

```html
<p style="color: red; font-size: 16px;">Это красный текст размером 16px.</p>
```

**Внутренние стили:**

```html
<head>
    <style>
        p {
            color: blue;
            font-size: 18px;
        }
    </style>
</head>
```

**Внешние стили:**

```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

## Селекторы

### Селектор по элементу

```css
p {
    color: blue;
}
```

### Селектор по классу

```css
.my-class {
    color: green;
}
```

HTML:
```html
<p class="my-class">Этот текст будет зеленым.</p>
```

### Селектор по ID

```css
#header {
    background-color: black;
    color: white;
}
```

HTML:
```html
<div id="header">Заголовок сайта</div>
```

### Комбинированные селекторы

```css
/* Все параграфы внутри div */
div p {
    margin: 10px;
}

/* Элементы с обоими классами */
.class1.class2 {
    font-weight: bold;
}

/* Непосредственные потомки */
ul > li {
    list-style-type: square;
}
```

## Свойства CSS

### Цвет и фон

```css
.box {
    color: #333;                     /* Цвет текста */
    background-color: #f5f5f5;       /* Цвет фона */
    border: 1px solid #ccc;          /* Рамка */
}
```

### Текст

```css
p {
    font-family: Arial, sans-serif;  /* Семейство шрифтов */
    font-size: 16px;                 /* Размер шрифта */
    font-weight: bold;               /* Жирность */
    text-align: center;              /* Выравнивание текста */
    line-height: 1.5;                /* Межстрочный интервал */
    letter-spacing: 1px;             /* Расстояние между буквами */
}
```

### Размеры и отступы

```css
.container {
    width: 80%;                      /* Ширина */
    max-width: 1200px;               /* Максимальная ширина */
    height: 400px;                   /* Высота */
    margin: 0 auto;                  /* Внешние отступы (top/bottom left/right) */
    padding: 20px;                   /* Внутренние отступы */
}
```

## Блочная модель (Box Model)

Каждый элемент в CSS состоит из:
- Content (содержимое)
- Padding (внутренние отступы)
- Border (граница)
- Margin (внешние отступы)

```css
.box {
    width: 300px;              /* Ширина содержимого */
    padding: 20px;             /* Внутренние отступы */
    border: 2px solid black;   /* Граница */
    margin: 15px;              /* Внешние отступы */
}
```

## Flexbox

Flexbox — это модель компоновки, которая позволяет элементам располагаться в строке или столбце и адаптироваться к размеру контейнера.

```css
.container {
    display: flex;             /* Включает flex-контейнер */
    flex-direction: row;       /* Направление (row, column) */
    justify-content: center;   /* Выравнивание по горизонтали */
    align-items: center;       /* Выравнивание по вертикали */
    flex-wrap: wrap;           /* Перенос элементов */
}

.item {
    flex: 1;                   /* Отношение распределения пространства */
}
```

## CSS Grid

Grid — мощный инструмент для создания двумерных макетов.

```css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* Три колонки с пропорциями 1:2:1 */
    grid-template-rows: 100px auto;      /* Два ряда */
    gap: 10px;                          /* Отступы между ячейками */
}

.grid-item {
    grid-column: 1 / 3;                 /* Расположение по колонкам */
    grid-row: 1 / 2;                    /* Расположение по рядам */
}
```

## Медиа-запросы

Медиа-запросы позволяют применять стили в зависимости от характеристик устройства.

```css
/* Стили для устройств с шириной экрана до 768px */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
    
    .menu {
        display: none;
    }
}
``` 