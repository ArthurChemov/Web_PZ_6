function canvas(selector, options){
   const canvas = document.querySelector(selector);
   canvas.classList.add('canvas')
   canvas.setAttribute('width', `${options.width || 400}px`)
   canvas.setAttribute('height', `${options.height || 300}px`)


   // отримання контексту для малювання
   const context = canvas.getContext('2d')
  // отримуємо координати canvas відносно viewport
   const rect = canvas.getBoundingClientRect();

  // ...
  let isPaint = false // чи активно малювання
  let points = [] //масив з точками

  // об’являємо функцію додавання точок в масив
  const addPoint = (x, y, dragging) => {
  // преобразуємо координати події кліка миші відносно canvas
  points.push({
      x: (x - rect.left),
      y: (y - rect.top),
      dragging: dragging,
      color: options.strokeColor,
      size: options.strokeWidth
  })
}

   // головна функція для малювання
  const redraw = () => {
  //очищуємо  canvass
  context.strokeStyle = options.strokeColor;
  context.lineJoin = "round";
  context.lineWidth = options.strokeWidth;
  let prevPoint = null;
  for (let point of points){
     if(point.color === options.strokeColor && point.size === options.strokeWidth){
        context.beginPath();
        if (point.dragging && prevPoint){
         context.moveTo(prevPoint.x, prevPoint.y)
         } else {
        context.moveTo(point.x - 1, point.y);
        }
        context.lineTo(point.x, point.y)
        context.closePath()
        context.stroke();
        prevPoint = point;
     }
  }
}

   // функції обробники подій миші
const mouseDown = event => {
  isPaint = true
  addPoint(event.pageX, event.pageY);
  redraw();
}

const mouseMove = event => {
  if(isPaint){
      addPoint(event.pageX, event.pageY, true);
      redraw();
  }
}

// додаємо обробку подій
canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup',() => {
  isPaint = false;
});
canvas.addEventListener('mouseleave',() => {
  isPaint = false;
});

//color-picker
document.getElementById('color-picker').addEventListener('click', function (e) {
  options.strokeColor = e.target.value
});

//brush-size
document.getElementById('brush-size').addEventListener('click', function (e) {
  options.strokeWidth = e.target.value
});

// TOOLBAR
const toolBar = document.getElementById('toolbar')

// clear button
const clearBtn = document.createElement('button')
clearBtn.classList.add('btn')
clearBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/clear.png"
png.width = 50
png.height = 40
clearBtn.appendChild(png)

clearBtn.addEventListener('click', () => {
  // тут необхідно додати код очистки canvas та масиву точок (clearRect)
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  points = [];
})
toolBar.insertAdjacentElement('afterbegin', clearBtn)


// download button
const downloadBtn = document.createElement('button')
downloadBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/download.png"
png.width = 50
png.height = 40
downloadBtn.appendChild(png)

downloadBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL("image/png").replace(/img\/png/, 'data:application/octet-stream');
  const newTab = window.open('about:blank','image from canvas');
  newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
})
toolBar.insertAdjacentElement('afterbegin', downloadBtn)


// save button
const saveBtn = document.createElement('button')
saveBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/save.png"
png.width = 50
png.height = 40
saveBtn.appendChild(png)

saveBtn.addEventListener('click', () => {
  localStorage.setItem('points', JSON.stringify(points));
})
toolBar.insertAdjacentElement('afterbegin', saveBtn)


// restore button
const restoreBtn = document.createElement('button')
restoreBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/restore.png"
png.width = 50
png.height = 40
restoreBtn.appendChild(png)

restoreBtn.addEventListener('click', () => {
  raw = localStorage.getItem('points');
  points = JSON.parse(raw);
  redraw();
})
toolBar.insertAdjacentElement('afterbegin', restoreBtn)


// timestamp button
const timestampBtn = document.createElement('button')
timestampBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/time.png"
png.width = 50
png.height = 40
timestampBtn.appendChild(png)

timestampBtn.addEventListener('click', () => {
  date = new Date(); // js функція повертає поточну дату, необхідно перетворити на string
  const [month, day, year]       = [date.getMonth()+1, date.getDate(), date.getFullYear()];
  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  context.fillText("Дата - "+month+" місяць "+day+" день "+year+" рік",50, 70);
  context.fillText("Час - "+hour+":"+minutes+":"+seconds,50, 90);
})
toolBar.insertAdjacentElement('afterbegin', timestampBtn)


// background button
const backgroundBtn = document.createElement('button')
backgroundBtn.classList.add('btn')
png = document.createElement("img")
png.src = "assets/img/background.png"
png.width = 50
png.height = 40
backgroundBtn.appendChild(png)

backgroundBtn.addEventListener('click', () => {
  const img = new Image;
  img.src =`https://www.fillmurray.com/500/300)`;
  img.onload = () => {
  context.drawImage(img, 0, 0);
}
})
toolBar.insertAdjacentElement('afterbegin', backgroundBtn)
}