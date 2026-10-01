import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRuns } from '../features/matchslice'

const ScoreBoard = () => {
    const dispatch = useDispatch()
    const {runs,wickets,overs}=useSelector((state)=>state.match)
    const {playerName,playerRuns}=useSelector((state)=>state.player)

  return (
    <div>ScoreBoard
        <p>
            <button onClick={() => dispatch(addRuns())}>+1</button>
        </p>
        <p>
            Match Score  :      Total Score:{runs}
                                Wickets:{wickets}
                                Overs :{overs}
        </p>
        <p>
            Player Scpre  :  Player Name:{playerName}
                            Player runs:{playerRuns}
        </p>
    </div>
  )
}

export default ScoreBoard