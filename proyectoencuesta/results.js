document.addEventListener('DOMContentLoaded', () => {
    const candidates = [
        { id: 1, nombre: 'Jorge Quiroga Ramírez', partido: 'Alianza Libre' },
        { id: 2, nombre: 'Samuel Doria Medina', partido: 'Alianza Unidad' },
        { id: 3, nombre: 'Rodrigo Paz Pereira', partido: 'Partido Demócrata Cristiano' },
        { id: 4, nombre: 'Manfred Reyes Villa', partido: 'APB Súmate' },
        { id: 5, nombre: 'Andrónico Rodríguez', partido: 'Alianza Popular' },
        { id: 6, nombre: 'Jhonny Fernández', partido: 'Unidad Cívica Solidaridad' },
        { id: 7, nombre: 'Eduardo Del Castillo', partido: 'Movimiento al Socialismo' },
        { id: 8, nombre: 'Pavel Aracena Vargas', partido: 'Alianza Libertad y Progreso' },
    ];

    const resultsList = document.getElementById('results-list');
    const totalVotesElement = document.getElementById('total-votes');
    const resetButton = document.getElementById('reset-votes-btn');

    const renderResults = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/results');
            const data = await response.json();

            const votes = {};
            let totalVotes = 0;
            data.forEach(row => {
                votes[row.candidatoId] = row.count;
                totalVotes += row.count;
            });

            totalVotesElement.textContent = totalVotes;
            resultsList.innerHTML = '';

            candidates.forEach(candidate => {
                const voteCount = votes[candidate.id] || 0;
                const percentage = totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;
                
                const listItem = document.createElement('div');
                listItem.className = 'results-item';
                listItem.innerHTML = `
                    <span class="item-candidate">${candidate.nombre}</span>
                    <span class="item-party">${candidate.partido}</span>
                    <span class="item-votes">${voteCount}</span>
                    <span class="item-percentage">${percentage.toFixed(2)}%</span>
                `;
                resultsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al obtener resultados:', error);
            resultsList.innerHTML = `<p style="text-align: center;">Error al cargar los resultados. Asegúrate de que el servidor de backend está corriendo.</p>`;
        }
    };

    resetButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/votes/reset', {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Se han reiniciado todos los votos.');
                renderResults();
            } else {
                alert('Error al reiniciar los votos.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    renderResults();
});