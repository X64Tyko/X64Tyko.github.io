import { useState } from 'react'
import "./TicTacToe.css"

enum TTTOption {
    Empty = "None",
    Cross = "Cross",
    Circle = "Circle"
}

interface onClickHandler{
    boxID: number;
    gridData: TTTOption;
    onClick: (boxID: number)=>void;
}

function TTTBox({boxID, gridData, onClick = () => {} }: onClickHandler) {

    function tickClick() {
        onClick(boxID);
    }
    
    return (
        <>
            <button className="tic-tac-box" onClick={tickClick} disabled={gridData != TTTOption.Empty}>
                {gridData === TTTOption.Empty ? '' : gridData === TTTOption.Circle ? 'O' : 'X'}
            </button>
        </>
    );
}

function TicTacToe() {
    const [turnID, setTurnID] = useState(TTTOption.Cross);
    const [grid, setGrid] = useState(Array(9).fill(TTTOption.Empty));
    
    function nextTurn(boxID: number) {
        setGrid(grid.map((gd, i) => {
            if (i === boxID)
                return turnID;

            return gd;
        }));

        setTurnID(turnID === TTTOption.Cross ? TTTOption.Circle : TTTOption.Cross);
    }

    function onReset() {
        setGrid(Array(9).fill(TTTOption.Empty));
    }

    let gridBoxes = [];
    for (let i: number = 0; i < 9; i++) {
        gridBoxes.push(<TTTBox boxID={i} gridData={grid[i]} onClick={nextTurn} />);

    }

    // Check for winner, change display text

    return (
        <>
            <div className="tic-tac-toe">
                {gridBoxes}
            </div>
            <p>It's currently <b>{turnID.toString()}'s</b> turn</p>
            <button onClick={onReset}>Reset</button>
        </>
    );
}

export default TicTacToe;