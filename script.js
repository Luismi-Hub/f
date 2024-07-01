document.addEventListener('DOMContentLoaded', () => {
    let showAll = false;

    fetch('p.json')
        .then(response => response.json())
        .then(data => {
            const puzzle = data;

            const gridElement = document.getElementById('grid');
            const wordListElement = document.getElementById('word-list');
            const toggleAllButton = document.getElementById('toggle-all');
            const gridContainer = document.querySelector('.grid-container');
            const verseContainer = document.getElementById('verse-container');

            // Crear la cuadrícula
            puzzle.grid.forEach((row, rowIndex) => {
                row.forEach((letter, colIndex) => {
                    const cell = document.createElement('div');
                    cell.textContent = letter;
                    cell.dataset.row = rowIndex;
                    cell.dataset.col = colIndex;
                    gridElement.appendChild(cell);
                });
            });

            // Crear la lista de palabras con colores diferentes para cada fila
            const colors = ['color-row-1', 'color-row-2', 'color-row-3', 'color-row-4'];
            const words = puzzle.words_outside;
            const columns = 4;
            const wordsPerColumn = 6;

            // Crear las columnas de palabras
            for (let col = 0; col < columns; col++) {
                const wordColumn = document.createElement('div');
                wordColumn.classList.add('word-column');

                let limit = wordsPerColumn;
                if (col === columns - 1) {
                    limit = words.length - (wordsPerColumn * (columns - 1));
                }

                for (let row = 0; row < limit; row++) {
                    const wordIndex = col * wordsPerColumn + row;
                    const listItem = document.createElement('li');
                    const button = document.createElement('button');
                    button.innerHTML = `<span>${wordIndex + 1}. </span><span>${words[wordIndex]}</span>`;
                    button.classList.add(colors[wordIndex % colors.length]);
                    button.addEventListener('click', () => {
                        const word = words[wordIndex];
                        showAll = false;
                        gridElement.style.backgroundColor = 'white';
                        toggleAllButton.textContent = 'All';
                        gridContainer.style.display = 'flex';
                        gridContainer.style.animation = 'bounceIn 1s ease forwards';
                        highlightWord(word);
                        showVerse(word);
                        verseContainer.classList.add('visible');  // Mostrar el contenedor del verso con transición
                        window.scrollBy({ top: 300, behavior: 'smooth' });
                    });
                    listItem.appendChild(button);
                    wordColumn.appendChild(listItem);
                }
                wordListElement.appendChild(wordColumn);
            }

            toggleAllButton.addEventListener('click', () => {
                showAll = !showAll;
                if (showAll) {
                    gridContainer.style.display = 'flex';
                    gridContainer.style.animation = 'bounceIn 1s ease forwards';
                    gridElement.style.backgroundColor = 'black';
                    toggleAllButton.textContent = 'Back';
                    highlightAllWords();
                    window.scrollBy({ top: 300, behavior: 'smooth' });
                } else {
                    gridElement.style.backgroundColor = 'white';
                    toggleAllButton.textContent = 'All';
                    clearHighlights();
                }
            });

            function highlightWord(word) {
                clearHighlights();

                let wordFound = false;
                for (let rowIndex = 0; rowIndex < puzzle.grid.length; rowIndex++) {
                    for (let colIndex = 0; colIndex < puzzle.grid[rowIndex].length; colIndex++) {
                        if (checkWord(word, rowIndex, colIndex, 'highlight')) {
                            wordFound = true;
                            return;
                        }
                    }
                }

                if (!wordFound) {
                    alert('Palabra no encontrada');
                }
            }

            function highlightAllWords() {
                const colors = [
                    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
                    "#33FFF2", "#FF8333", "#3383FF", "#FF3333", "#83FF33",
                    "#FF3383", "#FF8333", "#8333FF", "#33FFA1", "#FF33F2",
                    "#A1FF33", "#33A1FF", "#FFA133", "#33FF83", "#8333FF",
                    "#33FF33", "#FF5733", "#5733FF", "#33FF57", "#F1C40F"
                ];

                clearHighlights();

                puzzle.words_outside.forEach((word, index) => {
                    let wordFound = false;
                    for (let rowIndex = 0; rowIndex < puzzle.grid.length; rowIndex++) {
                        for (let colIndex = 0; colIndex < puzzle.grid[rowIndex].length; colIndex++) {
                            if (checkWord(word, rowIndex, colIndex, 'highlight-all', colors[index])) {
                                wordFound = true;
                                break;
                            }
                        }
                        if (wordFound) break;
                    }
                });
            }

            function checkWord(word, row, col, highlightClass, color) {
                const directions = [
                    { x: 1, y: 0 },  // Horizontal derecha
                    { x: -1, y: 0 }, // Horizontal izquierda
                    { x: 0, y: 1 },  // Vertical abajo
                    { x: 0, y: -1 }, // Vertical arriba
                    { x: 1, y: 1 },  // Diagonal abajo derecha
                    { x: -1, y: -1 }, // Diagonal arriba izquierda
                    { x: 1, y: -1 }, // Diagonal arriba derecha
                    { x: -1, y: 1 }  // Diagonal abajo izquierda
                ];

                for (let { x, y } of directions) {
                    if (isWordAt(word, row, col, x, y, highlightClass, color)) {
                        return true;
                    }
                }
                return false;
            }

            function isWordAt(word, row, col, x, y, highlightClass, color) {
                const cellsToHighlight = [];
                for (let i = 0; i < word.length; i++) {
                    const currentRow = row + i * y;
                    const currentCol = col + i * x;

                    if (
                        currentRow < 0 || currentRow >= puzzle.grid.length ||
                        currentCol < 0 || currentCol >= puzzle.grid[0].length ||
                        puzzle.grid[currentRow][currentCol] !== word[i]
                    ) {
                        return false;
                    }
                    const cell = document.querySelector(`[data-row='${currentRow}'][data-col='${currentCol}']`);
                    if (cell) cellsToHighlight.push(cell);
                }
                cellsToHighlight.forEach(cell => {
                    cell.classList.add(highlightClass);
                    if (color) cell.style.color = color;
                });
                return true;
            }

            function clearHighlights() {
                document.querySelectorAll('.highlight, .highlight-all').forEach(cell => {
                    cell.classList.remove('highlight', 'highlight-all');
                    cell.style.color = '';
                });
            }

            function showVerse(word) {
                const cleanedWord = word.toLowerCase();
                const verse = puzzle.versos.find(v => v.toLowerCase().includes(`(${cleanedWord})`));
                verseContainer.innerHTML = "";  // Clear previous content
                if (verse) {
                    const cleanedVerse = verse.replace(/\(.*?\)/g, '');
                    const p = document.createElement('p');
                    p.innerHTML = cleanedVerse;
                    verseContainer.appendChild(p);
                } else {
                    verseContainer.innerHTML = "Verse not found.";
                }
                verseContainer.classList.add('visible');  // Mostrar el contenedor del verso con transición
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
