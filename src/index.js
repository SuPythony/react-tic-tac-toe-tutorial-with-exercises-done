import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.toBold ? {fontWeight: "bold"} : {fontWeight: "normal"}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, toBold) {
    return <Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    toBold={toBold}/>;
  }

  render() {
    let pos;
    if (calculateWinner(this.props.squares)) {
      pos = calculateMove(this.props.squares)
    }

    let board = [];
    for(let row = 0; row < 3; row++) {
      let boardRow = [];
      for(let col = 0; col < 3; col++) {
        if (calculateWinner(this.props.squares) && pos.includes((row * 3) + col)) {
          boardRow.push(
            <span  key={(row * 3) + col}>{this.renderSquare((row * 3) + col, true)}</span>
          );
        } else {
          boardRow.push(
            <span  key={(row * 3) + col}>{this.renderSquare((row * 3) + col, false)}</span>
          );
        }
      }
      board.push(
        <div className="board-row" key={row}>
          {boardRow}
        </div>
      );
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      positions: [],
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let col;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    if (i === 0 || i === 3 || i === 6) {
      col = 1;
    } else if (i === 1 || i === 4 || i === 7) {
      col = 2;
    } else {
      col = 3;
    }
    const positions = this.state.positions;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      positions: positions.concat([[col, Math.floor(i/3) + 1]]),
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let text;
    let moves;

    if (this.state.ascending) {
      text = "Descending";
    } else {
      text = "Ascending";
    }

    moves = history.map((step, move) => {
      let desc = move ? "Go to move #" + move : "Go to game start";
      desc = move ? desc + " (" + this.state.positions[move-1][0] + ", " + this.state.positions[move-1][1] + ")" : desc;
      if (move === this.state.stepNumber) {
        return(<li key={move}>
          <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        </li>);
      } else {
        return(<li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>);
      }
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => {this.setState({ascending: !this.state.ascending,})}}>{text}</button>
          <ol reversed={!this.state.ascending}>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateMove(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
