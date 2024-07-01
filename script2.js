document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.querySelector('.search-icon');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const closePopupButton = document.getElementById('close-popup');
    const decreaseButton = document.getElementById('decrease');
    const increaseButton = document.getElementById('increase');
    const puzzleNumberInput = document.getElementById('puzzle-number');
    const searchPopupButton = document.getElementById('search-popup');

    // Mostrar el popup al hacer clic en el icono de la lupa
    searchIcon.addEventListener('click', () => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Cerrar el popup al hacer clic en la "X" o en el overlay
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Disminuir el número en el input
    decreaseButton.addEventListener('click', () => {
        let currentValue = parseInt(puzzleNumberInput.value, 10);
        if (currentValue > 1) {
            puzzleNumberInput.value = currentValue - 1;
        }
    });

    // Aumentar el número en el input
    increaseButton.addEventListener('click', () => {
        let currentValue = parseInt(puzzleNumberInput.value, 10);
        puzzleNumberInput.value = currentValue + 1;
    });

    // Acción del botón "Search"
    searchPopupButton.addEventListener('click', () => {
        const puzzleNumber = puzzleNumberInput.value;
        // Lógica para buscar y cargar el puzzle correspondiente
        alert(`Searching for puzzle number ${puzzleNumber}`);
        // Cerrar el popup después de la búsqueda
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });
});
