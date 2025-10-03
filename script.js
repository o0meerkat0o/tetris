document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-button');
    const width = 10;
    const height = 20;
    let squares = [];
    let timerId;
    let score = 0;

    for(let i = 0; i < width*height; i++){
        const div = document.createElement('div');
        grid.appendChild(div);
        squares.push(div);
    }

    const lTetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2],
        [1,width+1,width*2+1,width*2],
        [width, width*2,width*2+1,width*2+2]
    ];
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ];
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const tetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random()*tetrominoes.length);
    let current = tetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => squares[currentPosition+index].style.backgroundColor='#ff69b4');
    }
    function undraw() {
        current.forEach(index => squares[currentPosition+index].style.backgroundColor='#ffe6f0');
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        if(collision()) {
            currentPosition -= width;
            freeze();
            return;
        }
        draw();
    }

    function collision() {
        return current.some(index =>
            (currentPosition+index >= width*height) ||
            squares[currentPosition+index].classList.contains('taken')
        );
    }

    function freeze() {
        current.forEach(index => squares[currentPosition+index].classList.add('taken'));
        // Spawn new tetromino
        random = Math.floor(Math.random()*tetrominoes.length);
        currentRotation = 0;
        current = tetrominoes[random][currentRotation];
        currentPosition = 4;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over 💔';
            clearInterval(timerId);
        } else {
            draw();
        }
        addScore();
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition+index)%width===0);
        if(!isAtLeftEdge) currentPosition -=1;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) currentPosition +=1;
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition+index)%width===width-1);
        if(!isAtRightEdge) currentPosition +=1;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) currentPosition -=1;
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) currentRotation=0;
        current = tetrominoes[random][currentRotation];
        draw();
    }

    function control(e) {
        if(e.keyCode===37) moveLeft();
        else if(e.keyCode===38) rotate();
        else if(e.keyCode===39) moveRight();
        else if(e.keyCode===40) moveDown();
    }
    document.addEventListener('keydown', control);

    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId=null;
          
            squares.forEach(sq => { sq.style.backgroundColor='#ffe6f0'; sq.classList.remove('taken'); });
            score = 0; scoreDisplay.innerHTML=score;
        } else {
            draw();
            timerId = setInterval(moveDown,500);
        }
    });

    function addScore() {
        for(let i=0;i<200;i+=width){
            const row = Array.from({length:width},(_,k)=>i+k);
            if(row.every(index => squares[index].classList.contains('taken'))){
                score+=10;
                scoreDisplay.innerHTML=score;
                row.forEach(index=>{
                    squares[index].classList.remove('taken');
                    squares[index].style.backgroundColor='#ffe6f0';
                });
                const removed = squares.splice(i,width);
                squares = removed.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
});
