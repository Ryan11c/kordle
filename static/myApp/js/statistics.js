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
                        backgroundColor: 'rgba(149, 211, 255, 0.5)',
                        borderColor: 'rgb(61, 187, 255)',
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
                        backgroundColor: 'rgba(149, 211, 255, 0.5)',
                        borderColor: 'rgb(61, 187, 255)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales:{
                        x:{ticks: {maxTicksLimit: 10}},
                        y:{beginAtZero: true}
                    }
                }
            });
        })
        .catch(error => console.error("Error loading requests chart:", error));
});