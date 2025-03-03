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

    fetch("/wins-chart/")
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('winsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar', 
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Total Wins Per Day',
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
        .catch(error => console.error("Error loading wins chart:", error));
});