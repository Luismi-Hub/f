import json
import os

# Leer el contenido de p.json
with open('sopa_de_letras_completo.json', 'r') as file:
    puzzles = json.load(file)

words_outside = puzzles['words_outside']
words_per_puzzle = 25
number_of_puzzles = (len(words_outside) + words_per_puzzle - 1) // words_per_puzzle

# Leer la plantilla HTML
with open('index.html', 'r') as file:
    template = file.read()

# Generar archivos HTML
for i in range(number_of_puzzles):
    start = i * words_per_puzzle
    end = start + words_per_puzzle
    words = words_outside[start:end]

    puzzle_html = template.replace('{{PUZZLE_NUMBER}}', str(i + 1))
    puzzle_html = puzzle_html.replace('{{WORDS}}', json.dumps(words))

    with open(f'puzzle_{i + 1}.html', 'w') as file:
        file.write(puzzle_html)

print(f'Se han generado {number_of_puzzles} archivos HTML.')
