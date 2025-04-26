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
            //this gathers the most recent data for requests up to 30 days ago. This will make the chart less messy
            const lastLabels = data.labels.slice(-30);
            const lastData = data.values.slice(-30);
            //this gathers the activeUsers data
            const lastActiveUserData = data.active_user_values.slice(-30);
            //make y axis be 20 more then current max users. this makes the chart look cleaner
            const maxActiveUser = Math.max(...lastActiveUserData);
            const max2 = maxActiveUser + 20;
            new Chart(ctx, {
                type: 'bar', 
                data: {
                    labels: lastLabels,
                    datasets: [{
                        type: 'line',
                        label: 'Active Users Per Day',
                        data: lastActiveUserData,
                        backgroundColor: 'rgba(149, 211, 255, 0.5)',
                        borderColor: 'rgb(64, 167, 223)',
                        borderWidth: 2,
                        tension: 0.7,
                        yAxisID: 'y2',
                    },
                    {
                        type: 'bar',
                        label: 'Requests',
                        data: lastData,
                        backgroundColor: 'rgba(149, 211, 255, 0.5)',
                        borderColor: 'rgb(61, 187, 255)',
                        borderWidth: 1,
                        fill: true,
                        yAxisID: 'y' 
                    }]
                },
                options: {
                    responsive: true,
                    scales:{
                        x:{ticks: {maxTicksLimit: 10}},
                        y:{beginAtZero: true},
                        y2:{beginAtZero: true, position: 'right', grid: {drawOnChartArea: false}, max: max2, ticks: {stepSize: 5}}
                    }
                }   
            });
        })
        .catch(error => console.error("Error loading requests chart:", error));
});
