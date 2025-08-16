document.addEventListener('DOMContentLoaded', () => {
    const candidates = [
        { id: 1, nombre: 'Jorge Quiroga Ramírez', partido: 'Alianza Libre', colorClass: 'jorge-quiroga' },
        { id: 2, nombre: 'Samuel Doria Medina', partido: 'Alianza Unidad', colorClass: 'samuel-doria' },
        { id: 3, nombre: 'Rodrigo Paz Pereira', partido: 'Partido Demócrata Cristiano', colorClass: 'rodrigo-paz' },
        { id: 4, nombre: 'Manfred Reyes Villa', partido: 'APB Súmate', colorClass: 'manfred-reyes' },
        { id: 5, nombre: 'Andrónico Rodríguez', partido: 'Alianza Popular', colorClass: 'andronico-rodriguez' },
        { id: 6, nombre: 'Jhonny Fernández', partido: 'Unidad Cívica Solidaridad', colorClass: 'jhonny-fernandez' },
        { id: 7, nombre: 'Eduardo Del Castillo', partido: 'Movimiento al Socialismo', colorClass: 'eduardo-del-castillo' },
        { id: 8, nombre: 'Pavel Aracena Vargas', partido: 'Alianza Libertad y Progreso', colorClass: 'pavel-aracena' },
    ];

    const candidatesGrid = document.getElementById('candidates-grid');

    const createCandidateCard = (candidate) => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <span class="candidate-icon">🗳️</span>
            <h3 class="candidate-name">${candidate.nombre}</h3>
            <p class="candidate-party">${candidate.partido}</p>
            <button class="vote-btn ${candidate.colorClass}" data-id="${candidate.id}">VOTAR</button>
        `;
        return card;
    };

    candidates.forEach(candidate => {
        const card = createCandidateCard(candidate);
        candidatesGrid.appendChild(card);
    });

    candidatesGrid.addEventListener('click', async (event) => {
        if (event.target.classList.contains('vote-btn')) {
            const candidateId = event.target.dataset.id;
            
            try {
                const response = await fetch('http://localhost:3000/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ candidatoId: parseInt(candidateId) })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(`¡Voto registrado para ${candidates.find(c => c.id == candidateId).nombre}!`);
                } else {
                    alert(`Error al registrar el voto: ${result.error}`);
                }
            } catch (error) {
                alert('No se pudo conectar con el servidor.');
                console.error('Error:', error);
            }
        }
    });
});