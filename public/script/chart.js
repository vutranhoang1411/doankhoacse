var data = [
    {
        labels: ['Có mặt', 'Không có mặt'],
        datasets: [{
          data: [0, 300],
          backgroundColor: [
            '#FF6B6B',
            '#4ECDC4',
          ],
          hoverOffset: 4
        }]
    },
    {
        labels: ['Nam', 'Nữ'],
        datasets: [{
          data: [300, 50],
          backgroundColor: [
            '#FF6B6B',
            '#4ECDC4',
          ],
          hoverOffset: 4
        }]
    },
    {
        labels: ['Không', 'Tin lành', 'Phật giáo', 'Thiên chúa giáo'],
        datasets: [{
          data: [300, 50, 30, 30],
          backgroundColor: [
            '#FFE66D',
            '#FF6B6B',
            '#4ECDC4',
            '#1A535C'
          ],
          hoverOffset: 2
        }]
    },
    {
        labels: ['Kinh', 'Tày', 'Mường', 'Khác'],
        datasets: [{
          data: [300, 50, 50, 20],
          backgroundColor: [
            '#FFE66D',
            '#FF6B6B',
            '#4ECDC4',
            '#1A535C'
          ],
          hoverOffset: 4
        }]
    },
    {
      labels: ["Tuổi đoàn TB", "Tuổi TB"],
      datasets: [{
        barPercentage: 0.8,
        barThickness: 56,
        data: [20, 21, 0],
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
        ]
      }]
    }
]

function config(index, title1) {
    return {
        type: 'pie',
        data: data[index],
        options: {
            title: {
                display: true,
                text: title1,
                position: 'bottom',
                fontSize: 18,
                padding: 18 
            },
            legend : {
              display: true,
              labels: {
                fontSize: 16
              },
              position: 'right',
              align: 'lef'
            }
        }
    }
}

const config5 = {
  type: 'bar',
  data: data[4],
  options: {
    indexAxis: 'y',
    title: {
      display: true,
      text: "gfhhfhf",
      position: 'bottom',
      fontSize: 18,
      padding: 5 
  },
    scales:
      {
        y: {
          beginAtZero: true
        }
      },
    legend : {
      display: false
    }  
  }
};

var num=0;
var nam=0;
var nu=0;

const chart1 = new Chart(
    document.getElementById('chart1'),
    config(0,`Số đại biểu có mặt ${num}/300`)
);
const chart2 = new Chart(
    document.getElementById('chart2'),
    config(1,`Nam: ${nam}      Nữ: ${nu}`)
);
const chart3 = new Chart(
    document.getElementById('chart3'),
    config(2,"Tôn giáo")
);
const chart4 = new Chart(
    document.getElementById('chart4'),
    config(3, "Dân tộc")
);
const chart5 = new Chart(
    document.getElementById('chart5'),
    config5
);


var socket = io.connect('http://localhost:3000');
var output = document.getElementById("num");

socket.on('student_join', function (data0) {
    console.log(data0);
    if(data0) {
      console.log(data0);
        data[0].datasets[0].data[0] +=5;
        data[0].datasets[0].data[1] -=5
        num+=1;
        const chart1 = new Chart(
          document.getElementById('chart1'),
          config(0,`Số đại biểu có mặt ${num}/300`)
      );
    } else {
        console.log("There is a problem:", data0);
    }
});