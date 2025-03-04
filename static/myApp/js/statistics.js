//CHARTJS things
document.addEventListener("DOMContentLoaded", function () {
    fetch("/signup-chart/")
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('signupChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'User Signups',
                        data: data.values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error("Error loading signup chart:", error));

        fetch("/requests-chart/")
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('requestsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line', 
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Requests Per Day',
                        data: data.values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => console.error("Error loading requests chart:", error));
});